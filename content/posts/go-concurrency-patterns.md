---
title: "Go 语言中的并发模式：从 Goroutine 到 Channel"
date: 2026-06-10
tags: ["go", "并发", "goroutine"]
categories: ["Go"]
---

Go 语言以其简洁的并发模型著称。这篇文章梳理几个核心并发模式的演进思路。

## Goroutine：轻量级线程

Goroutine 是 Go 并发的基石。它们由 Go 运行时管理，初始栈只有几 KB，可以轻松创建成千上万个：

```go
func main() {
    go doWork()
    // 主 goroutine 继续执行
}
```

## Channel：通信而非共享内存

Go 的哲学是"不要通过共享内存来通信，而要通过通信来共享内存"：

```go
ch := make(chan string)

go func() {
    ch <- "hello from goroutine"
}()

msg := <-ch
fmt.Println(msg)
```

## 常用并发模式

### 1. Fan-out / Fan-in

多个 worker 从同一个 channel 消费，结果汇聚到一个 channel：

```go
func fanIn(chs ...<-chan int) <-chan int {
    out := make(chan int)
    var wg sync.WaitGroup
    for _, ch := range chs {
        wg.Add(1)
        go func(c <-chan int) {
            defer wg.Done()
            for v := range c {
                out <- v
            }
        }(ch)
    }
    go func() { wg.Wait(); close(out) }()
    return out
}
```

### 2. Pipeline

多个阶段串联，每个阶段的输出是下一个阶段的输入：

```go
func pipeline(nums []int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n * n
        }
        close(out)
    }()
    return out
}
```

### 3. Select 多路复用

`select` 语句让你同时等待多个 channel 操作：

```go
select {
case msg := <-ch1:
    handle(msg)
case msg := <-ch2:
    handle(msg)
case <-time.After(5 * time.Second):
    fmt.Println("timeout")
}
```

## Context：取消与超时

`context.Context` 是 Go 中传递取消信号和截止时间的标准方式：

```go
ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
defer cancel()

select {
case <-someWork():
    fmt.Println("done")
case <-ctx.Done():
    fmt.Println("cancelled:", ctx.Err())
}
```

## 小结

Go 的并发模型从 goroutine 开始，通过 channel 进行安全通信，借助 select 实现多路复用，最后用 context 管理生命周期。这几个组件组合起来，可以表达几乎所有并发场景。
