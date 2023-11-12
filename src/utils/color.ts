function hexToRGBA(hex: string, transparency: number = 1): string | null {
    hex = hex.replace("#", "");

    if (!/^[0-9A-F]{6}$/i.test(hex)) {
        return null;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${transparency})`;
}

export {
    hexToRGBA
}