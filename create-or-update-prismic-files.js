const fs = require('fs');

const UPDATE_OR_CREATE = "UPDATE" // "CREATE" OR "UPDATE"
const FOLDER_WITH_PRISMIC_FILES = ""
const OUTPUT_FOLDER_WITH_TRANSLATION_FILES = ""
const SOURCE_FILE_WITH_TRANLSATIONS = ""
const LOCALE = "fi-fi"
const EXTRA_CONDITIONS_FUNCTION = () => {
    return true
}

function update(obj, val, newVal) {
    for(var i in obj) {
        if(typeof obj[i] == 'object') {
            update(obj[i], val, newVal)
        } else if(obj[i] === val) {
            obj[i] = newVal;
        }
    }
    return obj;
}

function processFile(filename, vocab) {
    const rawdata = fs.readFileSync(`${FOLDER_WITH_PRISMIC_FILES}/${filename}`);
    const jsonFile = JSON.parse(rawdata);
    const forbiddenKeys = ['id', 'grouplang', 'program_name', 'licence_type']

    const isLangGB = jsonFile.lang === "en-gb"
    
    function iterateKeys(obj, original) {
        const keys = Object.keys(obj)
        keys.forEach((key) => {
            const value = obj[key]
            if (typeof value === 'object' &&
            value !== null) {
                iterateKeys(value, original)
                return
            }
            if ((typeof value === 'string' || value instanceof String)) {
                const isCapitalLetter = value.match(/[A-Z]/)
                const isLink = value.match(/:\/\//)
                const isKeyForbidden = forbiddenKeys.includes(key)
                const isKeyContainText = key.includes("text")
                if ((Boolean(isCapitalLetter) || isKeyContainText) && !isLink && !isKeyForbidden) {
                    if (vocab[value.trim()]) {
                        update(original, value, vocab[value.trim()])
                    }
                }
            }
        })
    }
    
    if (isLangGB && EXTRA_CONDITIONS_FUNCTION()) {
        iterateKeys(jsonFile, jsonFile)
        jsonFile.lang = LOCALE
        const outputFile = UPDATE_OR_CREATE === "CREATE" ? `translate_${jsonFile.grouplang}_${LOCALE}.json` : filename
        fs.writeFileSync(
            `${OUTPUT_FOLDER_WITH_TRANSLATION_FILES}/${outputFile}`,
            JSON.stringify(jsonFile)
        )
    }
}

fs.readdir(`${FOLDER_WITH_PRISMIC_FILES}/`, function(err, list) {
    const vocab = fs.readFileSync(SOURCE_FILE_WITH_TRANLSATIONS);
    const vocabParsed = JSON.parse(vocab)
    for (const i = 0; i < list.length; i++) {
        const filename = list[i];
        processFile(filename, vocabParsed)
    }
});



