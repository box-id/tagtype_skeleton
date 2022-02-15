# Tagtype decoder Skeleton

_Skeleton Code for BOX-ID shared configuration, encoder and decoder of devices._

This is a example how a message decoder for the BOX-ID System should look like.

## Folders

-   **`src`:** Typescript source files
-   **`src/index.ts`:** Just a export helper
-   **`src/decode.ts`:** Basic decoding file with a exported function to start a decoding
-   **`src/decode/`:** Folder to place the additional decoder files
-   **`src/encode.ts`:** Basic encoding file with a exported function to do the encoding of the current settings
-   **`src/encode`:** Folder to place the additional encoder files
-   **`src/config.ts`:** Basic configuration file with generic config functions
-   **`src/config/`:** Folder to place the additional device configuration files
-   **`src/utils.ts`:** Processing utils
-   **`src/test/`:** Folder with the unit test files

## NPM Tasks

-   `compile`: simple code compile from TS to JS
-   `dev`: test and watch: compile the code and wait for changes to recompile and run the unit test
-   `check`: run all checks: dependencies checker, code linter, unit test and compile
-   `clear`: clear all compile code

## Result Message

The decoded message should result a JS object _(JSON compatible)_.
The contents is fully optional and can contain any kind of key value pairs.

But there are some keys with special meanings in the processing after the raw data was decoded.

-   **`time`** _(`Number`)_: Optional timestamp of this message. If not time is defined in the body or the header, the service will use it's own time.
    Example: `1600867532`
-   **`type`** _(`String`)_: A message type describing the reason for the data input. This is usually shown in the raw data list as column for A quick view over the reason why this message was send or how the payload will look like.
    Example: `"GPS_POS"`
-   **`geo`** _(`Array`)_: The geo position including an optional accuracy to set for the given tag.
    **Formats:**< - `[latitude, longitude]` Only geo position< - `[latitude, longitude, accuracy]` With an optional accuracy radius im meter
    Example: `[52.0116, 11.8523, 1342]`
-   **`geo_source`** _(`Number`)_:
    A description to inform the system the position source.
    `0` _UNKNOWN_: Unknown position source _( GUI-Color: gray )_
    `1` _SCELL_: computedLocation.source = 2 - Sigfox simple cell position _( GUI-Color: gray )_
    `2` _SML_: computedLocation.source = 3 - Sigfox machine learning POI _( GUI-Color: gray )_
    `3` _SHD_: computedLocation.source = 4 - Sigfox HD cell position _( GUI-Color: gray )_
    `4` _SPDB_: computedLocation.source = 5 - Sigfox private DB _( GUI-Color: blue )_
    `5` _SWIFI_: computedLocation.source = 6 - Sigfox private wifi via here _( GUI-Color: blue )_
    `6` _GWIFI_: Wifi position via BOX-ID google location _( GUI-Color: blue )_
    `7` _HWIFI_: Wifi position via BOX-ID here location _( GUI-Color: blue )_
    `8` _GPS_: GPS position direct from device _( GUI-Color: red )_
    `9` _ZID_: Geo position via zone ident if defined in db _( GUI-Color: blue )_
    Example: `8`
-   **`zone_ident`** _(`String`)_: An zone ident token to force the zone resolver which zone should be used as result.
    Example: `skdfjbgvsliubk`
-   **`mounted`** _(`Boolean`)_: A flag that describes if this device is currently mounted to the asset
-   **`in_transit`** _(`Boolean`)_: A flag that describes if this device is in transit, so e.g. is traveling with a truck,
-   **`msg_event_shock`** _(`Number` | `Boolean`)_:
    If a `msg_event = "shock"` is defined it's possible to add a corresponding value like the mG that caused this event
    Example: `573`
    If no value like can be defined with the event just a boolean `true` should be send
-   **`msg_event_temp`** _(`Number` | `Boolean`)_:
    If a `msg_event = "temp"` is defined it's possible to add a corresponding temperature that caused this event
    Example: `13`
    If no value like can be defined with the event just a boolean `true` should be send
-   **`msg_event_humi`** _(`Number` | `Boolean`)_:
    If a `msg_event = "humi"` is defined it's possible to add a corresponding humidity that caused this event
    Example: `23`
    If no value like can be defined with the event just a boolean `true` should be send
-   **`msg_event_press`** _(`Number` | `Boolean`)_:
    If a `msg_event = "press"` is defined it's possible to add a corresponding air pressure that caused this event
    Example: `6874`
    If no value like can be defined with the event just a boolean `true` should be send
-   **`macs`** _(`Array<String | Object>`)_: A list of recorded mac addresses used to locate ths position via Here or Google Positioning Services. This can also be used to locate the device via our Zone-Ident Feature
    _If the element is a string:_ A single mac address. As byte divider it's allowed to use `:`, `-` or nothing.
    Example: `[{ "mac": "12:23:34:AB:BC:CD", "rssi": -23 },{ "mac": "98:23:56:AB:BC:CD", "rssi": -42 }]`
    _If the element is a object:_ Object-Params:
    -   `mac` _(`String`)_: The mac address. As byte divider it's allowed to use `:`, `-` or nothing.
        Example: `"12:23:34:AB:BC:CD"`
    -   `rssi` _(`Number`)_: The rssi for this recorded mac address in dBm
        Example: `-42`
-   **`beacons`** _(`Array<String | Object>`)_: A list of BLE, or similar, beacons used to locate the device. This can also be used to locate the device via our Zone-Ident Feature
    _If the element is a string:_ A single beacon address. As byte divider it's allowed to use `:`, `-` or nothing.
    Example: `[{ "beacon": "98:87:34:FC:DC:CD", "rssi": -23 }]`
    _If the element is a object:_ Object-Params:
    -   `beacon` _(`String`)_: The beacon address. As byte divider it's allowed to use `:`, `-` or nothing.
        Example: `"98:87:34:FC:DC:CD"`
    -   `rssi` _(`Number`)_: The rssi for this recorded beacon address in dBm
        Example: `-23`
-   **`stations`** _(`Array`)_: A list of cellular stations, or similar, to locate the device. This can also be used to locate the device via our Zone-Ident Feature
    Example: `[{ "station": "cell-de-0815", "rssi": -13 }]`
    _If the element is a string:_ A single station identifier
    Example: `"cell-de-0815"`
    _If the element is a object:_ Object-Params:
    -   `station` _(`String`)_: A single station identifier
        Example: `"cell-de-0815"`
    -   `rssi` _(`Number`)_: The rssi for this station in dBm
        Example: `-13`
-   **`temp`** _(`Number`)_: A temperature recorded by this device. Unit `°C`. If the device type is configured to have e.g. temperatures as condition values we will also show these values in tracking and Feed and keep track of the min., max. and average values.
    Example: `13.9`
-   **`humi`** _(`Number`)_: A humidity recorded by this device. Unit `%`. If the device type is configured to have e.g. humidity as condition values we will also show these values in tracking and Feed and keep track of the min., max. and average values.
    Example: `42`
-   **`press`** _(`Number`)_: A air pressure recorded by this device. Unit `hPa`. If the device type is configured to have e.g. air pressure as condition values we will also show these values in tracking and Feed and keep track of the min., max. and average values.
    Example: `487`
-   **`acc`** _(`Array<Number>`)_: The current acceleration of this device as list of x, y and z. The acceleration in a specific direction in `mG`
    Example: `[154, 456, 542]`
