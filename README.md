# Scripts for connecting Prismic and Localise
Our service for defining and generating email templates and push notifications.

## How to convert prismic files into localise-friendly format

1. Download the recent snapshot of the documents from Prismic with "Export your documents" on [Import/Export](https://commercial-helios.prismic.io/settings/import/)
2. Extract the archive and get the documents that should be processed
3. Create your own version on the `extract-messages` script based on the template
    1. `FOLDER_WITH_PRISMIC_FILES` is the path for the folder where Prismic documents that should be processed
    2. `OUTPUT_JSON_FILE` is the path for the json file with the results of the conversion
    3. `EXTRA_CONDITIONS_FUNCTION` is optional param. It is the function that could help to filter some documents by some conditions. Also, by default only documents with `lang` equals "en-gb" are proccessed since English is the our base language
4. Run the your custom script with `node script_path/it.js`
5. Get the json file with the path `OUTPUT_JSON_FILE` and use it for uploading to the [lokalise](https://lokalise.com/)
    1. At the moment, you could send the file to igor@pleo.io so he could upload it to the [lokalise](https://lokalise.com/). Later on we will create some automatisation here too.


## How to create new documents or update existed with the translations for Prismic

1. Download the recent snapshot of the documents from Prismic with "Export your documents" on [Import/Export](https://commercial-helios.prismic.io/settings/import/)
2. Extract the archive and get the documents that should be processed
3. Get the file with the recent translations that you want to apply for the Prismic
    1. You could get this file directly from lokalise using this process:  [lokalise-downloading-translation-files](https://docs.lokalise.com/en/articles/3150682-downloading-translation-files) with dev@pleo.io account. Password could be found in 1Password. The format of the file should be "JSON"
    2. You could ask igor@pleo.io so he could give this file for you
4. Create your own version on the `create-prismic-files` script based on the template
    1. `FOLDER_WITH_PRISMIC_FILES` is the path for the folder where Prismic documents that should be processed
    2. `OUTPUT_FOLDER_WITH_TRANSLATION_FILES` is the path for the folder where the translated documents will be stored
    3. `SOURCE_FILE_WITH_TRANLSATIONS` is the path for the file downloaded from [lokalise](https://lokalise.com/) with the translations
    4. `LOCALE` is the name of the locale from Prismic
    5. `UPDATE_OR_CREATE` should equal to "CREATE" when creating new files and should equal to "UPDATE" when updating existed files
    6. `EXTRA_CONDITIONS_FUNCTION` is optional param. It is the function that could help to filter some documents by some conditions. Also, by default only documents with `lang` equals "en-gb" are proccessed since English is the our base language
5. Run the your custom script with `node script_path/it.js`
6. Get the Prismic files with the path `OUTPUT_FOLDER_WITH_TRANSLATION_FILES` and use it for uploading to Prismic with [Import/Export](https://commercial-helios.prismic.io/settings/import/) choosing "Import your documents"
