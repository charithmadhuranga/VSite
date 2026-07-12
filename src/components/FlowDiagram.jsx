import { useEffect, useState, useRef, useCallback } from 'react';
import panzoom from 'panzoom';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#1a2035',
    primaryTextColor: '#f1f5f9',
    primaryBorderColor: '#00d4aa',
    lineColor: '#00d4aa',
    secondaryColor: '#1a2035',
    tertiaryColor: '#1a2035',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    background: '#0a0e1a',
  },
  flowchart: {
    curve: 'basis',
    padding: 30,
    nodeSpacing: 80,
    rankSpacing: 120,
    useMaxWidth: false,
    htmlLabels: true,
  },
});

const diagram = `graph LR
    S["Sensors &amp; Actuators<br/><span style='font-size:12px;color:#64748b'>Physical Layer</span>"]
    DH["DeviceHub<br/><span style='font-size:12px;color:#a29bfe'>LoRa / WiFi / Modbus</span>"]
    EH["VEdgeHub<br/><span style='font-size:12px;color:#00d4aa'>VOS + 4G LTE</span>"]
    VC["VCloud<br/><span style='font-size:12px;color:#00d4aa'>Analytics &amp; Fleet Mgmt</span>"]
    VA["VApp<br/><span style='font-size:12px;color:#00d4aa'>Client Applications</span>"]

    S <-->|"data"| DH
    DH <-->|"aggregated"| EH
    EH <-->|"upstream"| VC
    EH <-.->|"local"| VA
    VC <-.->|"sync"| VA

    style S fill:#1a2035,stroke:#64748b,stroke-width:2px,color:#94a3b8
    style DH fill:#1a2035,stroke:#6c5ce7,stroke-width:2px,color:#a29bfe
    style EH fill:#1a2035,stroke:#00d4aa,stroke-width:2px,color:#00d4aa
    style VC fill:#1a2035,stroke:#00d4aa,stroke-width:2px,color:#00d4aa
    style VA fill:#1a2035,stroke:#00d4aa,stroke-width:2px,color:#00d4aa`;

function ZoomControls({ onZoomIn, onZoomOut, onReset }) {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-10">
      <button
        onClick={onZoomIn}
        className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white flex items-center justify-center text-lg font-bold transition-colors"
        title="Zoom in"
      >
        +
      </button>
      <button
        onClick={onZoomOut}
        className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white flex items-center justify-center text-lg font-bold transition-colors"
        title="Zoom out"
      >
        −
      </button>
      <button
        onClick={onReset}
        className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white flex items-center justify-center transition-colors"
        title="Reset view"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
    </div>
  );
}

export default function FlowDiagram() {
  const [svg, setSvg] = useState('');
  const containerRef = useRef(null);
  const panzoomInstance = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await mermaid.render('diagram-vioneta', diagram);
        if (!cancelled) setSvg(result.svg);
      } catch (e) {
        console.error('Mermaid render error:', e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Auto-fit on first render and on resize
  const autoFit = useCallback(() => {
    if (!panzoomInstance.current || !containerRef.current) return;
    const pz = panzoomInstance.current;
    const container = containerRef.current;
    const svgEl = container.querySelector('svg');
    if (!svgEl) return;

    const cw = container.clientWidth - 40;
    const sw = svgEl.getBoundingClientRect().width;
    if (sw <= 0) return;

    const scale = Math.min(1, cw / sw);
    pz.moveTo(0, 0);
    pz.zoomAbs(0, 0, scale);
  }, []);

  // Init panzoom after SVG is in DOM
  useEffect(() => {
    if (!svg || !containerRef.current) return;

    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    // Clean up previous instance
    if (panzoomInstance.current) {
      panzoomInstance.current.destroy();
    }

    const pz = panzoom(svgEl, {
      bounds: false,
      boundsPadding: 0.1,
      maxZoom: 4,
      minZoom: 0.15,
      smoothScroll: true,
      zoomSpeed: 0.07,
      panSpeed: 1.2,
      filterKey: (e) => {
        // Allow page scroll when not over the diagram
        return false;
      },
    });

    panzoomInstance.current = pz;

    // Prevent page scroll when scrolling over diagram
    const handleWheel = (e) => {
      e.preventDefault();
    };
    svgEl.closest('.diagram-viewport')?.addEventListener('wheel', handleWheel, { passive: false });

    // Auto-fit after a short delay to let SVG layout
    requestAnimationFrame(() => {
      requestAnimationFrame(() => autoFit());
    });

    return () => {
      pz.destroy();
      panzoomInstance.current = null;
      svgEl.closest('.diagram-viewport')?.removeEventListener('wheel', handleWheel);
    };
  }, [svg, autoFit]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => autoFit();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [autoFit]);

  const handleZoomIn = () => panzoomInstance.current?.zoomIn({ smooth: true });
  const handleZoomOut = () => panzoomInstance.current?.zoomOut({ smooth: true });
  const handleReset = () => autoFit();

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/5 bg-[#0a0e1a] p-6 md:p-10 relative">
      {svg ? (
        <>
          <div
            ref={containerRef}
            className="diagram-viewport w-full h-[300px] md:h-[400px] overflow-hidden cursor-grab active:cursor-grabbing touch-none"
          >
            <div
              className="w-full h-full flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
          <ZoomControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleReset}
          />
          <div className="text-center mt-3 text-[10px] text-text-muted/40 select-none">
            Scroll to zoom · Drag to pan
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center text-text-muted text-sm py-40">Loading diagram...</div>
      )}
    </div>
  );
}
