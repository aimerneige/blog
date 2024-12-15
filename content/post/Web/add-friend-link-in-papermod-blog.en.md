---
title: "Add Friend Link in PaperMod Blog"
date: 2023-03-12T13:25:06+08:00
draft: false
ShowToc: true
categories: [Web]
tags: [blog,papermod,css]
cover:
    image: "images/friend-link.png"
    alt: "Friend Link"
    relative: false
---

PaperMod is a good hugo blog theme, but it did not support a friend link officially. So you need to do some simple customize.

## Full Code

Put this shortcode into `layouts/shortcodes/friends.html`


```html
<style type="text/css">
    .friends {
        --link-count-per-row: 1;
    }

    @media screen and (min-width: 576px) {
        .friends {
            --link-count-per-row: 2;
        }
    }

    @media screen and (min-width: 768px) {
        .friends {
            --link-count-per-row: 3;
        }
    }

    .friends {
        display: grid;
        grid-template-columns: repeat(var(--link-count-per-row), 1fr);
        grid-gap: 16px;
    }

    /* 空间占位 */
    .friend-skeleton {
        height: 280px;
        display: inline-block;
        position: relative;
    }

    .friend {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        transition: 0.67s cubic-bezier(0.19, 1, 0.22, 1);
        border-radius: var(--radius);
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
            0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12) !important;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .friend:hover {
        transform: translateY(-8px);
        box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
            0 5px 8px 0 rgba(0, 0, 0, 0.14), 0 1px 14px 0 rgba(0, 0, 0, 0.12) !important;
    }

    .friend-avatar {
        object-fit: cover;
        width: 100%;
        height: 180px;
        margin: 0 !important;
        border-radius: 0 !important;
    }
    .friend-content {
        text-align: center;
        flex: 1;
        width: 100%;
        padding: 16px;
        background: var(--entry);
        transform: translate3d(0, 0, 0);
    }

    .friend-name {
        font-size: 1.2rem;
        font-weight: bold;
        transform: inherit;
    }

    .friend-description {
        font-size: 0.8rem;
        color: var(--secondary);
        transform: translate3d(0, 0, 0);
    }
</style>
<div class="friends">
    {{ range .Site.Data.friends }}
    <div class="friend-skeleton">
        <a href="{{ .link }}" target="_blank">
            <div class="friend">
                <img class="friend-avatar" src="{{ .image }}" />
                <div class="friend-content">
                    <div class="friend-name">{{ .title }}</div>
                    <div class="friend-description">{{ .intro }}</div>
                </div>
            </div>
        </a>
    </div>
    {{ end }}
</div>
<!-- style code by https://github.com/fissssssh -->
<!-- view https://github.com/fissssssh/fissssssh.github.io for more detail -->
```

## Usage

1. Add your friends in `data/friends.yml` like this:

```yml
- title: "伞"
  intro: "一只咸鱼的学习记录"
  link: "https://umb.ink/"
  image: "https://avatars.githubusercontent.com/u/53655863?v=4"
- title: "HelloWorld的小博客"
  intro: "这里是一个小白的博客"
  link: "https://mzdluo123.github.io/"
  image: "https://avatars.githubusercontent.com/u/23146087?v=4"
```

2. Use shortcodes like this in your post:

\{\{< friends >\}\}
