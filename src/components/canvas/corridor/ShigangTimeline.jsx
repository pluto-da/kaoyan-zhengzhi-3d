import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useScene } from '../../../context/SceneContext';
import { ALL_SUBJECT_SUMMARIES } from '../../../config/allSubjectSummaries';

/**
 * ShigangTimeline — 史纲时间轴墙牌 (美观版)
 *
 * 视觉: 左墙一条手绘感"时间轴丝带"贯穿, 10 个年份节点 + 挂牌
 *  - 节点圆片(红) + 轴线(深棕) + 挂绳 + 木牌(米色/描边)
 *  - 悬停: 牌微放大 + 变暖色 + 提示浮现
 * 点击: 弹出该章考点列表(overlay 内上下滚动)
 */

const PERIODS = [
    { name: '鸦片战争', year: '1840', ch: 1 },
    { name: '早期探索', year: '1851', ch: 2 },
    { name: '辛亥革命', year: '1911', ch: 3 },
    { name: '建党大革命', year: '1921', ch: 4 },
    { name: '土地革命', year: '1927', ch: 5 },
    { name: '抗日战争', year: '1937', ch: 6 },
    { name: '解放战争', year: '1945', ch: 7 },
    { name: '建国探索', year: '1949', ch: 8 },
    { name: '改革开放', year: '1978', ch: 9 },
    { name: '新时代', year: '2012', ch: 10 },
];

const CH_TITLES = [
    '进入近代后中华民族的磨难与抗争',
    '不同社会力量对国家出路的早期探索',
    '辛亥革命与君主专制制度的终结',
    '中国共产党成立和中国革命新局面',
    '中国革命的新道路',
    '中华民族的抗日战争',
    '为建立新中国而奋斗',
    '中华人民共和国的成立与中国社会主义建设道路的探索',
    '改革开放与中国特色社会主义的开创和发展',
    '中国特色社会主义进入新时代',
];

// === 布局常量 ===
const WALL_X = -3.35;         // 左墙内侧(留 0.15 防 z-fighting)
const AXIS_Y = 1.55;          // 时间轴高度(视线上方)
const SIGN_TOP_Y = 1.28;      // 牌顶挂绳起点
const SIGN_Y = 0.82;          // 牌中心高度
const SPACING = 5.2;          // 节点间距(Z)
const START_DZ = -7;          // 首节点相对段起点

// 段落起讫年份 → 段内节点位置按年份比例微调Y(起伏感)
const nodeY = (i) => AXIS_Y + ((i % 3) - 1) * 0.09;

