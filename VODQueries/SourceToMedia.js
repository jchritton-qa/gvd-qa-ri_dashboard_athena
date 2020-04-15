function SourceToMedia(schema, currentProcessedDate) {
    return {
        "ri_reference_name": "SourceToMedia",
        "join_column": "media_gnid",
        "present_column": "CASE WHEN MC1.media_gnid IS NOT NULL THEN SM1.source_gnid END",
        "total_column": "SM1.source_gnid",
        "current_from": `
            FROM ${schema}.ri_sources_vod RS1
                INNER JOIN gvd_base.catalog_manifest_catalog_item CMCI1
                    ON RS1.source_gnid = CMCI1.source_id
                        AND CMCI1.processed_date = '${currentProcessedDate}'
                INNER JOIN gvd_base.catalog_item CI1
                    ON CMCI1.catalog_item_gnid = CI1.catalog_item_gnid
                        AND CMCI1.source_id = CI1.source_gnid
                        AND CI1.processed_date = '${currentProcessedDate}'
                        AND CI1.catalog_status = 'active'
                INNER JOIN gvd_base.source_media SM1
                    ON CI1.source_gnid = SM1.source_gnid
                        AND SM1.processed_date = '${currentProcessedDate}'
                LEFT OUTER JOIN gvd_base.media_context MC1
                    ON SM1.media_gnid = MC1.media_gnid
                        AND MC1.processed_date = '${currentProcessedDate}'
                        AND MC1.media_status = 'active'
        `.trim()
    }
}

module.exports = {SourceToMedia}