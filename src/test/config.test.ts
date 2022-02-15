import chai from "chai"
import chaiSubset from "chai-subset"

import { messageTypes } from "../config"

chai.use(chaiSubset)

const expect = chai.expect

describe("Configuration Tests", () => {
    describe("message types", () => {
        it("check message types list", async () => {
            const types = messageTypes()
            const expTypes = [
                "STATUS",
                "DOWNLINK_REQ",
                "RESERVED_02",
                "INVALID_MESSAGE_TYPE",
                "WIFI",
                "NOWIFI"
            ]
            expect(types).is.a("array")
            expect(types).containSubset(expTypes)
            expect(types.length).eql(expTypes.length)
        })
    })
})
