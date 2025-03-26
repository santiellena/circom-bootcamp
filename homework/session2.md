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

### Solutions:

I'll be using [the Rust playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024) to find the soultions.

1. 
```rust
fn main() {
    let p = 71;
    println!("-1 is congurent to {}", -1 % p + p);
    println!("-4 is congurent to {}", -4 % p + p);
    println!("-160 is congurent to {}", -160 % p + p);
    println!("500 is congurent to {}", 500 % p + p);
}
```

```bash
-1 is congurent to 70
-4 is congurent to 67
-160 is congurent to 53
500 is congurent to 74
```

2. For this exercise, I had to manually create an algorithm that computes the modular inverse of some number in a field.

```rust
// Extended Euclidean Algorithm
pub fn ext_gcd(a: i64, b: i64) -> (i64, i64, i64) {
    let (mut old_r, mut r) = (a, b);
    let (mut old_s, mut s) = (1, 0);
    let (mut old_t, mut t) = (0, 1);

    while r != 0 {
        let quotient = old_r / r;
        (old_r, r) = (r, old_r - quotient * r);
        (old_s, s) = (s, old_s - quotient * s);
        (old_t, t) = (t, old_t - quotient * t);
    }

    (old_s, old_t, old_r) // Return (s, t, gcd)
}

/// Modular inverse using Extended Euclidean Algorithm
fn mod_inverse(value: u64, order: u64) -> i64 {
    let (s, _, gcd) = ext_gcd(value as i64, order as i64);
    if gcd != 1 {
        return 0;
    }
    (s % order as i64 + order as i64) % order as i64
}
```

Shout out to the [`/my_math`](https://github.com/santiellena/my-rusty-plonk/blob/main/src/my_math) folder from `my-rusty-plonk` personal project.

Adding those previous functions to the Rust playground, and this:
```rust
fn main() {
    let p = 71;

    let five_sixths = (5 * mod_inverse(6, p) as u64) % p;
    let eleven_twelfths = (11 * mod_inverse(12, p) as u64) % p;
    let twentyone_twelfths = (21 * mod_inverse(12, p) as u64) % p;
    
    println!("5/6 mod {} -> {}", p, five_sixths);
    println!("11/12 mod {} -> {}", p, eleven_twelfths);
    println!("21/12 mod {} -> {}", p, twentyone_twelfths);
    
    assert!((five_sixths + eleven_twelfths) % p == twentyone_twelfths);
}
```

```bash
5/6 mod 71 -> 60
11/12 mod 71 -> 66
21/12 mod 71 -> 55
```

3. For this exercise, I will be using the same functions from point 2.

In the Rust playground:
```rust
fn main() {
    let p = 71;

    let two_thirds = (2 * mod_inverse(3, p) as u64) % p;
    let one_half = (mod_inverse(2, p) as u64) % p;
    let one_third = (mod_inverse(3, p) as u64) % p;
    
    println!("2/3 mod {} -> {}", p, two_thirds);
    println!("1/2 mod {} -> {}", p, one_half);
    println!("1/3 mod {} -> {}", p, one_third);
    
    assert!((two_thirds * one_half) % p == one_third);
}
```

```bash
2/3 mod 71 -> 48
1/2 mod 71 -> 36
1/3 mod 71 -> 24
```

4. For this excercise I will use the 2 functions for modular inverses of point 2, and other functions for matrix operations:

```rust
fn inverse_matrix_2x2_mod_p(a: [[u64; 2]; 2], det: u64, p: u64) -> [[u64; 2]; 2] {
    let mut a_inv = a;
    a_inv[0][0] = a[1][1];
    a_inv[1][1] = a[0][0];
    
    let neg_one = p - 1;
    a_inv[0][1] = (neg_one * a[0][1]) % p;
    a_inv[1][0] = (neg_one * a[1][0]) % p;
    
    for i in 0..a.len() {
        for j in 0..a[i].len() {
            a_inv[i][j] = (a_inv[i][j] * mod_inverse(det, p) as u64) % p;
        }
    }
    
    a_inv
}

fn matrix_mul(a: [[u64; 2]; 2], b: [[u64; 2]; 2], p: u64) -> [[u64; 2]; 2] {
    let mut c: [[u64; 2]; 2] = [[0; 2]; 2];
    
    c[0][0] = (a[0][0] * b[0][0] + a[0][1] * b[1][0]) % p;
    c[0][1] = (a[0][0] * b[1][0] + a[0][1] * b[1][1]) % p;
    
    c[1][0] = (a[1][0] * b[0][0] + a[1][1] * b[1][0]) % p;
    c[1][1] = (a[1][0] * b[1][0] + a[1][1] * b[1][1]) % p;
    
    c
}

fn is_identity(identity: [[u64; 2]; 2]) -> bool {
    let mut result = true;
    for i in 0..identity.len() {
        for j in 0..identity[i].len(){
            let val = identity[i][j];
            if i == j {
                if val != 1 {
                    result = false;
                    break
                }
            } else {
                if val != 0 {
                    result = false;
                    break
                }
            }
        }
    }
    result
}

fn main() {
 let p = 71;
 let a: [[u64; 2]; 2] = [[1, 1], [1, 4]];
 
 let det = (a[0][0] * a[1][1]) % p + p - (a[0][1] * a[1][0]) % p;
 
 let a_inv = inverse_matrix_2x2_mod_p(a, det, p);
 
 let identity = matrix_mul(a, a_inv, p);
 
 assert!(is_identity(identity));
}
```


5. 

```rust
fn main() {
let p = 71;
let mut x = 0;
    for i in 0..p{
        if (i * i) % p == 12 {
                x = i;
                break;
            }
    }
println!("Modular Square of 12 is {}", x);
}
```

```bash
Modular Square of 12 is 15
```