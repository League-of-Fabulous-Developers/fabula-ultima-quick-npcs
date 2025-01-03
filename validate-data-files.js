const fs = require("fs")
const path = require("path")
const Ajv = require("ajv/dist/2020")

const schema = require("./schema/schema.schema.json")

const ajv = new Ajv()
const validate = ajv.compile(schema)

const dataDirectory = path.join(__dirname, "config");

const dir = fs.opendirSync(dataDirectory, {recursive: true});
try {
    let entry;
    while (entry = dir.readSync()) {
        if (entry.isFile()) {
            const data = require(path.resolve(entry.path, entry.name));
            if (validate(data)) {
                console.log("File:", entry.name, "Okay")
            } else {
                console.log("File:", entry.name, "Errors:")
                for (let error of validate.errors) {
                    console.log(error)
                }
            }
        }
    }
} finally {
    dir.closeSync();
}