import { Chart, ChartData, ChartOptions } from 'chart.js/auto';
import { useEffect, useRef } from "react";
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
// import {ru} from 'date-fns/locale';

export default function CFD(props: { data: ChartData<'line'> }) {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        if (chartRef.current) {
            let isMobile = false
            const ctx = chartRef.current.getContext('2d')!;
            if (ctx) {
                const chart = new Chart(ctx, {
                    type: 'line',
                    data: props.data,
                    options: {
                        scales: {
                            x: {
                                type: 'time',
                                ticks: {
                                    source: 'auto',
                                    maxRotation: 0,
                                    autoSkip: true,
                                }
                            },
                            // adapters: {
                            //     date: {
                            //         locale: ru
                            //     }
                            // }
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
    return (
        <div id="canvas-container">
            <canvas ref={chartRef} />
        </div>
    )
}