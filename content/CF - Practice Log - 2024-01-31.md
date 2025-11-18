Time Created: 2025-10-24 15:46
Status: #review 
Tags: [[Programming Contests]]


# Notes



### Problem 1
https://codeforces.com/problemset/problem/1726/D

The graph is connected, so there is at least n-1 edges.
Thus, m = n-1 or n or n+1 or n+2.

Consider what we do when we add an edge of colour red or blue. Adding this edge will connected **at most 2** connected components. This means we decrease $c_1 + c_2$ by at most 1.
Moreover, we note that it doesnt matter which colour the edge is, as long as it connected two seperate connected components of the same colour, then we will decrease the final ans by 1 which is good.
Thus, for n-1 we can just colour the whole tree red, since each time we are always decreasing the answer by 1. 
Then, for each n,n+1,n+2, we want to first colour some spanning tree red, then we DONT want to colour anything that will connect two nodes who are already in the same connected component in the same colour.
Find the spanning tree and colouring red will make min ans and its the simplist. Then we have at most 3 edges left. THese 3 edges might form a cycle, so we have to watch for that. Otherwise we just colour them blue since colouring them red will make edges connect nodes that are in the same connected components, since we already connected the tree red.
If in the case these 3 edges form a cycle, we want to eliminate the cycle, while still keeping the tree. These 3 edges will only form our current cycle, want wont form another cycle with any other edge.
Thus, we can colour one edge in this cycle red, colour the other two green, then start over again and eliminating the two blue edges. This way, we guarentee one edge is coloured red, and n-1 edges are left uncoloured. After running the process again, we can just pick any edge to be coloured blue and the 3 blue edges will not form a acycle since the first two blue edges only forms a cycle with a edge we already coloured red at the beginning.

To run the process of finding a spanning tree, we just use DSU and greedily add edges if the two nodes are in different connected components.

I used hints for this one, but most stuff I figured out by myself. Mainly looked at hint to deal with the cycle at the end.

Also to check if its in a cycle, I create a set which stores nodes.
If its a 3 edge cycle it will have edges:
a - b
b - c
c - a
There are 3 edges, 3 nodes in the set then we know its a cycle, else its not a cycle.

==**PLEASE REVIEW DFS SOLUTION IN EDITORIAL**==

### Problem 2
https://codeforces.com/problemset/problem/1725/C

We want to colour the lamps in such a way that if two lamps the are the same colour form a diameter, no other lamp has that same colour(those two lamps are the only lamps with that colour).

Since m = 3* 10^5, we can seperate this into cases of how many ways where we choose $i$ pairs, each with a different colour, then all the rest lamps are not pairs coloured with the same colour, and their colours differ from the $i$ already chosen colours.
To pick i pairs that have i distinct colours, we have
$\binom{pairs}{i}$ ways to pick i pairs and $\binom{m}{i}$ to choose i colours. Then $i!$ ways to assign $i$ colours to $i$ pairs.
Then we want to choose colours for the rest of the lamps. We now have $pairs - i$ diameter pairs left, and $m - i$ colours left. These pairs cannot have the same colour. Thus, for each pair there are $(m-i) * (m-i-1)$ ways to pick colour, since for each pair, we can pick one of the remaining colours for one lamp, then one of the remaining colours except for the already chosen colour for the other lamp.
For pairs - i diameter pairs, the total is $(m-i)(m-i-1)^{(pair-i)}$ ways.
We then look at the remaning lamps that have no pairs. We can pick any colour for these lamps since they wont affect anything. There are $m-i$ colours for each lamp, and $single$ lamps in total. Thus we have $(m-i)^{single}$ ways.
The total ways is just multiplying these parts up, then summing that over all i. The equation is:
$$
\sum_{i=0}^{min(m,pairs)} \left(\binom{pairs}{i}\cdot\binom{m}{i}\cdot i!\right) \cdot \left( (m-i)(m-i-1)^{(pair-i)} \cdot (m-i)^{single} \right)
$$

We first find the diameter(note if diameter is decimal(0.5), then all lamps doesnt affect each other so ans is just $n^m$).
Then we find all diameter pairs, and do the above calculation.

Looks like its same as editorial
**TO NOT TLE:** Make sure we ==set every number in calculation to after MOD==, this way we dont have to compute more stuff in add() and pow()


### Problem 3

We know the sum of the fib seuqnece is $F_{n+2}-1$.
Based off https://planetmath.org/listoffibonaccinumbers
we can get the first 55 fib numbers, since the max sum of $c$ is $10^9 * 100 = 10^{11}$
Then, we can check if its possible by seeing if the sum of $c$ = one of these $F_i - 1$. Then, we know we only have to fill the all $F_a$ from 1 to $i-2$ .

Cant think of anything. Hint 1: its greedy strat.
Given some $c_i$, we see if we can fill the max possible unfilled fib number $F_a$ currently.
If this $c_i$ is bigger, we know its possible to take $F_a$ from this $c_i$.
Moreover, for each $F_a$, we will not go and split it into pieces of $F_{a-1} + F_{a-2}$, since no matter how we split it, two Fs will always be next to each other, meaning that the colours are indistinguishable and thus it fails because we never want two consecutive fib numbers to have the same letters, since they will form one giant block if next to each other.
Thus, for each $F_i$ we either take it, or we dont. 

Nah this is too hard I look at solution.

OK I sorta get it. This problem is pretty much just guess a greedy and prove it. I dont know where I couldve found intution. Although Ive came pretty close. Basically, we just go through each fib number and subtract it from the largest current letter occurance, then freeze this letter for 1 turn to avoid neighbour fib choosing.
This works because we know the sum is the sum of these fib numbers, so in the end every letter occurance is 0. The only thing stopping us is just at some point, we are left with some numbers in the multiset(# of letter occurances), such that **ALL of them are smaller than the current fib number**, then we cant subtract it from anything.
We want to prevent this from happening as much as possible, so that for every number we choose it will always be bigger than the current fib number. The natural greedy is OBVIOUSLY to choose the max number in the multiset.

idk what I couldve done the problem sol is so simple but idk why I just couldnt think of it. For future references if there is some problem that asks to distribute sequence to numbers we should do something similar above.

Like this solution is literally the easiest greedy ever. We just know that it is always optimal to choose the largest number for subtraction, since the sum will be 0 at the end anyway so we dont care about ordering. The actual fib sequence doesnt even matter. We just always subtract from max.



### Problem 4
https://codeforces.com/problemset/problem/1696/E




### Problem 5
https://codeforces.com/problemset/problem/1622/D



## Reference

