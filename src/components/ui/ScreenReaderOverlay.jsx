import { useScene } from '../../context/SceneContext';
import '../../styles/ScreenReaderOverlay.scss';

/**
 * ScreenReaderOverlay — A7 无障碍
 *
 * 为屏幕阅读器提供 3D 画布内容的不可见 HTML 层。
 * 包含与交互式 3D 元素（门、房间）对应的按钮/链接。
 * 通过 .sr-only 视觉隐藏，但对辅助技术完全可访问。
 * 内容基于本地知识库章节统计（离线可用，不依赖云端）。
 */
const ROOM_NAMES = {
    about: '习思想 · 天空之城',
    gallery: '马原 · 概念画廊',
    contact: '思修法基 · 修身海岸',
    studio: '毛中特 · 理论工作室',
};

const ScreenReaderOverlay = () => {
    const { hasEntered, isInRoom, currentRoom, teleportTo, requestExit } = useScene();

    return (
        <div className="sr-overlay" role="complementary" aria-label="考研政治 3D 知识世界无障碍导航">
            {/* 跳转链接 */}
            <a href="#sr-main-nav" className="sr-only sr-focusable">
                跳转到无障碍导航
            </a>

            {/* 主导航 */}
            <nav id="sr-main-nav" className="sr-only" aria-label="复习房间导航">
                <h1>考研政治 · 3D 知识世界</h1>
                <h2>复习导航</h2>

                {!hasEntered && (
                    <p>欢迎进入考研政治 3D 知识世界。点击或按回车键推开大门开始复习。</p>
                )}

                {hasEntered && !isInRoom && (
                    <>
                        <p>你正在史纲走廊中。选择一扇门进入复习房间：</p>
                        <ul>
                            <li>
                                <button onClick={() => teleportTo('gallery')} type="button">
                                    马原 · 概念画廊 — 导论 + 8 章，84 考点
                                </button>
                            </li>
                            <li>
                                <button onClick={() => teleportTo('studio')} type="button">
                                    毛中特 · 理论工作室 — 导论 + 8 章，45 考点
                                </button>
                            </li>
                            <li>
                                <button onClick={() => teleportTo('about')} type="button">
                                    习思想 · 天空之城 — 导论 + 17 章，156 考点
                                </button>
                            </li>
                            <li>
                                <button onClick={() => teleportTo('contact')} type="button">
                                    思修法基 · 修身海岸 — 绪论 + 6 章，55 考点
                                </button>
                            </li>
                        </ul>
                    </>
                )}

                {hasEntered && isInRoom && (
                    <>
                        <p>
                            你正在{ROOM_NAMES[currentRoom] || currentRoom}房间。
                        </p>
                        <button onClick={requestExit} type="button">
                            返回走廊
                        </button>

                        {/* 各房间内容描述（静态知识库内容，离线可用） */}
                        {currentRoom === 'about' && (
                            <div aria-label="习思想房间内容">
                                <h3>习思想 · 天空之城</h3>
                                <p>本房间以无限天空呈现习近平新时代中国特色社会主义思想，共 17 章 156 考点。</p>
                                <section>
                                    <h4>章节索引</h4>
                                    <ul>
                                        <li>第 1 章 · 中国特色社会主义进入新时代 - 高频考点</li>
                                        <li>第 2 章 · 新时代的历史方位与使命 - 高频考点</li>
                                        <li>第 3 章 · 坚持和发展中国特色社会主义的总任务 - 高频考点</li>
                                        <li>第 4 章 · 新时代社会主要矛盾与基本方略 - 高频考点</li>
                                        <li>第 5 章 · 坚持党的全面领导 - 高频考点</li>
                                        <li>第 6-17 章 · 各领域布局与保障 - 中高频考点</li>
                                    </ul>
                                </section>
                            </div>
                        )}
                        {currentRoom === 'gallery' && (
                            <div aria-label="马原房间内容">
                                <h3>马原 · 概念画廊</h3>
                                <p>浏览马克思主义基本原理的章节画卡，共 8 章 84 考点。点击画卡翻转查看考点、页码与考频。</p>
                                <ul>
                                    <li><h4>导论 · 马克思主义是关于无产阶级和人类解放的科学</h4></li>
                                    <li><h4>第 1 章 · 辩证唯物论</h4><p>物质、意识、时空、规律 - 每年必现</p></li>
                                    <li><h4>第 2 章 · 唯物辩证法</h4><p>矛盾、联系、发展 - 每年必现</p></li>
                                    <li><h4>第 3 章 · 认识论</h4><p>实践、认识、真理 - 每年必现</p></li>
                                    <li><h4>第 4 章 · 唯物史观</h4><p>社会存在、社会意识、生产力 - 高频</p></li>
                                    <li><h4>第 5-8 章 · 政治经济学与科学社会主义</h4></li>
                                </ul>
                            </div>
                        )}
                        {currentRoom === 'contact' && (
                            <div aria-label="思修法基房间内容">
                                <h3>思修法基 · 修身海岸</h3>
                                <p>思想道德与法治按思想篇、道德篇、法治篇三层组织，共 6 章 55 考点。点击海面木桶查看各层章节索引。</p>
                            </div>
                        )}
                        {currentRoom === 'studio' && (
                            <div aria-label="毛中特房间内容">
                                <h3>毛中特 · 理论工作室</h3>
                                <p>旋转显示器塔浏览毛泽东思想和中国特色社会主义理论体系概论，共 8 章 45 考点。点击显示器查看详情。</p>
                                <ul>
                                    <li><h4>导论 · 马克思主义中国化时代化</h4></li>
                                    <li><h4>第 1 章 · 毛泽东思想及其历史地位</h4></li>
                                    <li><h4>第 2 章 · 新民主主义革命理论</h4></li>
                                    <li><h4>第 3 章 · 社会主义改造理论</h4></li>
                                    <li><h4>第 4 章 · 社会主义建设道路初步探索</h4></li>
                                    <li><h4>第 5-8 章 · 中国特色社会主义理论体系</h4></li>
                                </ul>
                            </div>
                        )}

                        {/* 快速导航到其他房间 */}
                        <h3>快速切换房间</h3>
                        <ul>
                            {currentRoom !== 'gallery' && (
                                <li><button onClick={() => teleportTo('gallery')} type="button">前往马原</button></li>
                            )}
                            {currentRoom !== 'studio' && (
                                <li><button onClick={() => teleportTo('studio')} type="button">前往毛中特</button></li>
                            )}
                            {currentRoom !== 'about' && (
                                <li><button onClick={() => teleportTo('about')} type="button">前往习思想</button></li>
                            )}
                            {currentRoom !== 'contact' && (
                                <li><button onClick={() => teleportTo('contact')} type="button">前往思修法基</button></li>
                            )}
                        </ul>
                    </>
                )}
            </nav>

            {/* 状态变化播报区 */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {isInRoom && `已进入${ROOM_NAMES[currentRoom] || currentRoom}房间`}
            </div>
        </div>
    );
};

export default ScreenReaderOverlay;
