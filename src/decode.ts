/**
 * Decode Sigfox messages
 */
import { IVals } from "@boxid/common_ts_interfaces/message"
import DB from "debug"
import { decodeMessageLength12 } from "./decode/decode_12byte_frame"
import { decodeMessageWithType } from "./decode/decode_typed_frame"

const debug = DB(`bx:tagtype_Skeleton:decode`)

// Main starting point to decode a message from a hex string to a js object
export default (data: string): Promise<IVals> => {
    const buff: Buffer = Buffer.from(data, "hex")
    const ret: IVals = {}
    debug("msg length", buff.length)
    if (buff.length === 12) {
        // decode messages with the length 12
        // -----------------
        // If the full 12 byte are required
        // we can't use a header with a type so we have to check for the length
        return decodeMessageLength12(buff, ret)
    } else {
        // Messages with a length lower than 12 and a header describing the type
        return decodeMessageWithType(buff, ret)
    }
}
