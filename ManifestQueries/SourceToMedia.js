function SourceToMedia(schema, currentProcessedDate) {
    return {
        "ri_reference_name": "SourceToMedia",
        "join_column": "media_gnid",
        "referring_object": "SM1.source_gnid",
        "present_column": "MC1.media_gnid",
        "total_column": "SM1.media_gnid",
        "current_from": `
            FROM gvd_base.availability_day AD1
                INNER JOIN gvd_base.availability_manifest_availability_day AMAD1
                    ON AD1.availability_gnid = AMAD1.availability_day_gnid
                        AND AMAD1.processed_date = '${currentProcessedDate}'
                INNER JOIN ${schema}.ri_sources RS1
                    ON AD1.source_gnid = RS1.source_gnid
                INNER JOIN gvd_base.source_media SM1
                    ON RS1.source_gnid = SM1.source_gnid
                        AND SM1.processed_date = '${currentProcessedDate}'
                LEFT OUTER JOIN gvd_base.media_context MC1
                    ON SM1.media_gnid = MC1.media_gnid
                        AND MC1.processed_date = '${currentProcessedDate}'
                        AND MC1.media_status = 'active'
            WHERE AD1.processed_date = '${currentProcessedDate}'
        `.trim()
    }
}

module.exports = {SourceToMedia}