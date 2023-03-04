---
title: "Hello World"
date: 2020-01-24T15:50:47+08:00
draft: false
ShowToc: true
MathJax: true
mermaid: true
categories: [Others]
tags: [others]
---

# Welcome

Welcome!

# HelloWorld

This is a simple test for my first blog article.

## Mathjax

- Test 1

$$a_{PI}(x|D) = E[u(x) | x, D] = \int_{-\infty}^{f'} \mathcal{N}(f; \mu(x), \kappa(x, x)) \ df
=\phi(f'; \mu(x), \kappa(x, x))$$

- Test 2

$$\frac{e}{\left( e+e^{\pi} - \pi^{e}\right) \,\left(  - e+\pi^{e}\right) }+{E(\left( e+\pi\right) \,\left( 2\,e+\pi\right) )}^{e}$$

## C

```c
#include <stdio.h>
int main()
{
  printf("HelloWorld!\n");
  return 0;
}
```

## C++

```cpp
#include <iostream>
int main()
{
    std::cout << "HelloWorld!" << std::endl;
    return 0;
}
```

## Java

```java
public class Main {
  public static void main(String[] args) {
      System.out.println("HelloWorld!");
  }
}
```

## Python

```python
print("HelloWorld!")
```

## Go

```go
package main

import "fmt"

func main() {
    fmt.Println("HelloWorld!")
}
```

## Hidden Text

{{< heimu >}}

Hidden Text

{{< /heimu >}}

## Mermaid

{{< mermaid >}}
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!
{{< /mermaid >}}

## Gallery

Yalong Bay No.2, Longhai Road No., Jinyang, Sanya, Hainan China

{{< gallery hover-effect="grow" >}}
  {{< figure link="images/gallery/Hainan/1.jpg" >}}
  {{< figure link="images/gallery/Hainan/2.jpg" >}}
  {{< figure link="images/gallery/Hainan/3.jpg" >}}
{{< /gallery >}}
{{< load-photoswipe >}}
