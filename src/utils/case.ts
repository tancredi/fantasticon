export const pascalCase = (str: string) =>
  str
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w+)/, 'g'),
      (_: string, b: string, c: string) => b.toUpperCase() + c.toLowerCase()
    )
    .replace(new RegExp(/\s/, 'g'), '')
    .replace(new RegExp(/\w/), (s: string) => s.toUpperCase());
