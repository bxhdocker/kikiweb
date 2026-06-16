---
title: "Docker 容器化实践：从 Dockerfile 到 Compose"
date: 2026-06-01
tags: ["docker", "容器", "devops"]
categories: ["基础设施"]
---

容器化是现代软件部署的标准方式。本文从零开始，走一遍 Docker 化一个 Go 应用的完整流程。

## 编写 Dockerfile

多阶段构建是 Go 应用的最佳实践：

```dockerfile
# 构建阶段
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o server .

# 运行阶段
FROM alpine:3.19
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/server /server
EXPOSE 8080
CMD ["/server"]
```

最终镜像只有约 15MB，非常精简。

## docker-compose 编排

多服务应用使用 docker-compose：

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/mydb

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "user"]
      interval: 5s

volumes:
  pgdata:
```

## 优化技巧

1. **利用构建缓存** — 先 `COPY go.mod`，再 `go mod download`，最后 `COPY . .`
2. **使用 `.dockerignore`** — 排除 `node_modules`、`.git` 等无关文件
3. **非 root 运行** — 在 Dockerfile 中添加 `USER 1000`
4. **健康检查** — 为关键服务添加 `HEALTHCHECK` 指令

## 总结

多阶段构建 + Alpine 基础镜像 = 小而安全的容器。配合 docker-compose，本地开发和生产部署的体验非常一致。
