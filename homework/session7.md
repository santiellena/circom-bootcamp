# Homework

1. Implement function `findRoot`.
```circom
template Roots () {
    signal input a;
    signal input b;
    signal input c;

    signal output root;
    
    // implement function findRoot
    out <-- findRoot(a,b,c);

    // constrain
    0 === a * out * out + b * out + c;
}
```

About [square roots](https://youtu.be/0lEwgX_zKqE?si=0vnid5QXSsWDcQDf&t=1916) check the video linked.
This is ready to be executed in [zkrepl](https://zkrepl.dev/).
```circom
pragma circom 2.1.6;

include "circomlib/pointbits.circom";

function findRoot(a, b, c, sign) {
    var numerator = -b;
    var discriminant = b ** 2 - 4 * a * c;
    var discriminantSqrt = sqrt(discriminant);
    var denominator = 2 * a;

    if(sign == 1){
        numerator += discriminantSqrt;
    } else {
        numerator -= discriminantSqrt;
    }

    return numerator * (1/denominator);
}

template Roots () {
    signal input a;
    signal input b;
    signal input c;

    signal output root1;
    signal output root2;
    
    // implement function findRoot
    root1 <-- findRoot(a,b,c,1);
    root2 <-- findRoot(a,b,c,0);

    signal root1Squared;
    root1Squared <== root1 * root1;
    signal aTimesRoot1Squared;
    aTimesRoot1Squared <== a * root1Squared;

    signal root2Squared;
    root2Squared <== root2 * root2;
    signal aTimesRoot2Squared;
    aTimesRoot2Squared <== a * root2Squared;

    // constrain
    0 === aTimesRoot1Squared + b * root1 + c;
    0 === aTimesRoot2Squared + b * root2 + c;
}

component main = Roots();

// roots are 2 and -2, it works!
/* INPUT = {
    "a": 1,
    "b": 0,
    "c": -4
} */
```