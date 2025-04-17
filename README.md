# Circom Bootcamp
This repository contains my homework and notes on the Circom Bootcamp by RareSkills.

## Content
- [Session 1](#session-1)
    - [Introduction](#introduction)
    - [Arithmetic Circuits](#arithmetic-circuits)
    - [Homework S1](#homework-s1)
- [Session 2](#session-2)
   - [Modular Arithmetic](#modular-arithmetic)
   - [Homework S2](#homework-s2)
- [Session 3](#session-3)
   - [Rank-1-Constraints-System](#rank-1-constraints-system)
   - [Homework S3](#homework-s3)
- [Session 4](#session-4)
   - [Circom Basics](#circom-basics)
   - [Homework S4](#homework-s4)
- [Session 5](#session-5)
   - [More Circom](#more-circom)
   - [Homework S5](#homework-s5)
- [Session 6](#session-6)
   - [Even More Circom](#even-more-circom)
   - [Homework S6](#homework-s6)
- [Session 7](#session-7)
   - [Compute then Constrain](#compute-then-constrain)
   - [Alias Bug](#alias-bug)
   - [Homework S7](#homework-s7)
- [Session 8](#session-8)
   - [Hacking Underconstrained Circuits with Fake Proofs](#hacking-underconstrained-circuits-with-fake-proofs)

****

## Session 1

### Introduction

The foundation of Circom is based on three key concepts:
1. Arithmetic Circuits
2. Rank 1 Constraint System (R1CS)
3. Modular Arithmetic

### Arithmetic Circuits

ZK is useful and has many use cases because proving you computed something correctly is usually simpler than computing it. Being more technical, we could say that given a P (polynomial) or an NP (non-deterministic polynomial) problem we can verify any solution by modeling the problem as a Boolean Formula.

Without going to much into details, the difference between P and NP problems is the computing time. P is the class of problems that can be solved and verified efficiently, while NP is the class of problems that can be verified efficiently. 

All problems in P and NP can be verified by transforming them into boolean formulas and showing a solution to the formula. This is key for ZKPs because only problems that can be efficiently verified can be converted in a boolean formula. 

Boolean formulas are a helpful tool to model problems but as they are restricted to boolean inputs and basic boolean operations ("boolean gates", AND, OR and NOT), constructing those formulas can get complicated even for basic problems.

It would be simpler to model those boolean formulas as arithmetic circuits.

But.. what is an **Arithmetic Circuit**?

An arithmetic circuit is a system of equations using only addition, multiplication, and equality. Like a Boolean circuit, it checks that a proposed set of inputs is valid, but doesn’t compute a solution.
The arithmetic circuit is "satisfied" (meaning that a valid set of inputs was passed) when all of its equality constraints are satisfied.

It is useful to think about representing boolean gates in arithmetic circuits because this way we can get the advantage of the arithmetic of Arithmetic Circuits and the logic of Boolean Formulas.

- The **AND** gate:
   | x |  y | x and y == z |
   |---|----|---------|
   | 0 |  0 |   0     | 
   | 0 |  1 |   0     |
   | 1 |  0 |   0     |
   | 1 |  1 |   1     |

   The equivalent artihmetic representation: `z = xy`

- The **OR** gate:
   | x |  y | x or y == z |
   |---|----|---------|
   | 0 |  0 |   0     | 
   | 0 |  1 |   1     |
   | 1 |  0 |   1     |
   | 1 |  1 |   1     |

   The equivalent artihmetic representation: `z = x + y - xy`

- The **NOT** gate:
   | x | ¬x |
   |---|----|
   | 0 |  1 |
   | 1 |  0 |

   The equivalent artihmetic representation: `z = 1 - x`

- The **XOR** gate: 
   | x |  y | x xor y == z |
   |---|----|---------|
   | 0 |  0 |   0     | 
   | 0 |  1 |   1     |
   | 1 |  0 |   1     |
   | 1 |  1 |   0     |

   The equivalent artihmetic representation: `z = x + y - 2xy`

In conclusion, as any NP problem can be represented as a Boolean Formula, and ant Boolean Formula can be represented as an Arithmetic Circuit, then the solution to any NP problem can be modeled with an Arithmetic Circuit.

### Homework S1

Proposed exercises and their solutions are in the homework folder in [this](./homework/session1.md) file.

## Session 2

### Modular Arithmetic

Given a `p` prime number we define a **finite field** with `p` elements `{0, 1, ..., p -1}`. The only allowed operations are addition and multiplication, modulo `p`.

To perform operations and play around with modular arithmetic, I used the [Rust playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024):
```rust
fn main() { // 10 = 3 mod 7
    println!("{}", 10 % 7);
}
```

When we do addition or multipication in a finite field, we might encounter **overflow**(the result is greater than `p`). This is typically considered a bad thing, but in modular arithmetic it's not a bug, it's a feature (lol). When an operation overflows, as it is done modulo `p`, we get the reminder of the division by `p` which is a number (better called "element") in the finite field.

For example, `3 + 5 = 1 mod 7`:
   - `3 + 5` is `8`, 
   - but modulo `7`, `8 = 1`.

In the previous example, we would say that `8` is **congruent** to `1`, not equal. This is just mathematical vocabulary, but I think it is good to know it because we will hear that word a lot working with finite fields.

The same concept can be used with **underflow**. Altough our finite field does not have elements that represent negative numbers, we do have "congruent" elements from our finite field. 

For example, in the Rust playground:
```rust
fn main() {
   // -6 = 1 mod 7
    println!("{}", -6 % 7 + 7);
    // note: the "+ 7" after the mod operation is there because of how Rust rounds division
    // in another programming language as Python that wouldn't be necessary.
}
```
- `-6` is conguent to `1`, so we have a way to represent negative numbers!

**Addition entity:** Any element plus `p` is the same element. 

**Additive inverse:**
`a + b = 0` -> `b` is the additive inverse of `a`. 
 - `0` is its own additive inverse.
 - every number has exactly one additive inverse

Here the "congruency" of negative numbers with elements of the finite field start to make sense.

In normal math, finding the additive inverse of `a` is kind of easy, we just say `-a`, `a + (-a) = 0`. However, in modular arithmetic, we don't have a way to substract (because we just use addition or multiplication) or to directly represent a negative number.

   - `5 - 5 mod 7` is NOT valid,
   - however, `5 + 2 = 0 mod 7` is valid.

Turns out that as `-5` is conguent to `2` they behave as the same element. Thus, `5 - 5 = 0` in normal math and `5 + 2 = 0` in the finite field where `p = 7`. Note that the congruency between numbers depends directly in the value assigned to `p`.

**Multiplicative inverse:** 
The multiplicative inverse for `a` is a number `b` such that `ab = 1`.
 - `0` logically doesn't have a multiplicative inverse.
 - every number has exactly one multiplicative inverse.

Normally, we would say that the multiplicative inverse of `5` is `1/5` because `5 * 1/5 = 1`. However, we are doing modular arithmetic and fractions cannot be represented.

Here the "congruency" between numbers outside of the field with elements of the fields also works, as with negative numbers.
For each element in the field, there is another element in the field that is congruent to the multiplicative inverse of that number. Essentially, they behave as the same number.

For example, the multiplicative inverse of `5 mod 7` is `3`.
 - `5 * 3 = 1 mod 7`
 - `15 = 1 mod 3`

Thus, `3` is congruent to `1/5` in the finite field when `p = 7`.

A cool rule of multiplicative inverses is: `(p - 1) and (p + 1)` are their own multiplicative inverses.
 - `(p - 1)(p - 1) = 1 mod p`
 - `(p + 1)(p + 1) = 1 mod p`

Remember that you can use Rust or Python to check it for yourself if you don't beleive me hahaha.

There is an explanation behind those curious behaviors, the easy way is to see that `(p - 1)` is congruent to `-1`, and `-1 * -1 = 1`. Same thing occurs with `(p + 1)`, it is congruent to `1`.

There is a theorem for computing the multiplicative inverse of a number (Fermat's Little Theorem), however, it is easier to use some tool that does the calculation for us. I guess it is to avoid innecesary complexity, BUT I wouldn't say that it will hurt to learn it anyways.

### Homework S2

Proposed exercises and their solutions are in the homework folder in [this](./homework/session2.md) file.

## Session 3

### Rank-1-Constraints-System

In this session, it was covered how artimetic circuits are converted into R1CS. This is the last session where we review foundational Circom topics. 

I already have my own personal explanation on how the conversion works from algebraic circuits in [this](https://github.com/santiellena/zk-magic-square?tab=readme-ov-file#arithmetic-circuit-to-r1sc) repository, with easy examples and some good theory background. I won't repeat myself here, you can go and check this topic there.

### Homework S3

Proposed exercises and their solutions are in the homework folder in [this](./homework/session3.md) file.

## Session 4

### Circom Basics

The knowledge from previous lessons starts to converge here. Circom is a language (unsure if it can be called a programming language) that allows us to write airthmetic circuits in the form of constraints that follows the rules of R1CS constraints.

Circom compiler converts our constraints into a R1CS (low-level representation), which allows us to eliminate complexity in writing our own ZK systems.

Circom has a syntax that is really familiar to common programming languages and allows us to use tools, such as for loops or conditional statements, to make the constraints declaration easier. However, its behavior is restricted and the logic behind writing circuits has nothing to do with the programming logic (although they seem simmilar).

After some research, I found that Circom is both a DSL (Domain-Specific-Language) and a programming language as well. The programming language feature of Circom is used to "populate" the witness (inputs) into some other thing, such as an output or an intermediate signal.

I don't think that going through the Circom syntax here would be helpful. Instead, refer to the following resource:
- [Circom Docs](https://docs.circom.io/circom-language/signals/)

In order to test skills, I suggest not to go through all zero knowledge puzzles (mentioned in the homework file) and just stick to the ones listed in the homework file (there are 5).

### Homework S4

Proposed exercises and their solutions are in the homework folder in [this](./homework/session4.md) file.

## Session 5

### More Circom

Highlights of the session:

- Most of the times an additional array of intermdiate signals is used to compute things.
- Conditional statements are only allowed if they don't modify the static structure of the R1CS that Circom compiles.
- The `output` keyword for signals has a strange behavior:
   - In sub-components, it kind of behaves as a "return" value,
   - In the main component, it makes the signal "public" and is denoted as "public output",
   - However, it's presence (or absense) never modifies the R1CS.

At this point I am really comfortable with the Circom syntax and its "intricate" behavior. Writing Circom thinking that it will create a R1CS and nothing else is a change of paradigm that is hard at the beginning.

In the first homework exercise you will see a problem I encountered and, why it was triggered and how I was able to solve it (recommended).

### Homework S5

Proposed exercises and their solutions are in the homework folder in [this](./homework/session5.md) file.

## Session 6

### Even More Circom

Conceptually this session didn't involve many topics, however, it helped a lot in the practical aspects of writing Circom circuits. 

We saw how the [circomlib](https://github.com/iden3/circomlib) library can be used and some of its components. Additionally, we learned about how commonly Circom code is written and got comfortable with all the possible problems we could encounter. It is really basic but from now on, we won't be learning how Circom works and how we can use it. Instead, we will see real use cases for it. 

Really interested for what is next!

### Homework S6

Proposed exercises and their solutions are in the homework folder in [this](./homework/session6.md) file.

## Session 7

### Compute then Constrain

##### • What is this pattern, why is it used?

The idea behind "compute then constrain" is computing the solution of an algorithm and then constraining the invariants of the algorithm. This is specially useful because we don't need to only use addition and multiplication because of restirctions in how R1CS are built, instead, we can use Circom as a normal programming language to get results (or intermediate results) and then constrain them. This not only reduces the complexity when building circuits but also reduces the size of the R1CS, making the computation behind it less computationally expensive (the prover time and complexity is reduced). 

##### • The Circom `<--` operator

Unlike `<==`, the `<--` operator does not create constraints. It is an operator to indicate the precence of out-of-circuit computation, allowing us to compute things and assing a value to a signal which is function of other signals, without constraining it (this is specially important because the R1CS is not modified nor affected, so there aren't non-quadratic constraints). 

##### • An example with modular square roots

This example was the easiest for me to visualize the magic of this pattern. 

Let's say we want a circuit to prove that there is a valid modular square of `in`, `out`:
```javascript
// this is pseudo code
sqrt(n) % p === out % p;
```
If we want to write a circuit that constraints the calculation of `sqrt(in)` we will need many constraints and the complexity to write them with only addition and multiplication will be excesive.

There is when the "compute then constrain" patters is useful. We can use Circom as a programming language to **compute** the modular square of `in`(first part of the pattern) and then **constrain** the invariants of the problem (second part of the pattern).
Try the following code in [zkRepl](https://zkrepl.dev/):
```circom
pragma circom 2.1.6;

include "circomlib/pointbits.circom";

template Example() {
   signal input in;
	signal output out;
	
	out <-- sqrt(in); // COMPUTE (<-- doesn't create a contraint)
	out * out === in; // CONSTRAIN INVARIANT
   /*
      it is nice to see that 
      sqrt(in) === out,
      is the same than
      out * out === in,
      but the latter is super easy to fit in a R1CS 
   */
}

component main = Example();

/* INPUT = {
    "in": 4
} */
// OUTPUT: 2
```
In the previous example we used the [`sqrt`](https://github.com/iden3/circomlib/blob/35e54ea21da3e8762557234298dbb553c175ea8d/circuits/pointbits.circom#L27) function from circomlib. The most important detail is that it is a function and doesn't create constraints, it just computes. 

##### • `Num2Bits` circuit from the `circomlib`

This one is also a good example of the "compute then constrain" pattern (you will note the the circomlib library uses it a lot), but it also a good circuit to explain why `n` in this circuit and other circuits, such as [comparators](https://github.com/iden3/circomlib/blob/master/circuits/comparators.circom), should only be used when `n <= 253` or `n <= 252` depending on the case. Where `n` is the numbers of bits that represent the value passed in signals.

Let's review the [`Num2Bits` implementation](https://github.com/iden3/circomlib/blob/35e54ea21da3e8762557234298dbb553c175ea8d/circuits/bitify.circom#L25-L39):
```circom
template Num2Bits(n) {
    signal input in;
    signal output out[n];
    var lc1=0;

    var e2=1;
    for (var i = 0; i<n; i++) {
        out[i] <-- (in >> i) & 1; // compute (picking the bit in position i)
        out[i] * (out[i] -1 ) === 0; // then constrain
        lc1 += out[i] * e2;
        e2 = e2+e2; // incrementing the coefficient (esentially making them powers of 2 but easier)
    }

    lc1 === in; // constraning that the sum of 1 bits times its coefficient is equal to the signal in
}
```
Because of the comments I think it is very easy to visualize the pattern.

Now the other relevant part is... why `n` should not be grater than `253`?

Altough this was not explained in the bootcamp, I did my own research and in the next section, you will find what I learned.

### Alias Bug

There is a type of bug in ZK circuits known as Alias. This bug occurs when trying to represent a value on the circuit with an amount of bits that could overflow `p`, the order of the field. 

The main problem here is that the binary representation constraints silently fail when they overflow. It depends heavily in the logic on the circuit that is being built, but let's see an example with the [`Bits2Num`](https://github.com/iden3/circomlib/blob/35e54ea21da3e8762557234298dbb553c175ea8d/circuits/bitify.circom#L55-L67) circuit:
```circom
template Bits2Num(n) {
    signal input in[n];
    signal output out;
    var lc1=0;

    var e2 = 1;
    for (var i = 0; i<n; i++) {
        lc1 += in[i] * e2;
        e2 = e2 + e2;
    }

    lc1 ==> out;
}
```

I could pass an array of many bits, create an overflow, and `out` won't represent actually what the array of bits represents. SILENTLY!
Let's see an example:
```circom
pragma circom 2.1.6;

include "circomlib/bitify.circom";

template Example(n) {
    signal in[n];

    for(var i = 0; i < n; i++){
        in[i] <== 1;
    }

    component bits2Num = Bits2Num(n);
    bits2Num.in <== in;
    log(bits2Num.out);
}

component main = Example(254);

/* INPUT = {
    "in": []
} */
```
Here we pass an array of `254` bits set to 1, but the output we get in decimal numbers doesn't represent the actual value of `(2^254) - 1`.
- Decimal output: 7059779437489773633646340506914701874769131765994106666166191815402473914366
- Binary output:  111110011011101100011000110100
                  01111011001110010111111101011 
                  001000111101011111011101001001
                  001011111100111111010100111101
                  000101101011111001100000101111
                  011011110000110010001101000111
                  101101110101111000001111000001
                  010011011000000111111111111111
                  1111111111110 (252 digits)

Now you see that we get a different decimal number given our initial array of bits.

But why and when this occurs?

Remember that I previously mentioned something about the amount of bits `n` not being greater than `252 or 253`, depending on the circuit. These values have a reason, and the reason is `p`, the order of the field.

Circom can represent values from `0` up to `p - 1`, obviously, because all calculations are done modulo `p`.

`p`in binary is represented with `254` bits, but `p` itself is not `(2^254) - 1`. This means that all the values in the range `[p-1, (2^254) - 1]` cannot be represented in our field without overflowing.

This means that all decimal values represented with `253` bits fits in our group, but not all of the represented with `254` do.

Wait... but why I said that sometimes the limit is `252`?

There are special cases such as in `comparators` where the strategy to compare numbers is calculating the addition of a bigger middle number with the delta between the two compared numbers. Then, just by checking the `MSB` of the addition, we can see if the delta was negative or positive infering the value of the comparison. 
If we compare two `253` bits values, we need the middle value of the values represented with `254` bits, which we saw that could raise a serious bug.

So we can compare numbers up to `252`. 
For the specific algorith on how this comparison works, check the [first exercise of the session 1 homework](./homework/session1.md).

To prevent the **alias bug**, circomlib has a circuit that works as a check: the [AliasCheck circuit](https://github.com/iden3/circomlib/blob/master/circuits/aliascheck.circom).

### Homework S7

Proposed exercises and their solutions are in the homework folder in [this](./homework/session7.md) file.

## Session 8

In this session, in addition of the next title, we also reviewed the Alias Bug, but I reasearched about it in the last session (yes, I went ahead of the program, but it's ok).

### Hacking Underconstrained Circuits with Fake Proofs

In circuits where the `<--` operator is used to compute intermediate signals, there is a vulnerability because the intermediate signal is not constrained. Although in Circom we cannot directly decide the value of intermediate signals (because Circom does it for us), we can modify the bytes content of the witness generated by Circom (we can force our intermediate signals to be anything).

There isn't much theory behind this type of bug. It can present because of an overlook of the devs when using `<--` to give values to intermediate signals thinking that the user cannot later change them. Remember, Circom just creates R1CS and then given a valid input, generates a witness (the witness is not the proof itself!!).

Check the homework file linked the next section for the whole context and explanation of the bug. 
Security Researcher mode: ON. Have fun!

### Homework S8

Proposed exercises and their solutions are in the homework folder in [this](./homework/session8/session8.md) file.