# Homework

This exercises are part of the "[zero-knowledge-puzzles](https://github.com/RareSkills/zero-knowledge-puzzles)" from RareSkills, so the best way to test if the solution is indeed correct is by forking the repo and using their test suit. I'll be sharing here my code, just the file, but for testing you will have to clone or fork the repo.

My fork with all solutions to the puzzles is [here](https://github.com/santiellena/zero-knowledge-puzzles).

1. [HasAtLeastOne](https://github.com/RareSkills/zero-knowledge-puzzles/blob/main/HasAtLeastOne/HasAtLeastOne.circom)
Note: this is by far the hardest to solve.
```circom
pragma circom 2.1.8;

// Create a circuit that takes an array of signals `in[n]` and
// a signal k. The circuit should return 1 if `k` is in the list
// and 0 otherwise. This circuit should work for an arbitrary
// length of `in`.

template HasAtLeastOne(n) { 
    signal input in[n];
    signal input k;
    signal output out;

    signal s[n];

    s[0] <== in[0] - k;

    for(var i = 1; i < n; i++){
        s[i] <== s[i-1] * (in[i] - k);
    }

    // here the logic of the IsZero template was copied
    // because if s[n-1] == 0, then there is a match

    component iszero = IsZero();
    iszero.in <== s[n-1];
    out <== iszero.out;

    /*
        For the record:
        - At the beggining I thought of the posibility of computing the inverse of a non-zero
        value to multiply it and get one.
        - Then I could treat the hole thing as binary variables, which is easier to work with 
        given the output needed.
        - However, I got a non-quadratic constraint error:
        ```circom
        signal inv_last_s;
        inv_last_s <== 1 / s[n-1];
        out <== 1 - (s[n-1] * inv_last_s);
        ``` 
        - The issue here was that s[n-1] could be zero and division by zero is not allowed,
        this triggered that "non-quadratic constraint" issue. Yes, weird the name of the error
        given the nature of the error.
        - My intuition that the inverse of zero would be zero in Circom was wrong, but I wasn't
        far wrong. If you chech the IsZero template, that's what it does!!
    */
}

template IsZero() {
    signal input in;
    signal output out;

    signal inv;

    inv <-- in!=0 ? 1/in : 0;

    out <== -in*inv +1;
    in*out === 0;
}

component main = HasAtLeastOne(4);
```

2. [MultiAND](https://github.com/RareSkills/zero-knowledge-puzzles/blob/main/MultiAND/MultiAND.circom)
```circom
pragma circom 2.1.8;

// Create a circuit that takes an array of signals `in` and
// returns 1 if all of the signals are 1. If any of the
// signals are 0 return 0. If any of the signals are not
// 0 or 1 the circuit should not be satisfiable.

template MultiAND(n) {
    signal input in[n];
    signal output out;
    signal s[n];

    0 === in[1] * (in[1] - 1);
    s[0] <== in[0];

    for(var i = 1; i < n; i++){
        0 === in[i] * (in[i] - 1);
        s[i] <== s[i-1] * in[i];
    }

    out <== s[n-1];
}

component main = MultiAND(4);
```

3. [MultiOR](https://github.com/RareSkills/zero-knowledge-puzzles/blob/main/MultiOR/MultiOR.circom)
```circom
pragma circom 2.1.8;
include "../node_modules/circomlib/circuits/comparators.circom";

// Write a circuit that returns true when at least one
// element is 1. It should return false if all elements
// are 0. It should be unsatisfiable if any of the inputs
// are not 0 or not 1.

template MultiOR(n) {
    signal input in[n];
    signal output out;

    signal s[n];

    0 === in[0] * (in[0] - 1);
    s[0] <== in[0];

    for(var i = 1; i < n; i++){
        0 === in[i] * (in[i] - 1);
        s[i] <== in[i] + s[i-1] - in[i] * s[i-1];
    }

    out <== s[n-1];
}

component main = MultiOR(4);
```

4. [Summation](https://github.com/RareSkills/zero-knowledge-puzzles/blob/main/Summation/Summation.circom)
```circom
pragma circom 2.1.8;

template Summation(n) {
    signal input in[n];
    signal input sum;

    // constrain sum === in[0] + in[1] + in[2] + ... + in[n-1]
    // this should work for any n
    var summation = 0;

    for(var i = 0; i < n; i++){
        summation += in[i];
    }

    summation === sum;
}

component main = Summation(8);
```

5. [IsTribonacci](https://github.com/RareSkills/zero-knowledge-puzzles/blob/main/IsTribonacci/IsTribonacci.circom)
```circom
pragma circom 2.1.8;

template IsTribonacci(n) {
    signal input in[n];
    assert (n >= 3);

    // check if in[n] is a tribonacci sequence
    // 0, 1, 1, 2, 4, 7, 13, 24, 44, ...
    // The three first are 0, 1, 1,
    // the rest are the sum of the previous three
    // circuit must work for arbitrary n

    in[0] === 0;
    in[1] === 1;
    in[2] === 1;

    for(var i = 3; i < n; i++){
        in[i] === in[i-1] + in[i-2] + in[i-3]; 
    }
}

component main = IsTribonacci(9);
```