Time Created: 2025-10-24 15:45
Status: #review 
Tags: [[Competitive Programming Contests]]


# Notes


**Problem 1:** https://codeforces.com/contest/1905/problem/D]
**Observations:**
Array, Prefix Mex, Sum
0 1 4 5 2 3 6 7        1 2 2 2 3 6 7 8   31
7 0 1 4 5 2 3 6        0 1 2 2 2 3 6 8   24
6 7 0 1 4 5 2 3        0 0 1 2 2 2 3 8   18
3 6 7 0 1 4 5 2        0 0 0 1 2 2 2 8   15 
2 3 6 7 0 1 4 5        0 0 0 0 1 4 5 8   18
5 2 3 6 7 0 1 4        0 0 0 0 0 1 4 8   13
4 5 2 3 6 7 0 1        0 0 0 0 0 0 1 8   9
1 4 5 2 3 6 7 0        0 0 0 0 0 0 0 8   8
 
**Reflection:**
I spent a long time on this problem cause I didnt know how to exactly approach it.
To be honest, I shouldve known that this is just "change sum of mex in O(1) or O(logn) based on some relation, then brute force over max mex."
I got the correct approach of finding the relation, I just spend too much time looking at the right to left relation change(cyclic shift to right) instead of left to right like in the editorial. Thus, this costed me time. Moreover, I just couldnt figure out the relationship
**Takeaway:**
- Dont get stuck on one approach, look from bottom to top(left to right) as well!
- When looking for relationship, try to think about what would happen to each individual prefix mex after some cyclic shift. How do they differ from prev?
	- Dont just pray and rely on looking for patterns


**Problem 2:** https://codeforces.com/contest/1910/problem/F

**Observations:**
Essentially, we want to minimize by first ==finding the edges that are most commonly visited in total==, then set as much of those to 1 as possible.
- For every edge, it is used $(cc_{child})\cdot(n-cc_{child})$ number of times. We imagine picking a node from child's side and a node from parents side(size n-cc_child), the 2 nodes form a path that goes through the edge.
- The final chosen k nodes must be a connected component itself
- size of CC_parent and CC_child will +1, -1 after switching, meaning we'll always choose some neighbour and switch as our next node.

**Fact(better understanding proof):** Root the tree at centroid(node divides tree in half), then for every node, its child will always have a smaller value of $(cc_{child})\cdot(n-cc_{child})$ since we are essentiallysubtract the size of $cc_{child}$ by 1 each time and  $(cc_{child}-1)\cdot(n-(cc_{child}-1)) < (cc_{child})\cdot(n-cc_{child})$ is always satisfied. Thus we will always form some connected components with our k chosen verticies.

## Reference

