const RISources = require("./RISources").RISources
const RISourcesVOD = require("./RISourcesVOD").RISourcesVOD

function SetupQueries(schema, currentProcessedDate) {
    return {
        ri_sources: RISources(schema, currentProcessedDate),
        ri_sources_vod: RISourcesVOD(schema, currentProcessedDate)
    }
}

module.exports = { SetupQueries }