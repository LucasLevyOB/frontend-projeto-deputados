export const LEGISLATURA_PADRAO = 57;
export const LEGISLATURA_COOKIE_KEY = 'depudados_legislatura';

export interface ILegislaturaOpcao {
  id: number;
  label: string;
  anos: number[];
}

export const getAnosByLegislatura = (idLegislatura: number): number[] => {
  const anoInicial = 2023 + (idLegislatura - 57) * 4;
  return [anoInicial, anoInicial + 1, anoInicial + 2, anoInicial + 3];
};

export const LEGISLATURAS_DISPONIVEIS: ILegislaturaOpcao[] = [
  { id: 57, label: '57ª (2023 – 2026)', anos: [2026, 2025, 2024, 2023] },
  { id: 58, label: '58ª (2027 – 2030)', anos: [2030, 2029, 2028, 2027] },
];

export const getLegislaturaLabel = (idLegislatura: number): string => {
  const encontrada = LEGISLATURAS_DISPONIVEIS.find((l) => l.id === idLegislatura);
  if (encontrada) return encontrada.label;
  const anos = getAnosByLegislatura(idLegislatura);
  return `${idLegislatura}ª (${anos[0]} – ${anos[3]})`;
};

export const parseLegislatura = (valor: string | null | undefined): number | null => {
  if (!valor) return null;
  const parsed = Number.parseInt(valor, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export const getLegislaturaFromCookie = (cookieHeader?: string | null): number | null => {
  const rawCookie =
    cookieHeader ?? (typeof document !== 'undefined' ? document.cookie : '');
  if (!rawCookie) return null;

  const entry = rawCookie
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${LEGISLATURA_COOKIE_KEY}=`));

  if (!entry) return null;
  const value = entry.slice(LEGISLATURA_COOKIE_KEY.length + 1);
  return parseLegislatura(decodeURIComponent(value));
};

export const saveLegislaturaCookie = (idLegislatura: number): void => {
  if (typeof document === 'undefined') return;
  document.cookie = `${LEGISLATURA_COOKIE_KEY}=${encodeURIComponent(String(idLegislatura))}; path=/; max-age=31536000; SameSite=Lax`;
};

export const resolveLegislaturaFromRequest = (request: Request): number => {
  const url = new URL(request.url);
  const fromUrl = parseLegislatura(url.searchParams.get('legislatura'));
  if (fromUrl !== null) return fromUrl;

  const fromCookie = getLegislaturaFromCookie(request.headers.get('Cookie'));
  return fromCookie ?? LEGISLATURA_PADRAO;
};

export const resolveLegislaturaClient = (searchParams: URLSearchParams): number => {
  const fromUrl = parseLegislatura(searchParams.get('legislatura'));
  if (fromUrl !== null) return fromUrl;

  const fromCookie = getLegislaturaFromCookie();
  return fromCookie ?? LEGISLATURA_PADRAO;
};
