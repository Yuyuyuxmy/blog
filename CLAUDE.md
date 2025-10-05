# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Astro 构建的个人博客项目（Fuwari 主题），使用 Tailwind CSS 和 Svelte 进行样式和交互开发。项目专注于技术内容分享，支持 Markdown 文章、深色模式、自定义主题颜色等功能。

## 关键开发命令

### 基础开发
- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm preview` - 预览构建结果

### 代码质量
- `pnpm lint` - 使用 Biome 检查并修复代码（仅 src 目录）
- `pnpm format` - 使用 Biome 格式化代码（仅 src 目录）
- `pnpm type-check` - TypeScript 类型检查（使用 `--noEmit --isolatedDeclarations`）

### 内容管理
- `pnpm new-post <filename>` - 创建新文章（自动添加 frontmatter，支持不带扩展名的文件名）
- `pnpm clean` - 清理 `src/content/assets` 目录中未被引用的图片文件

## 项目架构

### 核心配置
- `src/config.ts` - 博客的主要配置文件，包含站点信息、导航栏、个人资料、主题颜色、背景图片、Umami 统计等配置
- `astro.config.mjs` - Astro 框架配置，定义了 Markdown 处理插件链和构建选项
- `src/content/config.ts` - 内容集合 schema 定义（posts、spec、assets）

### 内容结构
- `src/content/posts/` - 博客文章 Markdown 文件
- `src/content/assets/` - 文章引用的资源文件（图片等）
- `src/content/spec/` - 特殊页面内容

### Markdown 处理流程
项目使用了完整的 remark/rehype 插件链处理 Markdown：

**Remark 插件（处理 Markdown AST）：**
1. `remarkMath` - 数学公式支持
2. `remarkReadingTime` - 计算阅读时间
3. `remarkExcerpt` - 提取摘要
4. `remarkGithubAdmonitionsToDirectives` - GitHub 风格提示块转换
5. `remarkDirective` - 自定义指令支持
6. `remarkSectionize` - 内容分段
7. `parseDirectiveNode` - 自定义指令解析（位于 `src/plugins/remark-directive-rehype.js`）

**Rehype 插件（处理 HTML AST）：**
1. `rehypeKatex` - 渲染数学公式
2. `rehypeSlug` - 为标题生成 ID
3. `rehypeImageFallback` - 图片降级处理（使用 `imageFallbackConfig`）
4. `rehypeComponents` - 自定义组件渲染（GitHub 卡片、提示块等）
5. `rehypeExternalLinks` - 外部链接自动打开新标签
6. `rehypeAutolinkHeadings` - 标题自动链接

### 自定义插件
- `src/plugins/rehype-component-admonition.mjs` - 提示块组件
- `src/plugins/rehype-component-github-card.mjs` - GitHub 卡片组件
- `src/plugins/rehype-image-fallback.mjs` - 图片降级插件
- `src/plugins/expressive-code/` - 代码块展示相关插件

### 页面和布局
- `src/pages/` - 路由页面（文章、归档、关于等）
- `src/layouts/` - 页面布局模板
- `src/components/` - 可复用组件

## 代码规范

### Biome 配置
- 使用 tab 缩进
- JavaScript 使用双引号
- 对 `.svelte`、`.astro`、`.vue` 文件禁用部分规则（`useConst`、`useImportType`）
- 忽略 `src/**/*.css`、`src/public/**/*`、`dist/**/*`、`node_modules/**/*`

### 文章 Frontmatter Schema
```yaml
title: string (必需)
published: date (必需)
updated: date (可选)
draft: boolean (默认 false)
description: string (默认 "")
image: string (默认 "")
tags: string[] (默认 [])
lang: string (默认 "")
pinned: boolean (默认 false)
```

## 特殊配置

### 包管理器
- 使用 pnpm@9.14.4
- Astro 包含补丁文件（`patches/astro.patch`）

### 图片处理
- 使用 `passthroughImageService()` - 不进行图片优化处理
- 配置了图片降级系统（`imageFallbackConfig`）用于 CDN 备份

### 部署
- 配置了 Vercel 部署适配器（`@astrojs/vercel`）
- 静态站点生成模式（`output: "static"`）
- 尾部斜杠策略：`trailingSlash: "always"`

### Expressive Code（代码块）
- 主题：`github-dark`
- 启用插件：可折叠区块、行号、自定义复制按钮
- 自定义样式变量：`--codeblock-bg`, `--codeblock-topbar-bg`, `--primary`
