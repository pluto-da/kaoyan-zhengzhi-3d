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

## 启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（端口 5199）
npm run dev

# 3. 浏览器访问
# 本地: http://localhost:5199/
# 局域网: http://<你的IP>:5199/
```

### 其他命令

```bash
npm run build      # 生产构建 → dist/
npm run preview    # 预览构建产物
```

### 操作说明

- **WASD** — 移动
- **鼠标拖动** — 旋转视角
- **点击物体** — 查看知识点详情
- **左上角菜单** — 切换房间 / 成就面板

## 离线

本项目已剥离所有云服务（Sanity CMS / PostHog / SEO 插件），数据全部本地静态化，双击 `dist/index.html` 可离线运行。

## 数据来源

笔记内容来自 Obsidian Wiki `../Wiki/05 政治/`，提取脚本生成 `src/config/politicsContent.js`。

考点区块命名：**研途考研机构 徐涛2027《核心考案》知识点简单提炼**。
