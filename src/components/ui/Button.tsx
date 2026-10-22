"use client";

import {motion, type HTMLMotionProps} from 'motion/react';
import type {ReactNode} from 'react';

type Variant = 'ink' | 'berry' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.008em] whitespace-nowrap select-none transition-[background-color,color,opacity,box-shadow] duration-300 ease-(--ease-soft) disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  ink: 'bg-ink text-white border border-ink/10 shadow-[inset_0_1px_0_rgba(255,255,255,.10)] hover:bg-black',
  berry: 'bg-berry text-white hover:bg-berry-deep shadow-[0_10px_30px_-12px_rgba(229,69,110,.6)]',
  ghost: 'bg-transparent text-ink hover:bg-ink/6',
  outline: 'bg-cream/60 text-ink border border-ink/18 hover:border-ink/40 backdrop-blur',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13.5px]',
  md: 'h-11 px-5 text-[14.5px]',
  lg: 'h-12 px-7 text-[15px]',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<HTMLMotionProps<'button'>, 'children' | 'className'> & {href?: undefined};

type ButtonAsLink = CommonProps &
  Omit<HTMLMotionProps<'a'>, 'children' | 'className'> & {href: string};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const hoverMotion = {
  whileHover: {y: -2},
  whileTap: {scale: 0.97},
  transition: {type: 'spring', stiffness: 500, damping: 30},
} as const;

export function Button(props: ButtonProps) {
  const {variant = 'ink', size = 'md', className = '', children} = props;
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (props.href !== undefined) {
    const {variant: _v, size: _s, className: _c, children: _ch, ...rest} = props;
    return (
      <motion.a className={classes} {...hoverMotion} {...rest}>
        {children}
      </motion.a>
    );
  }

  const {variant: _v, size: _s, className: _c, children: _ch, type = 'button', ...rest} = props;
  return (
    <motion.button type={type} className={classes} {...hoverMotion} {...rest}>
      {children}
    </motion.button>
  );
}
