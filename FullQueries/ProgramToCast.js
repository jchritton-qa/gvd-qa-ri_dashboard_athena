function ProgramToCast(schema, currentProcessedDate) {
    return {
        "ri_reference_name": "ProgramToCast",
        "join_column": "root_contributor_gnid",
        "present_column": "CASE WHEN RC1.root_contributor_gnid IS NOT NULL THEN PC1.program_gnid END",
        "total_column": "PC1.program_gnid",
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
                INNER JOIN gvd_base.program_cast PC1
                    ON P1.program_gnid = PC1.program_gnid
                        AND PC1.processed_date = '${currentProcessedDate}'
                LEFT OUTER JOIN gvd_base.root_contributor RC1
                    ON PC1.contributor_cast_root_gnid = RC1.root_contributor_gnid
                        AND RC1.processed_date = '${currentProcessedDate}'
            WHERE CMCI1.processed_date = '${currentProcessedDate}'
        `.trim()
    }
}

module.exports = {ProgramToCast}