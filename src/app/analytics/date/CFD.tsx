import {Chart, ChartData, ChartOptions, Point} from 'chart.js/auto';
import {useEffect, useRef, useState} from "react";
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import dayjs from "dayjs";
import styles from './CFD.module.css'
import ChartPlug from "@/app/analytics/ChartPlug";

export default function CFD(props: { data: ChartData<'line'> }) {
    const canvas_ref = useRef<HTMLCanvasElement | null>(null);
    const [showPoint, setShowPoint] = useState(false)
    const chart_ref = useRef<Chart<"line", Array<Point | number | null>, unknown>>(null);
    const length = props.data.datasets[0].data.length
    useEffect(() => {
        if (canvas_ref.current) {
            const ctx = canvas_ref.current.getContext('2d')!;
            if (ctx && length > 0) {
                chart_ref.current = new Chart(ctx, {
                    type: 'line',
                    data: props.data,
                    options: {
                        elements: {
                            point: {pointHitRadius: 4, pointRadius: 0,}
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
                                labels: {
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
                    if (chart_ref.current)
                        chart_ref.current.destroy();
                }
            }
        }
    }, [props.data]);
    useEffect(() => {
        if (chart_ref.current?.options?.elements) {
            // Ох уж этот TypeScript
            const elements = chart_ref.current.options.elements as {
                point: { pointRadius: number; pointHitRadius: number; };
            };
            if (elements.point) {
                elements.point.pointRadius = showPoint ? 4 : 0;
                chart_ref.current.update();
            }
        }
    }, [showPoint]);
    if (length == 0)
        return <ChartPlug/>
    return (
        <div className={styles.container}>
            <input className={styles.checkBox} title={'Отображать точки'} type="checkbox" checked={showPoint}
                   onChange={(e) => setShowPoint(e.target.checked)}/>
            <div className={styles.container}>
                <canvas ref={canvas_ref}/>
            </div>
        </div>
    )
}