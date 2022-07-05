---
title: "Shell Learning Notes Parameters"
date: 2022-05-01T02:22:52+08:00
draft: false
ShowToc: true
categories: [Shell]
tags: [linux,bash,shell,notes]
cover:
    image: "images/Gnu-bash-logo.svg"
    alt: "Bash Logo"
    relative: false
---
# Pass Parameters

When you are running a shell script and you want to pass some parameters into the script, you can get the parameters by `$n`.

The `n` represents a number, the `1` is meant for the first parameters you pass to the script, the `2` is the second parameters you pass to the script, and so on.

Note that the `0` is the script fine name.

Example:

```bash
#!/usr/bin/bash

echo "Parameters Example:"
echo "The Script File Name: \"$0\""
echo "The First Parameters: \"$1\""
echo "The Second Parameters: \"$2\""
echo "The Third Parameters: \"$3\""
echo "The Forth Parameters: \"$4\""
```

Run this script:

```bash
➜ ./test.sh first second third fourth
Parameters Example:
The Script File Name: "./test.sh"
The First Parameters: "first"
The Second Parameters: "second"
The Third Parameters: "third"
The Forth Parameters: "fourth"
```

Some special characters to solve the parameters:

| args | explanation                                                  |
| ---- | ------------------------------------------------------------ |
| `$#` | The number of arguments passed to the script.                |
| `$*` | Displays all parameters passed to the script as a single string. |
| `$$` | The current process ID number of the script running.         |
| `$!` | ID number of the last process running in the background.     |
| `$@` | Same as `$*`, but returns each argument as in array.         |
| `$-` | Displays the current options used by the shell, which has the same function as the **set** command. |
| `$?` | Displays the exit status of the last command. 0 means no error, any other value means there is an error. |

Example:

```bash
#!/usr/bin/bash

echo "Parameters Example:"
echo "The Script File Name: \"$0\""
echo "The Number of Parameters: $#"
echo "All Parameters: \"$*\""
echo "Script PID: $$"
```

Run this script:

```bash
➜ ./test.sh first second third fourth fifth
Parameters Example:
The Script File Name: "./test.sh"
The Number of Parameters: 5
All Parameters: "first second third fourth fifth"
Script PID: 25504
```

Different between `$*` and `$@`:

- `$*` return one args, which means `1 2 3` as a single string.
- `$@` return array of args, which means `1` `2` `3` as a array.

Example:

```bash
#!/usr/bin/bash

echo "-- Example For \$* ---"
for i in "$*"; do
    echo $i
done

echo "-- Example For \$@ ---"
for i in "$@"; do
    echo $i
done
```

Run this script:

```bash
➜ ./test.sh first second third fourth fifth
-- Example For $* ---
first second third fourth fifth
-- Example For $@ ---
first
second
third
fourth
fifth
```

## Refer Link

- <https://www.runoob.com/linux/linux-shell-passing-arguments.html>
