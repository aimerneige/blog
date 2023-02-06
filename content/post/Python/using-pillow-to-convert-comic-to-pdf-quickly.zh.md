---
title: "使用 pillow 库快速将漫画转化为 pdf 便于转发与阅读"
date: 2020-05-27T23:36:38+08:00
draft: false
ShowToc: true
categories: [Python]
tags: [python,tool]
---

## 介绍

使用安卓手机阅读一些漫画的时候，因为屏幕较小，查看文字的时候需要放大，很麻烦。博主虽然有一个 iPad4，屏幕够大，但是把这么多图片文件发送到 iPad 上面十分的麻烦，一天，偶然看到了一个 pdf 格式的漫画，在 iPad 上面的阅读体验十分棒，于是博主就打算写一个程序来将大量的漫画图片转化为 pdf 来方便在 iPad 上阅读。

查阅资料，我们会发现 [Pillow](https://github.com/python-pillow/Pillow) 这个第三方 python 库可以来处理图片，同时也可以将大量的图片转化为 pdf 文档。

简单地查看下 [官方文档](https://pillow.readthedocs.io/en/stable/) 。

emmm，官方文档的东西有点多，为了快速解决问题还是直接查找下有没有相关代码把。

随便查了下，发现了这个：

> ```python
> from PIL import Image
>
> image1 = Image.open(r'C:\Users\Ron\Desktop\Test\image1.png')
> image2 = Image.open(r'C:\Users\Ron\Desktop\Test\image2.png')
> image3 = Image.open(r'C:\Users\Ron\Desktop\Test\image3.png')
> image4 = Image.open(r'C:\Users\Ron\Desktop\Test\image4.png')
>
> im1 = image1.convert('RGB')
> im2 = image2.convert('RGB')
> im3 = image3.convert('RGB')
> im4 = image4.convert('RGB')
>
> imagelist = [im2,im3,im4]
>
> im1.save(r'C:\Users\Ron\Desktop\Test\myImages.pdf',save_all=True, append_images=imagelist)
> ```
>
> 来源： https://datatofish.com/images-to-pdf-python/

不需要仔细看又臭又长的官方文档了，nice！

了解了如何使用这个强大的库，就可以开始写代码了，vsc 一条龙服务!

**代码很简单，直接上源码了：**

## 源码

项目文件目录：

```
- comic/ # 包含了漫画的图片
	- example_001.png
	- example_002.png
	- example_003.png
	  ...
	- example_202.png
- output/ # 保存输出的pdf文件
	- ろりっぽいの.pdf
main.py
```

main.py

```python
from PIL import Image
import os

# change these config
DOC_NAME    = 'ろりっぽいの' # 输出pdf文件的名字
COMIC_PATH  = 'comic/'       # 漫画的保存路径
SAVE_PATH   = 'output/'      # pdf输出路径
USE_ABSLUTE = False          # 是否使用绝对路径
PAGE_NUMBER = 220            # 漫画的页数
NAME_BEFORE = 'example_'     # 漫画图片文件数字前的内容
FILE_TYPE   = '.png'         # 漫画文件的文件类型
FILL_NUMBER = 2              # 填充的数字的个数


if not USE_ABSLUTE:
    DIR_PATH = os.path.dirname(os.path.realpath(__file__)) + '/'
    COMIC_PATH = DIR_PATH + COMIC_PATH
    SAVE_PATH = DIR_PATH + SAVE_PATH


cover_path = COMIC_PATH + NAME_BEFORE + '1'.zfill(FILL_NUMBER) + FILE_TYPE
cover = Image.open(cover_path).convert('RGB')

comic_images_list = []

for i in range(2, PAGE_NUMBER + 1):
    comic_image_path = COMIC_PATH + NAME_BEFORE + str(i).zfill(FILL_NUMBER) + FILE_TYPE
    comic_image = Image.open(comic_image_path).convert('RGB')
    comic_images_list.append(comic_image)

pdf_file_path = SAVE_PATH + DOC_NAME + '.pdf'

cover.save(pdf_file_path, save_all=True, append_images=comic_images_list)
```

## 使用说明

唔，能打开我的文章并看懂我上面在说什么的读者应该知道如何使用吧，甚至可以自己手撸一个功能相同的软件出来，不过这里还是稍微解释一下我的代码。

使用的话，代码部分不需要修改，直接按照注释，修改前面的几个全局变量就可以了。

唯一需要说明的是最后一个变量 `__FILL_NUMBER__` ：

由于大部分的漫(ben)画(zi)一般都是 `001.jpg, 002.jpg, 003.jpg, ... , 102.jpg` 这样或者 `01.png, 02.png, 03.png, ... , 42.png` 这样的命名规则，所以这里我使用了 `zfill` 这个函数来快速将循环数转化为文件名，而这个参数就是给 `zfill` 这个函数用的。

如果你不清楚 `zfill` 这个函数是干什么的。这里我准备了几个网站。

https://python-reference.readthedocs.io/en/latest/docs/str/zfill.html

https://www.w3schools.com/python/ref_string_zfill.asp

## 软件效率

值得一提的是转化效率，200 多页，大概 100 多 M 的漫(ben)画(zi)转化只用了不到 10 秒钟，转化后 pdf 文件只有 60 多 M，还有压缩效果，nice。pillow 牛逼就完事了。~~可以使用 iPad 继续愉快的看漫(ben)画(zi)了。~~

## 后记

本来想上传 GitHub 的，但是代码太简单了，干脆直接水一篇博客算了。

话说如果把漫(ben)画(zi)连代码一起打包发到 GitHub 上会不会被 ban 帐号啊？（听说 GitHub 在打击网盘行为？）~~传播淫秽物品罪了解一下？~~
