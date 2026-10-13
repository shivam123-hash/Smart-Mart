import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CardLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SharedTransitionContextType {
  activeItem: any | null;
  sourceLayout: CardLayout | null;
  openProduct: (item: any, layout: CardLayout) => void;
  closeProduct: () => void;
}

const SharedTransitionContext = createContext<SharedTransitionContextType>({
  activeItem: null,
  sourceLayout: null,
  openProduct: () => {},
  closeProduct: () => {},
});

export const useSharedTransition = () => useContext(SharedTransitionContext);

interface SharedTransitionProviderProps {
  children: ReactNode;
}

export const SharedTransitionProvider = ({ children }: SharedTransitionProviderProps) => {
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [sourceLayout, setSourceLayout] = useState<CardLayout | null>(null);

  const openProduct = (item: any, layout: CardLayout) => {
    setActiveItem(item);
    setSourceLayout(layout);
  };

  const closeProduct = () => {
    setActiveItem(null);
    setSourceLayout(null);
  };

  return (
    <SharedTransitionContext.Provider
      value={{
        activeItem,
        sourceLayout,
        openProduct,
        closeProduct,
      }}
    >
      {children}
    </SharedTransitionContext.Provider>
  );
};
