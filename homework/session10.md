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