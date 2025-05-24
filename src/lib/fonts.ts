// Exporta os nomes das fontes para uso nos estilos
export const fontSans = '"Inter", system-ui, -apple-system, sans-serif';
export const fontHeading = '"Oswald", "Inter", system-ui, -apple-system, sans-serif';
export const fontMono = '"Fira Code", "Fira Mono", monospace';

// Exporta as variáveis CSS para as fontes
export const fontVariables = {
  '--font-sans': fontSans,
  '--font-heading': fontHeading,
  '--font-mono': fontMono,
} as const;
