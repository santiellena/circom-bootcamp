# Homework

1. Implement a template that takes x and raises it to power e (modulo p is implied) and assigns the output to out.
This exercise is part of the [zero knowledge puzzles]() from RareSkills
```circom
pragma circom 2.1.6;

include "circomlib/comparators.circom";

template Power(n) {
  signal input base;
  signal input power;

  signal output out;

  component isEqual = IsEqual();
  isEqual.in[0] <== power;
  isEqual.in[1] <== n;
  isEqual.out === 1;

  signal intermediates[n];
  intermediates[0] <== base;
  if(n == 0){
      out <== 1;
  } else {
      for(var i=1; i<n; i++){
          intermediates[i] <== base * intermediates[i - 1];
      }
      out <== intermediates[n-1];
  }

}

component main = Power(10);

/* INPUT = {
    "base": 3,
    "power": 10
} */
```

This solves perfectly the task, however, I will take it to the next level and do what we did in today's session, which is a way to emulate stateful computation. The following template will compute up to `n` powers but `out` will be equal to `base` to the `power` input.
```circom
pragma circom 2.1.6;

include "circomlib/comparators.circom";

template QuinSelector(n){
    signal input in[n];
    signal input index;

    signal output out;

    signal intermediates[n];
    component isEqs[n];
    var sum;
    for(var i=0; i<n; i++){
        isEqs[i] = IsEqual();
        isEqs[i].in[0] <== i;
        isEqs[i].in[1] <== index;

        intermediates[i] <== isEqs[i].out * in[i];
        sum += intermediates[i];
    }

    out <== sum;
}

/*
    It will compute powers of base up to n 
    but select the power of the signal power
*/
template PowerSelector(n) {
  signal input base;
  signal input power;

  signal output out;

  component lessEqThan = LessEqThan(252);
  lessEqThan.in[0] <== power;
  lessEqThan.in[1] <== n;
  lessEqThan.out === 1;

  signal powers[n + 1];
  powers[0] <== 1;

  for(var i=1; i < n+1; i++){
    powers[i] <== base * powers[i - 1];      
  }

   component quinSelector = QuinSelector(n+1);
   quinSelector.index <== power;
   quinSelector.in <== powers;
   out <== quinSelector.out; 
}

component main = PowerSelector(10);

/* INPUT = {
    "base": 3,
    "power": 9
} */
```