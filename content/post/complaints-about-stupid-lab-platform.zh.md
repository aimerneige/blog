---
title: "对于某实验平台的吐槽"
date: 2021-08-19T21:44:21+08:00
draft: false
ShowToc: false
categories: [Web]
tags: [web,javascript]
---

今天学校不知道哪搞了个平台，让我们去上面做模拟实验，我点开一看，好嘛，没啥用的机器人、电焊，继续看下去还有题目，又懒得上网查答案，但是学校给的通知里有一行话引起了我的注意:

> 温馨提示:需要从实验空间进入实验,不可直接输入网址进入

不可直接输入网址？我仔细看了下，发现实验空间的作用就是添加一个 token，如果直接进去就是游客，没有办法登录。

这下就好办了啊，虽然是游客，但是游客也可以做题啊，我用游客帐号先做了不就拿到答案了吗？

这个系统果然把正确答案显示在前端了，但是不太好看，于是我就跑去 F12 看了。

结果我在后台找到了下面的代码:

```js
$.ajax({
		url: "/webApi/experimen/rig/getData",
		type: "GET",
		data: { courseId: courseId },
		dataType: "JSON",
		success: function (res) {

        // 省略的大量代码逻辑

        })；
```

> 下面的注释是原来就有，不是我加的。\
> 对，这个系统没有对 js 做混淆甚至在代码里有详细的注释。

```js
// 单选
var answer = $('.afterTesting .topic1 form');
for (var k = 0; k < answer.length; k++) {
    var question1 = $(answer[k]).find(".question1");
    var questionAnswer = question1.attr("data-answer");
    var userAnswer = question1.find("input[type='radio']:checked").val();
    var score = parseFloat(question1.attr("data-score"));
    if (questionAnswer.length > 1) {
        var userdAnswer = question1.find("input[type='checkbox']:checked");
        let userdAnswerStr = '';
        for (let i = 0; i < userdAnswer.length; i++) {
        userdAnswerStr += $(userdAnswer[i]).val();
        //console.log($(userdAnswer[i]).val());
        }
        //console.log(userdAnswerStr);
        userAnswer = userdAnswerStr
    }
    var isok = "";
    if (questionAnswer == userAnswer) {
        isok = "正确";
        question1.find(".countItem span").html(score);
        resultafter += score
    } else {
        isok = "错误";
        question1.find(".countItem span").html("0");
	}
	question1.find(".yourAnswer span").html(isok);
}
```

好家伙，前端直接向后台发请求拿答案数据，然后判断对错？这就好比考试的时候老师把答案和试卷都给你，让你自己写完试卷自己评分。

直接发一个请求过去，果然拿到答案了。

数据示例:

```json
{
    "id": "570239720236388352",
    "courseId": null,
    "title": "07、机器人的运动速度与摇杆的偏转量 （）",
    "optionA": "A、正比             ",
    "optionB": "B、反比 ",
    "optionC": "C、不成比例         ",
    "optionD": "D、以上均不正确",
    "optionE": "",
    "optionF": "",
    "optionG": "",
    "optionH": "",
    "answer": "A",
    "tag": "",
    "analysis": "",
    "remarks": "",
    "content": "",
    "score": 3.0,
    "pid": "550581359601651712_before",
    "countOfRow": null
}
```
