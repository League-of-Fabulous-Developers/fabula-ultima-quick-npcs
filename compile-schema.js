const fs = require("fs")
const path = require("path")
const Ajv = require("ajv/dist/2020")
const standaloneCode = require("ajv/dist/standalone").default

const schema = require("./schema/schema.schema.json")

const ajv = new Ajv({code: {source: true, esm: true}})
const validate = ajv.compile(schema)
let moduleCode = standaloneCode(ajv, validate)

// Now you can write the module code to file
fs.writeFileSync(path.join(__dirname, "scripts/generated/schema-validator.mjs"), moduleCode)
