# Homework

### Exercises:

1. Convert the following set of constraints to R1CS.
```math
\begin{align*}
z*v &= x*y+x*u\\
v &= t*u + 2*v*x + 3
\end{align*}
```
Solution:
```math
\begin{align*}

\color{yellow}{a} &= \color{green}{z} \color{white}*  \color{purple}{v}\\
\color{yellow}{b} &= \color{green}{x} \color{white}* \color{purple}{u}\\
\color{yellow}{c} &= \color{green}{v} \color{white}* \color{purple}{x}\\
\\
\color{yellow}{a} &= \color{green}{x} \color{white}* \color{purple}{y + b}\\
\color{yellow}{v} &= \color{green}{t} \color{white}* \color{purple}{u + 2 * c + 3}\\   
\\
\end{align*}
\\\\
\textcolor{yellow}{\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 
\end{bmatrix}} \begin{bmatrix}
1 \\
x \\
y \\
z \\
u \\
v \\
t \\
a \\
b \\
c \\
\end{bmatrix} = 
\textcolor{green}{\begin{bmatrix}
0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 
\end{bmatrix}} \begin{bmatrix}
1 \\
x \\
y \\
z \\
u \\
v \\
t \\
a \\
b \\
c \\
\end{bmatrix} \circ 
\textcolor{purple}{\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 1 & 0 \\
3 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 2 
\end{bmatrix}} \begin{bmatrix}
1 \\
x \\
y \\
z \\
u \\
v \\
t \\
a \\
b \\
c \\
\end{bmatrix}
```


2. Convert the set of constraints to R1CS.
```math
\begin{align*}
3*x*y - x^2 &= 2x*z-z^2\\
-x^3 &= 4x - z*y - \frac{1}{2}  
\end{align*}
```

3. Write a set of constraints that models `u = x && y && !z`. Don’t forget the `{0, 1}` constraints.

4. Write a set of constraints that models `u = !(x || (y && z)) || (x && !z)`. Don’t forget the `{0, 1}` constraints. Convert that to a R1CS.