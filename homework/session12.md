# Homework

1. Implement a selection sort template...
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

template ComputeMin (n) {
    signal input in[n];
    signal input startIdx;

    signal output min;
    signal output minIdx;

    component less = LessThan(252);
    less.in[0] <== startIdx;
    less.in[1] <== n;
    less.out === 1;

    var _min = in[startIdx];
    var _idx = startIdx;
    for (var i = startIdx + 1; i < n; i++) {
        if (in[i] < _min) {
            _idx = i;
            _min = in[i];
        } 
    }

    min <-- _min;
    minIdx <-- _idx;

    component leqs[n];
    component lessThanStartIdx[n];
    signal intermCalc[n];
    for (var i = 0; i < n; i++) {
        lessThanStartIdx[i] = LessThan(252);
        lessThanStartIdx[i].in[0] <== i;
        lessThanStartIdx[i].in[1] <== startIdx;

        intermCalc[i] <== (1 - lessThanStartIdx[i].out) * in[i];

        leqs[i] = LessEqThan(252);
        leqs[i].in[0] <== min;
        leqs[i].in[1] <== lessThanStartIdx[i].out * min + intermCalc[i];

        leqs[i].out === 1;
    }

    component quinSelector = QuinSelector(n);
    quinSelector.i <== minIdx;
    for(var i = 0; i < n; i++){
        quinSelector.in[i] <== in[i];
    }

    quinSelector.out === min;
}

template MinSwap(n) {
    signal input in[n];
    signal input startIdx;

    signal output out[n];
    
    component min = ComputeMin(n);
    min.startIdx <== startIdx;
    for(var i = 0; i < n; i++){
        min.in[i] <== in[i];
    }    
    component isEqStartIdx[n];
    component isEqMinIdx[n];

    component isStartIdxEqMinIdx = IsEqual();
    isStartIdxEqMinIdx.in[0] <== startIdx;
    isStartIdxEqMinIdx.in[1] <== min.minIdx;

    component quinSelectorStartIdx = QuinSelector(n);
    quinSelectorStartIdx.i <== startIdx;
     for(var i = 0; i<n; i++){
        quinSelectorStartIdx.in[i] <== in[i];
    }

    signal nandIsEqs[n];
    signal selectorStartIdxInMinIdx[n];
    signal selectorMinIdxInStartIdx[n];
    signal valueWhenStartIdxIsEqualMinIdx[n];
    signal substractToAvoidDoubling[n];

    for(var i=0; i<n; i++){
        isEqStartIdx[i] = IsEqual();
        isEqStartIdx[i].in[0] <== startIdx;
        isEqStartIdx[i].in[1] <== i;

        isEqMinIdx[i] = IsEqual();
        isEqMinIdx[i].in[0] <== min.minIdx;
        isEqMinIdx[i].in[1] <== i;

        selectorStartIdxInMinIdx[i] <== isEqMinIdx[i].out * quinSelectorStartIdx.out;
        selectorMinIdxInStartIdx[i] <== isEqStartIdx[i].out * min.min;

        valueWhenStartIdxIsEqualMinIdx[i] <== isStartIdxEqMinIdx.out * in[i];
        substractToAvoidDoubling[i] <== isEqMinIdx[i].out * valueWhenStartIdxIsEqualMinIdx[i];

        nandIsEqs[i] <== (1 - isEqStartIdx[i].out) * (1 - isEqMinIdx[i].out);
        out[i] <== in[i] * (nandIsEqs[i])  + selectorStartIdxInMinIdx[i] + selectorMinIdxInStartIdx[i] - substractToAvoidDoubling[i];
    }
}

template SelectionSort(n) {

    signal input in[n];
    signal output out[n];

    signal interm[n][n];

    for (var i = 0; i < n; i++) {
        in[i] ==> interm[0][i];
    }

    component minSwap[n];
    for (var i = 0; i < n - 1; i++) {
        minSwap[i] = MinSwap(n);
        minSwap[i].startIdx <== i;
        for (var j = 0; j < n; j++) {
            minSwap[i].in[j] <== interm[i][j];
        }
        for (var j = 0; j < n; j++) {
            minSwap[i].out[j] ==> interm[i+1][j];
        }

        
    }

    for (var j = 0; j < n; j++) {
        out[j] <== interm[n-1][j];
    }

}

component main = SelectionSort(7);

/* INPUT = {
    "in": [4,3,5,4,4,10,1]
} */
```