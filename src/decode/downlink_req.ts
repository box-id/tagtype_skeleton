import { IVals } from "@boxid/common_ts_interfaces/message";
import DB from "debug"
export const debug = DB(`bx:tagtype_Skeleton:decode:downlink_req`)

const RESULT_OF_APPLYING_DOWNLINK_CONF: string[] = [
    "OK",
    "ERROR",
    "LOCKED",
    "RECEIVER_ERROR"
];
type TResultOfApplyingDownlinkConf = typeof RESULT_OF_APPLYING_DOWNLINK_CONF[number];
interface IDownlinkReqData extends IVals {
    result_applying_downlink_conf: TResultOfApplyingDownlinkConf;
    continues_bit: boolean;
    is_repeated_req: boolean;
    seq_num: number;
    version_format: number;
    firmware_version: string;
    first_req_after_startup: boolean;
    is_pending_req: boolean;
}

// #################################
// # Complex example how to decode a bit string into js key values
// #################################
export function decodeDownlinkReqData(buff: Buffer): IDownlinkReqData {
    const byte1 = buff[0];
    const byte2 = buff[1];
    const byte3 = buff[2];
    const byte4 = buff[3];
    const byte5 = buff[4];

    debug("req data: b1:%i b2:%i b3:%i b4:%i bb:%i", byte1, byte2, byte3, byte4, byte5);
    const fwPatch = ((byte2 >> 4) & 0xF);
    const fwMinor = (byte5 << 4) + ((byte4 >> 4) & 0xF);
    const fwMajor = ((byte4 & 0x7) << 8) + (byte3 & 0xFF);

    const idxROADC = (byte1 >> 6) & 0x3;
    return {
        // byte 1
        result_applying_downlink_conf: RESULT_OF_APPLYING_DOWNLINK_CONF[idxROADC],
        continues_bit: ((byte1 >> 5) & 0x1) === 1,
        is_repeated_req: ((byte1 >> 4) & 0x1) === 1,
        seq_num: byte1 & 0xf,
        // byte 2
        version_format: (byte2 >> 2) & 0x3,
        first_req_after_startup: ((byte2 >> 1) & 0x1) === 1,
        is_pending_req: (byte2 & 0x1) === 1,
        firmware_version: `${fwMajor}.${fwMinor}.${fwPatch}`,
    };
}
