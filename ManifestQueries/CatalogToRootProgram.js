function CatalogToRootProgram(schema, currentProcessedDate) {
    return {
        "ri_reference_name": "CatalogToRootProgram",
        "join_column": "program_root_gnid",
        "present_column": "RP1.root_program_gnid",
        "total_column": "CI1.program_root_gnid",
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
                LEFT OUTER JOIN gvd_base.root_program RP1
                    ON CI1.program_root_gnid = RP1.root_program_gnid
                        AND RP1.processed_date = '${currentProcessedDate}'
            WHERE AD1.processed_date = '${currentProcessedDate}'
        `.trim()
    }
}

module.exports = {CatalogToRootProgram}