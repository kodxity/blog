Time Created: 2025-10-24 15:46
Status: #review 
Tags: [[Competitive Programming Contests]]


# Notes

### Problem 1
https://codeforces.com/problemset/problem/1857/G

For any two nodes, we can build a new path between it and still satisify the conditions if  max weight in MST between two nodes < weight of the graph is <= S. This can be done in O(n^2).

We think about how much each edge is used, which will prob lead to O(n).

Well prob wanna sort weights in descending

Ok, I think I've got the solution all by myself!
Sort the edge largest to smallest and iterate.
For every edge, we know its the maixmum edge of the current graph. Then, all paths from node a to b will have this edge as the max edge on the path if a and b are from both sides of the edge. Then the number of paths is (node from left) * (node from right)-1 since we subtract path which is just the two nodes connected by the current edge cause we cant have multiple edges.
number of paths = number of edges we can add. For each of these edges we can have (S - current edge weight + 1) possible weights -> (the number of weights possible to maintain the MST+not having the edge at all). We multiply (S-w+1)^(# of current paths) to ans.
Then, we dont want to deal with the edge anymore since we just calculated all paths that have the edge as max. Moreover, all proceeding edges must not go through this edge. Thus, we will delete this edge from the tree. We can impl this and counting using DSU.
To impl deletion on DSU we just use reverse trick where we process edges smallest to largest and add edge to simulate deletion.

https://codeforces.com/contest/1857/submission/243973771

Yup, my solution is editorial
### Problem 2
https://codeforces.com/contest/1862/problem/G

Thought of this by myself in like 30mins - 1hr

For these "impossible game simulation" problems I feel like the best thing to do if to find some way that will simplify the game so that we can simulate it and get ans in O(1) or O(logn).

First, try some examples and see how stuff changes.
Look at two adjancent values ansd see when they will merge
note that the progression {n,n-1,n-1,...,1}, each added value is one less than the value before it.
This means that at any time, an element v_i in the original sorted array can never be greater than the number after it. This is because their add value differs by 1. Thus, the will become equal after $v_{i+1} - v_{i}$ moves and that every value in the array will keep its order in the original array at any time. The only difference is merging after some moves.

We want the max number of moves. The max number of moves is obviously the max $v_{i+1} - v_{i}$. Since for every move before it everything wouldve already merged into one number for all $v_i$.

This means we just have to for each q find the maximum $v_{i+1} - v_i$ after each change, this will be the number of moves needed to merge the array. Then add it to the max value in the original array since this value will increase by 1 each move(since its the max value and the order of values never change, only merging occurs). We do this using multisets and simulating by replacing and inserting new values that need to change.


Key takeaway is we want to try to convert a complicated simulation game into a ez and fast calculation.

Looks like I have same answer as editorial.


### Problem 3
https://codeforces.com/problemset/problem/1731/E

To make cost as small as possible, we need to go from largest gcd and add as much edges with large gcd as possible.

It is left to determine how many edges can we add for each gcd value.

Note that for every edge that has gcd vaule x, there will always be more edges that has gcd value y where y < x. So all smaller gcd value edges will have more in the graph. This is because we can form the same multiples just with smaller gcd value, so there are more edges we can make.

The greedy strat is:
We calculate how many edge have gcd value x, and add max edge as possible
**Wanna look at good proof idk I just had intuition and proof by AC :/**
I think its because of some like greedy coin thingy and the fact that any edge that has smaller gcd value will have more of that edges.\


All these problem I did without any help kinda slow tho cause im bad but :/ also usaco gold was so sad I got like 613 and ==LEGIT FARMED ALL EZ SUBTASKS LIKE THE MAX SUBTASK FOR EVERY PROBLEM BEFORE AC==, also spent like 1 hour on P3 and still couldnt get it cause idk how to deal with pointer bs cause I suck but ya no shot I make plat and I suck and I shouldve done stuf I didnt and its very sad.
Life is sad and idk if I can have positive delta on cf tmrw but ==IDGAF these are all contests that feed the go and idc I just wanna make CCO pls pls pls==




## Reference

