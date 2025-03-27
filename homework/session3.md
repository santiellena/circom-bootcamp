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
\color{yellow}{a - b} &= \color{green}{x} \color{white}* \color{purple}{y}\\
\color{yellow}{v - 2 * c - 3} &= \color{green}{t} \color{white}* \color{purple}{u}\\   
\\
\end{align*}
```

```math
\textcolor{yellow}{\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & -1 & 0 \\
-3 & 0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & -2 
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
0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 
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
Solution:

```math
\begin{align*}

\color{yellow}{a} &= \color{green}{x} \color{white}*  \color{purple}{y}\\
\color{yellow}{b} &= \color{green}{x} \color{white}* \color{purple}{x}\\
\color{yellow}{c} &= \color{green}{z} \color{white}* \color{purple}{z}\\
\color{yellow}{d} &= \color{green}{b} \color{white}* \color{purple}{x}\\
\\
\color{yellow}{3*a + c - b} &= \color{green}{2*x} \color{white}* \color{purple}{z}\\
\color{yellow}{-d -4x + \frac{1}{2}} &= \color{green}{-z} \color{white}* \color{purple}{y}
\\
\end{align*}
```

```math
\textcolor{yellow}{\begin{bmatrix}
0 & 0 & 0 & 0 & 1 & 0 & 0 & 0\\
0 & 0 & 0 & 0 & 0 & 1 & 0 & 0\\
0 & 0 & 0 & 0 & 0 & 0 & 1 & 0\\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 1\\
0 & 0 & 0 & 0 & 3 & -1 & 1 & 0\\
\frac{1}{2} & -4 & 0 & 0 & 0 & 0 & 0 & -1 
\end{bmatrix}} \begin{bmatrix}
1 \\
x \\
y \\
z \\
a \\
b \\
c \\
d \\
\end{bmatrix} = 
\textcolor{green}{\begin{bmatrix}
0 & 1 & 0 & 0 & 0 & 0 & 0 & 0\\
0 & 1 & 0 & 0 & 0 & 0 & 0 & 0\\
0 & 0 & 0 & 1 & 0 & 0 & 0 & 0\\
0 & 0 & 0 & 0 & 0 & 1 & 0 & 0\\
0 & 2 & 0 & 0 & 0 & 0 & 0 & 0\\
0 & 0 & 0 & -1 & 0 & 0 & 0 & 0 
\end{bmatrix}} \begin{bmatrix}
1 \\
x \\
y \\
z \\
a \\
b \\
c \\
d \\
\end{bmatrix} \circ 
\textcolor{purple}{\begin{bmatrix}
0 & 0 & 1 & 0 & 0 & 0 & 0 & 0\\
0 & 1 & 0 & 0 & 0 & 0 & 0 & 0\\
0 & 0 & 0 & 1 & 0 & 0 & 0 & 0\\
0 & 1 & 0 & 0 & 0 & 0 & 0 & 0\\
0 & 0 & 0 & 1 & 0 & 0 & 0 & 0\\
0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 
\end{bmatrix}} \begin{bmatrix}
1 \\
x \\
y \\
z \\
a \\
b \\
c \\
d \\
\end{bmatrix}
```

3. Write a set of constraints that models `u = x && y && !z`. Don’t forget the `{0, 1}` constraints.

Solution:

```math
\begin{align*}
u &= u * u\\
x &= x * x\\
y &= y * y\\
z &= z * z\\
\\
a &= 1 - z\\
b &= y * a\\
u &= x * b\\ 
\end{align*}
```

4. Write a set of constraints that models `u = !(x || (y && z)) || (x && !z)`. Don’t forget the `{0, 1}` constraints. Convert that to a R1CS.

Constraints:
```math
\begin{align*}
\color{yellow}{u} &= \color{green}{u} \color{white}{*} \color{purple}{u}\\
\color{yellow}{x} &= \color{green}{x} \color{white}{*} \color{purple}{x}\\
\color{yellow}{y} &= \color{green}{y} \color{white}{*} \color{purple}{y}\\
\color{yellow}{z} &= \color{green}{z} \color{white}{*} \color{purple}{z}\\
\\
\color{yellow}{a} &= \color{green}{1} \color{white}{*} \color{purple}{(1 - z)}\\
\color{yellow}{b} &= \color{green}{x} \color{white}{*} \color{purple}{a}\\
\color{yellow}{c} &= \color{green}{y} \color{white}{*} \color{purple}{z}\\
\color{yellow}{d - c - b} &= \color{green}{-c} \color{white}{*} \color{purple}{b}\\
\color{yellow}{e - x - d} &=\color{green}{-x} \color{white}{*} \color{purple}{d}\\
\color{yellow}{u} &= \color{green}{1} \color{white}{*} \color{purple}{(1 - e)}\\ 
\end{align*}
```

R1CS:
```math
\textcolor{yellow}{\begin{bmatrix}
0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & -1 & -1 & 1 & 0 & 0 \\
0 & -1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & -1 & 1 \\
0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 
\end{bmatrix}} \begin{bmatrix}
1 \\
x \\
y \\
z \\
u \\
v \\
a \\
b \\
c \\
d \\
e \\
\end{bmatrix} = 
\textcolor{green}{\begin{bmatrix}
0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & -1 & 0 & 0 & 0 \\
0 & -1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 
\end{bmatrix}} \begin{bmatrix}
1 \\
x \\
y \\
z \\
u \\
v \\
a \\
b \\
c \\
d \\
e \\
\end{bmatrix} \circ 
\textcolor{purple}{\begin{bmatrix}
0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
1 & 0 & 0 & -1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 \\
1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & -1 
\end{bmatrix}} \begin{bmatrix}
1 \\
x \\
y \\
z \\
u \\
v \\
a \\
b \\
c \\
d \\
e \\
\end{bmatrix}
```