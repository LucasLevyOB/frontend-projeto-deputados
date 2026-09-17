export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatCompactCurrency = (value: number): string => {
  if (!value || isNaN(value)) {
    return 'R$ 0';
  }

  const absValue = Math.abs(value);
  const sinal = value < 0 ? '-' : '';

  if (absValue >= 1_000_000_000) {
    const formatado = (absValue / 1_000_000_000).toLocaleString('pt-BR', {
      maximumFractionDigits: 1,
    });
    return `${sinal}R$ ${formatado} bi`;
  }

  if (absValue >= 1_000_000) {
    const formatado = (absValue / 1_000_000).toLocaleString('pt-BR', {
      maximumFractionDigits: 1,
    });
    return `${sinal}R$ ${formatado} mi`;
  }

  if (absValue >= 1_000) {
    const formatado = (absValue / 1_000).toLocaleString('pt-BR', {
      maximumFractionDigits: 1,
    });
    return `${sinal}R$ ${formatado} mil`;
  }

  return formatCurrency(value);
};

