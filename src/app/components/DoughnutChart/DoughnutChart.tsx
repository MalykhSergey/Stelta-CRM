"use client"
import {Chart, ChartData, ChartOptions} from 'chart.js/auto';
import {useEffect, useRef} from 'react';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ChartDataType from "@/models/Analytics/ChartDataType";
import {formatValue} from "react-currency-input-field";
import ChartPlug from "@/app/analytics/ChartPlug";

Chart.register(ChartDataLabels);
const centerTextPlugin = {
    id: 'center-title',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beforeDraw: function (chart: any) {
        if (chart.config.type != 'doughnut') {
            return;
        }
        const centerConfig = chart.config.options!.elements!.center;
        if (centerConfig) {
            const ctx = chart.ctx;
            const fontStyle = centerConfig.fontStyle || 'Arial';
            const txt = centerConfig.text;
            const color = centerConfig.color || '#000';
            const maxFontSize = centerConfig.maxFontSize || 75;
            const sidePadding = centerConfig.sidePadding || 20;
            const sidePaddingCalculated = (sidePadding / 100) * (chart._metasets[chart._metasets.length - 1].data[0].innerRadius * 2)
            ctx.font = "30px " + fontStyle;

            const stringWidth = ctx.measureText(txt).width;
            const elementWidth = (chart._metasets[chart._metasets.length - 1].data[0].innerRadius * 2) - sidePaddingCalculated;


            const widthRatio = elementWidth / stringWidth;
            const newFontSize = Math.floor(30 * widthRatio);
            const elementHeight = (chart._metasets[chart._metasets.length - 1].data[0].innerRadius * 2);


            let fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
            let minFontSize = centerConfig.minFontSize;
            const lineHeight = centerConfig.lineHeight || 25;
            let wrapText = false;

            if (minFontSize === undefined) {
                minFontSize = 20;
            }

            if (minFontSize && fontSizeToUse < minFontSize) {
                fontSizeToUse = minFontSize;
                wrapText = true;
            }

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
            let centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
            ctx.font = fontSizeToUse + "px " + fontStyle;
            ctx.fillStyle = color;

            if (!wrapText) {
                ctx.fillText(txt, centerX, centerY);
                return;
            }

            const words = txt.split(' ');
            let line = '';
            const lines = [];
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                if (testWidth > elementWidth && n > 0) {
                    lines.push(line);
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }
            centerY -= (lines.length / 2) * lineHeight;

            for (let n = 0; n < lines.length; n++) {
                ctx.fillText(lines[n], centerX, centerY);
                centerY += lineHeight;
            }
            ctx.fillText(line, centerX, centerY);
        }
    }
}

Chart.register(centerTextPlugin);

export default function DoughnutChart(props: {
    data: ChartData<'doughnut', number[], string>,
    title: string,
    type: ChartDataType
}) {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const total = props.data.datasets[0].data.reduce((sum, number) => sum + number, 0)
    useEffect(() => {
        let isMobile = false
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
            isMobile = true
        }
        if (chartRef.current && total > 0) {
            const ctx = chartRef.current.getContext('2d')!;
            if (ctx) {
                const chart = new Chart<'doughnut', number[], string>(ctx, {
                    type: 'doughnut',
                    data: props.data,
                    options: {
                        maintainAspectRatio: isMobile,
                        elements: {
                            center: {
                                text: formatValue({
                                    value: Math.round(total).toString(),
                                    suffix: props.type == ChartDataType.COUNT ? '' : '₽',
                                    groupSeparator: ' ',
                                    decimalSeparator: ','
                                }),
                                maxFontSize: 50,
                            },
                        },
                        plugins: {
                            legend: {
                                position: isMobile ? 'bottom' : 'right',
                                labels: {
                                    color: 'rgb(0,0,0)',
                                    font: {
                                        size: isMobile ? 8 : 16
                                    }
                                },
                                onClick: function () {
                                }
                            },
                            datalabels: {
                                formatter: (value, context) => {
                                    const label_value = props.data.datasets[0].data[context.dataIndex]
                                    return label_value ? `${(label_value / total * 100).toFixed(1)}%` : ''
                                },
                                color: 'rgb(255,255,255)',
                                font: (context) => {
                                    const chartArea = context.chart.chartArea;
                                    const width = chartArea.width
                                    const height = chartArea.height
                                    const relative_Value = context.dataset.data[context.dataIndex] as number / total;
                                    let sectorArea = Math.min(width, height) * relative_Value;
                                    if (isMobile) {
                                        sectorArea /= 2
                                    }
                                    return {size: Math.min(Math.max(sectorArea * 0.4, 8), 40)};
                                },
                                anchor: 'center',
                            },
                        }
                    } as ChartOptions<'doughnut'>,
                });
                return () => {
                    chart.destroy();
                }
            }
        }
    }, [props.data]);
    if (total == 0)
        return <ChartPlug/>
    return (<canvas ref={chartRef}/>);
}
