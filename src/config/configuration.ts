import {
    ITagConfig,
    ITagConfigBoolean,
    ITagConfigNumber,
    ITagConfigNumberList,
    ITagConfigString,
    ITagConfigValueSelect,
} from "@boxid/common_ts_interfaces/tagsettings"

interface IConfiguration extends ITagConfig {
    numeric_setting_key: ITagConfigNumber
    select_number_mapping_key: ITagConfigValueSelect
    select_value_key: ITagConfigNumberList
    define_string_key: ITagConfigString
    switch_key: ITagConfigBoolean
}

export const configuration: IConfiguration = {

    // A numeric setting to define a value with min/max and step values
    numeric_setting_key: {
        type: "number",
        // Form label
        desc: "Label of the numeric setting",
        // Optional form info
        info: "Additional info for this setting",
        // min allowed value
        min: 0,
        // max possible value
        max: 70,
        // the steps between allowed values
        step: 5,
        // default value
        default: 25,
        // the unit of this value shown in the gui
        unit: "hours",
        // a optional value that will activate a on/off switch for this setting and the value that will be used if set to "off"
        offIf: 0,
        // define if this setting is hidden in the gui
        hidden: false,
        // this setting is only shown to MASTER users or if flag is active to ADMINS
        advanced: false,
        // optional group key to group settings under a specific headline.
        // also This is used to define sigfox config blocks
        groupKey: "BASE",
        // sorting of this setting within the group
        sort: 100,
    },

    // A select config to solve flexible mappings between the shown number in the gui and the value stored
    select_number_mapping_key: {
        type: "valueselect",
        // Form label
        desc: "Label of the numeric selects",
        // Optional form info
        info: "Additional info for this setting",
        // a list of selections with the `showValue` to be displayed to the user and a `value` to be stored
        options: [
            { value: 0, showValue: 0 },
            { value: 1, showValue: 1 },
            { value: 2, showValue: 3 },
            { value: 3, showValue: 6 },
            { value: 4, showValue: 9 },
            { value: 5, showValue: 12 },
            { value: 6, showValue: 15 },
            { value: 7, showValue: 18 },
            { value: 8, showValue: 21 },
            { value: 9, showValue: 24 },
            { value: 10, showValue: 27 },
            { value: 11, showValue: 30 },
            { value: 12, showValue: 33 },
            { value: 13, showValue: 36 },
            { value: 14, showValue: 39 },
            { value: 15, showValue: 42 },
        ],
        // a optional value that will activate a on/off switch for this setting and the value that will be used if set to "off"
        offIf: 0,
        // default selection
        default: 0,
        // the unit of this value shown in the gui
        unit: "msg/day",
        // define if this setting is hidden in the gui
        hidden: false,
        // this setting is only shown to MASTER users or if flag is active to ADMINS
        advanced: false,
        // optional group key to group settings under a specific headline.
        // also This is used to define sigfox config blocks
        groupKey: "BASE",
        // sorting of this setting within the group
        sort: 110,
    },

    // for selections of numbers that represents a specific behavior.
    select_value_key: {
        type: "numberselect",
        // Form label
        desc: "Label of the selects",
        // Optional form info
        info: "Additional info for this setting",
        // A list of values that can be selected
        options: [0, 1, 2, 3],
        // The meaning of each value as text output
        meanings: ["lower", "normal", "higher", "highest"],
        // default selection
        default: 1,
        // define if this setting is hidden in the gui
        hidden: false,
        // this setting is only shown to MASTER users or if flag is active to ADMINS
        advanced: false,
        // optional group key to group settings under a specific headline.
        // also This is used to define sigfox config blocks
        groupKey: "BASE",
        // sorting of this setting within the group
        sort: 110,
    },

    // for manual text inputs
    define_string_key: {
        type: "string",
        // Form label
        desc: "Label of the selects",
        // Optional form info
        info: "Additional info for this setting",
        // The encoding of this text.
        // - `utf8`: for regular text
        // - `ascii`: for simple text
        // - `int`: for manual number input
        // - `hex`: only hex values are allowed
        encoding: "hex",
        // a optional regular expression to make sure the content is of a specific format
        regexp: "^[a-fA-F0-9]{0,10}$",
        // default text
        default: "0000000000",
        // define if this setting is hidden in the gui
        hidden: false,
        // this setting is only shown to MASTER users or if flag is active to ADMINS
        advanced: false,
        // optional group key to group settings under a specific headline.
        // also This is used to define sigfox config blocks
        groupKey: "BASE",
        // sorting of this setting within the group
        sort: 110,
    },

    // a boolean switch
    switch_key: {
        type: "boolean",
        // Form label
        desc: "Label of the selects",
        // Optional form info
        info: "Additional info for this setting",
        // default switch state
        default: false,
        // define if this setting is hidden in the gui
        hidden: false,
        // this setting is only shown to MASTER users or if flag is active to ADMINS
        advanced: false,
        // optional group key to group settings under a specific headline.
        // also This is used to define sigfox config blocks
        groupKey: "BASE",
        // sorting of this setting within the group
        sort: 110,
    },
}
