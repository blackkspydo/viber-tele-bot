import express from 'express';

const app = express();
// hello world route
app.get('/', (req, res) => {
    res.send('Hello World!');
});



app.listen(8080);
