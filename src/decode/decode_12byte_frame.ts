import DB from "debug";
import { IMac } from "@boxid/common_ts_interfaces/general";
import { IVals } from "@boxid/common_ts_interfaces/message";

import { decodeMacs } from "./wifi";
import { DecoderError } from "./error";

const debug = DB(`bx:tagtype_Skeleton:decode:12byte_frame`)

enum FrameType {
    WIFIS_REGULAR,
    WIFIS_KEEPALIVE,
}
function detectFrameType(buff: Buffer): FrameType | undefined {
    const type0 = buff[0];
    const type6 = buff[6];
    debug("type0", buff[0]);
    debug("type6", buff[1]);
    const t00 = type0 & 0x1;
    // const t01 = type0 & 0x2
    const t60 = type6 & 0x1;
    // const t61 = type6 & 0x2
    debug("t00", t00);
    // debug("t01", t01)
    debug("t60", t60);
    // debug("t61", t61)
    if (t00 === 0 && t60 === 0) {
        return FrameType.WIFIS_REGULAR;
    }
    if (t00 === 0 && t60 === 1) {
        return FrameType.WIFIS_KEEPALIVE;
    }
}

// Example decoding of a 12 Byte wifi message
export function decodeMessageLength12(buff: Buffer, ret: IVals): Promise<IVals> {
    const frameType = detectFrameType(buff);
    debug("frameType: %s", frameType);
    switch (frameType) {
        case FrameType.WIFIS_REGULAR:
        case FrameType.WIFIS_KEEPALIVE: {
            const [macs, typeWifi] = decodeMacs(buff);
            ret.type = typeWifi;
            if (macs != null && macs.length) {
                ret.macs = macs.map(
                    (mac): IMac => {
                        return { mac };
                    }
                );
            }
            if (frameType === FrameType.WIFIS_REGULAR) {
                ret.mounted = true;
            }
            ret.in_transit = false;
            return Promise.resolve(ret);
        }

        default:
            return Promise.reject(new DecoderError("INVALID_FRAME", buff));
    }
}
