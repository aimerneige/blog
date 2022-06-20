---
title: "LeetCode Pyramid Transition Matrix"
date: 2020-09-11T15:30:34+08:00
draft: false
ShowToc: false
categories: [Program]
tags: [LeetCode]
---

> https://leetcode.com/problems/pyramid-transition-matrix/

> We are stacking blocks to form a pyramid. Each block has a color which is a one letter string.
>
> We are allowed to place any color block `C` on top of two adjacent blocks of colors `A` and `B`, if and only if `ABC` is an allowed triple.
>
> We start with a bottom row of `bottom`, represented as a single string. We also start with a list of allowed triples `allowed`. Each allowed triple is represented as a string of length 3.
>
> Return true if we can build the pyramid all the way to the top, otherwise false.
>
> **Example 1:**
>
> ```
> Input: bottom = "BCD", allowed = ["BCG", "CDE", "GEA", "FFF"]
> Output: true
> Explanation:
> We can stack the pyramid like this:
>        A
>       / \
>      G   E
>     / \ / \
>    B   C   D
>
> We are allowed to place G on top of B and C because BCG is an allowed triple.  Similarly, we can place E on top of C and D, then A on top of G and E.
> ```
>
> **Example 2:**
>
> ```.
> Input: bottom = "AABA", allowed = ["AAA", "AAB", "ABA", "ABB", "BAC"]:
> Output: false
> Explanation:
> We can't stack the pyramid to the top.
> Note that there could be allowed triples (A, B, C) and (A, B, D) with C != D....
> ```
>
> **Constraints:**
>
> - `bottom` will be a string with length in range `[2, 8]`.
> - `allowed` will have length in range `[0, 200]`.
> - Letters in all strings will be chosen from the set `{'A', 'B', 'C', 'D', 'E', 'F', 'G'}`.

```java
class Solution {
    Map<String, List<String>> map;

    public boolean pyramidTransition(String bottom, List<String> allowed) {
        map = new HashMap<>();
        for(String s : allowed) {
            String key = s.substring(0, 2);
            String value = s.substring(2, 3);
            map.putIfAbsent(key, new ArrayList<>());
            map.get(key).add(value);
        }
        return solve(bottom);
    }

    private boolean solve(String bottom) {
        if(bottom.length() == 1) {
            return true;
        }
        List<String> nextBottoms = new ArrayList<>();
        generateNextBottoms(bottom, nextBottoms, "", 0);
        for(String next : nextBottoms) {
            if(solve(next)) {
                return true;
            }
        }
        return false;
    }

    private void generateNextBottoms(String bottom, List<String> res, String cur, int i) {
        if(cur.length() == bottom.length() - 1) {
            res.add(cur);
            return;
        }
        String key = bottom.substring(i, i + 2);
        if(!map.containsKey(key)) {
            return;
        }
        List<String> values = map.get(key);
        for(String c : values) {
            generateNextBottoms(bottom, res, cur + c, i + 1);
        }
    }
}
```
