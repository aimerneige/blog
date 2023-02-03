---
title: "Golang Context"
date: 2023-02-03T23:29:21+08:00
draft: false
ShowToc: true
categories: [Go]
tags: [golang,channel,context]
cover:
    image: "images/go-context.png"
    alt: "Golang Context"
    relative: false
---

## 前言

有时我们要通过第三方服务获取数据，它可以是外部提供的 API，也可以是微服务的接口等等，总之，它们有相同的问题：“获取数据可能需要大量时间”。如果在代码中同步地获取这些数据，程序就会花时间等待这些服务响应，而这些等待会严重影响程序的运行效率，而且一旦这些服务崩溃，我们的程序就会陷入无休止的等待中，那么如何解决这个问题呢？可以使用 Go 的 context 包。

## 问题

我们用这个函数来替代那些第三方服务。我们直接使用 `time.Sleep()` 函数来模拟一个耗时过程，在现实场景中，它可能是在执行一个非常复杂的 SQL 查询，也可以是调用一个人工智能服务接口。当然，这个耗时是不确定的，甚至有可能是无穷大（卡死）。

```go
func fetchThirdPartyStuffWhichCanBeSlow() (int, error) {
	time.Sleep(time.Millisecond * 500)

	return 64, nil
}
```

如果我们不做任何处理，直接调用这个函数，就像这样：

```go
func foo() {
	// some code here ...

	val, err := fetchThirdPartyStuffWhichCanBeSlow()
	if err != nil {
		log.Fatal(err)
	}

	// some code here ...
}
```

上面的代码如果用在一些只执行一次的脚本、工具中，并不会带来严重后果，无非多等一下就好了，即使有问题也可以关掉程序检查一下第三方服务。但是如果上面的代码用在一个承载大流量的 web 服务中，程序在执行完耗时代码后还要继续执行一些重要的业务功能，那么这样直接调用而不加考虑的代码很可能是致命的。一旦第三方服务出现问题，程序没有任何机制检查和处理，而是直接陷入无休止的等待。这显然是不合理的。

## 解决方案

要解决上述的问题，比较常见的思路是引入一个主动停止耗时服务的功能，这样如果耗时函数花了太多时间执行，程序就可以感知到，并主动干预。

在后文中，我们假设我们要使用用户的 ID 访问用户的数据，且调用三方服务的代码被单独封装为 `fetchUserData()`。

### 使用 Channel

如果不使用本文要介绍的 Context，传统的思路是使用 Channel + Select 来处理：

```go
type Response struct {
	value int
	err   error
}

func fetchUserData(userID int) (int, error) {
	stop := make(chan bool)
	respch := make(chan Response)

	go func() {
		val, err := fetchThirdPartyStuffWhichCanBeSlow()
		respch <- Response{
			value: val,
			err:   err,
		}
	}()

	go func() {
		time.Sleep(time.Millisecond * 200)
		stop <- true
	}()

	for {
		select {
		case <-stop:
			return 0, fmt.Errorf("fetching data from third party took to long")
		case resp := <-respch:
			return resp.value, resp.err
		}
	}
}
```

这里我们使用 stop 这个 Channel 来发送停止信号，在程序执行超过指定时间时关掉终止等待并报错，而 respch 用来接受返回值。在程序的最后，使用 select 来接受 Channel 的信号，当检测到超时或执行完成时返回结果。

### 使用 Context

Context 的基础用法其实就是对上述代码的优化：

```go
func foo() {
	// some code here ...
	
	ctx := context.Background()
	val, err := fetchUserData(ctx, userID)
	
	// some code here ...
}

type Response struct {
	value int
	err   error
}

func fetchUserData(ctx context.Context, userID int) (int, error) {
	ctx, cancel := context.WithTimeout(ctx, time.Millisecond*200)
	defer cancel()
	respch := make(chan Response)

	go func() {
		val, err := fetchThirdPartyStuffWhichCanBeSlow()
		respch <- Response{
			value: val,
			err:   err,
		}
	}()

	for {
		select {
		case <-ctx.Done():
			return 0, fmt.Errorf("fetching data from third party took to long")
		case resp := <-respch:
			return resp.value, resp.err
		}
	}
}
```

这里，我们新建了一个 context：`ctx, cancel := context.WithTimeout(ctx, time.Millisecond*200)`

这个 context 带超时检测，超时后它会自动发出 `ctx.Done()` 这个信号，我们只需要在最后监测它即可。

### 传递数据

除了直接使用超时机制外，我们也可以通过 Context 传递数据：

```go
func foo() {
	// some code here ...
	
	ctx := context.WithValue(context.Background(), "foo", "bar")
	val, err := fetchUserData(ctx, userID)
	
	// some code here ...
}

func fetchUserData(ctx context.Context, userID int) (int, error) {
	value := ctx.Value("foo")
	fmt.Println(value)

	// some code here ...
}
```

### 优势在哪儿

使用 Context 可以减少 Channel 的使用，尤其是调用层级非常深时，使用 Channel 来传递关闭信号非常复杂，而 Context 可以轻松地传递关闭信号。

## 参考链接

- [YouTube - How To Use The Context Package In Golang?](https://www.youtube.com/watch?v=kaZOXRqFPCw)
- [YouTube - [Go 語言] 用 10 分鐘了解 context 使用場景及介紹](https://www.youtube.com/watch?v=yXmPkSNByjY)
