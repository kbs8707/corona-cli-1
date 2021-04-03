const axios = require('axios');
const numberFormat = require('./numberFormat');
const exitCountry = require('./exitCountry');
const to = require('await-to-js').default;
const handleError = require('cli-handle-error');

module.exports = async (spinner, table, countryName, options) => {
    let url;
    //Return vaccine data for one country
    if (countryName) {
        url = `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${countryName}?lastdays=10`;
    }
    //Return vaccine data for all countries
    else {
        url = `https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=10`;
    }
    const [err, response] = await to(
        axios.get(url));
        exitCountry(err, spinner, countryName);
        err && spinner.stopAndPersist();
        handleError(`API is down, try again later.`, err, false);
        const thisCountry = response.data;
        
        // Format.
        const format = numberFormat(options.json);
        
        table.push([
            `—`,
            thisCountry.country,
            format(thisCountry.timeline),
        ]);
        spinner.stopAndPersist();
        console.log(table.toString());
};
