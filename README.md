# 考研政治 3D 知识世界

基于 React 19 + Three.js (R3F) + GSAP 的沉浸式考研政治复习工具。

## 结构

| 房间 | 科目 | 章节数 |
|------|------|--------|
| GALLERY | 马原 | 8 章 + 导论 |
| STUDIO | 毛中特 | 8 章 + 导论 |
| ABOUT | 习思想 | 17 章 + 导论 |
| CONTACT | 思修法基 | 6 章 + 绪论 |
| 走廊墙面 | 史纲时间轴 | 10 时期 |

## 开发

```bash
npm install
npm run dev        # 开发服务器 (默认 5173, 本项目用 5199)
npm run build      # 生产构建 → dist/
npm run preview    # 预览构建产物
```

## 离线

本项目已剥离所有云服务（Sanity CMS / PostHog / SEO 插件），数据全部本地静态化。

## 数据来源

笔记内容来自 Obsidian Wiki `../Wiki/05 政治/`，提取脚本生成 `src/config/politicsContent.js`。

考点区块命名：**徐涛题眼**（非"王道题眼"，后者为 408 计算机考研术语）。
