Time Created: 2025-10-24 15:46
Status: #review 
Tags: [[Programming Contests]]


# Notes


### Contest
https://codeforces.com/contest/1918
Solved 4 problems which was the goal, just very slow on all of them.
First I misread/interepreted ig the sample for B, I thought of the solution at the very start by guessing, but sample didnt match so I didnt think about it in that direction. Only later I realized I calculated the sample wrong and my original solution was actually correct. Problem was ez I just couldnt think idk.
For D I also thought of bisearch solution fast, but took a long time debugging cause originally I thought we can calculate value using greedy but it was actually DP. Overall I feel like I couldve got more rating by doing stuff faster but I still got +11 so I'll take it.

### Problem 1
https://codeforces.com/problemset/problem/1741/F
idk kinda looks messy, check hint 1.
Split the problem into two cases:
- Find the min distance of segment from a diff colored segment to its left
- Find the min distance of segment from a diff colored segment to its right

For every segement, we want to find the maximum right bound of diff colored segment whose left segment is smaller than our current segment.

Ok nvm im kinda slow at impl.

Pretty much, for every segment we want to only consider the segements that are not to teh right of the current segment.
Thus, we want to consider all segements whose left bound(start) is before our current right bound. This way every segement is to the left or intersecting the current segment. 
From these segments, we want to find the maximum right bound in order to maximize our chance of intersection. 
We can store the max right bound for each colour in a multiset. We are then able to pick the largest right bound that is not the current segment colour fast since even if the maximum right bound is the current colour, we can just go one below and its a different colour.

This problem is just case work - figure out how to divide and conquer the problem into left and right and solve + messy implementation.
Its actually not that hard I just missed you can split into two cases :(




### Problem 2
https://codeforces.com/problemset/problem/1851/G

This is not a normal weighted graph problem since time for queries will TLE normally.
I think theres some property with th inclusion of heights as weights that makes this solvable.
jk its prob some graph optimizations.

We want the lowest point/energy reached during the path.

OMG... I just checked hint 1 and ya its a property with the heights im actually so dumb gg.

Ya theres like almost no way I shouldve known you cant really "simulate shortest path" for queries since we want the lowest point reached and theres like no almost no chance + negative weights 
wait nah I feel like you can still get lowest point, but with negative weights its def not a shortest path problem so idk. Ya its probably gg.

We note some property with the difference between heights as weights.
Let use go from a -> b -> c. From a->b we need $h_b - h_a$ energy.
From b -> c we need $h_c-h_b$ energy. Thus, the total energy is just $h_c - h_b + h_b - h_a = h_c - h_a.$
Thus, from any node $x$ to any other node $y$ the final energy spent is just $h_y - h_x$ if there exists some path between them.
I shouldve known we ==manipulate equations to get weight== cause this is very trivial and this problem is instasolve but im just kinda brain no work rn idk.

The lowest point in the path is just the $max(h_a - h_x)$ where $a$ is a node in the valid path from x to y.

Thus, we want to know if we can go from x to y using only edges whose $h_a-h_x$ is smaller <=$e$.

We can prob use DSU for this but idk how we can get this to run since everything is 10^5.

Ohhhhh wait im actually a genius we could just sort the queries and this is ggez.
I actually didnt learn this trick until a few days ago haha ig jotting down thought process really does help :)

We dont want to delete edges for smaller n, thus we can sort queries and process in sorted order so we never have to delete edges.
Note that we want $e-max(h_a - h_x) \ge 0$ for all a in the path. Thus, we want $e+h_x - max(h_a) \ge 0, e+h_x \ge max(h_a)$. Therefore, we can include all node $a$ such that $h_a \le e+h_x$. Then, we want to include all edges from $a$ whose $h_b$ is also $\le e+h_x$. Then, we will run DSU to see if x and y are in the same connected component. If they are, we know there is a path. We can sort queries by $e+h_x$ and just keep adding edges.


In general, we want to manipulate formulas so that we can do greedy sorting that doesnt rely on changing h_x and e, and h_a.


### Problem 3
https://codeforces.com/problemset/problem/1764/D

The sequence ends when all pegs are on one half of the polygon.
This means that floor(n/2) consecutive pegs are removed(checked hint 1)
We thus know that the game will end as soon as there are floor(n/2) consecutive pegs removed. Otherwise the game will go on.

nah I just have 0 clue how you count that theres like no way im bad at math.



## Reference

