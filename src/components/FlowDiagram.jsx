import { useEffect, useRef, useState, useCallback } from 'react';
import panzoom from 'panzoom';
import { Signal, LayoutGrid, Cpu, Cloud, Smartphone } from 'lucide-react';

function Node({ id, icon: Icon, label, tag, sub, color, border, glow, x, y }) {
  return (
    <div
      className="absolute flex flex-col items-center gap-2.5 group"
      style={{ left: x, top: y }}
      data-node={id}
    >
      <div
        className="relative w-[72px] h-[72px] rounded-[18px] flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-110"
        style={{
          background: 'rgba(15, 20, 35, 0.9)',
          borderColor: border,
          boxShadow: `0 0 0 1px ${border}22, 0 4px 24px ${glow}`,
        }}
      >
        <div
          className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at center, ${glow}, transparent 70%)` }}
        />
        <Icon className="w-7 h-7 relative z-10" style={{ color }} />
      </div>
      {tag && (
        <span
          className="text-[10px] font-bold tracking-[0.2em] uppercase"
          style={{ color }}
        >
          {tag}
        </span>
      )}
      <span className="text-sm font-semibold text-white leading-tight text-center">{label}</span>
      <span className="text-[11px] text-text-muted leading-tight text-center">{sub}</span>
    </div>
  );
}

function ConnectionLine({ x1, y1, x2, y2, color = '#00d4aa', opacity = 0.4, dashed = false, label, id }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  return (
    <g>
      {/* Glow line */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth="4"
        strokeOpacity={opacity * 0.15}
        strokeLinecap="round"
        filter="url(#glow)"
      />
      {/* Main line */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity={opacity}
        strokeLinecap="round"
        strokeDasharray={dashed ? '6 4' : 'none'}
        className={dashed ? '' : ''}
      >
        {!dashed && (
          <animate
            attributeName="stroke-dashoffset"
            from={len}
            to="0"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </line>
      {!dashed && (
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color}
          strokeWidth="1.5"
          strokeOpacity={opacity * 0.6}
          strokeDasharray="4 8"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to={-12}
            dur="1.5s"
            repeatCount="indefinite"
          />
        </line>
      )}
      {/* Arrow markers */}
      <circle cx={x2} cy={y2} r="3" fill={color} fillOpacity={opacity * 0.8}>
        <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
        <animate attributeName="fill-opacity" values={`${opacity * 0.6};${opacity};${opacity * 0.6}`} dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx={x1} cy={y1} r="3" fill={color} fillOpacity={opacity * 0.8}>
        <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Label */}
      {label && (
        <g>
          <rect
            x={mx - label.length * 3.5 - 8}
            y={my - 10}
            width={label.length * 7 + 16}
            height="18"
            rx="9"
            fill="rgba(10, 14, 26, 0.85)"
            stroke={color}
            strokeWidth="0.5"
            strokeOpacity={opacity * 0.5}
          />
          <text
            x={mx}
            y={my + 3}
            textAnchor="middle"
            fill={color}
            fillOpacity={opacity * 1.2}
            fontSize="9"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
            letterSpacing="0.05em"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
}

export default function FlowDiagram() {
  const containerRef = useRef(null);
  const svgContainerRef = useRef(null);
  const panzoomInstance = useRef(null);
  const [dims, setDims] = useState({ w: 800, h: 360 });

  const nodeSize = 72;
  const nodeRadius = 18;
  const pad = 40;

  // Layout positions (responsive)
  const getLayout = useCallback((w) => {
    const isSmall = w < 600;
    const nodeW = isSmall ? 56 : 72;
    const gap = isSmall ? 30 : 60;
    const startX = pad;
    const topY = pad;
    const bottomY = isSmall ? 200 : 220;

    const row1 = [
      { id: 'sensors', x: startX },
      { id: 'devicehub', x: startX + nodeW + gap },
      { id: 'vedgehub', x: startX + (nodeW + gap) * 2 },
      { id: 'vcloud', x: startX + (nodeW + gap) * 3 },
    ];

    const vappX = row1[2].x + (nodeW + gap) / 2;

    return {
      nodes: {
        sensors: { x: row1[0].x, y: topY },
        devicehub: { x: row1[1].x, y: topY },
        vedgehub: { x: row1[2].x, y: topY },
        vcloud: { x: row1[3].x, y: topY },
        vapp: { x: vappX, y: bottomY },
      },
      nodeW,
      totalW: row1[3].x + nodeW + pad,
      totalH: bottomY + nodeW + pad + 30,
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setDims({ w, h: 360 });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const layout = getLayout(dims.w);
  const n = layout.nodes;

  const cx = (id) => n[id].x + layout.nodeW / 2;
  const cy = (id) => n[id].y + layout.nodeW / 2;
  const cr = layout.nodeW / 2 + 4;

  // Auto-fit
  const autoFit = useCallback(() => {
    if (!panzoomInstance.current || !svgContainerRef.current) return;
    const pz = panzoomInstance.current;
    const container = containerRef.current;
    const svgEl = svgContainerRef.current;
    if (!container || !svgEl) return;

    const cw = container.clientWidth - 20;
    const sw = layout.totalW;
    if (sw <= 0) return;

    const scale = Math.min(1, cw / sw);
    const offsetX = (cw - sw * scale) / 2;
    pz.moveTo(offsetX, 0);
    pz.zoomAbs(0, 0, scale);
  }, [layout.totalW]);

  useEffect(() => {
    if (!svgContainerRef.current) return;

    if (panzoomInstance.current) {
      panzoomInstance.current.destroy();
    }

    const pz = panzoom(svgContainerRef.current, {
      bounds: false,
      maxZoom: 4,
      minZoom: 0.15,
      smoothScroll: true,
      zoomSpeed: 0.07,
      panSpeed: 1.2,
    });

    panzoomInstance.current = pz;

    const vp = containerRef.current;
    const handleWheel = (e) => e.preventDefault();
    vp?.addEventListener('wheel', handleWheel, { passive: false });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => autoFit());
    });

    return () => {
      pz.destroy();
      panzoomInstance.current = null;
      vp?.removeEventListener('wheel', handleWheel);
    };
  }, [autoFit]);

  useEffect(() => {
    const handleResize = () => autoFit();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [autoFit]);

  const handleZoomIn = () => panzoomInstance.current?.zoomIn({ smooth: true });
  const handleZoomOut = () => panzoomInstance.current?.zoomOut({ smooth: true });
  const handleReset = () => autoFit();

  const nodeData = [
    { id: 'sensors', icon: Signal, label: 'Sensors & Actuators', tag: '', sub: 'Physical Layer', color: '#94a3b8', border: 'rgba(100,116,139,0.3)', glow: 'rgba(100,116,139,0.08)' },
    { id: 'devicehub', icon: LayoutGrid, label: 'DeviceHub', tag: 'VDeviceHub', sub: 'LoRa / WiFi / Modbus', color: '#a29bfe', border: 'rgba(108,92,231,0.35)', glow: 'rgba(108,92,231,0.1)' },
    { id: 'vedgehub', icon: Cpu, label: 'VEdgeHub', tag: 'VEdgeHub', sub: 'VOS + 4G LTE', color: '#00d4aa', border: 'rgba(0,212,170,0.35)', glow: 'rgba(0,212,170,0.1)' },
    { id: 'vcloud', icon: Cloud, label: 'VCloud', tag: 'VCloud', sub: 'Analytics & Fleet Mgmt', color: '#00d4aa', border: 'rgba(0,212,170,0.35)', glow: 'rgba(0,212,170,0.1)' },
    { id: 'vapp', icon: Smartphone, label: 'VApp', tag: 'VApp', sub: 'Client Applications', color: '#00d4aa', border: 'rgba(0,212,170,0.25)', glow: 'rgba(0,212,170,0.06)' },
  ];

  return (
    <div className="relative">
      {/* Diagram area */}
      <div
        ref={containerRef}
        className="w-full h-[320px] md:h-[380px] overflow-hidden rounded-2xl border border-white/5 bg-[#080c16] cursor-grab active:cursor-grabbing touch-none relative"
      >
        <div ref={svgContainerRef} className="relative" style={{ width: layout.totalW, height: layout.totalH }}>
          {/* SVG connections layer */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={layout.totalW}
            height={layout.totalH}
            viewBox={`0 0 ${layout.totalW} ${layout.totalH}`}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Backbone: Sensors ↔ DeviceHub */}
            <ConnectionLine
              x1={cx('sensors') + cr} y1={cy('sensors')}
              x2={cx('devicehub') - cr} y2={cy('devicehub')}
              color="#00d4aa" opacity={0.35} label="data"
            />
            {/* DeviceHub ↔ VEdgeHub */}
            <ConnectionLine
              x1={cx('devicehub') + cr} y1={cy('devicehub')}
              x2={cx('vedgehub') - cr} y2={cy('vedgehub')}
              color="#00d4aa" opacity={0.5} label="aggregated"
            />
            {/* VEdgeHub ↔ VCloud */}
            <ConnectionLine
              x1={cx('vedgehub') + cr} y1={cy('vedgehub')}
              x2={cx('vcloud') - cr} y2={cy('vcloud')}
              color="#00d4aa" opacity={0.6} label="upstream"
            />
            {/* VEdgeHub ↔ VApp (local) */}
            <ConnectionLine
              x1={cx('vedgehub')} y1={cy('vedgehub') + cr}
              x2={cx('vapp') - cr} y2={cy('vapp')}
              color="#00d4aa" opacity={0.3} dashed label="local"
            />
            {/* VCloud ↔ VApp */}
            <ConnectionLine
              x1={cx('vcloud')} y1={cy('vcloud') + cr}
              x2={cx('vapp') + cr} y2={cy('vapp')}
              color="#00d4aa" opacity={0.3} dashed label="sync"
            />
          </svg>

          {/* Nodes layer */}
          {nodeData.map((nd) => (
            <Node
              key={nd.id}
              {...nd}
              x={n[nd.id].x}
              y={n[nd.id].y}
            />
          ))}
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white flex items-center justify-center text-lg font-bold transition-colors backdrop-blur-sm"
          >+</button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white flex items-center justify-center text-lg font-bold transition-colors backdrop-blur-sm"
          >−</button>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hint */}
      <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-text-muted/30 select-none">
        <span>Scroll to zoom</span>
        <span className="w-1 h-1 rounded-full bg-text-muted/20" />
        <span>Drag to pan</span>
      </div>
    </div>
  );
}
