---
title: "Shell Learning Notes Comment"
date: 2022-05-01T02:25:48+08:00
draft: true
ShowToc: true
categories: [Shell]
tags: [linux,bash,shell,notes]
cover:
    image: "images/Gnu-bash-logo.svg"
    alt: "Bash Logo"
    relative: false
---
# Shell Comment

Start with `#`

```bash
# this is a line of comment
```

Simply write more with `#` start

```bash
# Author: Aimer Neige
# Email: aimer.neige@aimerneige.com
# Date: 2022-04-29
```

Other way:

```bash
:<<EOF
Author: Aimer Neige
Email: aimer.neige@aimerneige.com
Date: 2022-04-29
EOF
```

```bash
:<<'
Author: Aimer Neige
Email: aimer.neige@aimerneige.com
Date: 2022-04-29
'
```

```bash
:<<!
Author: Aimer Neige
Email: aimer.neige@aimerneige.com
Date: 2022-04-29
!
```

## Refer Link

- <https://www.runoob.com/linux/linux-shell-variable.html>
