const chain = require("./progression.js");
//const chain = require("./test.js");
const express = require('express');
const axios = require('axios');
const q = require('q');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({limit: '5000mb', extended: true, parameterLimit: 100000000000}));
app.use(express.json());

app.use(express.static('newProject'));
app.listen(port,()=>{
  console.log(`app listening on port ${port}`);
});

app.get('/combined',(req,res)=>{
  q.fcall(async ()=>{
    
  });
});

app.get('/blockchain',(req,res)=>{
  res.send(chain[0]);
});

//console.log(chain);