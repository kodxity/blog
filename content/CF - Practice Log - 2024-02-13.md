Time Created: 2025-10-24 15:49
Status: #review 
Tags: [[Programming Contests]]


# Notes




**Problem 1:** https://codeforces.com/problemset/problem/1839/D

This seems so dp.
We want to sort each segment
For each segment that max moves is just the out of place value that is farthest away from a 0.
Find the number of required moves to sort some array if both sides have 0.
Solve for fixed k
We should try to fix the elements that wont move vs the elements that will move
Fixed element should form an increasing sequence. Now we have some chunk of fixed - unfixed elements.
Then, we know that we must have zeros in every segment of unfixed element, and we only need 1 zero. The cost will then be the number of moved elements since they only have to move once in optimal(idk proof but pretty sure this has to be the case). We want to find max length increasing subsequence so moved elements is minimal.
This problem then becomes finding the max length of increasing subsequence such that it divides array into exactly k segments. 



## Reference

