import {Chart, ChartData, ChartOptions} from 'chart.js/auto';
import {useEffect, useRef} from "react";
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import dayjs from "dayjs";

export default function CFD(props: { data: ChartData<'line'> }) {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
            if (chartRef.current) {
                const ctx = chartRef.current.getContext('2d')!;
                if (ctx) {
                    const chart = new Chart(ctx, {
                        type: 'line',
                        data: props.data,
                        options: {
                            elements: {
                                point: {
                                    pointHitRadius: 4,
                                    pointRadius: 0,
                                }
                            },
                            parsing: false,
                            indexAxis: 'x',
                            scales: {
                                x: {
                                    type: 'time',
                                    time: {
                                        unit: 'day',
                                        displayFormats: {
                                            day: 'DD.MM'
                                        },
                                    },
                                    ticks: {
                                        source: 'auto',
                                        maxRotation: 0,
                                        autoSkip: true,
                                        color: 'black'
                                    }
                                },
                                y: {
                                    ticks: {
                                        format: {
                                            style: "decimal",
                                        },
                                        color: 'black',
                                        stepSize: 1,
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    reverse: true,
                                    labels:{
                                        color: 'black',
                                    }
                                },
                                decimation: {
                                    algorithm: 'lttb',
                                    enabled: true,
                                    samples: 90,
                                    threshold: 100,
                                },
                                datalabels: {
                                    display: false,
                                },
                                tooltip: {
                                    callbacks: {
                                        title: (tooltipItems) => {
                                            const date = tooltipItems[0].parsed.x;
                                            return dayjs(date).format('DD.MM.YYYY');
                                        }
                                    }
                                }
                            },
                            maintainAspectRatio: false,
                        } as ChartOptions<'line'>,
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
    return (<canvas ref={chartRef}/>)
}