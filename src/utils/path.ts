export const slashJoin = (...segments: string[]): string => {
  const trimmed: string[] = [];

  segments.forEach((current, i) => {
    const isFirst = i === 0;
    const isLast = i === segments.length - 1;

    if (!isFirst && current.substr(0, 1) === '/') {
      current = current.substr(1);
    }

    if (!isLast && current.substr(-1) === '/') {
      current = current.substring(0, current.length - 1);
    }

    trimmed.push(current);
  });

  return trimmed.join('/');
};

export const removeExtension = (path: string) =>
  path.includes('.')
    ? path
        .split('.')
        .slice(0, -1)
        .join('.')
    : path;
