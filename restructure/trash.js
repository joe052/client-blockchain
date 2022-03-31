//get chain from api and push transaction
  async function getResolve2(node,transaction){
    const response = await fetch(node + '/resolve');
    const result = await response.json();
    //let bigChain = [];
      //shared method addArray() in complex section
    let allChain = this.addArray(result);
    console.log(allChain.length);
    allChain.sort();
    const newChain = allChain[allChain.length - 1];
    //console.log(newChain);
    console.log(newChain.length);

    //adding transaction to acquired chain
    this.addData(newChain,transaction);
    
    for(const i of allChain){
      //console.log(i.length);
    }  
  }