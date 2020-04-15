const CatalogToProgram = require("./CatalogToProgram").CatalogToProgram
const CatalogToRootProgram = require("./CatalogToRootProgram").CatalogToRootProgram
const ProgramToCast = require("./ProgramToCast").ProgramToCast
const ProgramToCrew = require("./ProgramToCrew").ProgramToCrew
const ProgramToMedia = require("./ProgramToMedia").ProgramToMedia
const SourceToMedia = require("./SourceToMedia").SourceToMedia

function VODQueries(schema, currentProcessedDate) {
    return {
        "vod": [
            CatalogToProgram(schema, currentProcessedDate),
            CatalogToRootProgram(schema, currentProcessedDate),
            ProgramToCast(schema, currentProcessedDate),
            ProgramToCrew(schema, currentProcessedDate),
            ProgramToMedia(schema, currentProcessedDate),
            SourceToMedia(schema, currentProcessedDate)
        ]
    }
}

module.exports = { VODQueries }