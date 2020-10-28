export const removeExtension = (path: string) =>
  path.includes('.') ? path.split('.').slice(0, -1).join('.') : path;
