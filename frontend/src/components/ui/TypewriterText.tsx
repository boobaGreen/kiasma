import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TypewriterTextProps {
    text: string;
    className?: string;
    delay?: number;
    speed?: number;
    tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

// Re-writing the component to use the "Split Text" approach for better compatibility
const TypewriterTextSplit = ({ text, className = '', delay = 0, speed = 0.03, tag = 'p' }: TypewriterTextProps) => {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const chars = containerRef.current?.querySelectorAll('.char');

        if (chars) {
            gsap.to(chars, {
                opacity: 1,
                duration: 0,
                stagger: speed,
                delay: delay,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                }
            });
        }
    }, { scope: containerRef });

    const Tag = tag as any;

    return (
        <Tag ref={containerRef} className={`${className} font-mono`}>
            {text.split('').map((char, i) => (
                <span key={i} className="char opacity-0">{char}</span>
            ))}
            <span className="inline-block w-3 h-5 bg-olivetti-red animate-blink ml-1 align-middle"></span>
        </Tag>
    );
};

export default TypewriterTextSplit;
