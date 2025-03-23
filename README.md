# Circom Bootcamp
This repository contains my homework and notes on the Circom Bootcamp by RareSkills.

## Content
- [Session 1](#session-1)
    - [Introduction](#introduction)
    - [Arithmetic Circuits](#arithmetic-circuits)
    - [Homework S1](#homework-s1)

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