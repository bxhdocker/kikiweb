# Kiki & Lucas

技术博客 & 宝贝成长相册。使用 Hugo 构建，部署在 GitHub Pages。

## 目录结构

```
kikiweb/
├── archetypes/         # Hugo 内容模板
├── assets/             # 需要处理的资源（CSS、JS，通过 Hugo Pipes）
├── content/
│   ├── posts/          # 技术博客文章
│   ├── album/          # 成长相册（Kiki & Lucas）
│   └── about.md        # 关于页面
├── layouts/            # 自定义主题模板
├── static/             # 静态文件（直接复制到输出目录）
└── config.toml         # Hugo 站点配置
```

## 本地开发

```bash
# 安装 Hugo
brew install hugo

# 启动开发服务器
hugo server -D

# 构建站点
hugo
```

## 添加博客文章

```bash
hugo new posts/文章名称.md
```

## 添加照片

将照片放入 `static/images/album/` 目录，然后在对应的相册页面（如 `content/album/kiki.md`）的 `gallery` 字段中引用：

```yaml
gallery:
  - src: "/images/album/kiki-1.jpg"
    alt: "Kiki 在公园"
    caption: "2024年春天"
```

## 自动部署

推送代码到 `main` 分支，GitHub Actions 会自动构建并部署到 GitHub Pages。

部署地址：`https://bxhdocker.github.io/kikiweb/`
