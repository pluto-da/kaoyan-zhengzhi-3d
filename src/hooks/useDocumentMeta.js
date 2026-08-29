import { useEffect, useRef } from 'react';
import { useScene } from '../context/SceneContext';

/**
 * useDocumentMeta — 动态 Meta 与虚拟路由 (History API)
 *
 * 用户进/出 3D 房间时更新 URL、标题、描述，并处理浏览器前进/后退。
 */

const ROOM_META = {
    null: {
        path: '/',
        title: '考研政治 · 3D 知识世界',
        description: '考研政治 3D 知识可视化：马原、毛中特、习思想、史纲、思修法基五科章节走廊复习，462 考点 + 研途考研机构 徐涛2027《核心考案》政治知识点简单提炼 + 易错点。',
    },
    about: {
        path: '/about',
        title: '习思想 · 天空之城 — 考研政治知识世界',
        description: '习近平新时代中国特色社会主义思想：导论 + 17 章，156 考点，按基本问题/布局安排/内外条件三板块组织。',
    },
    gallery: {
        path: '/gallery',
        title: '马原 · 概念画廊 — 考研政治知识世界',
        description: '马克思主义基本原理：导论 + 8 章，84 考点。画卡式复习，翻转查看考点、页码与考频。',
    },
    studio: {
        path: '/studio',
        title: '毛中特 · 理论工作室 — 考研政治知识世界',
        description: '毛泽东思想和中国特色社会主义理论体系概论：导论 + 8 章，45 考点，显示器塔式浏览。',
    },
    contact: {
        path: '/contact',
        title: '思修法基 · 修身海岸 — 考研政治知识世界',
        description: '思想道德与法治：绪论 + 6 章，55 考点。思想篇/道德篇/法治篇三层结构。',
    },
};

// Map URL paths back to room IDs for deep linking
const PATH_TO_ROOM = {
    '/': null,
    '/about': 'about',
    '/gallery': 'gallery',
    '/studio': 'studio',
    '/contact': 'contact',
};

/**
 * Returns the room ID that the initial URL points to (for deep linking).
 * Call this once at app startup to determine if we need to auto-teleport.
 */
export function getInitialRoomFromUrl() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return PATH_TO_ROOM[path] !== undefined ? PATH_TO_ROOM[path] : null;
}

export function useDocumentMeta() {
    const { currentRoom, teleportTo, hasEntered } = useScene();
    const isHandlingPopState = useRef(false);
    const lastPushedRoom = useRef(undefined); // Track what we last pushed to avoid duplicates

    // Update document meta and URL when room changes
    useEffect(() => {
        const roomKey = currentRoom === null ? 'null' : currentRoom;
        const meta = ROOM_META[roomKey] || ROOM_META['null'];

        // Update the page title
        document.title = meta.title;

        // Update meta description
        const descTag = document.querySelector('meta[name="description"]');
        if (descTag) {
            descTag.setAttribute('content', meta.description);
        }

        // Update OG meta tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', meta.title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', meta.description);

        // Push to browser history (only if not handling a popstate event and room actually changed)
        if (!isHandlingPopState.current && lastPushedRoom.current !== currentRoom) {
            // Use replaceState for the very first load, pushState for subsequent navigations
            if (lastPushedRoom.current === undefined) {
                window.history.replaceState({ room: currentRoom }, '', meta.path);
            } else {
                window.history.pushState({ room: currentRoom }, '', meta.path);
            }
            lastPushedRoom.current = currentRoom;
        }

        isHandlingPopState.current = false;
    }, [currentRoom]);

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = (event) => {
            isHandlingPopState.current = true;
            const targetRoom = event.state?.room ?? null;
            lastPushedRoom.current = targetRoom;

            if (targetRoom === null) {
                // Going back to corridor — we don't teleport, just need to trigger exit
                const meta = ROOM_META['null'];
                document.title = meta.title;
            } else if (hasEntered) {
                // Teleport to the target room
                teleportTo(targetRoom);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [teleportTo, hasEntered]);
}
