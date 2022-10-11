const express = require('express');
const app = express();

app.get('/test', (req, res) => {
    res.send('test')
})

app.listen(1337, () =>{
    console.log('server started')
})