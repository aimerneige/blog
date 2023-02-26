---
title: "Go 图像处理基础"
date: 2022-08-12T22:40:28+08:00
draft: false
ShowToc: true
categories: [Go]
tags: [golang,image]
cover:
    image: "images/go-image-processing-basic.webp"
    alt: "go image processing"
    relative: false
---

# 前言

Go 语言的官方包 [image](https://pkg.go.dev/image) 和 [image/color](https://pkg.go.dev/image/color) 定义了非常多的类型，涵盖了很多的图像处理基础内容，本文简单介绍这些库中的基本概念和使用方法。

# 常见类型介绍

## Colors

[Colors](https://pkg.go.dev/image/color#Color) 是一个接口，它的代码如下：

```go
type Color interface {
	// RGBA returns the alpha-premultiplied red, green, blue and alpha values
	// for the color. Each value ranges within [0, 0xffff], but is represented
	// by a uint32 so that multiplying by a blend factor up to 0xffff will not
	// overflow.
	//
	// An alpha-premultiplied color component c has been scaled by alpha (a),
	// so has valid values 0 <= c <= a.
	RGBA() (r, g, b, a uint32)
}
```

简单来说，它定义了一个函数，它将任意类型的颜色转化为 rgba 值。这个转化过程可能是有损失的，比如转化 `CMYK` 或 `YCbCr` 颜色空间的颜色。

`Color` 的 rgba 值都是经过了 alpha 预乘的。

`Color` 定义的 rgba 值类型是 `uint32`，但是它存储的颜色是 16 位色深，也就是其最大值为 65535，这样做为了兼容一些算法，以防止在某些乘法运算中出现溢出[^1]。

## RGBA

`image/color` 包同样定义了很多实现了 `Color` 接口的颜色类型，例如 [RGBA](https://pkg.go.dev/image/color#RGBA)，它的代码如下：

```go
type RGBA struct {
    R, G, B, A uint8
}
```

它简单地实现了经典的“8 bit 色深”颜色。

请注意，`RGBA` 的 R 字段是 [0, 255] 范围内的 8 位 alpha 预乘颜色。 RGBA 通过将该值乘以 0x101 来满足 Color 接口，以生成 [0, 65535] 范围内的 16 位 alpha 预乘颜色。 类似地，`NRGBA` 结构类型表示 8 位非 alpha 预乘颜色，如 PNG 图像格式所使用的那样。 直接操作 `NRGBA` 的字段时，值是非 alpha 预乘的，但在调用 RGBA 方法时，返回值是 alpha 预乘的。

## Model

[Model](https://pkg.go.dev/image/color#Model) 是一个可以将 `Colors` 转化为其他 `Colors` 的接口，这个转化可能是有损失的。例如，`GrayModel` 可以将任何颜色转换为去饱和的灰色 [Gray](https://pkg.go.dev/image/color#Gray)。
`Palette` 可以将任意颜色转化为有限的调色板中的一种颜色。

```go
type Model interface {
    Convert(c Color) Color
}

type Palette []Color
```

## Points

一个 [Points](https://go.dev/pkg/image/#Point) 是一个整数网格上的 (x, y) 的坐标，轴向右和向下递增。它既不是像素也不是方格。它是一个没有宽度，高度和颜色的点。下图中为了可视化，使用了带有彩色的方块。

```go
type Point struct {
    X, Y int
}
```

![points](https://go.dev/blog/image/image-package-01.png)

```go
p := image.Point{2, 1}
```

## Rectangles

一个 [Rectangle](https://go.dev/pkg/image/#Rectangle) 是整数网格上的轴对称矩形，它由俩个点来定义：它左上角的点和右下角的点。与点类似，矩形也没有颜色，但是下面图片为了可视化而使用了带有颜色的细线勾画出矩形，同时标出了他们的最小和最大点。

```go
type Rectangle struct {
    Min, Max Point
}
```

为了方便，`image.Rect(x0, y0, x1, y1)` 等价于 `image.Rectangle{image.Point{x0, y0}, image.Point{x1, y1}}`，但是书写起来更加容易。

左边和上边被包括在矩形内，而右边和下边不包括在矩形内。即对于一个点 p 和一个矩形 r,p 来说，`In(p)` 当且仅当 `r.Min.X <= p.X && p.X < r.Max.X` 时成立，对 Y 同理。这非常类似于切片 `s[i0:i1]` 包括 i0 而不包括 i1 一样。（与数组和切片不同，矩形经常包含有非零的原点）

![rectangles](https://go.dev/blog/image/image-package-02.png)

```go
r := image.Rect(2, 1, 5, 5)
// Dx 和 Dy 返回一个矩形的宽和高
fmt.Println(r.Dx(), r.Dy(), image.Pt(0, 0).In(r)) // prints 3 4 false
```

将点加入矩形 `Add()` 会平移矩形。点和矩形并非局限于右下象限。

![rectangles-2](https://go.dev/blog/image/image-package-03.png)

```go
r := image.Rect(2, 1, 5, 5).Add(image.Pt(-4, -2))
fmt.Println(r.Dx(), r.Dy(), image.Pt(0, 0).In(r)) // prints 3 4 true
```

俩个矩形相交 `Intersect()` 会生成另一个矩形，它可能是空的。

![rectangles 3](https://go.dev/blog/image/image-package-04.png)

```go
r := image.Rect(0, 0, 4, 3).Intersect(image.Rect(2, 2, 5, 5))
// Size 返回一个矩形的宽和高，作为一个点
fmt.Printf("%#v\n", r.Size()) // prints image.Point{X:2, Y:1}
```

点 `Point` 和矩形 `Rectangles` 以值传递的方式返回值。将一个 `Rectangle` 作为 argument 传入一个函数相当于传入俩个 `Point` 或四个 `int`。

## Images

一个 [Image](https://go.dev/pkg/image/#Image) 将 `Rectangle` 中的每个正方形网格映射到某种 `Model` 的 `Color`。"The pixel at (x, y)" 是指由点 (x, y)，(x+1, y)，(x+1, y+1) 和 (x, y+1) 定义的正方形网格的颜色。

```go
type Image interface {
	// ColorModel returns the Image's color model.
	ColorModel() color.Model
	// Bounds returns the domain for which At can return non-zero color.
	// The bounds do not necessarily contain the point (0, 0).
	Bounds() Rectangle
	// At returns the color of the pixel at (x, y).
	// At(Bounds().Min.X, Bounds().Min.Y) returns the upper-left pixel of the grid.
	// At(Bounds().Max.X-1, Bounds().Max.Y-1) returns the lower-right one.
	At(x, y int) color.Color
}
```

一个常见的错误是认为图像的 `Bounds` 开始于 (0, 0)。例如，一个 GIF 动画包含一系列图像，第一个图像之后的每个图像通常只保存更改区域的像素数据，并且该区域不一定从 (0, 0) 开始。正确地遍历一个 Image 的像素的方法如下：

```go
b := m.Bounds()
for y := b.Min.Y; y < b.Max.Y; y++ {
    for x := b.Min.X; x < b.Max.X; x++ {
        doStuffWith(m.At(x, y))
    }
}
```

`Image` 的实现并不一定基于内存切片中的像素数据。例如，`Uniform` 表示一个具有巨大边界和统一颜色的图像，其内存就表示该颜色。

```go
type Uniform struct {
    C color.Color
}
```

但是，通常地，程序需要一个基于切片的，存储着像是 `RGBA` 和 `Gray`（其包引用位 image.RGBA 和 image.Gray）这样的数据结构类型的像素数据，并且实现了 `Image` 接口的图像。

```go
type RGBA struct {
    // Pix holds the image's pixels, in R, G, B, A order. The pixel at
    // (x, y) starts at Pix[(y-Rect.Min.Y)*Stride + (x-Rect.Min.X)*4].
    Pix []uint8
    // Stride is the Pix stride (in bytes) between vertically adjacent pixels.
    Stride int
    // Rect is the image's bounds.
    Rect Rectangle
}
```

这些类型同样提供了一个 `Set(x, y int, c color.Color)` 方法来允许一次修改图片的一个像素。

```go
m := image.NewRGBA(image.Rect(0, 0, 640, 480))
m.Set(5, 5, color.RGBA{255, 0, 0, 255})
```

如果你在读或写大量的像素数据，直接读写这些结构中的 Pix 字段会更有效，同时也更复杂。

基于切片的 Image 实现还提供了 `SubImage` 方法。它可以返回同一组数组下的 `Image`。修改子图片的像素会影响原图的像素，类似修改子切片 `s[i0:i1]` 同样会影响原始切片 `s` 一样。

![images](https://go.dev/blog/image/image-package-05.png)

```go
m0 := image.NewRGBA(image.Rect(0, 0, 8, 5))
m1 := m0.SubImage(image.Rect(1, 2, 5, 5)).(*image.RGBA)
fmt.Println(m0.Bounds().Dx(), m1.Bounds().Dx()) // prints 8, 4
fmt.Println(m0.Stride == m1.Stride)             // prints true
```

对于一些处理图片的 `Pix` 的底层代码，应该小心对于 `Pix` 的访问越界会影响图片边界外的像素。在上面的示例代码中，`m1.Pix` 覆盖的像素用蓝色阴影进行标注。而一些顶层代码，例如 `At` 和 `Set` 方法，或是 [image/draw](https://go.dev/pkg/image/draw/) 包将会限制它们的操作在图片的边界内。

## Image Formats

Go 语言标准库支持多种常见的图像格式，例如 GIF、JPEG 和 PNG。如果你知道源图像的文件格式，可以直接使用 [io.Reader](https://go.dev/pkg/io/#Reader) 进行解码。

```go
import (
    "image/jpeg"
    "image/png"
    "io"
)

// convertJPEGToPNG converts from JPEG to PNG.
func convertJPEGToPNG(w io.Writer, r io.Reader) error {
    img, err := jpeg.Decode(r)
    if err != nil {
        return err
    }
    return png.Encode(w, img)
}
```

如果你有一张未知格式的图片，[image.Decode](https://go.dev/pkg/image/#Decode) 函数可以自动检测格式。可识别的格式是在运行时构建的，不限于标准库中的格式。图像格式包通常在 init 函数中注册其格式，main 包将“下划线引入”这样的包，不适用而仅仅为了注册其格式。

```go
import (
    "image"
    "image/png"
    "io"

    _ "code.google.com/p/vp8-go/webp"
    _ "image/jpeg"
)

// convertToPNG converts from any recognized format to PNG.
func convertToPNG(w io.Writer, r io.Reader) error {
    img, _, err := image.Decode(r)
    if err != nil {
        return err
    }
    return png.Encode(w, img)
}
```

# 参考链接

> https://go.dev/blog/image

[^1]: https://en.wikipedia.org/wiki/Alpha_compositing
