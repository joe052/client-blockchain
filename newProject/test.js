//import * as crypto from 'crypto';
//const crypto = require('crypto-js');
const fetch = require('node-fetch');
const SHA256 = require('crypto-js/sha256');

let transArr = [];
const myUrl = "https://blockchain.joeroyalty00.repl.co/blockchain";

class Transaction {
  constructor(owner, receiver, size) {
    this.owner = owner;
    this.receiver = receiver;
    this.landId = this.generateId();
    this.size = size;
  }

  toString() {
    return JSON.stringify(this);
  }

  generateId() {
    return SHA256(this.owner + this.receiver + this.size).toString();
  }
}

//container for multiple transactions
class Block {
  constructor(previousHash = '', transaction, date = Date.now()) {
    this.previousHash = previousHash;
    this.transaction = transaction;
    //this.transaction = JSON.stringify(transaction);
    this.timestamp = date;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(this.previousHash + this.date + JSON.stringify(this.transaction) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    console.log('⛏⛏ Transacting...');
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: " + this.hash + " and nonce is " + this.nonce);
  }
}

class Chain {
  static instance = new Chain();

  constructor() {
    
    this.chain = [];
    this.difficulty = 4;
  }

  //fetch chain from api and push transaction
  async getChain(transaction) {
    const response = await fetch(myUrl);
    const data = await response.json();
    console.log("getting...");
    this.addData(data,transaction);
  }

  //push new block with transaction to chain
  addData(object,transaction) {
    this.chain.push(object);
    
    //picking chain elements only #filtering
    this.chain = this.chain[0];
    console.log("This is the chain i fetched:");
    //console.log(this.chain);
    
    //special .length for objects...checking length of fetched chain
    console.log(Object.keys(this.chain).length);

    //getting latest block of chain
    const latest = this.chain[Object.keys(this.chain).length -1];
    //console.log("\nbelow lies the latest")
    //console.log(latest.hash);

    //creating and mining new block and adding transaction
    const newBlock = new Block(latest.hash, transaction);
    newBlock.mineBlock(this.difficulty);
    console.log(transaction);
    this.chain.push(newBlock);
    console.log(this.chain);
    console.log(Object.keys(this.chain).length);
    console.log("\nupdate successfully complete!!");
    //console.log("\nupdate successfully complete!!");
  }

  /*----------------test to get the pure chain only------------------------------------------------*/
  //get chain
  async getPchain() {
    const response = await fetch(myUrl);
    const data = await response.json();
    //console.log("getting...");
    const newChain = this.addPdata(data);
    //console.log(newChain);
    return newChain;
  }

  //push chain
  addPdata(object) {
    let newChain = [];
    newChain.push(object);
    newChain = newChain[0];
    return newChain;
  }

  returner(){
    return this.getPchain();
  }
/*-----------------------end of test---------------------------------------------*/

  //get balance
  async getBalanceOfAddress(address) {
    let balance = 0;
    const chain =  await this.returner();
    //console.log(chain);
    
    for (const block of chain) {
      const trans = block.transaction;
      if (trans.owner === address) {
        balance -= trans.size;
      }
      if (trans.receiver === address) {
        balance += trans.size;
      }
    }
    return balance;
    //console.log(balance);
  }

}

class Wallet {

  constructor(publicKey) {
    this.publicKey = publicKey;
    this.minimum = 100;
    //this.bal = bal;
  }

  async filterTransaction(){
    let receiveArr = [];
    let sendArr = [];
    let availableBalance = await Chain.instance.getBalanceOfAddress(this.publicKey);
    
    const chain = await Chain.instance.returner();
     for(const block of chain){
       const trans = block.transaction;
       if(trans.owner == this.publicKey || trans.receiver == this.publicKey){
         transArr.push(trans);
       }
     }
    console.log(transArr);
    for(const x of transArr){
      if(x.owner == this.publicKey){
        sendArr.push(x);
      }else{
      receiveArr.push(x);
      }
    }
  console.log(`sent transactions are ${sendArr.length}\nreceived transactions are ${receiveArr.length}\nbalance is ${availableBalance}`);
    return transArr;
  }
  
  async transactLand(size, receiverPublicKey) {
    let minimum = this.minimum;
    let availableLand =  await Chain.instance.getBalanceOfAddress(this.publicKey);
    //let availableLand = 500;
    //console.log(availableLand);

    if (availableLand > 0 && availableLand >= size) {

      if (size >= minimum) {
        const transaction = new Transaction(this.publicKey, receiverPublicKey, size);
        Chain.instance.getChain(transaction);
        //console.log(transaction);
      } else {
        console.log(`\nunable to initiate transaction from ${this.publicKey}...minimum transactable size is ${minimum}`);
        const oldChain = await Chain.instance.returner();
        Chain.instance.chain.push(oldChain);
      }

    } else {
      console.log("\ninsufficient land size to initiate transaction from", this.publicKey);
      const oldChain = await Chain.instance.returner();
      Chain.instance.chain.push(oldChain);
    }

  }
  
}

const satoshi = new Wallet('satoshi');
//const bob = new Wallet('bob');
//const alice = new Wallet('alice');
//const manu = new Wallet('manu');
//const joe = new Wallet('joe');
//const grace = new Wallet('grace');
//const ann = new Wallet('ann');
//const isaac = new Wallet('isaac');
//const peter = new Wallet('peter');
//const agnes = new Wallet('agnes');


satoshi.transactLand(200,'ann');
satoshi.filterTransaction();

//console.log(Chain.instance);
//console.log(JSON.stringify(Chain.instance,null,4));
let chain = Chain.instance.chain;

module.exports = chain;