const ShigangTimeline = ({ zOffset }) => {
    const { openOverlay } = useScene();
    const [hovered, setHovered] = useState(null);
    const groupRef = useRef();
    const nodeRefs = useRef([]);

    const signs = useMemo(() => PERIODS.map((p, i) => ({
        ...p,
        z: zOffset + START_DZ - i * SPACING,
        nodeY: nodeY(i),
    })), [zOffset]);

    // 挂牌钟摆微摆动(绕挂绳顶点)
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        nodeRefs.current.forEach((g, i) => {
            if (!g) return;
            g.rotation.z = Math.sin(t * 0.9 + i * 0.9) * 0.018;
            // 悬停缓动放大
            const target = hovered === PERIODS[i].ch ? 1.07 : 1.0;
            const cur = g.scale.x || 1;
            const next = cur + (target - cur) * 0.15;
            g.scale.setScalar(next);
        });
    });

    const handleClick = (period) => {
        const ch = ALL_SUBJECT_SUMMARIES.shigang?.find(
            c => c.title.replace(/\s+/g, '').includes(CH_TITLES[period.ch - 1].replace(/\s+/g, ''))
        );
        if (!ch) return;
        openOverlay({
            title: `史纲 · 第 ${period.ch} 章 · ${ch.title}`,
            description: `${period.year}年 · ${period.name} · 徐涛核心考案`,
            layout: 'shigang_timeline',
            points: ch.points,
        });
    };

    return (
        <group>
            {/* === 时间轴主线 (横贯整段的深棕丝带) === */}
            <mesh position={[WALL_X + 0.02, AXIS_Y, zOffset + START_DZ - (PERIODS.length - 1) * SPACING / 2]} rotation={[0, 0, Math.PI / 2]}>
                <planeGeometry args={[(PERIODS.length - 1) * SPACING + 1.6, 0.055]} />
                <meshBasicMaterial color="#5a4630" side={THREE.DoubleSide} />
            </mesh>
            {/* 丝带高光线 */}
            <mesh position={[WALL_X + 0.03, AXIS_Y + 0.02, zOffset + START_DZ - (PERIODS.length - 1) * SPACING / 2]} rotation={[0, 0, Math.PI / 2]}>
                <planeGeometry args={[(PERIODS.length - 1) * SPACING + 1.6, 0.012]} />
                <meshBasicMaterial color="#8a6d47" side={THREE.DoubleSide} />
            </mesh>

            {signs.map((sign, i) => (
                <group key={sign.ch}>
                    {/* === 轴上节点 (红圆点 + 白芯) === */}
                    <group position={[WALL_X + 0.04, sign.nodeY, sign.z]}>
                        <mesh>
                            <circleGeometry args={[0.09, 24]} />
                            <meshBasicMaterial color="#a02c2c" side={THREE.DoubleSide} />
                        </mesh>
                        <mesh position={[0, 0, 0.001]}>
                            <circleGeometry args={[0.035, 16]} />
                            <meshBasicMaterial color="#f7e9c7" side={THREE.DoubleSide} />
                        </mesh>
                    </group>

                    {/* === 挂绳 (节点→牌顶) === */}
                    <mesh
                        position={[WALL_X + 0.05, (sign.nodeY + SIGN_TOP_Y) / 2, sign.z]}
                        rotation={[0, 0, 0]}
                    >
                        <planeGeometry args={[0.02, sign.nodeY - SIGN_TOP_Y]} />
                        <meshBasicMaterial color="#6b573d" side={THREE.DoubleSide} />
                    </mesh>

                    {/* === 挂牌 (钟摆组, 绕牌顶摆动) === */}
                    <group
                        ref={(el) => (nodeRefs.current[i] = el)}
                        position={[WALL_X + 0.06, SIGN_TOP_Y, sign.z]}
                    >
                        <group position={[0, -(SIGN_TOP_Y - SIGN_Y), 0]}>
                            {/* 牌底板(深描边) */}
                            <mesh
                                onClick={(e) => { e.stopPropagation(); handleClick(sign); }}
                                onPointerEnter={(e) => { e.stopPropagation(); setHovered(sign.ch); }}
                                onPointerLeave={() => setHovered(null)}
                            >
                                <planeGeometry args={[1.5, 0.78]} />
                                <meshBasicMaterial color="#43331f" side={THREE.DoubleSide} />
                            </mesh>
                            {/* 牌面(米色纸) */}
                            <mesh position={[0, 0, 0.002]}
                                onClick={(e) => { e.stopPropagation(); handleClick(sign); }}
                                onPointerEnter={(e) => { e.stopPropagation(); setHovered(sign.ch); }}
                                onPointerLeave={() => setHovered(null)}
                            >
                                <planeGeometry args={[1.4, 0.68]} />
                                <meshBasicMaterial color={hovered === sign.ch ? '#ffedca' : '#f6efdd'} side={THREE.DoubleSide} />
                            </mesh>
                            {/* 左侧红色年份块 */}
                            <mesh position={[-0.47, 0, 0.004]}>
                                <planeGeometry args={[0.52, 0.56]} />
                                <meshBasicMaterial color={hovered === sign.ch ? '#b83535' : '#a02c2c'} side={THREE.DoubleSide} />
                            </mesh>
                            {/* 年份文字(白) */}
                            <Text
                                position={[-0.47, 0, 0.008]}
                                fontSize={0.21}
                                color="#fdf4e0"
                                font="/fonts/simhei-subset.ttf"
                                anchorX="center"
                                anchorY="middle"
                            >
                                {sign.year}
                            </Text>
                            {/* 时期名(墨色, 可两行) */}
                            <Text
                                position={[0.24, 0, 0.008]}
                                fontSize={0.185}
                                color="#2b2115"
                                font="/fonts/simhei-subset.ttf"
                                anchorX="center"
                                anchorY="middle"
                                maxWidth={0.78}
                                lineHeight={1.15}
                            >
                                {sign.name}
                            </Text>
                            {/* 章号小徽标(右上角) */}
                            <Text
                                position={[0.62, 0.24, 0.008]}
                                fontSize={0.09}
                                color="#8a6d47"
                                font="/fonts/simhei-subset.ttf"
                                anchorX="center"
                                anchorY="middle"
                            >
                                第{sign.ch}章
                            </Text>
                            {/* 悬停提示 */}
                            <Text
                                position={[0, -0.56, 0.008]}
                                fontSize={0.1}
                                color="#8a3b1f"
                                font="/fonts/simhei-subset.ttf"
                                anchorX="center"
                                anchorY="middle"
                                fillOpacity={hovered === sign.ch ? 1 : 0}
                            >
                                点击查看考点 →
                            </Text>
                        </group>
                    </group>
                </group>
            ))}
        </group>
    );
};

export default ShigangTimeline;
