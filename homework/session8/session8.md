# Homework

1. Construct a witness that corresponds to an invalid division. For example, you can prove that 10 divided by 3 is 2.
```circom
include "circomlib/comparators.circom";

template BadExample() {
    signal input num;
    signal input den;
    signal output quotient;
    signal output mod;

    quotient <-- num \ den;
    mod <-- num % den;

    num === den * quotient + mod;
    component iz = IsZero();
    iz.in <== den;
    iz.out === 0;
}

component main = BadExample();

/* INPUT = {
    "num": 10,
    "den": 3
}*/
```

a) Compile the Circom file to get the R1CS and the wasm files to compute the witness:
```bash
circom --r1cs --sym --wasm underconstrained.circom
```

b) Generate the witness from a valid input:
```bash
node underconstrained_js/generate_witness.js  underconstrained_js/underconstrained.wasm input.json underconstrained_js/witness.wtns
```

c) Retrieve the witness.wtns into json format to visualize all intermediate signals:
```bash
snarkjs wej underconstrained_js/witness.wtns witness.json
cat witness.json
# [
# "1", constant
# "3", quotient (output)
# "1", mod (output)
# "10", num (input)
# "3", den (input)
# "14592161914559516814830937163504850059032242933610689562465469457717205663745" (intermediate from the isZero)
#]
```

d) Check the validity of the current witness:
```bash
snarkjs wtns check underconstrained.r1cs underconstrained_js/witness.wtns
```
Output:
```bash
[INFO]  snarkJS: WITNESS CHECKING STARTED
[INFO]  snarkJS: > Reading r1cs file
[INFO]  snarkJS: > Reading witness file
[INFO]  snarkJS: ----------------------------
[INFO]  snarkJS:   WITNESS CHECK
[INFO]  snarkJS:   Curve:          bn128
[INFO]  snarkJS:   Vars (wires):   6
[INFO]  snarkJS:   Outputs:        2
[INFO]  snarkJS:   Public Inputs:  0
[INFO]  snarkJS:   Private Inputs: 2
[INFO]  snarkJS:   Labels:         8
[INFO]  snarkJS:   Constraints:    2
[INFO]  snarkJS:   Custom Gates:   false
[INFO]  snarkJS: ----------------------------
[INFO]  snarkJS: > Checking witness correctness
[INFO]  snarkJS: WITNESS IS CORRECT
[INFO]  snarkJS: WITNESS CHECKING FINISHED SUCCESSFULLY
```

e) Modify the compiled wtns to modify intermediate signals and get our two constraints passed anyways.

Here the fun starts.

We will open the `witness.wtns` file and modify its internal binary composition. This file is actually an array of 8 bits numbers so we will open it with Node.js and modify the positions in which the intermediate signals are stored.

As our intermediate signal has the same value than our "den" input, we will try to modify first the first match and then the second match, so we get a valid witness(but malicious).

We want to make the constraint `num === den * quotient + mod;` to pass without changing `num`(10) and `den`(3), and making `quotient = 2` modifying `mod` to be any number so it satisfies the constraint, so `mod = 4` will do.

First we will read the array of bytes to see what byte we have to modify
```javascript
let fs = require('fs');

let binaryWitness = fs.readFileSync('underconstrained_js/witness.wtns');
let bytes = new Uint8Array(binaryWitness);

console.dir(bytes, { 'maxArrayLength': null });
```
Output:
```bash
Uint8Array(268) [
  119, 116, 110, 115,   2,   0,   0,   0,   2,   0,   0,   0,
    1,   0,   0,   0,  40,   0,   0,   0,   0,   0,   0,   0,
   32,   0,   0,   0,   1,   0,   0, 240, 147, 245, 225,  67,
  145, 112, 185, 121,  72, 232,  51,  40,  93,  88, 129, 129,
  182,  69,  80, 184,  41, 160,  49, 225, 114,  78, 100,  48,
    6,   0,   0,   0,   2,   0,   0,   0, 192,   0,   0,   0,
    0,   0,   0,   0,   1,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
    (3),   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,   (1),   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,  10,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
    3,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,   1,   0,   0, 160,
   98,  78,  65,  45, 182, 245, 208, 251, 218, 154,  34, 112,
  147, 229,   0,   1, 207, 131,  53, 208,  27, 192, 203,  64,
  247, 222,  66,  32
]
```

Here we spot two 3s in the first column, one of those has to be modified because it is the `quotient` value that we want to make 2, and we also spot a couple of 1s where one of those represent the `mod` value that we want to make 4. 

The order of appearance of values in the array is the same than in the `witness.json` so the first 3 is the `quotient` and the second is the `den`. The other value we are interested in is `mod` which is a 1 between the 10 and the first 3.

The `quotient` is in the index `108` of the array.
The `mod` is in the index `140` of the array.

