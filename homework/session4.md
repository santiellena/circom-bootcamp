# Homework

This exercises are part of the "[zero-knowledge-puzzles](https://github.com/RareSkills/zero-knowledge-puzzles)" from RareSkills, so the best way to test if the solution is indeed correct is by forking the repo and using their test suit. I'll be sharing here my code, just the file, but for testing you will have to clone or fork the repo.

My fork with all solutions to the puzzles is [here](https://github.com/santiellena/zero-knowledge-puzzles).

1. [MultiplyNoOut](https://github.com/RareSkills/zero-knowledge-puzzles/blob/main/MultiplyNoOut/MultiplyNoOut.circom)

```circom
pragma circom 2.1.8;

// Your circuit should constrain the third signal in `in`
// to be the product of the first two signals

template MultiplyNoOutput() {
    signal input in[3];

    in[2] === in[0] * in[1];
}

component main = MultiplyNoOutput();
```

2. [FourBitBinary](https://github.com/RareSkills/zero-knowledge-puzzles/blob/main/FourBitBinary/FourBitBinary.circom)

```circom
pragma circom 2.1.8;

// Create a circuit that takes an array of four signals
// `in`and a signal s and returns is satisfied if `in`
// is the binary representation of `n`. For example:
// 
// Accept:
// 0,  [0,0,0,0]
// 1,  [1,0,0,0]
// 15, [1,1,1,1]
// 
// Reject:
// 0, [3,0,0,0]
// 
// The circuit is unsatisfiable if n > 15

template FourBitBinary() {
    signal input in[4];
    signal input n;

    var coefficient = 1;
    var num = 0;
    for(var i = 0; i < 4; i++){
        0 === in[i] * (in[i] - 1); // binary
        
        num += in[i] * coefficient;
        coefficient *= 2;
    }

    n === num;
}

component main{public [n]} = FourBitBinary();
```

3. [AllBinary](https://github.com/RareSkills/zero-knowledge-puzzles/blob/main/AllBinary/AllBinary.circom)

```circom
pragma circom 2.1.8;

// Create constraints that enforces all signals
// in `in` are binary, i.e. 0 or 1.

template AllBinary(n) {
    signal input in[n];

    for (var i = 0; i < n; i++) {
		0 === in[i] * (in[i] - 1);
	}
}

component main = AllBinary(4);
```

4. [MultiANDNoOut](https://github.com/RareSkills/zero-knowledge-puzzles/blob/main/MultiANDNoOut/MultiANDNoOut.circom)

```circom
pragma circom 2.1.8;

// Create a circuit that takes an array of signals `in` and
// is satisfied if all the signals are equal to one.
// i.e. in[i] === 1 for all i

template MultiANDNoOut(n) {
    signal input in[n];

    for(var i = 0; i < n; i++){
        in[i] === 1;
    }
}

component main = MultiANDNoOut(4);
```

5. [IncreasingDistance](https://github.com/RareSkills/zero-knowledge-puzzles/blob/main/IncreasingDistance/IncreasingDistance.circom)

```circom
pragma circom 2.1.8;

// Create a circuit that takes an array of signals
// in1[n], in2[n], in3[n] and enforces that
// in1[0] * in2[0] === in3[0]
// in1[1] * in2[1] === in3[1] + 1
// in1[2] * in2[2] === in3[2] + 2
// ...
// in1[n-1] * in2[n-1] === in3[n-1] + n-1
template IncreasingDistance(n) {
    signal input in1[n];
    signal input in2[n];
    signal input in3[n];

    for(var i = 0; i < n; i++){
        in1[i] * in2[i] === in3[i] + i;
    }
}

component main = IncreasingDistance(4);
```