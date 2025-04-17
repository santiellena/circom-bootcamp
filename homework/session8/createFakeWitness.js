let fs = require('fs');

let binaryWitness = fs.readFileSync('underconstrained_js/witness.wtns');

let bytes = new Uint8Array(binaryWitness);

bytes[108] = 2;
bytes[140] = 4;

fs.writeFileSync('underconstrained_js/fake_witness.wtns', bytes);
