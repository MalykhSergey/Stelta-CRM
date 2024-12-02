"use client"
import {Chart, ChartData, ChartOptions} from 'chart.js/auto';
import {useEffect, useRef} from 'react';
import "./DoughnutChart.css";

export default function DoughnutChart(props: { data: ChartData<'doughnut', number[], string> }) {
    const chartRef = useRef<HTMLCanvasElement | null>(null);

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
                            legend: {
                                position: 'right',
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
