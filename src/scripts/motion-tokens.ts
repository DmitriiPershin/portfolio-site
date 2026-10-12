export const motionNumber = (name: string) => Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
export const motionSeconds = (name: string) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return Number.parseFloat(value) * (value.endsWith('ms') ? .001 : 1);
};
