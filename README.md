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



### Homework S2

Proposed exercises and their solutions are in the homework folder in [this](./homework/session2.md) file.