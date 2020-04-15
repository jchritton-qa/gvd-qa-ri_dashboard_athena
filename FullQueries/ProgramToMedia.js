function ProgramToMedia(schema, currentProcessedDate) {
    return {
        "ri_reference_name": "ProgramToMedia",
        "join_column": "media_gnid",
        "present_column": "CASE WHEN MC1.media_gnid IS NOT NULL THEN PM1.program_gnid END",
        "total_column": "PM1.program_gnid",
        "current_from": `
            FROM gvd_base.catalog_manifest_catalog_item CMCI1
                INNER JOIN gvd_base.catalog_item CI1
                    ON CMCI1.catalog_item_gnid = CI1.catalog_item_gnid
                        AND CMCI1.source_id = CI1.source_gnid
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
            WHERE CMCI1.processed_date = '${currentProcessedDate}'
        `.trim()
    }
}

module.exports = {ProgramToMedia}