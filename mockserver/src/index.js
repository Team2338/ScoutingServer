const originalMatches = JSON.parse(JSON.stringify(require('./matches.json')));
const express = require('express');
const cors = require('cors');
const app = express();
const PORT_NUM = 8080;

const corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200,
	exposedHeaders: ['secretCode']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let matches;

app.get('/api/v1/team/:teamNumber/event/:eventCode', (request, response) => {
	console.log('Received getMatches request');

	response.json(matches);
});

app.post('/api/v1/team/:teamNumber', (request, response) => {
	console.log('Received createMatch request');

	const id = matches.length;
	const match = request.body;

	match.id = id;
	matches.push(match);

	response.json(match);
});

app.put('/api/v1/team/:teamNumber/match/:matchId/hide', (request, response) => {
	console.log('Received hideMatch request');

	const matchId = request.params['matchId'];
	const match = matches.find((match) => match.id === matchId);
	// TODO: return error if match doesn't exist
	if (match) {
		match.isHidden = true;

	}

	return match;
});

app.put('/api/v1/team/:teamNumber/match/:matchId/unhide', (request, response) => {
	console.log('Received unhideMatch request');

	const matchId = request.params['matchId'];
	const match = matches.find((match) => match.id === matchId);
	// TODO: return error if match doesn't exist
	if (match) {
		match.isHidden = false;
	}

	return match;
});

app.listen(PORT_NUM, () => {
	console.log(`Server running on port ${PORT_NUM}`);
	matches = JSON.parse(JSON.stringify(originalMatches));
});
