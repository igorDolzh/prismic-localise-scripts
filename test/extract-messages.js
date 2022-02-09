const fs = require('fs');

const FOLDER_WITH_PRISMIC_FILES = "20-12-2021"
const OUTPUT_JSON_FILE = "extracted-messages.json"
const EXTRA_CONDITIONS_FUNCTION = () => {
    return true
}

const messages = {}
function processFile(filename, initialTag) {
    const rawdata = fs.readFileSync(`${FOLDER_WITH_PRISMIC_FILES}/${filename}`);
    const jsonFile = JSON.parse(rawdata);
    const forbiddenKeys = ['id', 'grouplang', 'program_name', 'licence_type']
    const tags = [...jsonFile.tags, initialTag]
    if (jsonFile.type) {
        tags.push(jsonFile.type)
    }
    if (jsonFile.uid) {
        tags.push(jsonFile.uid)
    } else if (jsonFile.prismic_title && (typeof jsonFile.prismic_title === 'string' || jsonFile.prismic_title instanceof String)) {
        tags.push(jsonFile.prismic_title.slice(0, 25))
    } else if (jsonFile.title && (typeof jsonFile.title === 'string' || jsonFile.title instanceof String) ) {
        tags.push(jsonFile.title.slice(0, 25))
    } else if (jsonFile.category && (typeof jsonFile.category === 'string' || jsonFile.category instanceof String)) {
        tags.push(jsonFile.category.slice(0, 25))
    } else if (jsonFile.name && (typeof jsonFile.name === 'string' || jsonFile.name instanceof String)) {
        tags.push(jsonFile.name.slice(0, 25))
    } else if (jsonFile.platform && (typeof jsonFile.platform === 'string' || jsonFile.platform instanceof String)) {
        tags.push(jsonFile.platform.slice(0, 25))
    }

    
    const isLangGB = jsonFile.lang === "en-gb"

    
    function iterateKeys(obj, k) {
        const keys = Object.keys(obj)
        keys.forEach((key) => {
            const value = obj[key]
            if (typeof value === 'object' &&
            value !== null) {
                iterateKeys(value, ++k)
                return
            }
            if ((typeof value === 'string' || value instanceof String)) {
                const isCapitalLetter = value.match(/[A-Z]/)
                const isLink = value.match(/:\/\//)
                const isKeyForbidden = forbiddenKeys.includes(key)
                const isKeyContainText = key.includes("text")
                if ((Boolean(isCapitalLetter) || isKeyContainText) && !isLink && !isKeyForbidden && value) {
                    if (!messages[value]) {
                        messages[value] = tags
                    } else {
                        messages[value] = [...new Set([...messages[value], ...tags])]
                    }                    
                }
            }
        })
    }
    
    if (isLangGB && EXTRA_CONDITIONS_FUNCTION()) {
        iterateKeys(jsonFile, 0)
    }


}


fs.readdir(`${FOLDER_WITH_PRISMIC_FILES}/`, function(err, list)
{
    for (let i = 0; i < list.length; i++) {
        const filename = list[i];
        const initialTag = filename.split('$')[0]
        processFile(filename, initialTag)
    }

    fs.writeFileSync(
        OUTPUT_JSON_FILE,
        JSON.stringify(messages)
    )
});



