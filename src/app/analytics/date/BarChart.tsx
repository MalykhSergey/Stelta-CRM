import {useEffect, useRef} from "react";
import {Chart, ChartData, ChartOptions} from 'chart.js/auto';

export default function BarChart(props: { data: ChartData<'bar', number[], string> }) {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
            const total = props.data.datasets[0].data.reduce((sum, number) => sum + number, 0)
            if (chartRef.current && total > 0) {
                let isMobile = false
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
                    isMobile = true
                }
                const ctx = chartRef.current.getContext('2d')!;
                if (ctx) {
                    const chart = new Chart<'bar', number[], string>(ctx, {
                        type: 'bar',
                        data: props.data,
                        options: {
                            maintainAspectRatio: false,
                            indexAxis: 'y',
                            scales: {
                                x: {reverse: true, ticks: {color: 'rgb(0,0,0)'},},
                                y: {position: 'right', ticks: {font: {size: isMobile ? 8 : 16}, color: 'rgb(0,0,0)'}}
                            },
                            plugins: {
                                legend: {display: false},
                                datalabels: {
                                    color: 'rgb(255,255,255)',
                                    font: {
                                        size: isMobile ? 15 : 30
                                    },
                                    anchor: 'center',
                                },
                            }
                        } as ChartOptions<'bar'>,
                    });
                    return () => {
                        chart.destroy();
                    }
                }
            }
        }
        ,
        [props.data]
    );
    return (
        <div id="canvas-container">
            <canvas ref={chartRef}/>
        </div>
    )
}