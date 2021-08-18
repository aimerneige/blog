---
title: "C 语言多线程基础"
date: 2020-11-01T18:21:23+08:00
draft: false
ShowToc: false
categories: [Program]
tags: [C/C++,Teach]
---

|         |      |              |
| ------- | ---- | ------------ |
| thread  | 线程 | 有共享内存   |
| process | 进程 | 没有共享内存 |

```
gcc file.c -lpthread
```

创建线程

```c
#include <stdio.h>
#include <pthread.h>

void *myfunc(void *args)
{
    for (int i = 0; i < 50; i++)
    {
        printf("%d\n", i);
    }
    return NULL;
}

int main()
{
    pthread_t th1;
    pthread_t th2;

    pthread_create(&th1, NULL, myfunc, NULL);
    pthread_create(&th2, NULL, myfunc, NULL);

    pthread_join(th1, NULL);
    pthread_join(th2, NULL);

    return 0;
}
```

传入参数

```c
#include <stdio.h>
#include <pthread.h>

void *myfunc(void *args)
{
    char *name = (char *)args;
    for (int i = 0; i < 50; i++)
    {
        printf("%s %d\n", name, i);
    }
    return NULL;
}

int main()
{
    pthread_t th1;
    pthread_t th2;

    pthread_create(&th1, NULL, myfunc, "th1");
    pthread_create(&th2, NULL, myfunc, "th2");

    pthread_join(th1, NULL);
    pthread_join(th2, NULL);

    return 0;
}
```

分部计算

```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

int arr[5000];
int s1 = 0;
int s2 = 0;

void *myfunc1(void *args)
{
    for (int i = 0; i < 2500; i++)
    {
        s1 += arr[i];
    }
    return NULL;
}

void *myfunc2(void *args)
{
    for (int i = 2500; i < 5000; i++)
    {
        s2 += arr[i];
    }
    return NULL;
}

int main()
{

    for (int i = 0; i < 5000; i++)
    {
        arr[i] = rand() % 50;
    }

    pthread_t th1;
    pthread_t th2;

    pthread_create(&th1, NULL, myfunc1, NULL);
    pthread_create(&th2, NULL, myfunc2, NULL);

    pthread_join(th1, NULL);
    pthread_join(th2, NULL);

    int S = s1 + s2;
    printf("Result: %d\n", S);

    return 0;
}

```

单参数的写法

```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

int arr[5000];
int s1 = 0;
int s2 = 0;

void *myfunc(void *args)
{
    int a = 0 [(int *)args];
    if (a == 1)
    {
        for (int i = 0; i < 2500; i++)
        {
            s1 += arr[i];
        }
    }
    else
    {
        for (int i = 2500; i < 5000; i++)
        {
            s2 += arr[i];
        }
    }

    return NULL;
}

int main()
{
    for (int i = 0; i < 5000; i++)
    {
        arr[i] = rand() % 50;
    }

    pthread_t th1;
    pthread_t th2;

    pthread_create(&th1, NULL, myfunc, (int []){1});
    pthread_create(&th2, NULL, myfunc, (int []){2});

    pthread_join(th1, NULL);
    pthread_join(th2, NULL);

    int S = s1 + s2;
    printf("Result: %d\n", S);

    return 0;
}
```

传入结构体

```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

typedef struct
{
    int first;
    int last;
} MY_ARGS;

int arr[5000];
int s1 = 0;
int s2 = 0;

void *myfunc(void *args)
{
    MY_ARGS *arg = (MY_ARGS *)args;
    for (int i = arg->first; i < arg->last; i++)
    {
        s1 += arr[i];
    }
    return NULL;
}

int main()
{
    for (int i = 0; i < 5000; i++)
    {
        arr[i] = rand() % 50;
    }

    pthread_t th1;
    pthread_t th2;

    MY_ARGS args_1 = {0, 2500};
    MY_ARGS args_2 = {2500, 5000};

    pthread_create(&th1, NULL, myfunc, &args_1);
    pthread_create(&th2, NULL, myfunc, &args_2);

    pthread_join(th1, NULL);
    pthread_join(th2, NULL);

    int S = s1 + s2;
    printf("Result: %d\n", S);

    return 0;
}
```

结构体的更多参数

```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

typedef struct
{
    int first;
    int last;
    int result;
} MY_ARGS;

int arr[5000];

void *myfunc(void *args)
{
    MY_ARGS *arg = (MY_ARGS *)args;
    for (int i = arg->first; i < arg->last; i++)
    {
        arg->result += arr[i];
    }
    return NULL;
}

int main()
{
    for (int i = 0; i < 5000; i++)
    {
        arr[i] = rand() % 50;
    }

    pthread_t th1;
    pthread_t th2;

    MY_ARGS args_1 = {0, 2500, 0};
    MY_ARGS args_2 = {2500, 5000, 1};

    pthread_create(&th1, NULL, myfunc, &args_1);
    pthread_create(&th2, NULL, myfunc, &args_2);

    pthread_join(th1, NULL);
    pthread_join(th2, NULL);

    int S = args_1.result + args_2.result;
    printf("Result: %d\n", S);

    return 0;
}
```

一些错误的写法

它会造成 race condition

```c
// dangerous operation
#include <stdio.h>
#include <pthread.h>

int a = 0;

void *myfunc(void *args)
{
    for (int i = 0; i < 1000000; i++)
    {
        a++;
    }
    return NULL;
}

int main()
{
    pthread_t pt1;
    pthread_t pt2;

    pthread_create(&pt1, NULL, myfunc, NULL);
    pthread_create(&pt2, NULL, myfunc, NULL);

    pthread_join(pt1, NULL);
    pthread_join(pt2, NULL);

    printf("%d\n", a);

    return 0;
}
```

加锁

```c
// in this way, it is slow
#include <stdio.h>
#include <pthread.h>

#define MAX_SIZE 5000000

pthread_mutex_t lock;
int a = 0;

void *myfunc(void *args)
{
    for (int i = 0; i < 100000; i++)
    {
        pthread_mutex_lock(&lock);
        a++;
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main()
{
    pthread_t pt1;
    pthread_t pt2;

    pthread_mutex_init(&lock, NULL);

    pthread_create(&pt1, NULL, myfunc, NULL);
    pthread_create(&pt2, NULL, myfunc, NULL);

    pthread_join(pt1, NULL);
    pthread_join(pt2, NULL);

    printf("%d\n", a);

    return 0;
}
```

较为完整的写法

```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

#define ZERO 0
#define HALF 2500000
#define MAX_SIZE 5000000

typedef struct
{
    int first;
    int last;
    int id;
} MY_ARGS;

int *arr;
int result[2];

void *myfunc(void *args)
{
    MY_ARGS *arg = (MY_ARGS *)args;
    for (int i = arg->first; i < arg->last; i++)
    {
        result[arg->id] += arr[i];
    }
    return NULL;
}

int main()
{
    arr = (int *)malloc(sizeof(int) * MAX_SIZE);
    for (int i = 0; i < MAX_SIZE; i++)
    {
        arr[i] = rand() % 5;
    }

    result[0] = 0;
    result[1] = 0;

    pthread_t th1;
    pthread_t th2;

    MY_ARGS args_1 = {ZERO, HALF, 0};
    MY_ARGS args_2 = {HALF, MAX_SIZE, 1};

    pthread_create(&th1, NULL, myfunc, &args_1);
    pthread_create(&th2, NULL, myfunc, &args_2);

    pthread_join(th1, NULL);
    pthread_join(th2, NULL);

    int S = result[0] + result[1];
    printf("Result: %d\n", S);

    return 0;
}
```
