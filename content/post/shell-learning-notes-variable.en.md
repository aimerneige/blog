---
title: "Shell Learning Notes Variable"
date: 2022-04-30T00:42:38+08:00
draft: false
ShowToc: true
description: "Learning notes for shell script variable"
categories: [Linux,shell]
tags: [linux,bash,shell,notes]
cover:
    image: "images/Gnu-bash-logo.svg"
    alt: "Bash Logo"
    relative: false
---
# Shell Variable

## Define Variable

You are not allowed to add `$` when defining a variable, while in php, you need it.

For example:

```bash
your_name="Aimer Neige"
```

Like other programming languages, you need to follow these rules:

1. You can only use letters, numbers, and underscores, and the first character can not be numbers.
1. You are not allowed to add space, use underscores `_` replace.
1. You are not allowed to use special characters.
1. You can not use any keywords  used by bash.

For example, right variable names:

```bash
RUNOOB
LD_LIBRARY_PATH
_var
var2
```

Wrong variable names:

```bash
?var=123
user*name=runoob
```

Except assign a variable with `=`, a statement is also right. For example:

```bash
for file in `ls /etc`
# or
for file in $(ls /etc)
```

Note that no spaces can be added to the sides of the equals sign.

```bash
# right
FOO="Hello"
echo $BAR

# wrong
BAR = "Hello"
echo $BAR
```

## Access Variable

If you want to use a variable, add `$` before the variable name:

```bash
your_name="Alice"
echo $your_name
echo ${your_name}
```

The `{}` can be ignored, but still recommend you add it. That is because when you are faced with this situation:

```bash
for skill in Ada Coffee Action Java; do
    echo "I am good at ${skill}Script"
done
```

If you ignore the `{}`, the script will think you want to access a variable named `skillScript`, which will cause some problems.

All of the variables you defined can be redefined:

```bash
your_name="Tom"
echo $your_name
your_name="Jack"
echo $your_name
```

Write a script in this way are right but note that if you assign a variable the second time, do not use `$` because the `$` only be used when you want to access it.

## Read-only Variable

Using the`readonly ` command can make a variable read-only.

```bash
#!/bin/bash

myUrl="https://www.google.com"
readonly myUrl
myUrl="https://aimerneige.com"
```

If you run this script, you will get this error output:

```bash
./test.sh: line 5: myUrl: readonly variable
```

## Delete Variable

You can delete a variable with `unset`.

```bash
unset variable_name
```

Variable can not be accessed after being deleted. Note that `unset` can not delete a read-only variable.

For example:

```bash
#!/bin/sh

myUrl="https://aimerneige.com"
unset myUrl
echo $myUrl
```

If you run this script, you will get noting for output.

## Variable Type

1. **local variable**: Define in a shell script, only available in the script.
2. **environment variable**: Define in the system environment, can be accessed by all of the program and shell scripts.
3. **shell variable**: Define in shell program, some of them are local variables and some of them are environment variables. These variables make sure the shell runs properly.

## Shell String

The string is the most used data structure. You can define a string with a single quote `'`, double quotes `"` or without quotation marks.

### single-quoted string

```bash
str='this is a string'
```

Limitations of single-quoted strings:

1. Any character in single quotes will be output as is, variables in single quoted strings are invalid;
2. A single quote cannot appear in a single quote string (even after using an escape character for a single quote), but it can appear in pairs and be used as string concatenation.

Enclosing characters in single quotation marks (‘) holds onto the literal value of each character within the quotes.  In simpler words, the shell will interpret the enclosed text within single quotes literally and will not interpolate anything including variables, backtracks, certain \ escapes, etc. <mark>No character in the single quote has special meaning. This is convenient when you do not want to use the escape characters to change the way the bash interprets the input string.</mark>

### double-quoted string

Example:

```bash
your_name="runoob"
str="Hello, I know you are \"$your_name\"! \n"
echo -e $str
```

Example output:

```bash
Hello, I know you are "runoob"!
```

Advantage of double-quoted string:

1. Variables can be enclosed in double quotes
2. Escape characters can appear in double quotes

