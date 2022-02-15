import { IVals } from "@boxid/common_ts_interfaces/message";
import { MessageType } from "./msg_type";

interface IMessageHeader extends IVals {
    batt: number;
    type: MessageType;
}

export function decodeHeader(byte: number): IMessageHeader {
    return {
        batt: byte >> 6,
        type: ((byte & 0x38) >> 4),
    };
}
