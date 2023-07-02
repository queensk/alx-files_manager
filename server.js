import express from 'express';

import routes from './routes/index.js';

const app = express();

app.use(express.json());
app.use(routes);

const port = process.env.PORT || 5000;

/**
 * Start listening on the port
 * @param {number} port - The port number to listen on
 * @param {function} callback - The callback function to execute after listening
 */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
