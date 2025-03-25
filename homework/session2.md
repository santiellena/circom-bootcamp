# Homework

### Exercises:
For all problems below, assume the finite field is `p = 71`.

#### Problem 1

Find the elements in a finite field that are congruent to the following values:

- -1
- -4
- -160
- 500

#### Problem 2

Find the elements that are congruent to `a = 5/6`, `b = 11/12`, and `c = 21/12`

Verify your answer by checking that `a + b = c` (in the finite field)

#### Problem 3

Find the elements that are congruent to `a = 2/3`, `b = 1/2`, and `c = 1/3`.

Verify your answer by checking that `a * b = c` (in the finite field)

#### Problem 4

The inverse of a 2 x 2 matrix A is

```math
A^{-1}=\frac{1}{\text{det}}\begin{bmatrix}d & -b\\-c & a\end{bmatrix}
```

where A is

```math
A = \begin{bmatrix}a & b\\c & d\end{bmatrix}
```

And the determinant det is

```math
\text{det}=a \times d-b\times c
```

Compute the inverse of the following matrix in the finite field:

```math
\begin{bmatrix}1 & 1\\1 & 4\end{bmatrix}
```

Verify your answer by checking that

```math
AA^{-1}=I
```

Where I is the identity matrix.

#### Problem 5

What is the modular square root of 12?

Verify your answer by checking that `x * x = 12 (mod 71)`

Use brute force to find the answer (in Python)

