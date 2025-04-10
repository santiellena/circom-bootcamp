# Homework
You can execute these circuits in [zkRepl](https://zkrepl.dev/), a running Circom evironment for testing and educational purposes.

1. Create a circuit that constrains in[n] to be sorted descending.
```circom
pragma circom 2.1.6;

include "circomlib/comparators.circom";

template Example (n) {
    signal input in[n];

    component components[n];
    for(var i = 0; i < n - 1; i++){
        components[i] = GreaterEqThan(252);
        components[i].in[0] <== in[i];
        components[i].in[1] <== in[i + 1];
        components[i].out === 1;
    }
}

component main = Example(5);

/* INPUT = {
    "in": [5,4,3,2,1]
} */
```

2. Create a circuit that constrains every element in[n] to be greater than input k.
```circom
pragma circom 2.1.6;

include "circomlib/comparators.circom";

template Example (n) {
    signal input in[n];
    signal input k;

    component components[n];
    for(var i = 0; i < n; i++){
        components[i] = GreaterEqThan(252);
        components[i].in[0] <== in[i];
        components[i].in[1] <== k;
        components[i].out === 1;
    }
}

component main = Example(5);

/* INPUT = {
    "in": [11,12,255,40,120],
    "k": 10
} */
```

3. Create a circuit that constrains every element in in[n] to be greater than or equal input k but also less than or equal input t. Constrain that k < t.
```circom
pragma circom 2.1.6;

include "circomlib/comparators.circom";

template Example (n) {
    signal input in[n];
    signal input k;
    signal input t;

    component lessEqComponents[n];
    component greaterEqComponents[n];

    component lessThan = LessThan(252);
    lessThan.in[0] <== k;
    lessThan.in[1] <== t;
    lessThan.out === 1;

    for(var i = 0; i < n; i++){
        lessEqComponents[i] = LessEqThan(252);
        lessEqComponents[i].in[0] <== in[i];
        lessEqComponents[i].in[1] <== t;
        lessEqComponents[i].out === 1;

        greaterEqComponents[i] = GreaterEqThan(252);
        greaterEqComponents[i].in[0] <== in[i];
        greaterEqComponents[i].in[1] <== k;
        greaterEqComponents[i].out === 1;
    }
}

component main = Example(5);

/* INPUT = {
    "in": [11,100,25,40,10],
    "k": 10,
    "t": 100
} */
```
4. Create a circuit that forces the following relationship on inputs arrays input lower[n], input in[n] and input upper[n]: lower[i] ≤ in[i] ≤ upper[i] for i in 0..n constrain that lower[i] < upper[i] for all i.
```circom
pragma circom 2.1.6;

include "circomlib/comparators.circom";

template Example (n) {
    signal input in[n];
    signal input lower[n];
    signal input upper[n];

    component lessThan[n];
    
    component lessEqThan[n*2];

    for(var i = 0; i < n; i++){
        lessThan[i] = LessThan(252);
        lessThan[i].in[0] <== lower[i];
        lessThan[i].in[1] <== upper[i];
        lessThan[i].out === 1;

        lessEqThan[i] = LessEqThan(252);
        lessEqThan[i].in[0] <== lower[i];
        lessEqThan[i].in[1] <== in[i];
        lessEqThan[i].out === 1;

        lessEqThan[i + n] = LessEqThan(252);
        lessEqThan[i + n].in[0] <== in[i];
        lessEqThan[i + n].in[1] <== upper[i];
        lessEqThan[i + n].out === 1;
    }
}

component main = Example(5);

/* INPUT = {
    "in": [11, 100, 25, 40, 10],
    "lower": [11, 55, 24, 2, 2],
    "upper": [20, 100, 55, 45, 15]
} */
```