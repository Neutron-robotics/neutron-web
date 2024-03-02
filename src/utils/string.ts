export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getLastPartAfterSeparator(input: string, separator: string): string {
    return input.split(separator).pop()!;
}

export function getFirstPartBeforeSeparator(input: string, separator: string): string {
    return input.split(separator)[0]
}

export function getFirstPartBeforeSeparatorOrDefault(input: string, separator: string, defaultValue: string): string {
    if (input.includes(separator))
        return getFirstPartBeforeSeparator(input, separator)
    return defaultValue
}