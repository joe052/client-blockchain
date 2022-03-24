 //const chain = require("./progression.js");
//const chain = require("./test.js");
const express = require('express');
const axios = require('axios');
const q = require('q');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

const url1 = 'https://blockchain.joeroyalty00.repl.co/blockchain';
const url2 = 'https://blockchain.joeroyalty00.repl.co/transactions';

app.use(bodyParser.urlencoded({limit: '5000mb', extended: true, parameterLimit: 100000000000}));
app.use(express.json());

app.use(express.static('newProject'));

app.get('/combined',(req,res)=>{
  q.fcall(async ()=>{
    const master = await axios.get(url1);
    const trans = await axios.get(url2);
    return[master,trans];//returning the two api request
  })
  .spread((master,trans)=>{
    //stripping only response data
    const mast = master.data;
    const tran = trans.data;

    //conduct checks
    if(!mast){
      res.send({message: "nothing here @ master!"});
    }
    if(!tran){
      res.send({message: "nothing here @ trans!"});
    }

    //create response
    const response = {
      status: "Success",
      message:"Data fetched",
      Data: {
        master: mast,
        trans: tran
      }
      
    };
    res.send(mast);
    //res.send("my guys...");
  })
  .catch(e =>{
    res.sendStatus({message: e});
  });
});

app.get('/',(req,res)=>{
  res.send('Build in progress.. @Client');
});

// app.get('/blockchain',(req,res)=>{
//   res.send(chain[0]);
// });

app.listen(port,()=>{
  console.log(`app listening on port ${port}`);
});

//console.log(chain);