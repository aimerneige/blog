# blog

![Man hours](https://img.shields.io/endpoint?url=https%3A%2F%2Fmanhours.aiursoft.cn%2Fr%2Fgithub.com%2Faimerneige%2Fblog.json)

## About

[Aimer's Blog](https://aimerneige.com/) Powered by [Hugo](https://gohugo.io/) & [PaperMod](https://github.com/adityatelange/hugo-PaperMod/)

## Install

```bash
sudo apt install hugo
```

## Clone

```bash
git clone https://github.com/aimerneige/blog.git
git submodule update --init --recursive
```

## Update

```bash
git submodule update --remote --merge
```

## New Post

```bash
hugo new post/title.en.md
hugo new post/title.zh.md
```

## Serve

```bash
hugo serve -D
```

## Build

```bash
hugo
```

## Local Admin

Run `npm --prefix admin install` and `npm --prefix admin start` to manage content locally.
See [本地管理工具说明](admin/README.md) for usage, security boundaries, and tests.

## Deploy

```bash
bash ./deploy.sh
```
