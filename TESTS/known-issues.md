This document lists non-critical known issues and quirks in the Calculator application. 
They do not affect functional correctness but are kept here for tracking and future cleanup.

======================================


### 002 – Multipel Zeros Are Accepted in Input
Description: Multiple '0's can be typed after an operator (e.g., '5 + 000').
Location: _handleNumber in InputHandler
Severity: Low -> Cosmetic issue. Math.js is resiliant to multiple 0 in an expression, undestands it as one singular 0.
Priority: Low


### 004 – Preprocessor Wraps Expressions in Extra Parentheses
Description: Already-parenthesized expressions are further wrapped (e.g., '5+(1+1)' → '(5+(1+1))').
Location: preprocess() in preprocessor
Severity: Low -> Math.js is resiliant to extra parentheses. Preprocessed expressions are not used to form output for display in frontend
Priority: Very Low

