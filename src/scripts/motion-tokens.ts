export const motionNumber = (name: string) => Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
export const motionSeconds = (name: string) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return Number.parseFloat(value) * (value.endsWith('ms') ? .001 : 1);
};

/** Semantic motion families shared by portfolio, CV, themes and route transitions. */
export const motionEase = (family: 'reveal' | 'change' | 'route') => getComputedStyle(document.documentElement).getPropertyValue(`--motion-ease-${family}`).trim();
