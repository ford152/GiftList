const express = require('express');
const MerkleTree = require('../utils/MerkleTree');
const verifyProof = require('../utils/verifyProof');
const niceList = require('../utils/niceList');

const port = 1225;

const app = express();
app.use(express.json());


// TODO: hardcode a merkle root here representing the whole nice list
// paste the hex string in here, without the 0x prefix
const merkleTree = new MerkleTree(niceList);
const MERKLE_ROOT = merkleTree.getRoot();
console.log('root is', MERKLE_ROOT);

app.post('/gift', (req, res) => {
  // grab the parameters from the front-end here
  const body = req.body;

  const index = niceList.findIndex(n => n === body.proveName);
  const proof = merkleTree.getProof(index);

  // verify proof against the Merkle Root
  const isInTheList = verifyProof(proof, body.proveName, MERKLE_ROOT);
  console.log(`verifying proof against Merkle Root for name: ${body.proveName}`, isInTheList);


  if (isInTheList) {
    res.send("Amazing! You get a gift!");
  } else {
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});