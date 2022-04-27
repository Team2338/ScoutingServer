const express = require('express');
const cors = require('cors');
const mockMatches = require('./mock-matches.json');
const app = express();
const PORT_NUM = 8080;

let matches;

const corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200,
	exposedHeaders: ['secretCode']
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/v1/team/:teamNumber', (request, response) => {
	console.log('Received createMatch request');

	const id = matches.length;
	const match = request.body;

	match.id = id;
	matches.push(match);

	response.json(match);
});

app.get('/api/v1/team/:teamNumber/event/:eventCode', (request, response) => {
	console.log('Received getMatches request');

	const teamNumber = request.params['teamNumber'];
	const eventCode = request.params['eventCode'];

	response.json(matches);
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

// app.post('/user', (request, response) => {
// 	console.log('Received createUser request');
// 	console.log(request.body);
//
// 	const id = users.length;
// 	const newUser = request.body;
// 	newUser.id = id;
// 	users.push(newUser);
//
// 	const returnedUser = {...newUser}
// 	delete returnedUser.password;
//
// 	response.append('token', `token${returnedUser.id}`);
// 	response.json(returnedUser);
// });

app.listen(PORT_NUM, () => {
	console.log(`Server running on port ${PORT_NUM}`);
	matches = JSON.parse(JSON.stringify(mockMatches));
});
