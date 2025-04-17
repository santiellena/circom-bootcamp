let fs = require('fs');

let binaryWitness = fs.readFileSync('underconstrained_js/witness.wtns');
let bytes = new Uint8Array(binaryWitness);

const HEADER_SIZE = 108; // bytes before the first witness value (or wire 1)
const FIELD_SIZE = 32;   // each field element is 32 bytes

const wireIndices = {
    quotient: 1,
    mod: 2
};

// new values to write
/// decided to allow inserting a big int because it could be used in
/// cases where we want to insert or modify a value that takes more
/// than 32 bytes
const newValues = {
    quotient: 2n,
    mod: 4n
};

// big int as a 32-byte little-endian array
function writeWireLE(buffer, offset, value) {
    let hex = value.toString(16).padStart(64, '0'); // 32 bytes = 64 hex chars
    let bytesLE = hex.match(/.{2}/g).reverse(); // little-endian
    for (let i = 0; i < 32; i++) {
        buffer[offset + i] = parseInt(bytesLE[i], 16);
    }
}

// write new values to the right offsets
for (let name in wireIndices) {
    const wireIndex = wireIndices[name];
    // here the formula from the explanation a little bit modified so we get the start of the wire and not the end
    const offset = HEADER_SIZE + (wireIndex - 1) * FIELD_SIZE;
    writeWireLE(bytes, offset, newValues[name]);
}

// save the modified witness
fs.writeFileSync('underconstrained_js/fake_witness_pro.wtns', bytes);