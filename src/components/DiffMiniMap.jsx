import React, { useRef, useState, useEffect, useCallback } from 'react';
import styles from './DiffMiniMap.module.css';

/**
 * 简化版 minimap：在滚动条右侧用颜色标记变更位置
 * - 仅当内容超出一屏时显示
 * - 点击可跳转到对应位置
 */
export default function DiffMiniMap({ diffLines, scrollRef }) {
  const mapRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [mapHeight, setMapHeight] = useState(0);

  // 检测是否需要显示（内容是否超出一屏）+ 获取 map 高度
  useEffect(() => {
    const el = scrollRef?.current;
    if (!el) return;
    const check = () => {
      const overflow = el.scrollHeight > el.clientHeight;
      setVisible(overflow);
      if (overflow && mapRef.current) {
        setMapHeight(mapRef.current.clientHeight);
      }
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scrollRef, diffLines]);

  // 点击 minimap 跳转
  const handleClick = useCallback((e) => {
    const el = scrollRef?.current;
    const map = mapRef.current;
    if (!el || !map) return;
    const rect = map.getBoundingClientRect();
    const ratio = (e.clientY - rect.top) / rect.height;
    el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
  }, [scrollRef]);

  if (!visible || !diffLines.length) return null;

  const totalLines = diffLines.length;

  // 合并连续同类型变更行为区间，减少渲染数量
  const markers = [];
  for (let i = 0; i < totalLines; i++) {
    const type = diffLines[i].type;
    if (type === 'context') continue;
    const start = i;
    while (i + 1 < totalLines && diffLines[i + 1].type === type) i++;
    markers.push({ type, start, end: i });
  }

  return (
    <div className={styles.miniMap} ref={mapRef} onClick={handleClick}>
      {mapHeight > 0 && markers.map((m, idx) => {
        const top = (m.start / totalLines) * mapHeight;
        const height = Math.max(2, ((m.end - m.start + 1) / totalLines) * mapHeight);
        const color = m.type === 'add' ? 'rgba(115, 201, 145, 0.7)' : 'rgba(241, 76, 76, 0.7)';
        return (
          <div
            key={idx}
            className={styles.marker}
            style={{ top, height, backgroundColor: color }}
          />
        );
      })}
    </div>
  );
}
