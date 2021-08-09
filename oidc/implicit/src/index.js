const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/oauth/redirect', (req, res) => {
	const index = path.join(
		process.cwd(),
		'src/public/redirect.html'
	);
	res.sendFile(index);
});

app.get('/', (req, res) => {
	const index = path.join(
		process.cwd(),
		'src/public/index.html'
	);
	res.sendFile(index);
});

const server = app
  .listen(
    port,
    () => console.log(`Listening at http://localhost:${port}`)
  );
