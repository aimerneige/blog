---
title: "如何给 Go 的结构体添加多个 tag"
date: 2023-02-26T12:48:36+08:00
draft: false
ShowToc: true
categories: [Go]
tags: [golang]
---

> 本来很简单的东西，但是老忘，干脆写个博客吧

### 正确写法

```go
type Page struct {
    PageId string                 `bson:"pageId",json:"pageId"`
    Meta   map[string]interface{} `bson:"meta",json:"pageId"`
}
```

### 错误写法

```go
type Page struct {
    PageId string                 `bson:"pageId" json:"pageId"`
    Meta   map[string]interface{} `bson:"meta" json:"pageId"`
}
```

### 很多 Tag

```go
Items []Item `gorm:"column:items,type:varchar(255);comment:'sample column'" json:"items"`
```

### 参考链接

- [StackOverflow - How to define multiple name tags in a struct](https://stackoverflow.com/questions/18635671/how-to-define-multiple-name-tags-in-a-struct)
