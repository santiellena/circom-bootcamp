# Homework 

1. Implement a swap function for an array of values where you swap the value at index `i` for index `j` and vice versa.
```circom
pragma circom 2.1.6;

include "circomlib/comparators.circom";

template QuinSelector(n){
    signal input in[n];
    signal input i;

    signal output out;

    component isEqs[n];
    signal intermediates[n];
    var sum;
    for(var idx = 0; idx<n; idx++){
        
        isEqs[idx] = IsEqual();
        isEqs[idx].in[0] <== idx;
        isEqs[idx].in[1] <== i;

        intermediates[idx] <== in[idx] * isEqs[idx].out;
        sum += intermediates[idx];
    }

    out <== sum;
}

template Swap (n) {
    signal input in[n];
    signal input i;
    signal input j;

    signal output out[n];

    component isEqI[n];
    component isEqJ[n];

    component isIEqJ = IsEqual();
    isIEqJ.in[0] <== i;
    isIEqJ.in[1] <== j;

    component quinSelectorI = QuinSelector(n);
    quinSelectorI.i <== i;
    for(var idx=0; idx<n; idx++){
        quinSelectorI.in[idx] <== in[idx];
    }

    component quinSelectorJ = QuinSelector(n);
    quinSelectorJ.i <== j;
    for(var idx=0; idx<n; idx++){
        quinSelectorJ.in[idx] <== in[idx];
    }

    signal nandIsEqs[n];
    signal selectorIinJ[n];
    signal selectorJinI[n];
    signal valueWhenIIsEqualJ[n];
    signal substractToAvoidDoubling[n];

    for(var idx=0; idx<n; idx++){
        isEqI[idx] = IsEqual();
        isEqI[idx].in[0] <== i;
        isEqI[idx].in[1] <== idx;

        isEqJ[idx] = IsEqual();
        isEqJ[idx].in[0] <== j;
        isEqJ[idx].in[1] <== idx;

        selectorIinJ[idx] <== isEqJ[idx].out * quinSelectorI.out;
        selectorJinI[idx] <== isEqI[idx].out * quinSelectorJ.out;

        valueWhenIIsEqualJ[idx] <== isIEqJ.out * in[idx];
        substractToAvoidDoubling[idx] <== isEqJ[idx].out * valueWhenIIsEqualJ[idx];

        nandIsEqs[idx] <== (1 - isEqI[idx].out) * (1 - isEqJ[idx].out);
        out[idx] <== in[idx] * (nandIsEqs[idx])  + selectorIinJ[idx] + selectorJinI[idx] - substractToAvoidDoubling[idx];
    }
}

component main = Swap(7);

/* INPUT = {
    "in": [2, 5, 36, 55, 8, 9, 11],
    "i": 1,
    "j": 6
} */
```