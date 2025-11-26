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
            primary: 'bg-primary text-white hover:bg-primary/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] border-2 border-transparent',
            secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] border-2 border-transparent',
            outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none',
            ghost: 'hover:bg-black/5 text-ink',
        };

        const sizes = {
            sm: 'px-4 py-2 text-xs',
            md: 'px-6 py-3 text-sm',
            lg: 'px-8 py-4 text-base',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center font-display font-bold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-none',
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
                    'bg-surface border border-border p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] transition-all duration-300',
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
