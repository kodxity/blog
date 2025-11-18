Time Created: 2025-10-24 15:50
Status: #review 
Tags: [[Programming Contests]]


# Notes



Todays CF was so bad cause I solved C in one and a half hour while solving D1 in 20 mins. Shouldve switched when I had no clue for 20 mins. Also both were ez ideas idk I was trying segtree stuff for C idea but I shouldve realized that was overkill asf so ya its tuff I shouldve looked at it in different direction and hope for the best at least its better than impl segtree for an hour.

**Problem 1:** https://codeforces.com/problemset/problem/1761/D

We can turn this into choosing stuff. Notice that every chunk of blocks who has a 1 carry must start with (1,1) and further bits must have either (1,1), (1,0), or (0,1). Fir every chunk of 0 carry, we must start with (0,0) after the 1 carry block and then it can be (0,0), (1,0), (0,1). All have no restrictions on each other except for (0,0) after (1,1) and (1,1) after 0 carry block. We need k 1 carrys. We can brute force # of blocks. We know blocks must alternate. For each block we have $3^{n-block}$ ways to choose bits that are not the starting block( which means its not fixed as (1,1) or (0,0)). We then divide the blocks for each 1 carry and 0 carry using stars and bars. We then determine if we start with 1-block or 0 -block. If we start with 1 block we must place (1,1) at first position. If we start with 0-block we can place (0,0),(1,0),(0,1) and thus we have $3^{n-block+1}$.

Same solution as editorial, block = segments in editorial.


**Problem 2:** https://codeforces.com/problemset/problem/1811/F
We know the following right off the bat:
- Every node inside the inner circle has degree 4
	- Exactly 2 connections also has degree 4.
- Every node in a cycle outside of the inner circle in a cycle with one of the verticies in the inner circle will have degree 2
- Every node must be one of the above cases(only have degree 2 and 4)

Think reason why not many ppl got it was because there are many contrains that sets a flower graph apart from non-flower. Satisfying all constrains will lead to ans.

Got similar to editorial, but I used diff stuff to check constrains and ig my ans is "not proven"

**Problem 3:** https://codeforces.com/problemset/problem/1775/E

Adding 1 & subtracting 1 to anything that is in the wrong direction will cost another extra move to repair. We only need to do this if we want to eliminate extra stuff thats otherwise not possible. Because we're sacraficing another move, we can just create a new move instead of moving along with our current move, since doing so and doing the above where we add to the wrong direction will have same amount of moves. Thus, its never optimal to do this and we should always add/subtract same direction.

The operation means that we can eliminate for every +,-,+,-,+,... or -,+,-,+,-,...

Lets do using dp similar approach. For every element, we will calculate how many moves did we take starting from that element. Then, for every element we can eliminate as much as possible using all prev elements with the opposite sign. Like we currently have sum of all possible moves remaining whose last element was opposite sign. We then cancel as much as possible. If nessesary, we will add moves.

Overall pretty ez sol I just didnt think of dp at the start cause I thought it required some data structure + greedy stuff, like way harder than this dp thingy.

Used same solution as chinese editorial me thinks: https://www.bilibili.com/video/BV1bM411F7Qp/

Editorial Argues that the answer is just the max - min prefix sum :mind_blowing:

We first note that the operation of +1 to $i$ and -1 to $j$ is basically just saying we are adding 1 to segment $[i...j)$. Thus, our operation essentially turns into: 

==pick ANY number of subsegment of the prefix sum, and add or subtract 1 to every number.==

To make everything 0, we want every prefix to be 0. And our operation can only +1 or -1 any subsegment for each move. Thus, the answer(min moves) is obviously just the max - min segment, since we want to make everything 0 and those are the upper and lower bounds that forces us to make such moves to eliminate that segment. Very smart approach! (but i think mine was more intuitive)







**Problem 4:** https://codeforces.com/problemset/problem/1771/D

Hint 1: Use dp. Let dp_{a,b} be ans, the max sub palindrome from a to b.

We make the transitions dp_{a,b} = max(dp_{prevtoa,b}, dp_{a,prevtob}, if s_a == s_b then dp_{prevtoa,prevtob}+2.
Here we must note that if distance of a to b = 1, dp_{a,b} = 1, and if dist of a to b = 2 and s_a == s_b, dp_{a,b} = 2. Not setting these will get WA on edge case.

idk why I didnt see the solution prob cause im used to tree problems being O(n) so I thought I had to do smth smart before I realized this is just ez bruteforce like :(

Quite unfortunate I didnt solve this tbh. I think main mistake was overthinking this with some smart thing about palindrome and I didnt realize the brute force solution, and I had been off of this sorta thing when doing 2100s so ig I didnt adjust. Anyway, shouldve realized this is easily bruteforceable using transitions in O(n^2)


## Reference

