---
title: "Golang embed"
date: 2022-08-13T23:57:11+08:00
draft: false
ShowToc: true
categories: [Go]
tags: [golang,embed]
cover:
    image: "images/go-embed.webp"
    alt: "Golang embed"
    relative: false
---

# 前言

在写项目的时候，有时候不可避免地要处理静态文件，如果将源码直接作为软件提供问题不大，使用相对路径读取这些静态文件就可以了。但是如果项目作为库向外公布显然不可行，使用相对路径是读取不到文件的，而使用绝对路径却会带来更大的问题：因为不同的人使用，路径绝对不可能完全一致的。如果要求用户在指定路径下放置这些依赖的静态文件，虽然可行但是会给用户带来很大的困扰，而且这样的实现方式显然不够优雅。这时候，将这些静态文件一起打包进可执行文件似乎是一个完美的解决方案，那么如何实现呢？最简单的方法是硬编码，将静态文件以文本或字节数组的形式直接编入源代码，go 也有一些库帮你自动生成代码，比如 [go-bindata](https://github.com/jteeuwen/go-bindata)。很明显，这个库已经终止维护了，这是因为在 go 1.16 版本，官方发布了 [embed](https://pkg.go.dev/embed) 完美地解决了这个问题。本文简要介绍 embed 的一些基础用法。

# embed

假设我们有一个文件 `hello.txt`

```txt
Hello World!
Hello go embed!
```

我们要写一个程序读取其中的内容并输出到终端：

```go
// file: main.go
package main

import (
	"fmt"
	"os"
)

func main() {
	s, err := os.ReadFile("./hello.txt")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(s))
}
```

很简单，不是吗？

```bash
➜ tree .
.
├── go.mod
├── hello.txt
└── main.go

0 directories, 3 files

➜ go build main.go

➜ ./main                             
Hello World!
Hello go embed!
```

但是如果 `hello.txt` 这个文件不存在的话，我们再次运行程序：

```bash
➜ rm hello.txt

➜ tree .
.
├── go.mod
├── main
└── main.go

0 directories, 3 files

➜ ./main  
panic: open ./hello.txt: no such file or directory

goroutine 1 [running]:
main.main()
	/home/aimerneige/Code/go/go-embed-tutorial/main.go:11 +0x96
exit status 2
```

显然，因为读取不到文件，程序在第 11 行 panic 了。那么如何将 `hello.txt` 也一并打包入可执行文件呢？

我们先不使用 embed，而是直接将文件内容硬编码，我们就会得到这样的代码：

```go
// file: main.go
package main

import (
	"fmt"
)

var f string = `Hello World!
Hello go embed!`

func main() {
	fmt.Println(f)
}
```

显然我们可以得到相同的结果：

```bash
➜ go build main.go

➜ tree .
.
├── go.mod
├── main
└── main.go

0 directories, 3 files

➜ ./main 
Hello World!
Hello go embed!
```

这里，我们使用了一个字符串 `f` 来存储文件中的内容。但是直接将文本内容放入源代码十分不优雅，尤其是当文本文件内容较多的时候，源代码就会太混乱，改动也比较麻烦。

接下来，我们恢复文件 `hello.txt` 后使用 embed 来优化它：

```go
// file: main.go
package main

import (
	_ "embed"
	"fmt"
)

//go:embed hello.txt
var f string

func main() {
	fmt.Println(f)
}
```

首先，我们下划线引入了一个包 `_　"embed"`，这样做是为了引入 `embed` 包来执行它的 `init` 函数而不使用它。有了这个包以后，我们就可以以注释的方式来将一个文件的内容绑定到一个变量上：

```go
//go:embed hello.txt
var f string
```

这个变量就会以字符串的形式存储文件 `hello.txt` 中的数据。

这时候，我们在 `hello.txt` 文件存在的情况下编译程序：

```bash
➜ go build main.go

➜ ./main 
Hello World!
Hello go embed!
```

简单执行文件我们当然可以得到相同的输出，但是如果这个时候我们删除 `hello.txt` 会发生什么呢？

```bash
➜ rm hello.txt

➜ tree .
.
├── go.mod
├── main
└── main.go

0 directories, 3 files

➜ ./main 
Hello World!
Hello go embed!
```

正如预期的那样，我们依然得到了相同的输出，这是因为 `hello.txt` 中的内容已经编码到了可执行文件中了。

类似地，我们还可以将图片编码为字节数组：

```go
// file: main.go
package main

import (
	"bytes"
	_ "embed"
	"image/jpeg"
	"image/png"
	"os"
)

//go:embed avatar.jpg
var imgData []byte

func main() {
	img, err := jpeg.Decode(bytes.NewReader(imgData))
	if err != nil {
		panic(err)
	}
	f, err := os.Create("./avatar.png")
	if err != nil {
		panic(err)
	}
    defer f.Close()
	png.Encode(f, img)
}
```

```bash
➜ tree .
.
├── avatar.jpg
├── go.mod
└── main.go

0 directories, 3 files
```

此时，我们编译 `main.go`，得到的可执行文件可以在任意目录下执行，并且都会在同级目录下输出一个 `avatar.png`。

```bash
➜ go build main.go

➜ rm avatar.jpg

➜ ./main

➜ tree .
.
├── avatar.png
├── go.mod
├── main
└── main.go

0 directories, 4 files
```

注意 embed 的路径是相对于源代码文件而言的。如下例：

```
➜ tree . 
.
├── go.mod
├── hello.txt
├── internal
│   ├── asserts
│   │   └── example.png
│   ├── internal.go
│   └── internal.txt
└── main.go

2 directories, 6 files
```

```go
// file: internal/internal.go
package internal

import (
	_ "embed"
)

//go:embed internal.txt
var txt string

//go:embed asserts/example.png
var png []byte
```

在 `internal` 包中，我们引用的俩个文件 `internal/internal.txt` 和 `internal/asserts/example.png` 的路径不是项目的相对路径，而是源文件 `internal/internal.go` 的相对路径。

上面的写法已经能够覆盖大部分的场景了，但是，如果我们的文件很多要怎么办呢？这时就需要使用 `embed.FS`。`embed.FS` 可以将文件或文件夹打包入可执行文件，并抽象为 `FS` 以供调用：

```go
// file: main.go
package main

import (
	"bytes"
	"embed"
	"fmt"
	"image/png"
	"io/fs"
)

//go:embed resources/images
var images embed.FS

//go:embed resources/text
var texts embed.FS

//go:embed resources
var resources embed.FS

func main() {
	// read images
	for i := 1; i <= 5; i++ {
		filePath := fmt.Sprintf("resources/images/Screenshot-%d.png", i)
		imgFile, err := fs.ReadFile(images, filePath)
		if err != nil {
			panic(err)
		}
		image, err := png.Decode(bytes.NewReader(imgFile))
		if err != nil {
			panic(err)
		}
		fmt.Printf("size of %s: %dx%d\n", filePath, image.Bounds().Dx(), image.Bounds().Dy())
	}
	// read text
	for i := 1; i <= 2; i++ {
		filePath := fmt.Sprintf("resources/text/example%d.txt", i)
		example, err := texts.ReadFile(filePath)
		if err != nil {
			panic(err)
		}
		fmt.Printf("text of %s: %s\n", filePath, string(example))
	}
	// read sub dir file
	license, err := resources.ReadFile("resources/license/LICENSE")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(license))
}
```

```bash
➜ tree .            
.
├── go.mod
├── main.go
└── resources
    ├── images
    │   ├── Screenshot-1.png
    │   ├── Screenshot-2.png
    │   ├── Screenshot-3.png
    │   ├── Screenshot-4.png
    │   └── Screenshot-5.png
    ├── license
    │   └── LICENSE
    └── text
        ├── example1.txt
        └── example2.txt

4 directories, 10 files

➜ cat resources/license/LICENSE  
EXAMPLE LICENSE FILE

➜ cat resources/text/example1.txt 
example 1

➜ cat resources/text/example2.txt
example 2

➜ go build main.go 

➜ ./main 
size of resources/images/Screenshot-1.png: 1920x1080
size of resources/images/Screenshot-2.png: 1920x1080
size of resources/images/Screenshot-3.png: 1920x1080
size of resources/images/Screenshot-4.png: 1920x1080
size of resources/images/Screenshot-5.png: 1920x1080
text of resources/text/example1.txt: example 1
text of resources/text/example2.txt: example 2
EXAMPLE LICENSE FILE

➜ rm resources -rf

➜ tree .
.
├── go.mod
├── main
└── main.go

0 directories, 3 files

➜ ./main 
size of resources/images/Screenshot-1.png: 1920x1080
size of resources/images/Screenshot-2.png: 1920x1080
size of resources/images/Screenshot-3.png: 1920x1080
size of resources/images/Screenshot-4.png: 1920x1080
size of resources/images/Screenshot-5.png: 1920x1080
text of resources/text/example1.txt: example 1
text of resources/text/example2.txt: example 2
EXAMPLE LICENSE FILE
```

要注意的是，我们读取文件时提供的路径一定是完整的相对路径。

`embed.FS` 在 http 静态服务中非常有用：

`main.go`

```go
// file: main.go
package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
)

//go:embed public
var public embed.FS

func main() {
	mux := http.NewServeMux()
	mux.Handle("/", handler())
	http.ListenAndServe(":8080", mux)
}

func handler() http.Handler {
	f := fs.FS(public)
	html, err := fs.Sub(f, "public")
	if err != nil {
		panic(err)
	}
	fmt.Println("Server start at http://127.0.0.1:8080/")
	return http.FileServer(http.FS(html))
}
```

`index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>This is a simple example index.html</p>
    <p>Click About bellow to see about page.</p>
    <a href="./about.html">About</a>
</body>
</html>
```

`about.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>About</title>
</head>
<body>
    <h1>About</h1>
    <p>This is a simple about.html page.</p>
    <p>Click bellow Index to back to index page.</p>
    <a href="./index.html">Index</a>
</body>
</html>
```

```bash
➜ tree .
.
├── go.mod
├── main.go
└── public
    ├── about.html
    └── index.html

1 directory, 4 files
```

当然还有很多其他神奇玩法，这里只介绍最基本的用法，其他大家发挥想象力。

# 参考链接

- [embed](https://pkg.go.dev/embed)