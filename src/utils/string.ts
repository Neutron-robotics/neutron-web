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

export function isNullOrEmpty(input: string) {
    return !input || input === ""
}

export function returnUndefinedIfEmpty(input:string) {
    return input === "" ? undefined : input
}

export function sortAlphaOnObjectProperty(a: any, b: any, property: string) {
    var textA = a[property].toUpperCase();
    var textB = b[property].toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
}