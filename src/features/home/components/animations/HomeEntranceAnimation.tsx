import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';

export interface UseHomeEntranceAnimationResult {
  headerStyle: {
    opacity: Animated.Value;
    transform: { translateY: Animated.Value }[];
  };
  getCategoryStyle: (index: number) => {
    opacity: Animated.Value;
    transform: { translateX: Animated.Value }[];
  };
  getSectionStyle: (sectionIndex: number) => {
    opacity: Animated.Value;
    transform: { translateY: Animated.Value }[];
  };
  isHeaderLanded: boolean;
}

export const useHomeEntranceAnimation = (
  isLoading: boolean,
  categoryCount: number = 8,
  topInset: number = 47
): UseHomeEntranceAnimationResult => {
  const initialHeaderY = -(topInset + 200);

  // Status bar & background color trigger (switches to green once header sweeps down)
  const [isHeaderLanded, setIsHeaderLanded] = useState(false);

  // Step 1: Header slide down & fade in (starts from completely outside the top of the screen)
  const headerSlideY = useRef(new Animated.Value(initialHeaderY)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  // Step 2: Category cards horizontal spring from right
  const categoryAnims = useRef(
    Array.from({ length: categoryCount }, () => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(75),
    }))
  ).current;

  // Step 3: Remaining feed sections staggered fade & slide up
  const feedSections = useRef([
    { opacity: new Animated.Value(0), translateY: new Animated.Value(40) }, // Best Deals
    { opacity: new Animated.Value(0), translateY: new Animated.Value(40) }, // Near by you
    { opacity: new Animated.Value(0), translateY: new Animated.Value(40) }, // Order Again
  ]).current;

  useEffect(() => {
    if (!isLoading) {
      // Reset values to initial state
      headerSlideY.setValue(initialHeaderY);
      headerOpacity.setValue(0);
      categoryAnims.forEach((cat) => {
        cat.opacity.setValue(0);
        cat.translateX.setValue(75);
      });
      feedSections.forEach((sec) => {
        sec.opacity.setValue(0);
        sec.translateY.setValue(40);
      });

      // Switch status bar to light-content right as the green header swoops into view (~240ms)
      const landTimer = setTimeout(() => {
        setIsHeaderLanded(true);
      }, 240);

      // 1. Header Animation (Smooth gliding descent from above the screen: ~720ms, +0.36s slower)
      Animated.parallel([
        Animated.timing(headerSlideY, {
          toValue: 0,
          duration: 720,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // 2. Categories Horizontal Staggered Spring Animation (~360ms start delay)
      const catTimer = setTimeout(() => {
        const categoryAnimations = categoryAnims.map((cat) =>
          Animated.parallel([
            Animated.spring(cat.translateX, {
              toValue: 0,
              friction: 8,
              tension: 32,
              useNativeDriver: true,
            }),
            Animated.timing(cat.opacity, {
              toValue: 1,
              duration: 520,
              useNativeDriver: true,
            }),
          ])
        );

        Animated.stagger(65, categoryAnimations).start();
      }, 360);

      // 3. Staggered Feed Sections (Slide up gently: ~680ms, +0.32s slower)
      const sectionTimers = feedSections.map((section, idx) => {
        return setTimeout(() => {
          Animated.parallel([
            Animated.timing(section.translateY, {
              toValue: 0,
              duration: 680,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(section.opacity, {
              toValue: 1,
              duration: 520,
              useNativeDriver: true,
            }),
          ]).start();
        }, 520 + idx * 160);
      });

      return () => {
        clearTimeout(landTimer);
        clearTimeout(catTimer);
        sectionTimers.forEach((t) => clearTimeout(t));
      };
    } else {
      setIsHeaderLanded(false);
    }
  }, [isLoading, topInset]);

  return {
    headerStyle: {
      opacity: headerOpacity,
      transform: [{ translateY: headerSlideY }],
    },
    getCategoryStyle: (index: number) => {
      const anim = categoryAnims[index] || {
        opacity: new Animated.Value(1),
        translateX: new Animated.Value(0),
      };
      return {
        opacity: anim.opacity,
        transform: [{ translateX: anim.translateX }],
      };
    },
    getSectionStyle: (sectionIndex: number) => {
      const section = feedSections[sectionIndex] || {
        opacity: new Animated.Value(1),
        translateY: new Animated.Value(0),
      };
      return {
        opacity: section.opacity,
        transform: [{ translateY: section.translateY }],
      };
    },
    isHeaderLanded,
  };
};

// Reusable UI Wrapper for Feed Sections
interface AnimatedSectionWrapperProps {
  style?: ViewStyle;
  animStyle: {
    opacity: Animated.Value;
    transform: { translateY: Animated.Value }[];
  };
  children: ReactNode;
}

export const AnimatedSectionWrapper: React.FC<AnimatedSectionWrapperProps> = ({
  style,
  animStyle,
  children,
}) => {
  return (
    <Animated.View style={[style, animStyle]}>
      {children}
    </Animated.View>
  );
};
