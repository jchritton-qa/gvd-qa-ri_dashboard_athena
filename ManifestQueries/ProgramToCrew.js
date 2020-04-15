function ProgramToCrew(schema, currentProcessedDate) {
    return {
        "ri_reference_name": "ProgramToCrew",
        "join_column": "root_contributor_gnid",
        "present_column": "CASE WHEN RC1.root_contributor_gnid IS NOT NULL THEN PC1.program_gnid END",
        "total_column": "PC1.program_gnid",
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
                INNER JOIN gvd_base.program_crew PC1
                    ON P1.program_gnid = PC1.program_gnid
                        AND PC1.processed_date = '${currentProcessedDate}'
                LEFT OUTER JOIN gvd_base.root_contributor RC1
                    ON PC1.contributor_crew_root_gnid = RC1.root_contributor_gnid
                        AND RC1.processed_date = '${currentProcessedDate}'
            WHERE AD1.processed_date = '${currentProcessedDate}'
        `.trim()
    }
}

module.exports = {ProgramToCrew}