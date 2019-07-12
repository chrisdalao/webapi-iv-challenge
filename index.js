const express = require('express');
const dotenv = require('dotenv');
dotenv.config()
const postRouter = require('./post-router.js');
const server = express();

server.use('/api/posts', postRouter);

const port = process.env.PORT || 9000;
server.listen(port, () => {
    console.log(`Server running on localhost:${port}`);
})