export function capitalizeFirstLetter(value: string): string {
  return value.charAt(0).toLocaleUpperCase() + value.slice(1);
}

export function kebabCase(value?: string): string {
  if (!value) {
    return '';
  }

  return (
    value
      // handle camelCase and PascalCase
      .replace(/([a-z0-9])([A-Z0-9])/g, '$1-$2')
      // remove spaces from ends
      .trim()
      // replace spaces and underscores with hyphens
      .replace(/[\s_]+/g, '-')
      .toLowerCase()
  );
}

export function formatMinutesAsHours(totalMinutes: number): string {
  if (!totalMinutes) {
    return '0 mins';
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  return `${hours}h: ${minutes}m`;
}
