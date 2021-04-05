#!/usr/bin/env node

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
	handleError(`UNHANDLED ERROR`, err);
});

const ora = require('ora');
const Table = require('cli-table3');
const JsonOutput = require('./utils/JsonOutput.js');
const cli = require('./utils/cli.js');
const init = require('./utils/init.js');
const theEnd = require('./utils/theEnd.js');
const handleError = require('cli-handle-error');
const getStates = require('./utils/getStates.js');
const getCountry = require('./utils/getCountry.js');
const getCountryChart = require('./utils/getCountryChart.js');
const getBar = require('./utils/getBar.js');
const getWorldwide = require('./utils/getWorldwide.js');
const getCountries = require('./utils/getCountries.js');
const {
	style,
	single,
	colored,
	singleStates,
	coloredStates,
	borderless
} = require('./utils/table.js');
const getVaccineCountry = require('./utils/getVaccineCountry.js');

// Cli.
const input = cli.input;
for (let i in input) {
	input[i] = input[i].toLowerCase();
}

const xcolor = cli.flags.xcolor;
const sortBy = cli.flags.sort;
const reverse = cli.flags.reverse;
const limit = Math.abs(cli.flags.limit);
const chart = cli.flags.chart;
const log = cli.flags.log;
const bar = cli.flags.bar;
const minimal = cli.flags.minimal;
const json = cli.flags.json;
const options = { sortBy, limit, reverse, minimal, chart, log, json, bar };

(async () => {
	// Init.
	await init(minimal || json);
	const spinner = ora({ text: '' });
	input[0] === 'help' && (await cli.showHelp(0));
	
	// Table
	const head = xcolor ? single : colored;
	const headStates = xcolor ? singleStates : coloredStates;
	const border = minimal ? borderless : {};
	const OutputFormat = json ? JsonOutput : Table;
	
	// Display data.
	spinner.start();
	if (input[0] === 'vaccine') {
		//Identify if searching for one country or all countries
		let country = input.length === 1 ? "" : input[1];
		const output = new OutputFormat({ head, style, chars: border }) //TODO implement output format for vaccines
		await getVaccineCountry(spinner, output, country, options)
	}

	//States only supports bar graph
	else if (input[0] === 'states') {
		const states = true;
		const output = new OutputFormat({ head: headStates, style, chars: border });
		await getStates(spinner, output, options);
		await getBar(spinner, states, options);
	}
	//Display country or world data
	else {
		const states = false;
		const output = new OutputFormat({ head, style, chars: border });

		await getWorldwide(output, json);
		//Country data only supports chart data
		if (input.length === 1) {
			let country = input[0];
			await getCountry(spinner, output, country, options);
			await getCountryChart(spinner, country, options);
		}
		//World data only supports bar graph
		else {
			await getCountries(spinner, output, options);
			await getBar(spinner, states, options);
		}
	}
	// theEnd(lastUpdated, states, minimal || json);
})();
