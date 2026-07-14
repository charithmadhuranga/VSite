import { useEffect, useRef, useCallback } from 'react';
import panzoom from 'panzoom';

export default function FlowDiagram() {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const pzRef = useRef(null);

  const autoFit = useCallback(() => {
    if (!pzRef.current || !containerRef.current || !svgRef.current) return;
    const cw = containerRef.current.clientWidth - 20;
    const svgW = svgRef.current.viewBox.baseVal.width;
    if (svgW <= 0) return;
    const scale = Math.min(1, cw / svgW);
    pzRef.current.moveTo((cw - svgW * scale) / 2, 0);
    pzRef.current.zoomAbs(0, 0, scale);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (pzRef.current) pzRef.current.dispose();

    const pz = panzoom(svg, {
      bounds: false,
      maxZoom: 4,
      minZoom: 0.2,
      zoomSpeed: 0.06,
      panSpeed: 1.2,
    });
    pzRef.current = pz;

    const vp = containerRef.current;
    const block = (e) => e.preventDefault();
    vp?.addEventListener('wheel', block, { passive: false });

    requestAnimationFrame(() => requestAnimationFrame(autoFit));

    const onResize = () => autoFit();
    window.addEventListener('resize', onResize);

    return () => {
      pz.dispose();
      pzRef.current = null;
      vp?.removeEventListener('wheel', block);
      window.removeEventListener('resize', onResize);
    };
  }, [autoFit]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full h-[280px] sm:h-[340px] md:h-[400px] overflow-hidden rounded-2xl border border-white/[0.04] bg-[#080c16] cursor-grab active:cursor-grabbing touch-none"
      >
        <svg
          ref={svgRef}
          viewBox="0 0 1000 320"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ display: 'block' }}
        >
          <defs>
            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Node gradients */}
            <linearGradient id="grad-grey" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a1640" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d2e28" />
              <stop offset="100%" stopColor="#0a1a16" />
            </linearGradient>
            {/* Animated dash for flowing lines */}
            <linearGradient id="line-fade-r" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#00d4aa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00d4aa" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* ============ CONNECTION LINES ============ */}

          {/* Sensors → DeviceHub */}
          <g>
            <line x1="175" y1="100" x2="295" y2="100" stroke="#00d4aa" strokeWidth="1.5" strokeOpacity="0.25" />
            <line x1="175" y1="100" x2="295" y2="100" stroke="#00d4aa" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="5 6">
              <animate attributeName="stroke-dashoffset" from="11" to="0" dur="1.2s" repeatCount="indefinite" />
            </line>
            <circle cx="295" cy="100" r="3" fill="#00d4aa" fillOpacity="0.6">
              <animate attributeName="fillOpacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
            <rect x="205" y="86" width="50" height="18" rx="9" fill="#0a0e1a" stroke="#00d4aa" strokeWidth="0.5" strokeOpacity="0.2" />
            <text x="230" y="98" textAnchor="middle" fill="#00d4aa" fillOpacity="0.5" fontSize="8" fontWeight="600" fontFamily="Inter,sans-serif">DATA</text>
          </g>

          {/* DeviceHub → VEdgeHub */}
          <g>
            <line x1="425" y1="100" x2="545" y2="100" stroke="#00d4aa" strokeWidth="1.5" strokeOpacity="0.35" />
            <line x1="425" y1="100" x2="545" y2="100" stroke="#00d4aa" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="5 6">
              <animate attributeName="stroke-dashoffset" from="11" to="0" dur="1.2s" repeatCount="indefinite" />
            </line>
            <circle cx="545" cy="100" r="3" fill="#00d4aa" fillOpacity="0.7">
              <animate attributeName="fillOpacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <rect x="445" y="86" width="70" height="18" rx="9" fill="#0a0e1a" stroke="#00d4aa" strokeWidth="0.5" strokeOpacity="0.25" />
            <text x="480" y="98" textAnchor="middle" fill="#00d4aa" fillOpacity="0.55" fontSize="8" fontWeight="600" fontFamily="Inter,sans-serif">AGGREGATED</text>
          </g>

          {/* VEdgeHub → VCloud */}
          <g>
            <line x1="675" y1="100" x2="805" y2="100" stroke="#00d4aa" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="675" y1="100" x2="805" y2="100" stroke="#00d4aa" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="5 6">
              <animate attributeName="stroke-dashoffset" from="11" to="0" dur="1.2s" repeatCount="indefinite" />
            </line>
            <circle cx="805" cy="100" r="3" fill="#00d4aa" fillOpacity="0.8">
              <animate attributeName="fillOpacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <rect x="707" y="86" width="66" height="18" rx="9" fill="#0a0e1a" stroke="#00d4aa" strokeWidth="0.5" strokeOpacity="0.3" />
            <text x="740" y="98" textAnchor="middle" fill="#00d4aa" fillOpacity="0.6" fontSize="8" fontWeight="600" fontFamily="Inter,sans-serif">UPSTREAM</text>
          </g>

          {/* VEdgeHub → VApp (diagonal down) */}
          <g>
            <path d="M 610 140 L 610 210 L 640 210" fill="none" stroke="#00d4aa" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="5 6">
              <animate attributeName="stroke-dashoffset" from="11" to="0" dur="1.5s" repeatCount="indefinite" />
            </path>
            <path d="M 610 140 L 610 210 L 640 210" fill="none" stroke="#00d4aa" strokeWidth="4" strokeOpacity="0.06" filter="url(#glow-soft)" />
            <circle cx="640" cy="210" r="2.5" fill="#00d4aa" fillOpacity="0.5">
              <animate attributeName="fillOpacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <rect x="580" y="167" width="36" height="16" rx="8" fill="#0a0e1a" stroke="#00d4aa" strokeWidth="0.5" strokeOpacity="0.2" />
            <text x="598" y="178" textAnchor="middle" fill="#00d4aa" fillOpacity="0.4" fontSize="7" fontWeight="600" fontFamily="Inter,sans-serif">LOCAL</text>
          </g>

          {/* VCloud → VApp (diagonal down) */}
          <g>
            <path d="M 870 140 L 870 210 L 770 210" fill="none" stroke="#00d4aa" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="5 6">
              <animate attributeName="stroke-dashoffset" from="11" to="0" dur="1.5s" repeatCount="indefinite" />
            </path>
            <path d="M 870 140 L 870 210 L 770 210" fill="none" stroke="#00d4aa" strokeWidth="4" strokeOpacity="0.06" filter="url(#glow-soft)" />
            <circle cx="770" cy="210" r="2.5" fill="#00d4aa" fillOpacity="0.5">
              <animate attributeName="fillOpacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <rect x="803" y="167" width="34" height="16" rx="8" fill="#0a0e1a" stroke="#00d4aa" strokeWidth="0.5" strokeOpacity="0.2" />
            <text x="820" y="178" textAnchor="middle" fill="#00d4aa" fillOpacity="0.4" fontSize="7" fontWeight="600" fontFamily="Inter,sans-serif">SYNC</text>
          </g>

          {/* ============ BACKBONE ARROW INDICATORS ============ */}
          {/* Subtle direction arrows on the backbone */}
          <g fill="none" stroke="#00d4aa" strokeWidth="1" strokeOpacity="0.3">
            <path d="M 180 100 L 188 96 L 188 104 Z" fill="#00d4aa" fillOpacity="0.2" />
            <path d="M 300 100 L 308 96 L 308 104 Z" fill="#00d4aa" fillOpacity="0.2" />
            <path d="M 430 100 L 438 96 L 438 104 Z" fill="#00d4aa" fillOpacity="0.25" />
            <path d="M 550 100 L 558 96 L 558 104 Z" fill="#00d4aa" fillOpacity="0.25" />
            <path d="M 680 100 L 688 96 L 688 104 Z" fill="#00d4aa" fillOpacity="0.3" />
            <path d="M 800 100 L 808 96 L 808 104 Z" fill="#00d4aa" fillOpacity="0.3" />
          </g>

          {/* ============ NODES ============ */}

          {/* --- Sensors & Actuators --- */}
          <g>
            <rect x="55" y="58" width="120" height="84" rx="16" fill="url(#grad-grey)" stroke="#64748b" strokeWidth="1.5" strokeOpacity="0.25" filter="url(#glow)" />
            <rect x="55" y="58" width="120" height="84" rx="16" fill="none" stroke="#64748b" strokeWidth="0.5" strokeOpacity="0.1" />
            {/* Icon: crosshair/signal */}
            <circle cx="115" cy="86" r="7" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
            <circle cx="115" cy="86" r="2.5" fill="#94a3b8" fillOpacity="0.5" />
            <line x1="115" y1="75" x2="115" y2="79" stroke="#94a3b8" strokeWidth="1" />
            <line x1="115" y1="93" x2="115" y2="97" stroke="#94a3b8" strokeWidth="1" />
            <line x1="104" y1="86" x2="108" y2="86" stroke="#94a3b8" strokeWidth="1" />
            <line x1="122" y1="86" x2="126" y2="86" stroke="#94a3b8" strokeWidth="1" />
            {/* Label */}
            <text x="115" y="112" textAnchor="middle" fill="#f1f5f9" fontSize="10.5" fontWeight="700" fontFamily="Inter,sans-serif">Sensors &amp;</text>
            <text x="115" y="124" textAnchor="middle" fill="#f1f5f9" fontSize="10.5" fontWeight="700" fontFamily="Inter,sans-serif">Actuators</text>
            <text x="115" y="135" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="Inter,sans-serif">Physical Layer</text>
          </g>

          {/* --- DeviceHub --- */}
          <g>
            <rect x="295" y="58" width="130" height="84" rx="16" fill="url(#grad-purple)" stroke="#6c5ce7" strokeWidth="1.5" strokeOpacity="0.3" filter="url(#glow)" />
            <rect x="295" y="58" width="130" height="84" rx="16" fill="none" stroke="#6c5ce7" strokeWidth="0.5" strokeOpacity="0.1" />
            {/* Icon: grid */}
            <rect x="348" y="77" width="10" height="10" rx="2" fill="none" stroke="#a29bfe" strokeWidth="1.1" />
            <rect x="360" y="77" width="10" height="10" rx="2" fill="none" stroke="#a29bfe" strokeWidth="1.1" />
            <rect x="348" y="89" width="10" height="10" rx="2" fill="none" stroke="#a29bfe" strokeWidth="1.1" />
            <rect x="360" y="89" width="10" height="10" rx="2" fill="none" stroke="#a29bfe" strokeWidth="1.1" />
            {/* Label */}
            <text x="360" y="112" textAnchor="middle" fill="#a29bfe" fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif" letterSpacing="0.12em">VDEVICEHUB</text>
            <text x="360" y="124" textAnchor="middle" fill="#f1f5f9" fontSize="10.5" fontWeight="700" fontFamily="Inter,sans-serif">DeviceHub</text>
            <text x="360" y="135" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="Inter,sans-serif">LoRa / WiFi / Modbus</text>
          </g>

          {/* --- VEdgeHub --- */}
          <g>
            <rect x="545" y="58" width="130" height="84" rx="16" fill="url(#grad-green)" stroke="#00d4aa" strokeWidth="1.5" strokeOpacity="0.3" filter="url(#glow)" />
            <rect x="545" y="58" width="130" height="84" rx="16" fill="none" stroke="#00d4aa" strokeWidth="0.5" strokeOpacity="0.1" />
            {/* Icon: chip/cpu */}
            <rect x="598" y="77" width="24" height="18" rx="3" fill="none" stroke="#00d4aa" strokeWidth="1.2" />
            <line x1="604" y1="82" x2="616" y2="82" stroke="#00d4aa" strokeWidth="0.8" strokeOpacity="0.5" />
            <line x1="604" y1="86" x2="616" y2="86" stroke="#00d4aa" strokeWidth="0.8" strokeOpacity="0.5" />
            <line x1="604" y1="90" x2="616" y2="90" stroke="#00d4aa" strokeWidth="0.8" strokeOpacity="0.5" />
            <circle cx="610" cy="94" r="1.5" fill="#00d4aa" fillOpacity="0.4" />
            <line x1="603" y1="72" x2="603" y2="77" stroke="#00d4aa" strokeWidth="0.8" strokeOpacity="0.4" />
            <line x1="617" y1="72" x2="617" y2="77" stroke="#00d4aa" strokeWidth="0.8" strokeOpacity="0.4" />
            {/* Label */}
            <text x="610" y="112" textAnchor="middle" fill="#00d4aa" fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif" letterSpacing="0.12em">VEDGEHUB</text>
            <text x="610" y="124" textAnchor="middle" fill="#f1f5f9" fontSize="10.5" fontWeight="700" fontFamily="Inter,sans-serif">VEdgeHub</text>
            <text x="610" y="135" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="Inter,sans-serif">VOS + 4G LTE</text>
          </g>

          {/* --- VCloud --- */}
          <g>
            <rect x="805" y="58" width="130" height="84" rx="16" fill="url(#grad-green)" stroke="#00d4aa" strokeWidth="1.5" strokeOpacity="0.3" filter="url(#glow)" />
            <rect x="805" y="58" width="130" height="84" rx="16" fill="none" stroke="#00d4aa" strokeWidth="0.5" strokeOpacity="0.1" />
            {/* Icon: cloud */}
            <path d="M 865 82 C 865 82 857 76 851 78 C 847 73 840 75 838 79 C 834 77 829 80 829 85 C 829 91 835 94 835 94" fill="none" stroke="#00d4aa" strokeWidth="1.2" strokeOpacity="0.6" />
            <path d="M 855 82 C 855 82 861 76 867 78 C 871 73 878 75 880 79 C 884 77 889 80 889 85 C 889 91 883 94 883 94" fill="none" stroke="#00d4aa" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="851" y1="94" x2="851" y2="100" stroke="#00d4aa" strokeWidth="0.8" strokeOpacity="0.4" />
            <line x1="859" y1="94" x2="859" y2="99" stroke="#00d4aa" strokeWidth="0.8" strokeOpacity="0.4" />
            {/* Label */}
            <text x="870" y="112" textAnchor="middle" fill="#00d4aa" fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif" letterSpacing="0.12em">VCLOUD</text>
            <text x="870" y="124" textAnchor="middle" fill="#f1f5f9" fontSize="10.5" fontWeight="700" fontFamily="Inter,sans-serif">VCloud</text>
            <text x="870" y="135" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="Inter,sans-serif">Analytics &amp; Fleet Mgmt</text>
          </g>

          {/* --- VApp (bottom row) --- */}
          <g>
            <rect x="650" y="210" width="120" height="80" rx="16" fill="url(#grad-green)" stroke="#00d4aa" strokeWidth="1" strokeOpacity="0.2" filter="url(#glow)" />
            <rect x="650" y="210" width="120" height="80" rx="16" fill="none" stroke="#00d4aa" strokeWidth="0.5" strokeOpacity="0.08" />
            {/* Icon: phone */}
            <rect x="703" y="226" width="14" height="22" rx="3" fill="none" stroke="#00d4aa" strokeWidth="1.1" strokeOpacity="0.6" />
            <line x1="709" y1="244" x2="711" y2="244" stroke="#00d4aa" strokeWidth="0.8" strokeOpacity="0.4" />
            <circle cx="710" cy="230" r="1.2" fill="#00d4aa" fillOpacity="0.4" />
            {/* Label */}
            <text x="710" y="264" textAnchor="middle" fill="#00d4aa" fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif" letterSpacing="0.12em">VAPP</text>
            <text x="710" y="276" textAnchor="middle" fill="#f1f5f9" fontSize="10" fontWeight="700" fontFamily="Inter,sans-serif">VApp</text>
            <text x="710" y="286" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="Inter,sans-serif">Client Applications</text>
          </g>

        </svg>
      </div>

      {/* Controls + hint */}
      <div className="flex items-center justify-between mt-3 px-1">
        <div className="flex items-center gap-3 text-[10px] text-text-muted/30 select-none">
          <span>Scroll to zoom</span>
          <span className="w-0.5 h-0.5 rounded-full bg-text-muted/20" />
          <span>Drag to pan</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => pzRef.current?.zoomIn({ smooth: true })}
            className="w-7 h-7 rounded-md bg-white/[0.03] border border-white/[0.06] text-white/50 hover:bg-white/[0.08] hover:text-white/80 flex items-center justify-center text-sm font-bold transition-colors"
          >+</button>
          <button
            onClick={() => pzRef.current?.zoomOut({ smooth: true })}
            className="w-7 h-7 rounded-md bg-white/[0.03] border border-white/[0.06] text-white/50 hover:bg-white/[0.08] hover:text-white/80 flex items-center justify-center text-sm font-bold transition-colors"
          >−</button>
          <button
            onClick={() => autoFit()}
            className="w-7 h-7 rounded-md bg-white/[0.03] border border-white/[0.06] text-white/50 hover:bg-white/[0.08] hover:text-white/80 flex items-center justify-center transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
