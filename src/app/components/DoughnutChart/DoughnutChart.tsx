"use client"
import {Chart, ChartData, ChartOptions} from 'chart.js/auto';
import {useEffect, useRef} from 'react';
import "./DoughnutChart.css";
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

export default function DoughnutChart(props: { data: ChartData<'doughnut', number[], string>, title: string }) {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const total = props.data.datasets[0].data.reduce((sum, number) => sum + number, 0)

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const chart = new Chart<'doughnut', number[], string>(ctx, {
                    type: 'doughnut',
                    data: props.data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: props.title,
                                font: {
                                    size: 24
                                },
                                color: 'rgb(0,0,0)'
                            },
                            legend: {
                                position: 'right',
                                labels: {
                                    color: 'rgb(0,0,0)'
                                }
                            },
                            datalabels: {
                                formatter: (value, context) => {
                                    const label_value = props.data.datasets[0].data[context.dataIndex]
                                    return  label_value ? `${(label_value / total * 100).toFixed(2)}%` : ''
                                },
                                color: 'rgb(255,255,255)',
                                font: {
                                    size: 18,
                                },
                                anchor: 'center',
                            },
                        },
                        onClick: function (e, item) {
                            if (item.length > 0) {
                                const index = item[0].index;
                                const label = props.data.labels![index];
                                alert('You clicked on ' + label);
                            }
                        }
                    } as ChartOptions<'doughnut'>,
                });
                return () => {
                    chart.destroy();
                }
            }
        }
    }, [props.data]);

    return (
        <div id="canvas-container">
            <canvas ref={chartRef}/>
        </div>
    );
}
