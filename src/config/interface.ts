// exported interface for the configuration
export interface ITagSettingsSkeletonSaved {
    numeric_setting_key: number
    select_number_mapping_key: number
    select_value_key: number
    define_string_key: string
    switch_key: boolean
}
export type ITagSettingsSkeleton = Partial<ITagSettingsSkeletonSaved>
