import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(0,255,157,0.5)]',
            secondary: 'bg-secondary text-white hover:bg-secondary/90',
            outline: 'border border-primary text-primary hover:bg-primary/10',
            ghost: 'hover:bg-white/5 text-white',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs',
            md: 'px-6 py-3 text-sm',
            lg: 'px-8 py-4 text-base',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'bg-surface/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-colors duration-300',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

export const Section = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, children, id, ...props }, ref) => {
        return (
            <section
                ref={ref}
                id={id}
                className={cn('py-20 px-6 max-w-7xl mx-auto relative', className)}
                {...props}
            >
                {children}
            </section>
        );
    }
);
