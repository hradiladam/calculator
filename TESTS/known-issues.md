This document lists non-critical known issues and quirks in the Calculator application. 
They do not affect functional correctness but are kept here for tracking and future cleanup.

======================================
======================================

002 – Multiple Zeros Are Accepted in Input

Expected Behavior:
Typing an operator followed by multiple zeros (e.g., 5 + 000) should normalize to a single zero (5 + 0).

Actual Behavior:
The calculator accepts multiple zeros (5 + 000) in the input display. However, math.js evaluates it correctly as 5 + 0.

How to Reproduce:
1. Open the calculator.
2. Enter 5 + 000.
3. Observe that three zeros appear in the input display.
4. Press = → result is still 5.

Location:
_handleNumber in InputHandler.

Severity:
Low – cosmetic issue only.

Priority:
Low.

STATUS: Open. Test skipped for now - cosmetic issue only. 

======================================

004 – Preprocessor Wraps Expressions in Extra Parentheses

Expected Behavior:
The preprocessor should normalize operators/percentages without adding redundant parentheses.
Example: 5+(1+1) should remain 5+(1+1).

Actual Behavior:
The preprocessor outputs an extra wrapper:
5+(1+1) → (5+(1+1)).
Math.js is resiliant to extra parenthesesparses, calculations are unaffected.

How to Reproduce:
1. Evaluate any expression with parentheses, e.g., 5+(1+1).
2. Inspect the preprocessed string.
3. Notice the redundant wrapping around the entire expression.

Location:
preprocess() in preprocessor.

Severity:
Very Low – purely cosmetic, does not affect evaluation, user will never see the additional parentheses

Priority:
Very Low.

STATUS: Open. Test skipped for now - non-issue. Tests skipped for now.
