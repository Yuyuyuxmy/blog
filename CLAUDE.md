# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Astro 构建的个人技术博客项目（Fuwari 主题），使用 Tailwind CSS 和 Svelte 进行样式和交互开发。项目由 @Yuyuyuxmy (星空鱼) 维护，专注于 Unity 开发和守望先锋游戏内容分享，支持 Markdown 文章、强制深色模式、自定义粉紫色主题等功能。

**重要提示**: 本项目已经过深度定制,移除了原作者的所有个人配置、广告、友链功能和图片回退机制。

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
- `src/config.ts` - 博客的主要配置文件，包含:
  - **站点信息**: 标题 "StarFish Blog"、副标题、描述
  - **主题颜色**: hue 312 (粉紫色 #ff95e9)、强制深色模式 (forceDarkMode: true)
  - **背景图片**: 启用随机背景 (`https://img.starfishyu.me/random?type=img&dir=xmy`)
  - **导航栏**: 首页、归档、关于、赞助、统计、状态
  - **Umami 统计**: us.umami.is 实例 (website-id: f2367224-f0da-43d8-824c-e509fee709db, shareId: MgiJewoeGKwGUnpt)
  - **个人资料**: 头像、名称、个人简介、社交链接 (Bilibili、GitHub、抖音)
  
- `astro.config.mjs` - Astro 框架配置，定义了 Markdown 处理插件链和构建选项
- `src/content/config.ts` - 内容集合 schema 定义（posts、spec、assets）
- `vercel.json` - Vercel 部署配置 (使用 pnpm)
- `.npmrc` - pnpm 配置 (enable-pre-post-scripts, auto-install-peers)

### 内容结构
- `src/content/posts/` - 博客文章 Markdown 文件 (当前仅保留 fuwari.md 作为示例)
- `src/content/assets/images/` - 文章引用的资源文件 (已清理,仅保留 13 张 fuwari.md 使用的图片)
- `src/content/spec/` - 特殊页面内容 (about.md)

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
3. ~~`rehypeImageFallback`~~ - **已删除** (图片回退机制已完全移除)
4. `rehypeComponents` - 自定义组件渲染（GitHub 卡片、提示块等）
5. `rehypeExternalLinks` - 外部链接自动打开新标签
6. `rehypeAutolinkHeadings` - 标题自动链接

### 自定义插件
- `src/plugins/rehype-component-admonition.mjs` - 提示块组件
- `src/plugins/rehype-component-github-card.mjs` - GitHub 卡片组件
- `src/plugins/expressive-code/` - 代码块展示相关插件
- ~~`src/plugins/rehype-image-fallback.mjs`~~ - **已删除**

### 页面和布局
- `src/pages/` - 路由页面（文章、归档、关于、赞助等）
- `src/pages/friends.astro` - **已删除** (友链功能已移除)
- `src/layouts/Layout.astro` - 主布局模板,包含:
  - 主题初始化脚本 (forceDarkMode 逻辑)
  - 背景图片加载脚本 (含 5 秒超时保护)
  - iOS Safari 优化 CSS
  - 移动端/平板响应式优化
  - Umami 分析跟踪脚本
- `src/components/` - 可复用组件
- `src/components/widget/SideBar.astro` - 侧边栏 (已移除 Secbit 和 NodeSupport 广告)

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
- 配置文件: `.npmrc` (enable-pre-post-scripts=true, auto-install-peers=true)

### 图片处理
- 使用 `passthroughImageService()` - 不进行图片优化处理
- **图片源**: 统一使用 `https://img.starfishyu.me`
- ~~图片降级系统~~ - **已完全移除** (不再使用 imageFallbackConfig 或域名回退机制)

### 背景图片系统
- **背景源**: `https://img.starfishyu.me/random?type=img&dir=xmy` (随机图片 API)
- **加载机制**: 
  - Image 对象预加载
  - crossOrigin 设置为 'anonymous'
  - 5 秒超时强制显示
  - 加载完成后启用透明卡片效果
- **移动端优化**:
  - iOS Safari 特殊处理 (`-webkit-fill-available`, `translate3d`)
  - iPad 支持 (max-width: 1024px)
  - 触摸屏检测 (`hover:none` + `pointer:coarse`)
  - 2 秒延迟动画避免加载闪烁

### 主题系统
- **主题色**: hue 312 (粉紫色 #ff95e9)
- **强制深色模式**: forceDarkMode: true (隐藏主题切换器)
- **固定色调**: fixed: true (访客无法更改主题色)
- **localStorage 处理**: forceDarkMode 启用时优先使用配置值,清除缓存的 hue

### 分析统计
- **Umami Analytics**:
  - 实例: us.umami.is
  - Website ID: f2367224-f0da-43d8-824c-e509fee709db
  - Share ID: MgiJewoeGKwGUnpt
  - 时区: Asia/Shanghai
  - 跟踪脚本: `<script defer src="https://cloud.umami.is/script.js" data-website-id="..."></script>`
  - 分享页面: https://cloud.umami.is/share/MgiJewoeGKwGUnpt
- **统计缓存**: `/public/js/umami-share.js` (1 小时 TTL)

### 部署
- **平台**: Vercel
- **区域**: Hong Kong (hkg1)
- **输出模式**: 静态站点生成 (`output: "static"`)
- **尾部斜杠**: `trailingSlash: "always"`
- **构建命令**: `pnpm run build`
- **安装命令**: `pnpm install --frozen-lockfile`
- **框架**: astro
- **配置文件**: `vercel.json`

### Expressive Code（代码块）
- **主题**: `github-dark`
- **启用插件**: 可折叠区块、行号、自定义复制按钮
- **自定义样式变量**: `--codeblock-bg`, `--codeblock-topbar-bg`, `--primary`
- **默认配置**: wrap: true, shellsession 不显示行号

## 已移除的功能

以下功能已从原始 Fuwari 主题中完全移除:

1. **原作者配置**:
   - ❌ Vercel 重定向规则
   - ❌ 原作者个人信息 (二叉树树 / afoim)
   - ❌ 原作者邮箱 (i@2x.nz)
   - ❌ 原作者 GitHub 链接

2. **广告系统**:
   - ❌ Secbit 横幅广告
   - ❌ NodeSupport iframe 嵌入

3. **友链功能**:
   - ❌ `src/pages/friends.astro` 页面
   - ❌ 导航栏友链入口

4. **图片回退机制**:
   - ❌ `imageFallbackConfig` 配置
   - ❌ `src/plugins/rehype-image-fallback.mjs` 插件
   - ❌ `ImageWrapper.astro` 中的 onerror 域名替换
   - ❌ `Layout.astro` 中的 fallback 逻辑
   - ❌ 所有 2x.nz 域名引用

5. **第三方追踪**:
   - ❌ Content Security Policy (CSP) 元标签 (包含百度统计、Google Analytics、Google Ads 等)
   - ❌ 百度统计 (hm.baidu.com)
   - ❌ Google Analytics / Tag Manager
   - ❌ Google AdSense / Ads

6. **内容清理**:
   - ❌ ~100 篇原作者文章 (仅保留 fuwari.md 作为示例)
   - ❌ 600+ 张未使用的图片 (仅保留 13 张)
   - ❌ 赞助商列表 (donate 页面已简化)

## 维护注意事项

1. **图片管理**: 所有图片统一使用 `https://img.starfishyu.me`,不要添加回退逻辑
2. **主题锁定**: forceDarkMode 和 fixed 保持启用,确保 hue 312 不被覆盖
3. **Umami 配置**: 所有 Umami 服务统一使用 us.umami.is (包括跟踪、分享、API)
4. **移动端优化**: 保持 iOS Safari 和触摸屏设备的特殊 CSS 处理
5. **代码整洁**: 不保留注释掉的代码,直接删除不需要的功能
6. **依赖管理**: 使用 pnpm,遵循 .npmrc 配置
