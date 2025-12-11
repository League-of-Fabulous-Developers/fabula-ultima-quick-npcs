const fs = require("fs")
const path = require("path")
const Ajv = require("ajv/dist/2020")

const schema = require("./schema/quicknpc.schema.json")

const ajv = new Ajv()
const validate = ajv.compile(schema)

const dataDirectory = path.join(__dirname, "data");

const dir = fs.opendirSync(dataDirectory, {recursive: true});

let errorCount = 0;

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
                errorCount++;
            }
        }
    }
} finally {
    dir.closeSync();
}

if (errorCount > 0) {
    throw new Error(`Encountered ${errorCount} errors`);
}