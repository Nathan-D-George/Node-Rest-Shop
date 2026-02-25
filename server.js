const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

server.listen(port);