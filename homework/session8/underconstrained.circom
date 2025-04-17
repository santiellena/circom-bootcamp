pragma circom 2.0.0;

template IsZero() {
    signal input in;
    signal output out;

    signal inv;

    inv <-- in!=0 ? 1/in : 0;

    out <== -in*inv +1;
    in*out === 0;
}

template BadExample() {
    signal input num;
    signal input den;
    signal output quotient;
    signal output mod;

    quotient <-- num \ den;
    mod <-- num % den;

    num === den * quotient + mod;
    component iz = IsZero();
    iz.in <== den;
    iz.out === 0;
}

component main = BadExample();