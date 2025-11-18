Time Created: 2025-10-24 15:48
Status: #review 
Tags: [[Programming Contests]]


# Notes





**Problem 1:** https://codeforces.com/problemset/problem/1913/D

This is DP strat obviously.
Had to look at editorial cause I dont know how you can get for each i the number of sequences that end in a_i. Turns out I just had to organize my thoughts and write it out ig, cause i thought it was pretty obvious:
- Dont pick a_i: dp_{last smaller}
	- we must erase this a_i using last smaller
- Pick a_i: sum_{i-1} - sum_{last smaller} + chain_{last smaller}
	- We can choose all numbers between last smaller and i as our last element before we put a_i as our last element. Hence we create prefix sum of Pick a_i to query this in O(1)
	- We can choose all numbers that are in a chain of smaller values, since we can eliminate everything in between this value and i and put i to the back. We store this as pre2

Moreover, we note that sum_0 = 1 as there is 1 way to start with 0.
Then, we note that if last-i = 0, we can just choose any number as our last starting. Thus, it will be sum_{i-1}, sum of all starting.

Here, pre_i represents how many possible if we have i as our last value.

**Problem 2:** https://vjudge.net/problem/CodeForces-1914G1

- When 1 light is turned on, we can assume both light are on

Wait I think this problem is actually pretty ez. For each colour, we can view as node and it can connect to all colours in between the two lightbulbs of this colour. Since O(n^2) wont TLE we can bruteforce and just make a graph.
Then ans is just number of connected components.
It is left to calculate product. For each cc, we want to know how many colours we can choose initially so that we will cover everything.
Since O(n^2) is allowed, we can first check the size of each cc using **undirected edges**.
Then, for each node we can check if starting at this node in the **directed graph**, we can visit all nodes in the cc(size = cc size). Since On^2 this is allowed to brute force.





**Problem 3:** https://vjudge.net/problem/CodeForces-1884D

Asked to find number of pairs such that no numbers in array is a divisors of its gcd.

Based on a similar problem I've done on 01-27-2024, we can get for every value the number of pairs whose gcd is exactly that using complementary counting. 
Then, for every value, if it is in the array we go through its multiples and eliminate every multiple of it for gcd. Then the number of pairs left is ans. Both iterations works in O(nlogn)



**Problem 4:** https://vjudge.net/problem/CodeForces-1900E

Adding the extra edges is essentially useless unless it is for the simple path restriction where we can use it so that we dont have to visit verticies twice.
Essentially, this allows us to jump over any node in the path that has already been visited. Thus, we can imagine that its a regular path where we can go to a node if we can reach it but **repeats are allowed** in the path.
The max length will be the max nodes one can reach.

Hint 2: For SCC, we can choose every node in it. Then, it just matters what edges between these scc.
- Idk why I didnt think of this, but prob cause of my lack of experience with scc( problem wise it almost never shows up idk) and idk how to implement & find all scc in a graph.


Then, im pretty sure this turns into a tree where we can just tree dp?
NVM its not a tree cause of > n-1 edges is possible but should just be 
DAG -> topological sorting DP with SCCs as the nodes.
Cause SCCs automatically just eliminates cycles I assume.

Idk im kinda tripped up by SCC so i look at editorial


**Problem 5:** https://codeforces.com/problemset/problem/1877/e

Hint 1: functional graph

**Problem 6:** https://codeforces.com/problemset/problem/1866/H

- Everything except empty set, has to be different.
- We can construct a valid sequence, then deal with permutation bs after
- For every sequence at pos i, we can place some number down only if n-1-i <= k - x. This is so that after we go to nth sequence this number is still <= k.
- With each possible number x, we want to choose where from 1 <= i <= n should we place it in the array, since if we place it once we have to place it for every sequence moving fowards.
	- possible x values are 1 <= x <= k-(n-1-i) for every i
	- For every x there is n choices for which i we will place it at first.

For each way, we want to take into account how many empty sets there are, thus we go through each i where i represents the number of empty sets. For each sequence, there is then max(0,k-(n-1-i)) numbers to place into n-i+1 positions each(n-i positions + 1 position for if the number is not included at all). Thus, total we have $(n-i+1)^{max(0,k-(n-1-i))}$ ways to choose numbers to see when it exists first. However, we want at least 1 number to exist at the very start. Sey we put $j$ numbers at the start. We then have
$$
\sum_{j=1}^{max(0,k-(n-1-i))}\binom{max(0,k-(n-1-i))}{j} \cdot (n-i+1)^{max(0,k-(n-1-i))-j}
$$Then we permute so $\binom{n}{i} \cdot (n-i)!$ so we put 0s into positions first cause order doesnt matter so we choose, then for each choosing we permute n-i since every non empty sequence will be different.


==If we can only count AT LEAST and it seems iffy to count EXACTLY, just count AT LEAST then do **complementary counting**==





## Reference

