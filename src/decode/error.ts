import { MessageType } from "./msg_type";

const maxMessageTypeValue = Object.keys(MessageType).length / 2;
export class DecoderError extends Error {
    public rawInput: string;
    private ErrorTypes = {
        INVALID_FRAME: "Invalid Frame type. The last bit of the first and sixth byte are 1 which is not specified (bit positions 0x100000001000000).",
        INVALID_MESSAGE_TYPE: `Invalid message type. Only uInt values between 0 and ${maxMessageTypeValue} are allowed. (message type relevant bits of byte 0: 0x38)`,
    };
    constructor(type: string, buff: Buffer) {
        super(type);
        this.name = type;
        this.message = this.ErrorTypes[type] || "Unknown error type. No details ...";
        this.rawInput = buff.toString("hex").toLowerCase();
    }
}
