---
title: "使用 Hugo + GitHub Pages 搭建个人博客"
date: 2026-06-16
tags: ["hugo", "github-pages", "博客"]
categories: ["教程"]
---

Hugo 是一个用 Go 编写的静态网站生成器，以构建速度快著称。配合 GitHub Pages 和 GitHub Actions，可以轻松实现免费的个人博客部署。

## 为什么选择 Hugo？

Hugo 有几个显著优点：

1. **极快的构建速度** — 数百篇文章在毫秒级完成构建
2. **单一二进制文件** — 无需安装依赖，一个文件即可运行
3. **强大的模板系统** — 基于 Go template，灵活且高性能
4. **丰富的主题生态** — 社区提供了大量高质量主题
5. **Markdown 原生支持** — 用 Markdown 写文章，专注内容本身

## 项目结构

```
myblog/
├── archetypes/     # 内容模板
├── assets/         # 需要处理的资源文件
├── content/        # Markdown 内容
├── data/           # 数据文件
├── layouts/        # 模板文件
├── static/         # 静态文件（直接复制）
├── themes/         # 主题
└── config.toml     # 站点配置
```

## GitHub Pages 自动部署

创建 `.github/workflows/hugo-deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
      - run: hugo --minify
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

每次推送代码到 `main` 分支，GitHub Actions 就会自动构建并部署站点。

## 自定义主题

Hugo 的模板系统非常灵活。你可以从零开始编写一个完全符合自己审美的主题，只需在 `layouts/` 目录下创建对应的模板文件。

关键模板文件：

| 文件 | 作用 |
|------|------|
| `layouts/_default/baseof.html` | 基础框架 |
| `layouts/index.html` | 首页 |
| `layouts/_default/single.html` | 单篇文章 |
| `layouts/_default/list.html` | 列表页 |
| `layouts/partials/` | 可复用的组件 |

## 总结

Hugo + GitHub Pages 是一种低成本、高性能的个人博客方案。不需要服务器，不需要数据库，完全免费，还能享受 GitHub 的全球 CDN 加速。
