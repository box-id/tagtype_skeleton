import { ITagConfig, ITagSettingMessageOpts } from "@boxid/common_ts_interfaces/tagsettings"

import { configuration } from "./config/configuration"
import { ITagSettingsSkeleton, ITagSettingsSkeletonSaved } from "./config/interface"
import { MessageType } from "./decode/msg_type"

/**
 * Possible return values for encoder
 *
 * @export
 * @interface ITagEncodeDataSkeleton
 */
export interface ITagEncodeDataSkeleton {
    // the current or probably changed device settings
    device_setting: ITagSettingsSkeletonSaved
    // the response the device will receive by the tagdata api
    response: string
    // if groups are used this response will also be stored with the group-key.
    // This is required, so that the gui can compare the current settings with the last send group response so it can mark groups as up to date to if the uplink of this group is pending
    response_BASE?: string
}

// DEPRECATED: Reduce the settings for the simple view
export const configurationSimple: ITagConfig = JSON.parse(JSON.stringify(configuration))
const hiddenSettings = ["define_string_key", "select_value_key"]
const len = hiddenSettings.length
for (let idx = 0; idx < len; idx++) {
    const hideKey = hiddenSettings[idx]
    Object.assign(configurationSimple[hideKey], {
        hidden: true,
    })
}

/**
 * Get all defaults of all defined defaults
 *
 * @returns {ITagSettingsSkeletonSaved}
 */
export const getDefaults = (): ITagSettingsSkeletonSaved => {
    const ini = {}
    const res = Object.keys(configuration).reduce((acc, key) => {
        acc[key] = configuration[key].default
        return acc
    }, ini) as ITagSettingsSkeletonSaved
    return res
}

/**
* A function used by the GUI to show a abstract of the current device configuration
*
* @param {ITagSettingsSkeleton} config
* @returns {ITagSettingMessageOpts}
*/
export const configurationText = (config: ITagSettingsSkeleton): ITagSettingMessageOpts => {
    const defaults = getDefaults()
    const aliveStaticTimer =
        config.numeric_setting_key != null ? config.numeric_setting_key : defaults.numeric_setting_key
    if (aliveStaticTimer === 0) {
        return {
            i18nKey: "x_per_day",
            values: {
                messages: 0,
            },
        }
    } else if (aliveStaticTimer > 24) {
        const value = parseFloat((aliveStaticTimer / 24).toFixed(1))
        return {
            i18nKey: "every_x_days",
            values: {
                messages: value,
            },
        }
    } else {
        const value = parseFloat((24 / aliveStaticTimer).toFixed(1))
        return {
            i18nKey: "x_per_day",
            values: {
                messages: value,
            },
        }
    }
}

const StringIsNumber = (value) => isNaN(Number(value)) === false


/**
* Helper function, used by the gui, that returns the possible message types.
* This is required to fill the possible values for the message type filter
*
* @returns {string[]}
*/
export const messageTypes = (): string[] => {
    const decoderKeys = Object.keys(MessageType)
        .filter(StringIsNumber)
        .map((key) => MessageType[key])

    decoderKeys.push("INVALID_MESSAGE_TYPE", "WIFI", "NOWIFI")
    return decoderKeys
}

/**
 * Internal helper function to generate a function to get a config's min, max or default value by key
 *
 * @param {("min" | "max" | "default")} [configKey="default"]
 * @returns {ITagSettingsSkeletonSaved}
 */
export const getKeyOfConfig = (configKey: "min" | "max" | "default" = "default"): ITagSettingsSkeletonSaved => {
    const ini: ITagSettingsSkeleton = {}
    return Object.keys(configuration).reduce((acc, settingKey) => {
        const cnf = configuration[settingKey]
        switch (configKey) {
            case "max":
                if (cnf.type === "boolean") {
                    acc[settingKey] = true
                    break
                }
                if (cnf.type === "number") {
                    acc[settingKey] = cnf.max
                    break
                }
                acc[settingKey] = cnf.default
                break
            case "min":
                if (cnf.type === "boolean") {
                    acc[settingKey] = false
                    break
                }
                if (cnf.type === "number") {
                    acc[settingKey] = cnf.min
                    break
                }
                acc[settingKey] = cnf.default
                break
            default:
                acc[settingKey] = cnf[configKey]
        }
        return acc
    }, ini) as ITagSettingsSkeletonSaved
}
