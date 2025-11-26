import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Circle, Triangle, Square, Hexagon } from 'lucide-react';

interface PintoriBackgroundProps {
    theme?: 'machine' | 'nature'; // Kept for compatibility, but we'll focus on the new style
    density?: 'low' | 'medium' | 'high';
}

const PintoriBackground = ({ density = 'medium' }: PintoriBackgroundProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const shapes = gsap.utils.toArray('.bg-shape');

        // Float Animation - Slow and hypnotic
        shapes.forEach((shape: any) => {
            gsap.to(shape, {
                y: 'random(-100, 100)',
                x: 'random(-50, 50)',
                rotation: 'random(-180, 180)',
                duration: 'random(10, 20)',
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 'random(0, 5)'
            });
        });

    }, { scope: containerRef });

    // Generate random shapes
    const getShapes = () => {
        const count = density === 'low' ? 5 : density === 'medium' ? 10 : 15;
        const items = [];
        const colors = ['text-primary', 'text-secondary', 'text-accent', 'text-text'];
        const Icons = [Circle, Triangle, Square, Hexagon];

        for (let i = 0; i < count; i++) {
            const Icon = Icons[Math.floor(Math.random() * Icons.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.floor(Math.random() * 60) + 20; // 20px to 80px
            const left = Math.floor(Math.random() * 100);
            const top = Math.floor(Math.random() * 100);
            const opacity = Math.random() * 0.1 + 0.05; // Very subtle

            items.push(
                <div
                    key={i}
                    className={`bg-shape absolute ${color} pointer-events-none`}
                    style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        opacity: opacity,
                        width: size,
                        height: size
                    }}
                >
                    <Icon width="100%" height="100%" strokeWidth={1.5} />
                </div>
            );
        }
        return items;
    };

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            {getShapes()}
        </div>
    );
};

export default PintoriBackground;
