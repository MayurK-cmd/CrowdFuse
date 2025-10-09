import React, { useEffect, useRef, useState, useMemo } from 'react';

const buildKeyframes = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);

  const keyframes = {};
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])];
  });
  return keyframes;
};

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = t => t,
  onAnimationComplete,
  stepDuration = 0.35
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === 'top' ? { filter: 'blur(10px)', opacity: 0, transform: 'translateY(-50px)' } : { filter: 'blur(10px)', opacity: 0, transform: 'translateY(50px)' },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        transform: direction === 'top' ? 'translateY(5px)' : 'translateY(-5px)'
      },
      { filter: 'blur(0px)', opacity: 1, transform: 'translateY(0)' }
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);

  return (
    <p ref={ref} className={`blur-text ${className}`} style={{ display: 'inline' }}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);
        const delayTime = (index * delay) / 1000;

        return (
          <span
            key={index}
            className="inline-block will-change-transform"
            style={{
              ...fromSnapshot,
              animation: inView ? `blur-animate-${index} ${totalDuration}s ${delayTime}s forwards` : 'none',
              whiteSpace: 'pre'
            }}
          >
            {segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes blur-animate-${index} {
                  0% {
                    filter: ${fromSnapshot.filter};
                    opacity: ${fromSnapshot.opacity};
                    transform: ${fromSnapshot.transform};
                  }
                  50% {
                    filter: ${toSnapshots[0].filter};
                    opacity: ${toSnapshots[0].opacity};
                    transform: ${toSnapshots[0].transform};
                  }
                  100% {
                    filter: ${toSnapshots[1].filter};
                    opacity: ${toSnapshots[1].opacity};
                    transform: ${toSnapshots[1].transform};
                  }
                }
              `
            }} />
          </span>
        );
      })}
    </p>
  );
};

export default BlurText;