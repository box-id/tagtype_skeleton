import DB from "debug"
export const debug = DB(`bx:tagtype_Skeleton:decode:wifi`)

function fixVariableBitOfMac(buff: Buffer, use6Bits: boolean = false): Buffer {
    // set bit7 to 0 to redo possible frame-type change by device
    if (use6Bits) {
        // drop the last 2 bits of the first byte
        buff[0] = buff[0] & 0xfc;
    } else {
        // drop the last bit of the first byte
        buff[0] = buff[0] & 0xfe;
    }

    return buff;
}
// a list of macs that represent if there was no mac found by the device.
// here we have to take care of the type flags
const invalidMacs = ["000000000000", "ffffffffffff", "feffffffffff", "fcffffffffff"];
export function decodeMacs(buff: Buffer, use6Bits: boolean = false): [string[], string] {
    const mac1 = fixVariableBitOfMac(buff.slice(0, 6), use6Bits).toString("hex").toLowerCase();
    const mac2 = fixVariableBitOfMac(buff.slice(6, 12), use6Bits).toString("hex").toLowerCase();
    debug("mac1", mac1);
    debug("mac2", mac2);
    // collect first and last mac address
    const macs = [];
    if (invalidMacs.indexOf(mac1) < 0) {
        macs.push(mac1);
    }
    if (invalidMacs.indexOf(mac2) < 0) {
        macs.push(mac2);
    }
    if (macs.length >= 1) {
        return [macs, "WIFI"];
    } else {
        return [[], "NOWIFI"];
    }
}
