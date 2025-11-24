import { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

const TradeChart = () => {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#a0a0a0',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 350,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });

        const newSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#00ff9d',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#00ff9d',
            wickDownColor: '#ef4444',
        });

        // Generate some mock data
        const data = [];
        let time = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).getTime() / 1000;
        let value = 2400;

        for (let i = 0; i < 100; i++) {
            const open = value + Math.random() * 50 - 25;
            const close = open + Math.random() * 50 - 25;
            const high = Math.max(open, close) + Math.random() * 10;
            const low = Math.min(open, close) - Math.random() * 10;

            data.push({
                time: time as any,
                open,
                high,
                low,
                close,
            });

            value = close;
            time += 24 * 60 * 60;
        }

        newSeries.setData(data);

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    return <div ref={chartContainerRef} className="w-full h-full" />;
};

export default TradeChart;
