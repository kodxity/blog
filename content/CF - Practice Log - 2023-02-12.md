Time Created: 2025-10-24 15:44
Status: #review 
Tags: [[Programming Contests]]


# Notes

**Problem 1:** https://codeforces.com/problemset/problem/1863/E

This is just obvious topological sorting + dp
dp state is when two numbers such that h_a > h_b and a -> b, we know that dp_b = dp_a + 1 since we have to wrap around, else dp_b = dp_a. We then take max of all dp_b values.

However, we have a problem to choose optimal starting time. We know that we have max dp * k for days + max h_i that ends, but we dont know how to choose a start where sum is minimized. We know that start must be a starting node with nothing pointing to it.

We note the following: every dp after a change in the starting time, will increase by at most 1. This is because changing the starting time will at most push things back 1 day. Moreover, if we push some start time to day 2, every dp that is affected will keep being affected as we push start times that are larger to day 2.
Thus, we can sort start times(0 nodes pointing to it) by time, then simulate adding to day 2 then updating all dp affected. If a dp is not affected, further dp will also not be affected so we will not continue if this is the case, else we keep going. Thus **all nodes will be visited at most once** since each node is affected & changed at most once.

My impl is very messy and sussy so we dont talk abt it.


**Problem 2:** https://codeforces.com/problemset/problem/1856/D

FIrst 4 vparagraphs of editorial is trivial. That will be the case.
I dont understand stuff so I watch https://www.youtube.com/watch?v=rstJt54Nf5w
Okay ya my thought process was kinda wrong. I missed:
For any pair of operations of +,-, we note that the sum after (+a-b) must be negative, since it will turn blue then turn back red so b > a. We want to minize the damage as much as possible. Thus, we want to make everything (+a-b) = -1.

We know we want to always try to add the biggest numbers at the end. Specifically the n biggest numbers. Then, everything else MUST be limited to a (+a-b) pair of moves. This is because we will not be able to add stuff again since everything will be blue now. Then we want to minimize damage so we pair up everything as -1. If whats left is odd we'll have one more number left(-b), and well just choose 1 so well have ciel(left/2) -1s that we have to subtract to numbers.

Then we just run binary search.

Note that if diff parity we just dont pick last element during our initial placement

**Problem 3:** https://codeforces.com/problemset/problem/1856/D

## Reference

