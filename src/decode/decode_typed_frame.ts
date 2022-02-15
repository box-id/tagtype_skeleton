import DB from "debug";
import { IVals } from "@boxid/common_ts_interfaces/message";

import { decodeDownlinkReqData } from "./downlink_req";
import { decodeTemp } from "./temp";
import { decodeHeader } from "./header";
import { MessageType } from "./msg_type";
import { DecoderError } from "./error";

const debug = DB(`bx:tagtype_Skeleton:decode:types_frame`)

export const decodeMessageWithType = (buff: Buffer, ret: IVals): Promise<IVals> => {
    const { batt, type } = decodeHeader(buff[0]);
    ret.batt = batt;

    debug("type", type);
    switch (type) {

        // ################################################
        // # Example to switch between message types
        // ################################################
        case MessageType.STATUS: {
            ret.type = "STATUS";
            const temp = decodeTemp(buff[1]);
            if (temp != null) {
                ret.temp = temp;
            }
            ret.mounted = true
            ret.byte2 = buff.slice(2, 12).toString("hex").toLowerCase();
            return Promise.resolve(ret);
        }
        case MessageType.DOWNLINK_REQ: {
            ret.type = "DOWNLINK_REQ";
            Object.assign(ret, decodeDownlinkReqData(buff.slice(1, 12)));
            return Promise.resolve(ret);
        }

        default: {
            return Promise.reject(new DecoderError("INVALID_MESSAGE_TYPE", buff));
        }
    }
};
