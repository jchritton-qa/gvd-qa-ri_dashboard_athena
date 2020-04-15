function CatalogToProgram(schema, currentProcessedDate) {
    return {
        "ri_reference_name": "CatalogToProgram",
        "join_column": "program_gnid",
        "present_column": "P1.program_gnid",
        "total_column": "CI1.program_gnid",
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
                LEFT OUTER JOIN gvd_base.program P1
                    ON CI1.program_gnid = P1.program_gnid
                        AND P1.processed_date = '${currentProcessedDate}'
                        AND P1.status = 'active'
        `.trim()
    }
}

module.exports = {CatalogToProgram}