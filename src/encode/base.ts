import { getDefaults, ITagEncodeDataSkeleton } from "../config"
import { ITagSettingsSkeleton } from "../config/interface"
import { calcHeader, getOrDefaultGen, IEncodeOpts } from "../encode"
import { calcValueBoolean, calcValueNumber, calcValueOptions, TFnGet } from "../utils"

import DB from "debug"
export const debug = DB(`bx:tagtype_Skeleton:encode:base`)


const ENCODING_TYPE = "BASE"
export default function encoderSkeletonBase(settings: ITagSettingsSkeleton = {}, opts: IEncodeOpts): ITagEncodeDataSkeleton {
    const defaults = getDefaults()
    const fnGet = getOrDefaultGen(settings, defaults) as TFnGet<number>
    const fnGetString = getOrDefaultGen(settings, defaults) as TFnGet<string>
    const buff = Buffer.alloc(8, "00", "hex")

    // BYTE 0
    // header
    const byte0 = calcHeader({ ...opts, type: ENCODING_TYPE })
    debug('byte0', byte0)
    buff.writeUInt8(byte0, 0)

    // BYTE 1
    // numeric_setting_key
    const byte1a = calcValueNumber(settings, "numeric_setting_key", fnGet, (v) => v / 5) & 0xF
    const byte1b = calcValueOptions(settings, "select_number_mapping_key", fnGet) & 0xF
    debug('byte1a', byte1a)
    buff.writeUInt8((byte1a << 4) + byte1b, 1)

    // BYTE 2
    // alive_static_state_timer
    const valByte2a = calcValueBoolean(settings, "switch_key", fnGet) & 0x1
    const valByte2b = calcValueOptions(settings, "select_value_key", fnGet) & 0xF
    debug('byte2', valByte2a, valByte2b)
    buff.writeUInt8((valByte2a << 4) + valByte2b, 2)

    // BYTE 3-7
    // speed | broadcast_cap
    const stringValue = fnGetString("define_string_key").padStart(10, "0").slice(-10)
    // fix the setting value to the probably fixed version
    settings["define_string_key"] = stringValue

    debug('byte3-7', stringValue)
    buff.write(stringValue, 3, "hex")

    const hexResp = buff.toString("hex")
    return {
        device_setting: Object.assign({}, defaults, settings),
        response: hexResp,
        [`response_${ENCODING_TYPE}`]: hexResp,
    }
}
