const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

app.get('/newquery', function (req, res) {
    res.send('GET request to homepage')
})

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});