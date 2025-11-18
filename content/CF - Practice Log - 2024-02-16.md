Time Created: 2025-10-24 15:49
Status: #review 
Tags: [[Programming Contests]]


# Notes


**Problem 1:** https://codeforces.com/problemset/problem/1808/D

Given a fixed palindrome, the palindromicity will be the number of x->n-x such that the two values are different.
This is because one of them must change in order to be the same as the other in palindrome. For every element, we can find sum of its contribution, then sum up these values.
Let every element be the left of the pair. For every element i, we can pair it up with i+2x, where x is integer and 2x + 1 <= k. This is due to k is odd. We can then do this by counting every same as element. Then store int some count. Since mods are the same we just go through it like sliding window, & update accordingly.

We first run the brute force solution where we just put each element as left, then have another iterator j which checks all right positions to see if its possible. This works in O(n^2).

An O(n) solution forces us to see which positions are possible. This means which right position such that we can form a k length subarray.
For the first element, we know that in order for it to be paired we must make it the leftmost in subarray so only right pair at position k would work. For everything else, we'll maintain a vis array and keep adding i+kth element. We then subtract accordingly based on if the ith element was vis(added to our cnt) or not. To find duplicates we just store freq in a map.

ez problem just cancer & I suck and I dont care.

**Review editorial later cause im so done with this problem rn**



**Problem 2:** https://codeforces.com/problemset/problem/1799/D2

Let dp_j mean at each position, one of the previous CPUs ran program j and the other ran program v_i. Previously the stack will look like v_{i-1}, j for some number j.
Then, we must add v_{i} to the top of either one. The transition is then:
If v_{i-1} = v_i, we have v_i, j.
- newdp_x = prevdp_x  + hot_{v_i}: add v_i on top of v_{i-1}
- newdp_{v_i} = min(prevdp_{v_i}+hot_{v_i}, prevdp_{x} + cold_{v_i} for all x)
If v_{i-1} != v_i, we have v_{i-1}, j.
- newdp_x = prevdp_x  + cold_{v_i}: add v_i on top of v_{i-1}
- newdp_{v_{i-1}} = prevdp_x + cold_{v_i}
- newdp_{v_{i-1}} = prevdp_{v_i} + hot_{v_i}

For each iteration all variables requires either whole range update or 1 variable update, thus we can do this using segtree for each iteration.


This problem could go fk itself.


**Problem 3:**

This can easily solved using dp, since we can just contruct a and b bit by bit.




## Reference

