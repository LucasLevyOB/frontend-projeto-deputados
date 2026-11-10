import { createContext, useContext } from 'react';

export interface LegislaturaContextData {
  legislatura: number;
  setLegislatura: (novaLegislatura: number) => void;
}

export const LegislaturaContext = createContext<LegislaturaContextData | undefined>(undefined);

export const useLegislatura = (): LegislaturaContextData => {
  const context = useContext(LegislaturaContext);
  if (!context) {
    throw new Error('useLegislatura deve ser usado dentro de um LegislaturaProvider');
  }
  return context;
};
