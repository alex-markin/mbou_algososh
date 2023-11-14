export const isGlobalLoadingActive = (loadingState: {
  [key: string]: boolean;
}) => {
  for (const key in loadingState) {
    if (key !== "insertIndex" && loadingState[key]) {
      return true;
    }
  }
  return false;
};
