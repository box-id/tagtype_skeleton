import chai from "chai"

import { Decoder } from ".."

const expect = chai.expect
describe("Decoder tests", () => {
    describe("activation", () => {
        it("normal", async () => {
            const data = "087c00"
            const exp = {
                batt: 0,
                byte2: "00",
                mounted: true,
                type: "STATUS",
                temp: 22,
            }
            return Decoder(data).then((decoded) => {
                expect(decoded).eql(exp)
            })
        })
    })

    describe("wifi macs", () => {
        it("normal: two macs", async () => {
            const data = [
                // 1st wifi mac
                "106F3F38DF81",
                // 2nd wifi mac
                "CC253571FFD5",
            ]
            return Decoder(data.join("")).then((decoded) => {
                const expected = {
                    type: "WIFI",
                    macs: [{ mac: "106f3f38df81" }, { mac: "cc253571ffd5" }],
                    mounted: true,
                    in_transit: false,
                }
                expect(decoded).eql(expected)
            })
        })

        it("normal: one mac", async () => {
            const data = [
                // 1st wifi mac
                "106F3F38DF81",
                // 2nd wifi mac
                "000000000000",
            ]
            return Decoder(data.join("")).then((decoded) => {
                const expected = {
                    type: "WIFI",
                    macs: [{ mac: "106f3f38df81" }],
                    mounted: true,
                    in_transit: false,
                }
                expect(decoded).eql(expected)
            })
        })

        it("normal: empty macs with 00", async () => {
            const data = [
                // 1st wifi mac
                "000000000000",
                // 2nd wifi mac
                "000000000000",
            ]
            return Decoder(data.join("")).then((decoded) => {
                const expected = {
                    type: "NOWIFI",
                    mounted: true,
                    in_transit: false,
                }
                expect(decoded).eql(expected)
            })
        })
    })


    describe("downlink req", () => {
        it("simple", async () => {
            const data = [
                // Battery = 3; B0: Set bit 3-5 to 0x05, reserved = 1
                "D0",
                // B1:
                // Result of applying previous downlink configuration = 0 ; Mirror of continues bit in downlink msg = false; is repeated = true
                "1",
                // seq. number
                "F",
                // B2:
                // patch version = 13
                "D",
                // version format = 3; first_req_after_startup = true; is_pending_req = true
                "F",
                // B3:
                // major Version = 13
                "2A",
                // B4:
                // minor Version = 23
                "70",
                // B5:
                // minor Version (msb)
                "01",
                // B6:
                // reserved
                "00"
            ]
            return Decoder(data.join("")).then((decoded) => {
                const expected = {
                    type: "DOWNLINK_REQ",
                    batt: 3,
                    result_applying_downlink_conf: "OK",
                    continues_bit: false,
                    is_repeated_req: true,
                    seq_num: 15,

                    version_format: 3,
                    first_req_after_startup: true,
                    is_pending_req: true,
                    firmware_version: "42.23.13",
                }
                expect(decoded).eql(expected)
            })
        })
        it("all min", async () => {
            const data = [
                // Battery = 0; B0: Set bit 3-5 to 0x05
                "10",
                // B1:
                // Result of applying previous downlink configuration = 0 ; Mirror of continues bit in downlink msg = false; is repeated = true
                "0",
                // seq. number
                "0",
                // B2:
                // patch version = 13
                "0",
                // version format = 3; first_req_after_startup = true; is_pending_req = true
                "C",
                // B3:
                // major Version = 13
                "00",
                // B4:
                // minor Version = 23
                "00",
                // B5:
                // minor Version (msb)
                "00",
                // B6:
                // reserved
                "00"
            ]
            return Decoder(data.join("")).then((decoded) => {
                const expected = {
                    type: "DOWNLINK_REQ",
                    batt: 0,
                    result_applying_downlink_conf: "OK",
                    continues_bit: false,
                    is_repeated_req: false,
                    seq_num: 0,

                    version_format: 3,
                    first_req_after_startup: false,
                    is_pending_req: false,
                    firmware_version: "0.0.0",
                }
                expect(decoded).eql(expected)
            })
        })
        it("all max", async () => {
            const data = [
                // Battery = 3; B0: Set bit 3-5 to 0x05, reserved = 1
                "D0",
                // B1:
                // Result of applying previous downlink configuration = 0 ; Mirror of continues bit in downlink msg = false; is repeated = true
                "F",
                // seq. number
                "F",
                // B2:
                // patch version = 13
                "F",
                // version format = 3; first_req_after_startup = true; is_pending_req = true
                "F",
                // B3:
                // major Version = 13
                "FF",
                // B4:
                // minor Version = 23
                "FF",
                // B5:
                // minor Version (msb)
                "FF",
                // B6:
                // reserved
                "FF"

            ]
            return Decoder(data.join("")).then((decoded) => {
                const expected = {
                    type: "DOWNLINK_REQ",
                    batt: 3,
                    result_applying_downlink_conf: "RECEIVER_ERROR",
                    continues_bit: true,
                    is_repeated_req: true,
                    seq_num: 15,

                    version_format: 3,
                    first_req_after_startup: true,
                    is_pending_req: true,
                    firmware_version: "2047.4095.15",
                }
                expect(decoded).eql(expected)
            })
        })

    })

})
