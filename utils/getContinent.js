//NEW FILE
const axios = require('axios');
const { cyan, dim } = require('chalk');
const numberFormat = require('./numberFormat');
const { sortingContinentKeys } = require('./table.js');
const to = require('await-to-js').default;
const handleError = require('cli-handle-error');
const orderBy = require('lodash.orderby');
const sortContinentValidation = require('./sortContinentValidation.js');

module.exports = async (
	spinner,
	output,
	{ sortBy, limit, reverse, json, bar }
) => {
		sortContinentValidation(sortBy, spinner);
		const [err, response] = await to(
			axios.get(`https://corona.lmao.ninja/v3/covid-19/continents`)
		);
		handleError(`API is down, try again later.`, err, false);
		let allContinents = response.data;

		// Limit.
		allContinents = allContinents.slice(0, limit);

		// Format.
		const format = numberFormat(json);

		// Sort & reverse.
		const direction = reverse ? 'asc' : 'desc';
		allContinents = orderBy(allContinents, [sortingContinentKeys[sortBy]], [direction]);

		// Push selected data.
		allContinents.map((oneContinent, count) => {
			output.push([
				count + 1,
				oneContinent.continent,
				format(oneContinent.cases),
				format(oneContinent.todayCases),
				format(oneContinent.deaths),
				format(oneContinent.todayDeaths),
				format(oneContinent.recovered),
				format(oneContinent.active),
				format(oneContinent.critical),
				format(oneContinent.casesPerOneMillion)
			]);
		});

		spinner.stopAndPersist();
		const isRev = reverse ? `${dim(` & `)}${cyan(`Order`)}: reversed` : ``;
		if (!json) {
			spinner.info(`${cyan(`Sorted by:`)} ${sortBy}${isRev}`);
		}
		console.log(output.toString());
};
