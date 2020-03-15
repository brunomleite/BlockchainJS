const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(index, data, previousHash = ''){
		this.index = index;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0
	}

	calculateHash(){
		return SHA256(this.index + this.previousHash + JSON.stringify(this.data) + this.nonce).toString();
	}

	mineBlock(difficulty){
		while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
			this.nonce++;
			this.hash = this.calculateHash();
		}
		console.log("Block mined: " + this.hash);
	}
}

class Blockchain{
	constructor(){
		this.chain = [];
		this.difficulty = 4;
	}

	createGenesisBlock(data){
		return new Block(0, data, "0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	createBlock(index, data){
		if(index == 0){
			this.chain.push(this.createGenesisBlock(data));
		}else{
			this.addBlock(new Block(index, data));
		}
	}

	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}

	isChainValid(){
		for(let i = 1; i < this.chain.length; i++){
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i-1]

			if(currentBlock.hash !== currentBlock.calculateHash()){
				return false;
			}

			if(currentBlock.previousHash !== previousBlock.hash){
				return false;
			}
		}
		return true;
	}
}

function readFile(name){
	let fs = require('fs');
	let text = '';

	return text = fs.readFileSync(name, 'utf8');
}

let test = new Blockchain();
let index = 0;

test.createBlock(index, readFile('input1.txt'));
index++;
test.createBlock(index, readFile('input2.txt'));
index++;

console.log(JSON.stringify(test, null, 4));
console.log('Blockchain Valid? - ' + test.isChainValid());

//test.chain[1].data = "Mudei";
//console.log('Blockchain Valid? - ' + test.isChainValid());