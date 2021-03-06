function ProgramToMedia(schema, currentProcessedDate) {
    return {
        "ri_reference_name": "ProgramToMedia",
        "join_column": "media_gnid",
        "referring_object": "PM1.program_gnid",
        "present_column": "MC1.media_gnid",
        "total_column": "PM1.media_gnid",
        "current_from": `
            FROM gvd_base.availability_day AD1
                INNER JOIN gvd_base.availability_manifest_availability_day AMAD1
                    ON AD1.availability_gnid = AMAD1.availability_day_gnid
                        AND AMAD1.processed_date = '${currentProcessedDate}'
                INNER JOIN ${schema}.ri_sources RS1
                    ON AD1.source_gnid = RS1.source_gnid
                INNER JOIN gvd_base.catalog_item CI1
                    ON AD1.catalog_item_gnid = CI1.catalog_item_gnid
                        AND CI1.processed_date = '${currentProcessedDate}'
                        AND CI1.catalog_status = 'active'
                INNER JOIN gvd_base.program P1
                    ON CI1.program_gnid = P1.program_gnid
                        AND P1.processed_date = '${currentProcessedDate}'
                        AND P1.status = 'active'
                INNER JOIN gvd_base.program_media PM1
                    ON P1.program_gnid = PM1.program_gnid
                        AND PM1.processed_date = '${currentProcessedDate}'
                LEFT OUTER JOIN gvd_base.media_context MC1
                    ON PM1.media_gnid = MC1.media_gnid
                        AND MC1.processed_date = '${currentProcessedDate}'
                        AND MC1.media_status = 'active'
            WHERE AD1.processed_date = '${currentProcessedDate}'
        `.trim()
    }
}

module.exports = {ProgramToMedia}