Double quotes are similar to single quotes except that it allows the shell to interpret dollar sign ($), backtick(`), backslash(\) and exclamation mark(!). The characters have special meaning when used with double quotes, and before display, they are evaluated. A double quote may be used within double quotes by preceding it with a backslash.

### string concatenation

Example:

```bash
your_name="runoob"
# double-quoted string
greeting="hello, "$your_name" !"
greeting_1="hello, ${your_name} !"
echo $greeting  $greeting_1

# single-quoted string
greeting_2='hello, '$your_name' !'
greeting_3='hello, ${your_name} !'
echo $greeting_2  $greeting_3
```

Example output:

```bash
hello, runoob ! hello, runoob !
hello, runoob ! hello, ${your_name} !
```

### length of string

```bash
string="abcd"
echo ${#string} # output: 4
```

If the variable are array, `${#string}` is equivalent to `${#string[0]}`.

For Example:

```bash
string="abcd"
echo ${#string[0]} # output: 4
```

### extract substring

Assume there is a variable `var=http://www.aaa.com/123.htm`.

#### `#` operator, delete left characters, keep right characters

```bash
echo ${var#*//}
```

Where `var` is the variable name, the `#` sign is the operator, and `*//` means to delete the first `//`sign from the left and all characters on the left from the left.

In the example, delete `http://` and we got `www.aaa.com/123.htm`.

#### `##` operator, delete left characters, keep right characters

```bash
echo ${var##*/}
```

`##*/` means to delete the last (rightmost) `/` sign from the left and all characters to the left from it.

In the example, delete `http://www.aaa.com/` and we got `123.htm`

#### `%` operator, delete right characters, keep left characters

```bash
echo ${var%/*}
```

`%/*` means to delete the first `/` sign from the right and the characters to the right from it.

In the example, delete `/123.htm` and we got `http://www.aaa.com.`

#### `%%` operator, delete right characters, keep left characters

```bash
echo ${var%%/*}
```

`%%/*` means to delete the last (leftmost) `/` sign from the right and all characters to the right from it.

In the example, delete `//www.aaa.com/123.htm` and we got `http:`.

#### from left index with character counts

```bash
echo ${var:0:5}
```

Where `0` means start from the first character from left, and `5` means the total number of characters.

In the example, we got `http:`.

#### from left index to end

```bash
echo ${var:7}
```

The `7` means start from the 8th character from left and till the end.

In the example, we got `www.aaa.com/123.htm`.

#### from right index with character counts

```bash
echo ${var:0-7:3}
```

Where `0-7` means start from the 7th character from right, and the `3` means the total number of characters.

In the example, we got `123`.

#### from left index to start

```bash
echo ${var:0-7}
```

The `0-7` means start from the 7th character from right and till the end.

In the example, we got `123.htm`.

#### Note:

The index of the first character are 0.

### Search String

Find the position of the character `i` or `o` (whichever occurs first is counted)

```bash
string="runoob is a great site"
echo `expr index "$string" io` # output 4
```

> More about `expr` command:
>
> - <https://cheat.sh/expr>
> - <https://www.geeksforgeeks.org/expr-command-in-linux-with-examples/>

## Shell Array

You can use one-dimensional array in bash. (bash does not support multidimensional arrays)

There is no limit to the size of the array.

Similar to the C programming language, the elements of the array start to index with 0.

### define array

Define an array with brackets `()`, and separate all of the elements with space.

For example:

```bash
array_name=(value0 value1 value2 value3)
```

```bash
array_name=(
value0
value1
value2
value3
)
```

```bash
array_name[0]=value0
array_name[1]=value1
array_name[2]=value2
array_name[3]=value3
```

```bash
array_name[0]=value0
array_name[114514]=value114514
```

Subscripts can be no-continuous and the range is without any limit.

### access array

```bash
value=${array_name[3]}
```

Use `@` to access all of the elements:

```bash
echo ${array_name[@]}
```

### get array length

Similar to string:

```bash
# Get the number of array elements
length=${#array_name[@]}
# or
length=${#array_name[*]}
# Get the length of a single element of an array
length=${#array_name[3]}
```

## Refer Link

- <https://www.runoob.com/linux/linux-shell-variable.html>
- <https://www.geeksforgeeks.org/difference-between-single-and-double-quotes-in-shell-script-and-linux/>
