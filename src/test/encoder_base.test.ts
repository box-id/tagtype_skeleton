import chai from "chai"
import chaiSubset from "chai-subset"
import { getKeyOfConfig } from "../config"
import { ITagSettingsSkeletonSaved } from "../config/interface"

import Encoder from "../encode"
import { testResponse } from "./helper"

const expect = chai.expect

chai.use(chaiSubset)

const SETTING_DEFAULTS: ITagSettingsSkeletonSaved = getKeyOfConfig()

const SETTING_MINS: ITagSettingsSkeletonSaved = getKeyOfConfig("min")

const SETTING_MAXS: ITagSettingsSkeletonSaved = getKeyOfConfig("max")

describe("Encoder base format tests", () => {
    it("defaults empty", (done) => {
        const expSettings = { ...SETTING_DEFAULTS }
        const exp = [
            // header
            "10",
            // numeric_setting_key
            "50",
            // switch_key, select_number_mapping_key
            "01",
            // define_string_key
            "00",
            "00",
            "00",
            "00",
            "00",
        ]

        const res = Encoder({}, undefined, { type: "BASE" })
        expect(res).property("response")

        testResponse(res.response, exp)

        expect(res).property("response_BASE")
        testResponse(res.response_BASE, exp)

        expect(res).property("device_setting").containSubset(expSettings)
        done()
    })

    it("defaults all passed", (done) => {
        const expSettings = { ...SETTING_DEFAULTS }
        const exp = [
            // header
            "10",
            // numeric_setting_key
            "50",
            // switch_key, select_number_mapping_key
            "01",
            // define_string_key
            "00",
            "00",
            "00",
            "00",
            "00",
        ]
        const res = Encoder({ ...expSettings }, undefined, { type: "BASE" })
        expect(res).property("response")

        testResponse(res.response, exp)

        expect(res).property("response_BASE")
        testResponse(res.response_BASE, exp)

        expect(res).property("device_setting").containSubset(expSettings)
        done()
    })
    it("random values with value correction", (done) => {
        const expSettings = {
            numeric_setting_key: 20,
            select_number_mapping_key: 0,
            select_value_key: 1,
            define_string_key: "aabb0198fe",
            switch_key: true
        }
        const settings = {
            numeric_setting_key: 19,
            select_number_mapping_key: 4711,
            select_value_key: 9,
            define_string_key: "aabb0198fe",
            switch_key: true
        }
        const exp = [
            // header
            "10",
            // numeric_setting_key
            "40",
            // switch_key, select_number_mapping_key
            "11",
            // define_string_key
            "aa",
            "bb",
            "01",
            "98",
            "fe",
        ]
        const res = Encoder({ ...settings }, undefined, { type: "BASE", requestOneMoreFrame: false })
        expect(res).property("response")
        testResponse(res.response, exp)

        expect(res).property("response_BASE")
        testResponse(res.response_BASE, exp)

        expect(res).property("device_setting").containSubset(expSettings)
        done()
    })

    it("all max", (done) => {
        const expSettings = { ...SETTING_MAXS }
        const exp = [
            // header
            "10",
            // numeric_setting_key
            "e0",
            // switch_key, select_number_mapping_key
            "11",
            // define_string_key
            "00",
            "00",
            "00",
            "00",
            "00",
        ]
        const res = Encoder({ ...expSettings }, undefined, { type: "BASE" })
        expect(res).property("response")

        testResponse(res.response, exp)

        expect(res).property("response_BASE")
        testResponse(res.response_BASE, exp)

        expect(res).property("device_setting").containSubset(expSettings)
        done()
    })

    it("all slightly over max", (done) => {
        const expSettings = {
            ...SETTING_DEFAULTS,
            numeric_setting_key: SETTING_MAXS.numeric_setting_key,
            define_string_key: "1122334455",
        }
        const settings = {
            numeric_setting_key: 70,
            select_number_mapping_key: 16,
            select_value_key: 4,
            define_string_key: "001122334455",
            switch_key: false
        }
        const exp = [
            // header
            "10",
            // numeric_setting_key
            "e0",
            // switch_key, select_number_mapping_key
            "01",
            // define_string_key
            "11",
            "22",
            "33",
            "44",
            "55",
        ]
        const res = Encoder({ ...settings }, undefined, { type: "BASE" })
        expect(res).property("response")
        testResponse(res.response, exp)

        expect(res).property("response_BASE")
        testResponse(res.response_BASE, exp)

        expect(res).property("device_setting").containSubset(expSettings)
        done()
    })

    it("set all to 0/min", (done) => {
        const expSettings = {
            numeric_setting_key: 0,
            select_number_mapping_key: 0,
            select_value_key: 1,
            define_string_key: "0000000000",
            switch_key: false
        }
        const exp = [
            // header
            "10",
            // numeric_setting_key
            "00",
            // switch_key, select_number_mapping_key
            "01",
            // define_string_key
            "00",
            "00",
            "00",
            "00",
            "00",
        ]
        const res = Encoder({ ...SETTING_MINS }, undefined, { type: "BASE", requestOneMoreFrame: true })
        expect(res).property("response")
        testResponse(res.response, exp)

        expect(res).property("response_BASE")
        testResponse(res.response_BASE, exp)

        expect(res).property("device_setting").containSubset(expSettings)
        done()
    })

})
