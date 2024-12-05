"use client"
import {Chart, ChartData, ChartOptions} from 'chart.js/auto';
import {useEffect, useRef} from 'react';
import "./DoughnutChart.css";
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);
const centerTextPlugin = {
    id: 'center-title',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beforeDraw: function (chart: any) {
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

export default function DoughnutChart(props: { data: ChartData<'doughnut', number[], string>, title: string }) {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
            const total = props.data.datasets[0].data.reduce((sum, number) => sum + number, 0)
            // let titleFontSize = 24
            let legendFontSize = 15
            let labelFontSize = props.data.datasets[0].data.length > 20 ? 9 : 18
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
                // titleFontSize /= 2
                legendFontSize /= 3
                labelFontSize /= 3
            }

            if (chartRef.current && total > 0) {
                const ctx = chartRef.current.getContext('2d')!;

                if (ctx) {
                    const chart = new Chart<'doughnut', number[], string>(ctx, {
                        type: 'doughnut',
                        data: props.data,
                        options: {
                            // aspectRatio: 1.5,
                            maintainAspectRatio: false,
                            elements: {
                                center: {
                                    text: total,
                                    maxFontSize: 50,
                                },
                            },
                            plugins: {
                                // title: {
                                //     display: true,
                                //     text: props.title,
                                //     font: {
                                //         size: titleFontSize
                                //     },
                                //     color: 'rgb(0,0,0)'
                                // },
                                legend: {
                                    position: 'right',
                                    labels: {
                                        color: 'rgb(0,0,0)',
                                        font: {
                                            size: legendFontSize
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
                                        const relative_Value = context.dataset.data[context.dataIndex] as number / total;
                                        return {size: Math.min(Math.max(labelFontSize * relative_Value * 240, 8), 40)};
                                    },
                                    anchor: 'center',
                                },
                            },
                            onClick: function (e, item) {
                                if (item.length > 0) {
                                    // const index = item[0].index;
                                    // const label = props.data.labels![index];
                                    // alert('You clicked on ' + label);
                                }
                            }
                        } as ChartOptions<'doughnut'>,
                    });
                    return () => {
                        chart.destroy();
                    }
                }
            }
        }
        ,
        [props.data]
    )
    ;

    return (
        <div id="canvas-container">
            <canvas ref={chartRef}/>
        </div>
    );
}
