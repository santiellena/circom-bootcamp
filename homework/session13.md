# Homework

1. Add a DUP op code to the VM here: https://www.rareskills.io/post/zkvm
```circom
pragma circom 2.1.6;

include "circomlib/comparators.circom";
include "circomlib/gates.circom";

template AND3() {
  signal input in[3];
  signal output out;

  signal temp;
  temp <== in[0] * in[1];
  out <== temp * in[2];
}

// i is the column number
// bits is how many bits we need
// for the LessEqThan component
template ShouldCopy(i, bits) {
  signal input sp;
  signal input is_push;
  signal input is_nop;
  signal input is_add;
  signal input is_mul;
  signal input is_dup;

  // out = 1 if should copy
  signal output out;

  // sanity checks
  is_add + is_mul + is_push + is_nop + is_dup === 1;
  is_nop * (1 - is_nop) === 0;
  is_push * (1 - is_push) === 0;
  is_add * (1 - is_add) === 0;
  is_mul * (1 - is_mul) === 0;
  is_dup * (1 - is_dup) === 0;


  // it's cheaper to compute ≠ 0 than > 0 to avoid
  // converting the number to binary
  signal spEqZero;
  signal spGteOne;
  spEqZero <== IsZero()(sp);
  spGteOne <== 1 - spEqZero;

  // it's cheaper to compute ≠ 0 and ≠ 1 than ≥ 2
  signal spEqOne;
  signal spGteTwo;
  spEqOne <== IsEqual()([sp, 1]);
  spGteTwo <== 1 - spEqOne * spEqZero;

  // the current column is 1 or more 
  // below the stack pointer
  signal oneBelowSp <== LessEqThan(bits)([i, sp - 1]);

  // the current column is 3 or more
  // below the stack pointer
  signal threeBelowSP <== LessEqThan(bits)([i, sp - 3]);

  // condition A
  component a3A = AND3();
  a3A.in[0] <== spGteOne;
  a3A.in[1] <== oneBelowSp;
  a3A.in[2] <== is_push + is_nop + is_dup;

  // condition B
  component a3B = AND3();
  a3B.in[0] <== spGteTwo;
  a3B.in[1] <== threeBelowSP;
  a3B.in[2] <== is_add + is_mul;

  component or = OR();
  or.a <== a3A.out;
  or.b <== a3B.out;  
  out <== or.out;
}

template CopyStack(m) {
  var nBits = 4;
    signal output out[m];
    signal input sp;
    signal input is_add;
    signal input is_mul;
    signal input is_push;
    signal input is_nop;
    signal input is_dup;


    component ShouldCopys[m];

    // loop over the columns
    for (var i = 0; i < m; i++) {
      ShouldCopys[i] = ShouldCopy(i, nBits);
      ShouldCopys[i].sp <== sp;
      ShouldCopys[i].is_add <== is_add;
      ShouldCopys[i].is_mul <== is_mul;
      ShouldCopys[i].is_push <== is_push;
      ShouldCopys[i].is_nop <== is_nop;
      ShouldCopys[i].is_dup <== is_dup;
      out[i] <== ShouldCopys[i].out;
    }
}

// n is how many instructions we can handle
// since all the instructions might be push,
// our stack needs capacity of up to n
template ZKVM(n) {
  var NOP = 0;
  var PUSH = 1;
  var ADD = 2;
  var MUL = 3;
  var DUP = 4;

  signal input instr[2 * n];

  // we add one extra row for sp because
  // our algorithm always writes to the
  // next row and we don't want to conditionally
  // check for an array-out-of-bounds
  signal output sp[n + 1];

  signal output stack[n][n];

  var IS_NOP = 0;
  var IS_PUSH = 1;
  var IS_ADD = 2;
  var IS_MUL = 3;
  var IS_DUP = 4;
  var ARG = 5;
  signal metaTable[n][6];

  // first instruction must be PUSH or NOP
  (instr[0] - PUSH) * (instr[0] - NOP) === 0;

  signal first_op_is_push;
  first_op_is_push <== IsEqual()([instr[0], PUSH]);

  // if the first op is NOP, we are forcing the first
  // value to be zero, but this is where the stack
  // pointer is, so it doesn't matter
  stack[0][0] <== first_op_is_push * instr[1];

  // initialize the rest of the first stack to be zero
  for (var i = 1; i < n; i++) {
    stack[0][i] <== 0;
  }

  // we fill out the 0th elements to avoid
  // uninitialzed signals
  sp[0] <== 0;
  sp[1] <== first_op_is_push;
  metaTable[0][IS_PUSH] <== first_op_is_push;
  metaTable[0][IS_NOP] <== 1 - first_op_is_push;
  metaTable[0][IS_ADD] <== 0;
  metaTable[0][IS_MUL] <== 0;
  metaTable[0][IS_DUP] <== 0;
  metaTable[0][ARG] <== instr[1];

  // spBranch is what we add to the previous stack pointer
  // based on the opcode. Could be 1, 0, or -1 depending on the
  // opcode. Since the first opcode cannot be POP, -1 is not
  // an option here.
  var SAME = 0;
  var INC = 1;
  var DEC = 2;
  signal spBranch[n][3];
  spBranch[0][INC] <== first_op_is_push * 1;
  spBranch[0][SAME] <== (1 - first_op_is_push) * 0;
  spBranch[0][DEC] <== 0;

  // populate the metaTable and the stack pointer
  component EqPush[n];
  component EqNop[n];
  component EqAdd[n];
  component EqMul[n];
  component EqDup[n];

  component eqSP[n][n];
  signal eqSPAndIsPush[n][n];
  for (var i = 0; i < n; i++) {
    eqSPAndIsPush[0][i] <== 0;
  }

  signal eqSPAndIsDup[n][n];

  // signals and components for copying
  component CopyStack[n];
  signal previousCellIfShouldCopy[n][n];
  for (var i = 0; i < n; i++) {
    previousCellIfShouldCopy[0][i] <== 0;
  }

  component eqSPMinus2[n][n];
  signal eqSPMinus2AndIsAdd[n][n];
  signal eqSPMinus2AndIsMul[n][n];
  for (var i = 0; i < n; i++) {
    eqSPMinus2AndIsAdd[0][i] <== 0;
    eqSPMinus2AndIsMul[0][i] <== 0;
  }

  // (the current column = sp - 2 and is_add) * sum
  signal eqSPMinus2AndIsAddWithValue[n][n];
  signal eqSPMinus2AndIsMulWithValue[n][n];

  signal sum_result[n][n];
  signal mul_result[n][n];
  for (var i = 0; i < n; i++) {
    eqSPMinus2AndIsAddWithValue[0][i] <== 0;
    eqSPMinus2AndIsMulWithValue[0][i] <== 0;
    sum_result[0][i] <== 0;
    mul_result[0][i] <== 0; 
  }

  signal dup_result[n][n];
  signal eqSPAndIsPushWithValue[n][n];

  // need to initialize
  for(var i = 0; i < n; i++){
      dup_result[0][i] <== 0;
  }

  for(var i = 1; i < n; i++){
      dup_result[i][0] <== 0;
      dup_result[i][n - 1] <== 0;
  }

  for (var i = 1; i < n; i++) {
    // check which opcode we are executing
    EqPush[i] = IsEqual();
    EqPush[i].in[0] <== instr[2 * i];
    EqPush[i].in[1] <== PUSH;
    metaTable[i][IS_PUSH] <== EqPush[i].out;

    EqNop[i] = IsEqual();
    EqNop[i].in[0] <== instr[2 * i];
    EqNop[i].in[1] <== NOP;
    metaTable[i][IS_NOP] <== EqNop[i].out;

    EqAdd[i] = IsEqual();
    EqAdd[i].in[0] <== instr[2 * i];
    EqAdd[i].in[1] <== ADD;
    metaTable[i][IS_ADD] <== EqAdd[i].out;

    EqMul[i] = IsEqual();
    EqMul[i].in[0] <== instr[2 * i];
    EqMul[i].in[1] <== MUL;
    metaTable[i][IS_MUL] <== EqMul[i].out;

    EqDup[i] = IsEqual();
    EqDup[i].in[0] <== instr[2 * i];
    EqDup[i].in[1] <== DUP;
    metaTable[i][IS_DUP] <== EqDup[i].out;

    // carry out the sums and muls
    for (var j = 0; j < n - 1; j++) {
      sum_result[i][j] <== stack[i - 1][j] + stack[i - 1][j + 1];
      mul_result[i][j] <== stack[i - 1][j] * stack[i - 1][j + 1];
    }

    // these values cannot be used in practice because
    // the stack doesn't go that high.
    // However, we still need to initialize
    // them because every column checks
    // if it is sp - 1, even the last 2
    for (var j = n - 1; j < n; j++) {
      sum_result[i][j] <== 0;
      mul_result[i][j] <== 0;
    }

    // carry out dup in bounds
    for (var j = 1; j < n - 1; j++) {
        dup_result[i][j] <== stack[i - 1][j - 1];
    }    

    // get the instruction argument
    metaTable[i][ARG] <== instr[2 * i + 1];

    // if it is a push, write to the stack
    // if it is a copy, write to the stack
    CopyStack[i] = CopyStack(n);
    CopyStack[i].sp <== sp[i];
    CopyStack[i].is_push <== metaTable[i][IS_PUSH];
    CopyStack[i].is_nop <== metaTable[i][IS_NOP];
    CopyStack[i].is_add <== metaTable[i][IS_ADD];
    CopyStack[i].is_mul <== metaTable[i][IS_MUL];
    CopyStack[i].is_dup <== metaTable[i][IS_DUP];
    for (var j = 0; j < n; j++) {
      previousCellIfShouldCopy[i][j] <== CopyStack[i].out[j] * stack[i - 1][j];

      eqSP[i][j] = IsEqual();
      eqSP[i][j].in[0] <== j;
      eqSP[i][j].in[1] <== sp[i];
      eqSPAndIsPush[i][j] <== eqSP[i][j].out * metaTable[i][IS_PUSH];
      eqSPAndIsDup[i][j] <== eqSP[i][j].out * metaTable[i][IS_DUP];

      // check if the column is two less
      // than the stack pointer
      // if so, we prepare to write the sum or
      // product here
      // if the current instruction is add or mul
      eqSPMinus2[i][j] = IsEqual();
      eqSPMinus2[i][j].in[0] <== j;
      eqSPMinus2[i][j].in[1] <== sp[i] - 2; // underflow doesn't matter

      eqSPMinus2AndIsAdd[i][j] <== eqSPMinus2[i][j].out * metaTable[i][IS_ADD];
      eqSPMinus2AndIsMul[i][j] <== eqSPMinus2[i][j].out * metaTable[i][IS_MUL];

      eqSPMinus2AndIsAddWithValue[i][j] <== eqSPMinus2AndIsAdd[i][j] * sum_result[i][j];
      eqSPMinus2AndIsMulWithValue[i][j] <== eqSPMinus2AndIsMul[i][j] * mul_result[i][j];

      eqSPAndIsPushWithValue[i][j] <== eqSPAndIsPush[i][j] * metaTable[i][ARG];
      // we will either
      // - PUSH 
      // - COPY or implicilty assign 0
      // - ADD
      // - MUL
      // - DUP
      stack[i][j] <== eqSPAndIsDup[i][j] * dup_result[i][j] + eqSPAndIsPushWithValue[i][j] + previousCellIfShouldCopy[i][j] + eqSPMinus2AndIsAddWithValue[i][j] + eqSPMinus2AndIsMulWithValue[i][j];
    }

    // write to the next row's stack pointer
    spBranch[i][INC] <== (metaTable[i][IS_PUSH] + metaTable[i][IS_DUP]) * (sp[i] + 1);
    spBranch[i][SAME] <== metaTable[i][IS_NOP] * (sp[i]);
    spBranch[i][DEC] <== (metaTable[i][IS_ADD] + metaTable[i][IS_MUL]) * (sp[i] - 1);
    sp[i + 1] <== spBranch[i][INC] + spBranch[i][SAME] + spBranch[i][DEC];
  }
}

component main = ZKVM(7);

/* INPUT = {
    "instr": [1,3,1,6,1,2,3,0,3,0,4,0,2,0]
} */

/*
    PUSH 3, PUSH 6, PUSH 2, MUL, MUL, DUP, ADD

*/

/*
  var IS_NOP = 0;
  var IS_PUSH = 1;
  var IS_ADD = 2;
  var IS_MUL = 3;
  var IS_DUP = 4;
*/
```