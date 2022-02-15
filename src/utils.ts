import {
    ITagConfigNumber,
    ITagConfigNumberList,
    ITagConfigValueSelect,
    TTagConfig,
} from "@boxid/common_ts_interfaces/tagsettings"

import { configuration } from "./config/configuration"
import { ITagSettingsSkeleton } from "./config/interface"

export type TFnGet<T = number | string> = (key: string) => T

function nearest(val: number, step: number, offset: number = 0): number {
    return Math.round((val - offset) / step) * step + offset
}
function precision(n: number, dp: number): number {
    dp = Math.pow(10, dp)
    return Math.round(n * dp) / dp
}
/**
* Helper function to find the best matching value for a define range/step
*
* @param {number} val
* @param {number} min
* @param {number} max
* @param {number} [step=1]
* @param {number} [offset=0]
* @returns {number}
*/
export function valueByDefinition(
    val: number,
    min: number,
    max: number,
    step: number = 1,
    offset: number = 0,
): number {
    // fix reversed min/max setting
    if (min > max) {
        const tmp = min
        min = max
        max = tmp
    }
    // on exceeding the limits use the limit
    if (val < min) {
        return min
    }
    if (val > max) {
        return max
    }
    // search the nearest value to the step
    if (step !== 1) {
        val = nearest(val, step, offset)
    }
    // calc the precision by step
    const remaining = step % 1

    const prec = Math.max(0, Math.ceil(Math.log(1 / (remaining === 0 ? 1 : remaining)) / Math.log(10)))
    if (prec > 0) {
        return precision(val, prec)
    } else {
        return Math.round(val)
    }
}

// ###############################
// #
// # Encoding helper functions
// #
// ###############################

export const valueFromOptions = <T>(value: T, options: T[], fallback: T): T => {
    if (options.indexOf(value) >= 0) {
        return value
    }
    return fallback
}
type TOptions = ITagConfigNumberList | ITagConfigValueSelect
function isOptionsConfig(cnf: TTagConfig): cnf is TOptions {
    return (cnf as TOptions).options !== undefined
}
function isValueSelectConfig(cnf: TTagConfig): cnf is ITagConfigValueSelect {
    return cnf.type === "valueselect"
}

const calcOptions = (cnf: TOptions): number[] => {
    if (isValueSelectConfig(cnf)) {
        return cnf.options.map((el) => el.value)
    }
    return cnf.options
}

export const calcValueOptions = (
    settings: ITagSettingsSkeleton,
    key: string,
    fnGet: TFnGet<number>,
    options?: number[],
): number => {
    const cnf = configuration[key]
    if (!isOptionsConfig(cnf)) {
        throw new Error(`Invalid config type for "calcValueOptions" of key "${key}"`)
    }

    const value = valueFromOptions(fnGet(key), options != null ? options : calcOptions(cnf), cnf.default)
    if (settings[key] != null) {
        settings[key] = value
    }
    return value
}
export const calcValueBoolean = (settings: ITagSettingsSkeleton, key: string, fnGet: TFnGet<number>): number => {
    const cnf = configuration[key]
    const value = valueFromOptions<number>(fnGet(key), [1, 0], cnf.default === true ? 1 : 0)
    if (settings[key] != null) {
        settings[key] = value === 1 ? true : false
    }
    return value
}
export const calcValueString = (
    settings: ITagSettingsSkeleton,
    key: string,
    fnGet: TFnGet<string>,
    maxLength?: number,
    fillWith?: string,
): string => {
    let value = fnGet(key)
    if (maxLength != null && value.length > maxLength) {
        value = value.substr(0, maxLength)
    }
    if (maxLength != null && fillWith != null) {
        value = value.padStart(maxLength, fillWith)
    }
    if (settings[key] != null) {
        settings[key] = value
    }
    return value
}

function isNumberConfig(cnf: TTagConfig): cnf is ITagConfigNumber {
    return (cnf as ITagConfigNumber).min !== undefined
}

type TFnCalc = (inp: number, raw?: number) => number
export const calcValueNumber = (
    settings: ITagSettingsSkeleton,
    key: string,
    fnGet: TFnGet<number>,
    fnCalc?: TFnCalc,
    offset: number = 0,
): number => {
    const cnf = configuration[key]
    if (!isNumberConfig(cnf)) {
        throw new Error(`Invalid config type for "calcValueNumber" of key "${key}"`)
    }
    const raw = fnGet(key)
    const value = valueByDefinition(raw, cnf.min, cnf.max, cnf.step, offset)
    if (settings[key] != null) {
        settings[key] = value
    }
    return fnCalc != null ? fnCalc(value, raw) : value
}
