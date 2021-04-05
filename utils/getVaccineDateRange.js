const axios = require('axios');
const numberFormat = require('./numberFormat');
const to = require('await-to-js').default;
const handleError = require('cli-handle-error');

module.exports = async () => {
	const [err, response] = await to(
		axios.get(`https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=10`)
		);
		handleError(`API is down, try again later.`, err, false);
		
		const dateRange = response.data;
		
        let header = [];
        header.push('#');
        header.push('Country');
        for (data in dateRange) {
            header.push(data);
        }
		
		return header;
	};
	