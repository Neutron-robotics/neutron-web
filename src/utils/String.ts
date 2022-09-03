export function isEmpty(str: string): boolean {
  return !str || str.length === 0;
}

export function isBlank(str: string): boolean {
  return !str || /^\s*$/.test(str);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
