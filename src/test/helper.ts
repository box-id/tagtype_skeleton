import DB from "debug"
import { expect } from "chai"
const debug = DB(`bx:tagtype_Skeleton:decode:helper`)

const testRMsg = (resp: string[], idx: number) => {
    const msg = [...resp]
    msg.splice(idx, 0, " (")
    msg.splice(idx + 2, 0, ") ")
    return msg.join("")
}

export const testResponse = (response: string, exp: string[]): void => {
    const responsePairs = response.match(/.{1,2}/g)
    const len = responsePairs.length
    for (let idx = 0; idx < len; idx++) {
        const pair = responsePairs[idx]
        const expPair = (exp[idx] || "").toLowerCase()
        expect(pair).eql(
            expPair,
            `invalid BYTE ${idx + 1} of\n\tact: ${testRMsg(responsePairs, idx)}\n\texp: ${testRMsg(exp, idx)}\n\t`,
        )
    }
}

type BitInfo = [key: string, value: number, size: number] | [key: string, value: number, size: number, signed: boolean]
export function combineBits(configs: BitInfo[], sizeByte: number = 12): string {
    const bits = []
    const len = configs.length
    for (let idx = 0; idx < len; idx++) {
        const [key, size, value, signed = false] = configs[idx]

        const bin = valueToBin(value, signed).padStart(size, "0").slice(-size)
        bits.push(bin)
        debug('combineBits(%s) size: %i; value: %i; binary: %s', key, size, value, bin)
    }
    debug('bin', `0b${bits.join("")}`)
    return BigInt(`0b${bits.join("")}`).toString(16).padStart(sizeByte * 2, "0")
}

function valueToBin(inp: number, signed: boolean = false): string {
    if (signed) {
        const buff = Buffer.alloc(4)
        buff.writeInt32BE(inp)
        return buff.readUInt32BE(0).toString(2)
    }
    return inp.toString(2)
}
