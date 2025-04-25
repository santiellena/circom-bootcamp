# Homework

1. Create a template that constrains out to be the maximum element of `input in[n]`. You should compute then constrain the maximum. You shouldn’t just compute out. You should constrain out to be `===` with the signal in the array that is the maximum.

```circom
pragma circom 2.1.6;

include "circomlib/comparators.circom";

template Max(n) {
  signal input in[n];
    signal output out;

    // Intermediate signals to track the maximum value and its index
    signal maxValue[n];
    signal maxIndex[n];

    // Initialize with the first element
    maxValue[0] <== in[0];
    maxIndex[0] <== 0;

    // Components for comparisons
    component lessThan[n-1];

    // Intermediate signals to avoid non-quadratic constraints
    signal lt_prev_value[n-1];
    signal lt_prev_index[n-1];

    // Compute the maximum iteratively
    for (var i = 1; i < n; i++) {
        lessThan[i-1] = LessThan(252);
        lessThan[i-1].in[0] <== maxValue[i-1]; // Compare previous max with current element
        lessThan[i-1].in[1] <== in[i];

        // If maxValue[i-1] < in[i], select in[i]; otherwise, keep maxValue[i-1]
        lt_prev_value[i-1] <== (1 - lessThan[i-1].out) * maxValue[i-1];
        maxValue[i] <== lessThan[i-1].out * in[i] + lt_prev_value[i-1];

        // If maxValue[i-1] < in[i], select index i; otherwise, keep previous index
        lt_prev_index[i-1] <== (1 - lessThan[i-1].out) * maxIndex[i-1];
        maxIndex[i] <== lessThan[i-1].out * i + lt_prev_index[i-1];
    }

    // Assign the final maximum to out
    out <== maxValue[n-1];

    // Constrain out to be equal to the input signal at maxIndex[n-1]
    component isEqual[n];
    signal isEqualOut[n];
    var sumIsEqual = 0;
    for (var i = 0; i < n; i++) {
        isEqual[i] = IsEqual();
        isEqual[i].in[0] <== maxIndex[n-1];
        isEqual[i].in[1] <== i;
        isEqualOut[i] <== isEqual[i].out * in[i]; // in[i] if i == maxIndex[n-1], else 0
        sumIsEqual += isEqualOut[i];
    }
    out === sumIsEqual; // Ensures out equals the input signal at maxIndex[n-1]

    // Constrain out to be >= all in[i] to prove it's the maximum
    component lessEqThan[n];
    for (var i = 0; i < n; i++) {
        lessEqThan[i] = LessEqThan(252);
        lessEqThan[i].in[0] <== in[i];
        lessEqThan[i].in[1] <== out;
        lessEqThan[i].out === 1; // Enforces in[i] <= out
    }
}

component main = Max(5);

/* INPUT = {
    "in": [1,2,22,5,5]
} */
```