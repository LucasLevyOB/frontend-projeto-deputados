import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router';
import { LegislaturaContext } from './LegislaturaContext';
import {
  LEGISLATURA_PADRAO,
  parseLegislatura,
  getLegislaturaFromCookie,
  saveLegislaturaCookie,
} from '@/utils/legislatura';

interface LegislaturaProviderProps {
  children: React.ReactNode;
}

const isRotaComLegislaturaNaUrl = (pathname: string): boolean =>
  pathname.startsWith('/deputados') ||
  pathname.startsWith('/deputado/') ||
  pathname.startsWith('/comparar');

export const LegislaturaProvider: React.FC<LegislaturaProviderProps> = ({ children }) => {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [legislatura, setLegislaturaState] = useState<number>(() => {
    const fromUrl = parseLegislatura(searchParams.get('legislatura'));
    return fromUrl ?? LEGISLATURA_PADRAO;
  });

  useEffect(() => {
    const fromUrl = parseLegislatura(searchParams.get('legislatura'));
    if (fromUrl !== null) {
      setLegislaturaState(fromUrl);
      saveLegislaturaCookie(fromUrl);
      return;
    }

    const fromCookie = getLegislaturaFromCookie();
    if (fromCookie !== null) {
      setLegislaturaState(fromCookie);
    }
  }, [searchParams]);

  const setLegislatura = useCallback(
    (novaLegislatura: number) => {
      setLegislaturaState(novaLegislatura);
      saveLegislaturaCookie(novaLegislatura);

      if (isRotaComLegislaturaNaUrl(pathname)) {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('legislatura', String(novaLegislatura));

        if (pathname.startsWith('/deputados')) {
          nextParams.delete('page');
        }

        setSearchParams(nextParams);
      }
    },
    [pathname, searchParams, setSearchParams]
  );

  const value = useMemo(
    () => ({ legislatura, setLegislatura }),
    [legislatura, setLegislatura]
  );

  return (
    <LegislaturaContext.Provider value={value}>
      {children}
    </LegislaturaContext.Provider>
  );
};
