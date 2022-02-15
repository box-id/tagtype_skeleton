export function decodeTemp(raw: number): number | null {
    if (raw === 0) {
        console.warn("Invalid Temp 0x00");
        return null;
    }
    if (raw === 0xff) {
        console.error("Read Temp 0xff");
        return null;
    }
    // offset -40 and detail 0.5
    return raw / 2 - 40;
}
