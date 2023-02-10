const matches = JSON.parse(JSON.stringify(require('./matches.json')));
const express = require('express');
const cors = require('cors');
const app = express();
const PORT_NUM = 8080;

const corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200,
	exposedHeaders: []
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1/team/:teamNumber/event/:eventCode', (request, response) => {
	console.log('Received getMatches request');

	response.json(matches);
});

app.listen(PORT_NUM, () => {
	console.log(`Server running on port ${PORT_NUM}`);
});
