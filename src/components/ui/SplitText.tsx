"use client";

import {motion, useReducedMotion, type MotionValue, type Variants} from 'motion/react';
import {useProgressTransform} from '@/hooks/useProgressTransform';
import {createElement, type ReactNode} from 'react';
import {EASE_EXPO} from '@/lib/motion';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

interface SplitTextProps {
  /** One string per line. Lines alternate direction: even from the left, odd from the right. */
  lines: readonly string[];
  as?: Tag;
  className?: string;
  lineClassName?: string;
  /** Highlight words (exact match, case-insensitive) in the accent colour. */
  accent?: readonly string[];
  /**
   * When provided, the animation is driven by this 0..1 scroll progress
   * instead of viewport entry. `range` is the enter window; `leave` the exit window.
   */
  progress?: MotionValue<number>;
  range?: readonly [number, number];
  leave?: readonly [number, number];
  /** `mount`: animate in on first paint and let scroll only drive the exit (for the hero). */
  enter?: 'scroll' | 'mount';
  /** Progress offset between consecutive lines in scroll mode, in progress units. */
  lineStagger?: number;
  /** Per-word delay in viewport mode, seconds. */
  wordStagger?: number;
  delay?: number;
  distance?: number;
  once?: boolean;
}

const WORD_BLUR = 'blur(10px)';
const NO_BLUR = 'blur(0px)';

function Word({children, accent}: {children: string; accent: boolean}) {
  return <span className={accent ? 'text-berry' : undefined}>{children}</span>;
}

function ScrollLine({
  text,
  index,
  progress,
  range,
  leave,
  lineStagger,
  distance,
  reduced,
  accent,
  className,
  mount,
}: {
  text: string;
  index: number;
  progress: MotionValue<number>;
  range: readonly [number, number];
  leave?: readonly [number, number];
  lineStagger: number;
  distance: number;
  reduced: boolean;
  accent: readonly string[];
  className?: string;
  mount: boolean;
}) {
  const dir = index % 2 === 0 ? -1 : 1;
  const shift = index * lineStagger;
  const travel = reduced ? 0 : distance;

  // Keyframes: [enter] in scroll mode, [leave] when provided. In mount mode
  // the entrance is a one-off animation and scroll owns only the exit.
  const inputs: number[] = [];
  const opacityOut: number[] = [];
  const xOut: number[] = [];
  const filterOut: string[] = [];
  if (!mount) {
    inputs.push(Math.min(range[0] + shift, 0.999), Math.min(range[1] + shift, 1));
    opacityOut.push(0, 1);
    xOut.push(dir * travel, 0);
    filterOut.push(WORD_BLUR, NO_BLUR);
  }
  if (leave) {
    inputs.push(leave[0], leave[1]);
    opacityOut.push(1, 0);
    xOut.push(0, -dir * travel * 0.5);
    filterOut.push(NO_BLUR, 'blur(6px)');
  }
  if (inputs.length === 0) {
    inputs.push(0, 1);
    opacityOut.push(1, 1);
    xOut.push(0, 0);
    filterOut.push(NO_BLUR, NO_BLUR);
  }

  const opacity = useProgressTransform(progress, inputs, opacityOut);
  const x = useProgressTransform(progress, inputs, xOut);
  const filter = useProgressTransform(progress, inputs, filterOut);

  return (
    <motion.span
      className={`block will-change-[transform,opacity] ${className ?? ''}`}
      style={{opacity, x, filter: reduced ? undefined : filter}}
    >
      {mount ? (
        <motion.span
          className="block"
          initial={{opacity: 0, x: dir * travel, filter: reduced ? NO_BLUR : WORD_BLUR}}
          animate={{opacity: 1, x: 0, filter: NO_BLUR}}
          transition={{duration: reduced ? 0.4 : 1.1, delay: 0.15 + index * 0.16, ease: EASE_EXPO}}
        >
          {renderWords(text, accent)}
        </motion.span>
      ) : (
        renderWords(text, accent)
      )}
    </motion.span>
  );
}

function renderWords(text: string, accent: readonly string[]): ReactNode[] {
  return text.split(' ').map((word, i, arr) => {
    const clean = word.replace(/[^\p{L}\p{N}&]/gu, '').toLowerCase();
    const isAccent = accent.some((a) => a.toLowerCase() === clean);
    return (
      <span key={`${word}-${i}`} className="inline-block">
        <Word accent={isAccent}>{word}</Word>
        {i < arr.length - 1 ? '\u00A0' : ''}
      </span>
    );
  });
}

function ViewLine({
  text,
  index,
  wordStagger,
  delay,
  distance,
  reduced,
  accent,
  once,
  className,
}: {
  text: string;
  index: number;
  wordStagger: number;
  delay: number;
  distance: number;
  reduced: boolean;
  accent: readonly string[];
  once: boolean;
  className?: string;
}) {
  const dir = index % 2 === 0 ? -1 : 1;
  const words = text.split(' ');
  // One viewport observer per line; words are orchestrated through variants so a
  // word translated off the edge can never block its own entrance.
  const lineVariants: Variants = {
    hidden: {},
    show: {transition: {staggerChildren: wordStagger, delayChildren: delay + index * 0.14}},
  };
  const wordVariants: Variants = {
    hidden: {opacity: 0, x: reduced ? 0 : dir * distance, filter: reduced ? NO_BLUR : WORD_BLUR},
    show: {opacity: 1, x: 0, filter: NO_BLUR, transition: {duration: reduced ? 0.4 : 0.9, ease: EASE_EXPO}},
  };
  return (
    <motion.span
      className={`block ${className ?? ''}`}
      variants={lineVariants}
      initial="hidden"
      whileInView="show"
      viewport={{once, amount: 0.5}}
    >
      {words.map((word, i) => {
        const clean = word.replace(/[^\p{L}\p{N}&]/gu, '').toLowerCase();
        const isAccent = accent.some((a) => a.toLowerCase() === clean);
        return (
          <motion.span key={`${word}-${i}`} className="inline-block will-change-[transform,opacity]" variants={wordVariants}>
            <Word accent={isAccent}>{word}</Word>
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

/**
 * Headline splitter. Lines alternate entry direction (left, right, left…),
 * fading and un-blurring as they land. Driven either by viewport entry or by
 * an explicit scroll progress MotionValue for pinned sections.
 */
export function SplitText({
  lines,
  as = 'h2',
  className,
  lineClassName,
  accent = [],
  progress,
  range = [0, 0.25],
  leave,
  enter = 'scroll',
  lineStagger = 0.05,
  wordStagger = 0.04,
  delay = 0,
  distance = 72,
  once = true,
}: SplitTextProps) {
  const reduced = useReducedMotion() ?? false;
  const label = lines.join(' ');

  const children = lines.map((text, index) =>
    progress ? (
      <ScrollLine
        key={`${text}-${index}`}
        text={text}
        index={index}
        progress={progress}
        range={range}
        leave={leave}
        lineStagger={lineStagger}
        distance={distance}
        reduced={reduced}
        accent={accent}
        className={lineClassName}
        mount={enter === 'mount'}
      />
    ) : (
      <ViewLine
        key={`${text}-${index}`}
        text={text}
        index={index}
        wordStagger={wordStagger}
        delay={delay}
        distance={distance}
        reduced={reduced}
        accent={accent}
        once={once}
        className={lineClassName}
      />
    ),
  );

  return createElement(as, {className, 'aria-label': label}, <span aria-hidden="true">{children}</span>);
}
