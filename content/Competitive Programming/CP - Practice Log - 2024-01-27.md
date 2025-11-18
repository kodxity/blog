Time Created: 2025-10-24 15:45
Status: #review 
Tags: [[Competitive Programming Contests]]


# Notes

## Practice Contest
https://codeforces.com/contest/1925/problem/C
I lowkey threw so hard on this contest.
Speedforces ABC but brick ez D :(
idk cause D was like combo + math I just brick but it looks so free like 1800 idk what happened I just didnt have an approach and cant calculate all possible sums

### Problem 1
https://codeforces.com/problemset/problem/1900/D
We can solve this easily in O(n^2) by sorting and just doing pairs then choose third number as all numbers after j.
Thought about it for 1 hour, cant find anything
Checked first hint
I knew this must be some brute force thingy where we take advantage of a_i < 10^5.

We brute force each gcd value. For each gcd if we can calculate all pairs whose gcd is a **multiple** of current value, we can find exact.
	- I was stuck cause I was thinking about a way to calculate ==exactly the specific gcd value== for every gced.
	- However, if we can calculate all multiples of this gcd value, we can complementary count and get the exact by ==subtracting all previous multiples of gcd values== from our answer, so we get exact pairs whose gcd is the current gcd value
		- If we calculate gcd values backwards from m - 1
This takes O(nlogn) as described in the editorial.
I had not thought of this
- If something looks iffy to calculate, try complementary counting

Now we try to calculate multiples of gcd in O(1) or logn idk.
This is actually not hard(i figured this out!) if we do precomputing.
Go through every element and see what it is a multiple of.
For every divisor, we store the number of elements that is a multiple of this value, and the total sum of all triplets. We want to add to the triplets value to get total triplets.
We do this with the equation $sum[j]*(n-1-i);$
Here, we choose some smaller element in the array that is also a multiple of j value, then our second element is our current element at $v[i]$, then the third element is anything we want that is bigger than the second element, since we arent using it in gcd(). There are n-1-i such choices.

Overall if I got the first observation of using complementary counting I wouldve solved it.

### Problem 2
https://codeforces.com/problemset/problem/1894/E




## Reference

