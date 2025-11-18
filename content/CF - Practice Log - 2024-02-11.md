Time Created: 2025-10-24 15:49
Status: #review 
Tags: [[Programming Contests]]


# Notes


### Mock 1 - 3 Hours
**Problem 1:** https://codeforces.com/problemset/problem/1877/E
Hint1: Functional Graphs

Every a_i points to index, so to $a_{a_i}$.

If I circle a node, I take care of all nodes that point to it, so they dont have to be circled. However, we cannot then choose all these nodes to be circled, as that would make circling our curent node useless and get -1. If eliminate curr node, ensure that it has a non-eliminated node pointing to it.
If we dont eliminae a node, we must ensure that the node it points to is eliminated.

Every connected component has exactly 1 cycle.?

This is just like two colouring, where we colour the functional graph black and white - black = eliminate/circle node, white = dont circle. Idk impl kinda seems iffy so i look at editorial.

We have confirmed valid graph:
- For each black node, there must be a white node that points to it
- For each white node, it must point to a black node, and no white nodes must point to it.

Noted by editorial: The graph forms a directed tree with 1 cycle at its root. For every node, we can determine its colour using its children, going up. If one of its children is white, node must be black since it then cant be white. Else, node must be white since either all children = black or no children.

Therefore, we know that it is **ALWAYS possible to construct** since we are just going to take one over the other for every node, and child decides it colour.
What makes it impossinle will be the last cycle edge. If this cycle edge connecting the root to some arbiturary node does not match colouring rules, the graph is impossible since there can only be one colouring of the tree(white for leaves, go upwards). 

Let root be the first node in the cycle. Then, the edge that the root goes to will be our "outlier" edge for the cycle. We then treat this as a normal tree and colour every node. Then, we go through the outlier edge and see if it matches colour rules: If adj node is white, root must not be white. 

Then, the answer is just the white coloured nodes in order(since r = p).

**I HATE THIS PROBLEM SO MUCH DO NOT USE DIRECTED TREE U SHOULD USE A QUEUE AND ITS LIKE ODD = BAD LIKE WTF HOW AM I SUPPOSED TO KNOW THIS STUFF WTFFFFF I HATE LFIE KDh aisdfhiwahfiewhfosenhfoisjm**

gg 5 hours wasted life 

**Problem 2:** https://codeforces.com/contest/1869/problem/D2

Everyone will have s = sum/n candies in the end.

Hint 1: We know that a person will not give any candies & recieve any candies if its a_i = s. Moreover, if a_i - s is a power of 2, we should only recieve / give that amount and do nothing, so there is 1 way to do so(Hint 2).

Hint3: Use bits.

==I guess anytime we want to sum values, make values the same, have 2^x as our thing, etc, we should try to consider bit by bit==



**Problem 3:** https://codeforces.com/problemset/problem/1864/E

We consider 1 game between fixed a and b, then optimize as much as possible.
For given a,b,a|b we go bit by bit. For each bit = 1 of the OR, if both a and b has that bit = 1 we cannot decide since all bits smaller and we dont have info on it. If only a or b has it we will just return immediately since we know one is smaller.
(I think this is best case scenario/the best info we can get?)

If we look at A and its bit is 1, we can move onto the next bit = 1. This is because when its Bs turn, if its bit is 0 we can just return i, otherwise we know both are 1 so we move onto the next bit, here b will ask the question. Thus if we keep on going, it means that for the next bit B is also 1.

We can simulate this for pair (a,b) in logn = 30 time.

Just look at editorial it uses trie??
https://usaco.guide/adv/string-search#tries

**Problem 4:** https://codeforces.com/problemset/problem/1838/D

We have to figure out two things:
- Given some sequence, how do we know if its walkable
- How to transition between sequences in O(logn) or O(1)

Backtracking gives us two more of that bracket.
The sequence length must be even. The first cannot be ")"
We cannot have "))" before the first "((".
If we have our first instance of "((", this must mean we have been through "()()()...". We then look at the last instance of "))". If there are no instance, we must then followed by "()()()..." which means its not walkable since theres no way to cancel our the "((". After the last instance of "))", we cannot have any more "((". Thus, it will just be followed by "()()()...".
Since length is even we thus have "()()()...((...unknown...))()()()..." as our sequence.
Since both sides are "()()()..." there size is even so "((...))" is even. This turns the problem simple, since we know that at any point when we have "((" or "))", we can cancel two at a time from both sides, so any sequence in "..." can be canceled. Thus, any sequence in this form will always be walkable.

Any sequence with size is odd or either ")" as starting or "(" as ending or the first repeating as "))" or the last repeating as "((" will get punished for being unwalkable. Any other sequence will be in the form above.

(**The middle is the important observation where I had to check editorial**)

To do queries, we can just update the positions of first "((", first "))", last "((", last "))" and compare. Every other constraint is ez check.


**Problem 5:** https://codeforces.com/problemset/problem/1906/F


## Reference

