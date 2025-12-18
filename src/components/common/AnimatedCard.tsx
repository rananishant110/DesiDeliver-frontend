import React from 'react';
import { Card, CardProps } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AnimatedCardProps extends CardProps {
  delay?: number;
  hoverScale?: number;
  hoverY?: number;
  animateOnScroll?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  delay = 0,
  hoverScale = 1.02,
  hoverY = -8,
  animateOnScroll = true,
  sx,
  ...props
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      ref={animateOnScroll ? ref : undefined}
      initial={animateOnScroll ? 'hidden' : false}
      animate={animateOnScroll ? (inView ? 'visible' : 'hidden') : undefined}
      variants={cardVariants}
      whileHover={{
        scale: hoverScale,
        y: hoverY,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          ...sx,
        }}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;
