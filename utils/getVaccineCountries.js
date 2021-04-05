const axios = require('axios');
const { cyan, dim } = require('chalk');
const numberFormat = require('./numberFormat');
const { sortingKeys } = require('./table.js');
const to = require('await-to-js').default;
const handleError = require('cli-handle-error');
const orderBy = require('lodash.orderby');
const sortValidation = require('./sortValidation.js');

module.exports = async (
    spinner,
    output,
    { sortBy, limit, reverse, bar, json }
    ) => {
        sortValidation(sortBy, spinner);
        const [err, response] = await to(
            axios.get(`https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=10`)
            );
            handleError(`API is down, try again later.`, err, false);
            let allCountries = response.data;
            
            // Format.
            const format = numberFormat(json);
            
            //Using today's vaccination number to order the list
            for (country in allCountries) {
                allCountries[country]["todayVaccine"] = Object.values(allCountries[country].timeline)[Object.values(allCountries[country].timeline).length - 1];
            }
            
            const direction = reverse ? 'asc' : 'desc';
            allCountries = orderBy(
                allCountries,
                ["todayVaccine"],
                [direction]
                );
                
                // Limit.
                allCountries = allCountries.slice(0, limit);
                
                // Push selected data.
                allCountries.map((oneCountry, count) => {
                    let singleData = [];
                    singleData.push(count+1);
                    singleData.push(oneCountry.country);
                    for (data in oneCountry.timeline) {
                        singleData.push(format(oneCountry.timeline[data]));
                    }
                    
                    output.push(singleData);
                });
                
                spinner.stopAndPersist();
                // const isRev = reverse ? `${dim(` & `)}${cyan(`Order`)}: reversed` : ``;
                // if (!json) {
                // 	spinner.info(`${cyan(`Sorted by:`)} ${sortBy}${isRev}`);
                // }
                console.log(output.toString());
            };
            