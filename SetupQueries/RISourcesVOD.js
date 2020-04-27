function RISourcesVOD(schema, currentProcessedDate) {
    return {
        dropQuery: `
            DROP TABLE IF EXISTS ${schema}.ri_sources_vod
        `,
        createQuery: `
            CREATE TABLE ${schema}.ri_sources_vod
            AS
            SELECT
                DISTINCT source_gnid,
                CURRENT_DATE AS processed_date,
                TO_UNIXTIME(CURRENT_TIMESTAMP) AS processed_time_unix
            FROM gvd_base.source_context
            WHERE processed_date = '${currentProcessedDate}'
                AND status = 'active'
                AND source_context_type = 'VOD'
        `
    }
}

module.exports = {RISourcesVOD}