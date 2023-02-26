---
title: "How to Add Multiple Tags to Go Struct"
date: 2023-02-26T12:48:36+08:00
draft: false
ShowToc: true
categories: [Go]
tags: [golang]
cover:
    image: "images/GO-Development-Banner.jpg"
    alt: "go banner"
    relative: false
---

> It is easy but always be forgotten, so write this post

### Correct

```go
type Page struct {
    PageId string                 `bson:"pageId",json:"pageId"`
    Meta   map[string]interface{} `bson:"meta",json:"pageId"`
}
```

### Incorrect

```go
type Page struct {
    PageId string                 `bson:"pageId" json:"pageId"`
    Meta   map[string]interface{} `bson:"meta" json:"pageId"`
}
```

### More tags

```go
Items []Item `gorm:"column:items,type:varchar(255);comment:'sample column'" json:"items"`
```

### Links

- [StackOverflow - How to define multiple name tags in a struct](https://stackoverflow.com/questions/18635671/how-to-define-multiple-name-tags-in-a-struct)
