# Homework

1. Implement correctly (with proper constraints) the following template:
```circom
template Bit32Division() {

    signal input n;
    signal input d;

    signal output quotient;
    signal output modulus;

    quotient <-- n \ d;
    modulus <-- n % d;

    // not good enough
    n === quotient * d + modulus;
}

component main = Bit32Division();

/* INPUT = {
    "n": "5",
    "d": "3"
} */
```

My solution:
```circom
pragma circom 2.1.6;

include "circomlib/bitify.circom";
include "circomlib/comparators.circom";

template Bit32Division() {

    signal input n;
    signal input d;

    signal output quotient;
    signal output remainder;

    component rangeCheck32bits[4];

    quotient <-- n \ d;
    remainder <-- n % d;

    rangeCheck32bits[0] = Num2Bits(32);
    rangeCheck32bits[0].in <== quotient;

    rangeCheck32bits[1] = Num2Bits(32);
    rangeCheck32bits[1].in <== remainder;

    rangeCheck32bits[2] = Num2Bits(32);
    rangeCheck32bits[2].in <== n;

    rangeCheck32bits[3] = Num2Bits(32);
    rangeCheck32bits[3].in <== d;

    n === quotient * d + remainder;

    component lt = LessThan(32);
    lt.in[0] <== remainder;
    lt.in[1] <== d;
    lt.out === 1;
}

component main = Bit32Division();

/* INPUT = {
    "n": "5000000",
    "d": "3"
} */
```

Apparently, comparing my solution with RareSkills ZK Book, the only check I missed is:
```circom
// denominator is not zero
  signal isZero;
  isZero <== IsZero()(denominator);
  isZero === 0;
```

But to be honest I don't understand how the `LessThan` check I did was not enough. I mean... if denominator is 0, reminder cannot be less than 0. But well, question for next session.