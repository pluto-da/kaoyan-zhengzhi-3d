/**
 * Studio Content Data — 知识库政治版
 *
 * 毛中特 9 章内容 — 来自 研库/Wiki/05 政治/02 毛中特/ 真实笔记
 * 每章一个"显示器", platform 用 blog (monitor 造型) 承载
 */

export const PLATFORM_CONFIG = {
    youtube: {
        color: '#FF0000',
        accentColor: '#cc0000',
        icon: '▶',
        label: 'YouTube',
        shape: 'tv', // Wide CRT style
    },
    blog: {
        color: '#4A90D9',
        accentColor: '#2d6cb5',
        icon: '📝',
        label: 'Blog',
        shape: 'monitor', // Thin desktop monitor
    },
    tiktok: {
        color: '#00F2EA',
        accentColor: '#FF0050',
        icon: '🎵',
        label: 'TikTok',
        shape: 'phone', // Vertical phone
    },
    instagram: {
        color: '#E1306C',
        accentColor: '#C13584',
        icon: '📷',
        label: 'Instagram',
        shape: 'phone',
    },
    x: {
        color: '#000000',
        accentColor: '#14171A',
        icon: '𝕏',
        label: 'X (Twitter)',
        shape: 'monitor',
    },
    linkedin: {
        color: '#0077B5',
        accentColor: '#005E93',
        icon: 'in',
        label: 'LinkedIn',
        shape: 'monitor',
    },
    codrops: {
        color: '#0099FF',
        accentColor: '#0077CC',
        icon: '💧',
        label: 'Codrops',
        shape: 'monitor',
    },
};

// 毛中特 9 章 — 标题/页码/考频均来自 Wiki/05 政治/02 毛中特 frontmatter
const RAW_CONTENT_DATA = [
    {
        id: 'mzt-daolun',
        platform: 'blog',
        title: '导论 · 马克思主义中国化时代化的历史进程与理论成果',
        description: '毛中特导论 · 徐涛核心考案 p.99–p.101 · 考频:高频',
        frontTexture: '/textures/studio/monitorfront_postnafbdoublewinner.webp',
        paintedFrontTexture: '/textures/studio/monitorfront_postnafbdoublewinner_painted.webp',
        thumbnail: null,
        url: null,
        date: '2026-07-23',
        readTime: 'p.99-101',
    },
    {
        id: 'mzt-01',
        platform: 'blog',
        title: '第 01 章 · 毛泽东思想及其历史地位',
        description: '毛思层 · 徐涛核心考案 p.102–p.106 · 考频:高频',
        thumbnail: null,
        url: null,
        date: '2026-07-23',
        readTime: 'p.102-106',
    },
    {
        id: 'mzt-02',
        platform: 'blog',
        title: '第 02 章 · 新民主主义革命理论',
        description: '毛思层 · 徐涛核心考案 p.107–p.118 · 考频:高频',
        thumbnail: null,
        url: null,
        date: '2026-07-23',
        readTime: 'p.107-118',
    },
    {
        id: 'mzt-03',
        platform: 'blog',
        title: '第 03 章 · 社会主义改造理论',
        description: '毛思层 · 徐涛核心考案 p.119–p.126 · 考频:高频',
        thumbnail: null,
        url: null,
        date: '2026-07-23',
        readTime: 'p.119-126',
    },
    {
        id: 'mzt-04',
        platform: 'blog',
        title: '第 04 章 · 社会主义建设道路初步探索的理论成果',
        description: '毛思层 · 徐涛核心考案 p.127–p.134 · 考频:高频',
        thumbnail: null,
        url: null,
        date: '2026-07-23',
        readTime: 'p.127-134',
    },
    {
        id: 'mzt-05',
        platform: 'blog',
        title: '第 05 章 · 中国特色社会主义理论体系的形成发展',
        description: '中特层 · 徐涛核心考案 p.135–p.141 · 考频:高频',
        thumbnail: null,
        url: null,
        date: '2026-07-23',
        readTime: 'p.135-141',
    },
    {
        id: 'mzt-06',
        platform: 'blog',
        title: '第 06 章 · 邓小平理论',
        description: '中特层 · 徐涛核心考案 p.142–p.151 · 考频:高频',
        thumbnail: null,
        url: null,
        date: '2026-07-23',
        readTime: 'p.142-151',
    },
    {
        id: 'mzt-07',
        platform: 'blog',
        title: '第 07 章 · 三个代表重要思想',
        description: '中特层 · 徐涛核心考案 p.152–p.153 · 考频:高频',
        thumbnail: null,
        url: null,
        date: '2026-07-23',
        readTime: 'p.152-153',
    },
    {
        id: 'mzt-08',
        platform: 'blog',
        title: '第 08 章 · 科学发展观',
        description: '中特层 · 徐涛核心考案 p.154–p.158 · 考频:高频',
        thumbnail: null,
        url: null,
        date: '2026-07-23',
        readTime: 'p.154-158',
    },
];

const blogTextures = ['/textures/studio/monitorfront_postnafbdoublewinner.webp'];
const blogPaintedTextures = ['/textures/studio/monitorfront_postnafbdoublewinner_painted.webp'];

let blogIdx = 0;
let blogPIdx = 0;

export const CONTENT_DATA = RAW_CONTENT_DATA.map((item) => {
    return {
        ...item,
        frontTexture: item.frontTexture || blogTextures[blogIdx++ % blogTextures.length],
        paintedFrontTexture: item.paintedFrontTexture || blogPaintedTextures[blogPIdx++ % blogPaintedTextures.length]
    };
});

// Helper to get content by platform
export const getContentByPlatform = (platform) => {
    if (platform === 'all') return CONTENT_DATA;
    return CONTENT_DATA.filter(item => item.platform === platform);
};

// Get latest content (for "On Air" indicator)
export const getLatestContent = () => {
    return [...CONTENT_DATA].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
};
