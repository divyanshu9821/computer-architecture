import { bootStrap } from "./branchOp.js";
import { setFileName, readInputFile, appendOutputFile, getFiles, initOutputFile } from "./fileIO.js";
import { tokenize } from "./tokenizer.js";
import { translate } from "./translator.js";

const files = getFiles()

initOutputFile();
if(files.length > 1) appendOutputFile(bootStrap())

files.forEach(file => {

    setFileName(file)
    
    const lines = readInputFile();

    for (let i = 0; i < lines.length; i++) {
        try {

            const tokens = tokenize(lines[i] || "")
            if (!tokens.status || !Array.isArray(tokens.tokens)) continue;
            const string = translate(tokens.tokens)
            appendOutputFile(string)

        } catch (e) {
            console.log(`Error on line: ${i + 1}`)
            process.exit();
        }
    }
})