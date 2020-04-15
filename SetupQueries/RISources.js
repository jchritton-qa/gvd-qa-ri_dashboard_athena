function RISources(schema, currentProcessedDate) {
    return {
        dropQuery: `
            DROP TABLE IF EXISTS ${schema}.ri_sources
        `,
        createQuery: `
            CREATE TABLE ${schema}.ri_sources
            AS
            SELECT
                DISTINCT LS1.source_gnid,
                CURRENT_DATE AS processed_date,
                CAST(TO_UNIXTIME(CURRENT_TIMESTAMP) AS BIGINT) AS processed_time_unix
            FROM gvd_base.lineup_source LS1
                INNER JOIN gvd_base.source_xid SX1
                    ON LS1.source_gnid = SX1.source_gnid
                        AND SX1.processed_date = '${currentProcessedDate}'
            WHERE LS1.processed_date = '${currentProcessedDate}'
        `
    }
}

module.exports = {RISources}