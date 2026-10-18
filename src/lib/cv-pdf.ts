/** Stable public URLs keep existing links valid; downloads use Dmitrii's CV naming. */
export const cvPdfFilename = (language: string, layout: string) =>
  `Pershin_Dmitrii-Product_Senior_Designer-CV-${language.toUpperCase()}-${layout}.pdf`;
