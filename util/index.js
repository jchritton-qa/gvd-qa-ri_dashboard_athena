function constructDropQuery(schema, dataScope, riReferenceName) {
    return `DROP TABLE IF EXISTS ${schema}.ri_${dataScope}_${riReferenceName.toLowerCase()}`;
}

function constructCreateQuery(schema, dataScope, riReferenceName, joinColumn, presentColumn, totalColumn, currentFrom) {
    return `
        CREATE TABLE ${schema}.ri_${dataScope}_${riReferenceName.toLowerCase()}
        AS
        SELECT
            DISTINCT CAST('${riReferenceName}' AS VARCHAR) AS ri_reference_name,
            ${presentColumn} AS present_objects,
            ${totalColumn} AS total_objects,
            CAST((
                CASE
                    WHEN ${presentColumn} IS NULL
                        THEN 'MISSING'
                    ELSE
                        'PRESENT'
                END
            ) AS VARCHAR) AS object_status,
            CAST('${joinColumn}' AS VARCHAR) AS join_column,
            CAST('${dataScope}' AS VARCHAR) AS data_scope,
            CURRENT_DATE AS processed_date,
            CAST(TO_UNIXTIME(CURRENT_TIMESTAMP) AS BIGINT) AS processed_time_unix
        ${currentFrom}
    `.trim();
}

function constructInsertQuery(schema, dataScope, riReferenceName) {
    return `
        INSERT INTO ${schema}.ri_summary
        SELECT
            CAST(MAX(ri_reference_name) AS VARCHAR) AS ri_reference_name,
            CAST(MAX(data_scope) AS VARCHAR) AS data_scope,
            COUNT(present_objects) AS present_objects,
            COUNT(total_objects) AS total_objects,
            COUNT(total_objects) - COUNT(present_objects) AS missing_objects,
            CAST(
        		CASE
        			WHEN (COUNT(present_objects) = 0 OR COUNT(total_objects) = 0)
        				THEN 0.0
        			ELSE (COUNT(present_objects) * 100.00) / COUNT(total_objects)
        		END
        	AS DOUBLE) AS ri_percentage,
            MAX(processed_date) AS processed_date,
            MAX(processed_time_unix) AS processed_time_unix
        FROM ${schema}.ri_${dataScope}_${riReferenceName.toLowerCase()}
    `.trim();
}

module.exports = {
    constructDropQuery,
    constructCreateQuery,
    constructInsertQuery
}