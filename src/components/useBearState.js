import { useContext } from 'react';
import { BearContext } from './BearContext';

export const useBearState = () => {
  const context = useContext(BearContext);
  if (!context) {
    throw new Error('useBearState must be used within a BearProvider');
  }
  return context;
};
