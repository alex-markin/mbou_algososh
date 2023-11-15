export const isGlobalLoadingActive = (loadingState: {
  [key: string]: boolean;
}) => {
  return Object.values(loadingState).some((state) => state);
};