So now we modify them and save a fake witness to then use it as proof.
```javascript
let fs = require('fs');

let binaryWitness = fs.readFileSync('underconstrained_js/witness.wtns');

let bytes = new Uint8Array(binaryWitness);

bytes[108] = 2;
bytes[140] = 4;

fs.writeFileSync('underconstrained_js/fake_witness.wtns', bytes);
```

f) Check the validity of the new fake witness:
```bash
node createFakeWitness.js
snarkjs wtns check underconstrained.r1cs underconstrained_js/fake_witness.wtns
```
Output: 
```bash
[INFO]  snarkJS: WITNESS CHECKING STARTED
[INFO]  snarkJS: > Reading r1cs file
[INFO]  snarkJS: > Reading witness file
[INFO]  snarkJS: ----------------------------
[INFO]  snarkJS:   WITNESS CHECK
[INFO]  snarkJS:   Curve:          bn128
[INFO]  snarkJS:   Vars (wires):   6
[INFO]  snarkJS:   Outputs:        2
[INFO]  snarkJS:   Public Inputs:  0
[INFO]  snarkJS:   Private Inputs: 2
[INFO]  snarkJS:   Labels:         8
[INFO]  snarkJS:   Constraints:    2
[INFO]  snarkJS:   Custom Gates:   false
[INFO]  snarkJS: ----------------------------
[INFO]  snarkJS: > Checking witness correctness
[INFO]  snarkJS: WITNESS IS CORRECT
[INFO]  snarkJS: WITNESS CHECKING FINISHED SUCCESSFULLY
```

We have created a valid witness that says that 10/3 = 2 and the reminder is 4. Awesome.


### Bonus Track

In circom’s binary witness format, all of your “wires” (constant, intermediates, inputs, outputs, etc.) get laid out as a flat array of field‐elements, each one encoded as a 32‐byte little-endian integer. What you saw in the JSON dump:
```bash
cat witness.json
# [
# "1", constant
# "3", quotient (output)
# "1", mod (output)
# "10", num (input)
# "3", den (input)
# "14592161914559516814830937163504850059032242933610689562465469457717205663745" (intermediate from the isZero)
#]
```
is exactly the order in which they’re stored in the `witness.wtns` file.

But this isn't something new, we knew that and with that information we inferred the position of the signal value we wanted.

However, there is a logic behind it: wires.

**How to find your signal’s wire index?**

When we compiled `underconstrained.circom`:
```bash
circom --r1cs --sym --wasm underconstrained.circom
```

We got `underconstrained.sym`:
```bash
cat underconstrained.sym
# 1,1,1,main.quotient
# 2,2,1,main.mod
# 3,3,1,main.num
# 4,4,1,main.den
# 5,-1,0,main.iz.out
# 6,-1,0,main.iz.in
# 7,5,0,main.iz.inv
```
This tells us:
- `quotient` is wire 1
- `mod` is wire 2
- `num` is wire 3
- ... and so on.

**underconstrained.wtns stucture**

- [0-108) bytes: header and wire 0 data (constant)
- [108-140) bytes: wire 1
- [140-172) bytes: wire 2
- ... and so on

As you can notice, each wire takes 32 bytes and is written little-endian. The signal data is inside the wire.

So instead of manually looking for the value in a log of the .wtns file, we could make an insertion based on some offset we calculate, and at the same time we could modify signal values that take more than 8 bits to be represented (making an insertion of the whole wire a.k.a. the 32 bytes)

This would be the calculation for the offset to know where the wire start:
```math
\text{header size} = 108 \\
offset = \text{header size} + i * 32
```

And a more flexible code for the same problem: [createFakeWitnessPro.js](./createFakeWitnessPro.js)

Check the validity of the new fake witness:
```bash
node createFakeWitnessPro.js
snarkjs wtns check underconstrained.r1cs underconstrained_js/fake_witness_pro.wtns
```
Output: 
```bash
[INFO]  snarkJS: WITNESS CHECKING STARTED
[INFO]  snarkJS: > Reading r1cs file
[INFO]  snarkJS: > Reading witness file
[INFO]  snarkJS: ----------------------------
[INFO]  snarkJS:   WITNESS CHECK
[INFO]  snarkJS:   Curve:          bn128
[INFO]  snarkJS:   Vars (wires):   6
[INFO]  snarkJS:   Outputs:        2
[INFO]  snarkJS:   Public Inputs:  0
[INFO]  snarkJS:   Private Inputs: 2
[INFO]  snarkJS:   Labels:         8
[INFO]  snarkJS:   Constraints:    2
[INFO]  snarkJS:   Custom Gates:   false
[INFO]  snarkJS: ----------------------------
[INFO]  snarkJS: > Checking witness correctness
[INFO]  snarkJS: WITNESS IS CORRECT
[INFO]  snarkJS: WITNESS CHECKING FINISHED SUCCESSFULLY
```