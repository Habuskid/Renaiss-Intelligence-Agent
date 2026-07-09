import { useMemo } from 'react';

export default function FmvChart({ data }) {
  const { linePath, areaPath } = useMemo(() => {
    if (!data || data.length < 2) return { linePath: '', areaPath: '' };
    const minPrice = Math.min(...data.map(d => d.usdCents));
    const maxPrice = Math.max(...data.map(d => d.usdCents));
    const range = maxPrice - minPrice || 1;

    const points = data.map((d, i) => {
      return {
        x: (i / (data.length - 1)) * 100,
        y: 100 - (((d.usdCents - minPrice) / range) * 100)
      };
    });

    const getBezierPath = (pts) => {
      if (pts.length === 0) return '';
      let d = `M ${pts[0].x},${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i === 0 ? 0 : i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

        const tension = 0.15;
        const cp1x = p1.x + (p2.x - p0.x) * tension;
        const cp1y = p1.y + (p2.y - p0.y) * tension;
        const cp2x = p2.x - (p3.x - p1.x) * tension;
        const cp2y = p2.y - (p3.y - p1.y) * tension;

        d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
      }
      return d;
    };

    const dPath = getBezierPath(points);
    const aPath = `${dPath} L 100,100 L 0,100 Z`;

    return { linePath: dPath, areaPath: aPath };
  }, [data]);

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-stone-200/50 shadow-sm h-full flex flex-col animate-fade-up delay-600 card-shine">
      <h2 className="text-[11px] font-bold text-stone-700 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">30-Day Fair Market Value</h2>
      
      <div className="relative flex-1 min-h-[200px] w-full mt-auto mb-2">
        {!data || data.length < 2 ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-stone-500">
            Not enough data to plot chart
          </div>
        ) : (
          <svg 
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
            <path 
              d={areaPath}
              fill="url(#areaGradient)"
              className="animate-fade-up delay-300"
            />
            
            <path 
              d={linePath} 
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2.5"
              className="animate-draw-line"
              vectorEffect="non-scaling-stroke"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset="100"
              filter="url(#glow)"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
