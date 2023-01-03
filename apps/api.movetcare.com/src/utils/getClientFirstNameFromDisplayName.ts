export const getClientFirstNameFromDisplayName = (displayName: string) =>
  displayName.trim().split(/\s+/)[0];
