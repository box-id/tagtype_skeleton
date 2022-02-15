import { IVals } from "@boxid/common_ts_interfaces/message"

import { ITagEncodeDataSkeleton } from "./config"
import { ITagSettingsSkeleton, ITagSettingsSkeletonSaved } from "./config/interface"
import encoderBase from "./encode/base"
import { TFnGet } from "./utils"


export const getOrDefaultGen = (settings: ITagSettingsSkeleton, defaults: ITagSettingsSkeletonSaved): TFnGet => {
    return (key) => {
        const val = settings[key] != null ? settings[key] : defaults[key]
        if (settings[key] == null) {
            settings[key] = val
        }
        if (typeof val === "boolean") {
            return val === true ? 1 : 0
        }
        return val
    }
}

export const messageTypesSkeleton = ["BASE"]
export type TMessageTypeSkeleton = typeof messageTypesSkeleton[number]


const messageTypeSkeletonMap: Record<TMessageTypeSkeleton, number> = {
    BASE: 0x01,
}

export interface IEncodeOpts {
    type: TMessageTypeSkeleton
    requestOneMoreFrame?: boolean
}

export function calcHeader(opts: IEncodeOpts): number {
    const type = opts.type
    const num = messageTypeSkeletonMap[type]
    return num << 4
}

// Main starting point to encode the settings to a hex string
export default (settings: ITagSettingsSkeleton = {}, _decoded: IVals = {}, opts: IEncodeOpts): ITagEncodeDataSkeleton => {
    switch (opts.type) {
        case "BASE":
            return encoderBase(settings, opts)
    }
}
