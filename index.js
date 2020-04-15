const aws = require("aws-sdk");
const AthenaExpress = require("athena-express");
const Util = require("./util")
const SetupQueries = require("./SetupQueries").SetupQueries;
const ManifestQueries = require("./ManifestQueries").ManifestQueries;
const FullQueries = require("./FullQueries").FullQueries;
const VODQueries = require("./VODQueries").VODQueries;

const awsCredentials = {
    region: "us-west-2",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};
aws.config.update(awsCredentials);

const athenaExpressConfig = { 
    aws,
    workgroup: "primary",
    s3: "s3://gn5456-gvd-qa-p/athena/",
    getStats: true
};
const athenaExpress = new AthenaExpress(athenaExpressConfig);

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

const fetchCurrentProcessedDate = async () => {
    // Get the most recent processed_date, currently most reliable from catalog_item
    const sql = `
        SELECT
            MAX(processed_date) AS current_processed_date
        FROM gvd_base.catalog_item
    `;

    const query = { sql }
    let currentProcessedDate = "";

    try {
        let data = await athenaExpress.query(query);
        console.log(data)
        currentProcessedDate = data.Items[0].current_processed_date;
    } catch (error) {
        console.error(error);
    }

    return currentProcessedDate;
}

const runSetupQueries = async (setupQueries) => {
    await asyncForEach(Object.keys(setupQueries), async (key) => {
        try {
            let data = await athenaExpress.query(setupQueries[key].dropQuery);
            console.log("======== " + key + " DROP ========")
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    
        try {
            let data = await athenaExpress.query(setupQueries[key].createQuery);
            console.log("======== " + key + " CREATE ========")
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    });
}

const runFinalQueries = async (finalObj) => {
    await asyncForEach(Object.keys(finalObj), async (key) => {
        try {
            let data = await athenaExpress.query(finalObj[key].dropQuery);
            console.log("======== " + key + " DROP ========")
            console.log(data);
        } catch (error) {
            console.log(error);
        }

        try {
            let data = await athenaExpress.query(finalObj[key].createQuery);
            console.log("======== " + key + " CREATE ========")
            console.log(data);
        } catch (error) {
            console.log(error);
        }

        try {
            let data = await athenaExpress.query(finalObj[key].insertQuery);
            console.log("======== " + key + " INSERT ========")
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    });
}

const populateUpdateQueries = (schema, finalObj, scope, data) => {
    data.forEach(ref => {
        finalObj[`ri_${scope}_${ref.ri_reference_name.toLowerCase()}`] = {
            dropQuery: Util.constructDropQuery(schema, scope, ref.ri_reference_name),
            createQuery: Util.constructCreateQuery(schema, scope, ref.ri_reference_name, ref.join_column, ref.present_column, ref.total_column, ref.current_from),
            insertQuery: Util.constructInsertQuery(schema, scope, ref.ri_reference_name)
        }
    })
}

// Handler function execution
(async () => {
    const customSchema = "gvd_md_qa";

    const currentProcessedDate = await fetchCurrentProcessedDate();

    const setupQueries = SetupQueries(customSchema, currentProcessedDate);
    const setupResults = await runSetupQueries(setupQueries);

    // Merge all primary RI queries, create and iterate through Athena DROP/CREATE/INSERT sets
    const mergedReferenceData = Object.assign({}, 
        ManifestQueries(customSchema, currentProcessedDate),
        FullQueries(customSchema, currentProcessedDate),
        VODQueries(customSchema, currentProcessedDate)
    )

    let finalObj = {};

    for (const [scope, data] of Object.entries(mergedReferenceData)) {
        if (Object.entries(data).length !== 0 && data.constructor === Array) {
            populateUpdateQueries(customSchema, finalObj, scope, data);
        }
    }

    const finalResults = await runFinalQueries(finalObj);
})();
