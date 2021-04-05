const axios = require('axios');
const numberFormat = require('./numberFormat');
const to = require('await-to-js').default;
const handleError = require('cli-handle-error');

module.exports = async (table, json) => {
	const [err, response] = await to(
		axios.get(`https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=10`)
		);
		handleError(`API is down, try again later.`, err, false);
		
		const allData = response.data;
		const format = numberFormat(json);
		
        let singleData = [];
        singleData.push('→');
        singleData.push('Worldwide');
        for (data in allData) {
            singleData.push(format(allData[data]));
        }
        table.push(
			singleData
		);

		const lastUpdated = Date(allData.updated);
		return lastUpdated;
	};
	