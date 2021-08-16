---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date | time.Format "2006-01-02 15:04:05" }}
draft: true
ShowToc: true
# description: "description here"
# categories: [development, publishing]
# tags: [hugo,content,static site generator]
# cover:
#     image: "images/blue_poison.jpg"
#     alt: "Blue Poison"
#     caption: "A Cute Blue Poison"
#     relative: false
---

