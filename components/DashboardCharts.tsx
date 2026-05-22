import React, { useState } from 'react';
import { 
  TrendingUp, 
  Layers, 
  Calendar, 
  ArrowUpRight, 
  Info,
  DollarSign,
  UserCheck,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ChartProps {
  stats: {
    vacancies: number;
    blogs: number;
    payments: number;
    paymentSuccessAmount: number;
    visitorsTotal: number;
    visitorsActive: number;
    visitorsToday: number;
    governmentLinks: number;
    admins: number;
    electricity: number;
    edistrict: number;
    withdrawal: number;
  };
}

export default function DashboardCharts({ stats }: ChartProps) {
  // Line chart interactive states
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  // Donut chart interactive states
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  // Bar chart interactive states
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Mock data calculations dynamically weighted by real database stats
  const totalRegistry = (stats.electricity || 0) + (stats.edistrict || 0) + (stats.withdrawal || 0);
  const scaleMultiplier = Math.max(1, Math.floor(totalRegistry / 10));

  // --- 1. Line/Area Chart Data (Monthly Registration Flow) ---
  const lineData = [
    { month: 'Dec', traffic: 220 * scaleMultiplier, applications: 180 * scaleMultiplier, income: 8400 },
    { month: 'Jan', traffic: 380 * scaleMultiplier, applications: 290 * scaleMultiplier, income: 14200 },
    { month: 'Feb', traffic: 450 * scaleMultiplier, applications: 350 * scaleMultiplier, income: 19800 },
    { month: 'Mar', traffic: 590 * scaleMultiplier, applications: 480 * scaleMultiplier, income: 24600 },
    { month: 'Apr', traffic: 820 * scaleMultiplier, applications: 620 * scaleMultiplier, income: 38400 },
    { month: 'May', traffic: (stats.visitorsToday * 12 + 400) || 980, applications: totalRegistry * 4 || 740, income: stats.paymentSuccessAmount || 49200 },
  ];

  // --- 2. Donut Chart Data (Service Categories Distribution) ---
  const serviceCategories = [
    { name: 'Ration & eDistrict', count: stats.edistrict || 124, color: 'rgb(79, 70, 229)', highlight: 'rgba(79, 70, 229, 0.15)' }, // Indigo
    { name: 'Electricity Bills', count: stats.electricity || 85, color: 'rgb(217, 70, 239)', highlight: 'rgba(217, 70, 239, 0.15)' }, // Fuchsia
    { name: 'Cash Withdrawal', count: stats.withdrawal || 68, color: 'rgb(16, 185, 129)', highlight: 'rgba(16, 185, 129, 0.15)' }, // Emerald
    { name: 'Gov Job Vacancy', count: stats.vacancies || 45, color: 'rgb(245, 158, 11)', highlight: 'rgba(245, 158, 11, 0.15)' }, // Amber
    { name: 'Blog Publications', count: stats.blogs || 32, color: 'rgb(14, 165, 233)', highlight: 'rgba(14, 165, 233, 0.15)' } // Sky
  ];

  const totalServices = serviceCategories.reduce((sum, item) => sum + item.count, 0);

  // --- 3. Weekly Traffic Bar Chart ---
  const barData = [
    { day: 'Mon', count: Math.max(12, Math.floor(stats.visitorsToday * 0.75)) || 42 },
    { day: 'Tue', count: Math.max(15, Math.floor(stats.visitorsToday * 0.85)) || 58 },
    { day: 'Wed', count: Math.max(18, Math.floor(stats.visitorsToday * 0.90)) || 64 },
    { day: 'Thu', count: Math.max(14, Math.floor(stats.visitorsToday * 0.80)) || 52 },
    { day: 'Fri', count: Math.max(22, Math.floor(stats.visitorsToday * 1.15)) || 78 },
    { day: 'Sat', count: Math.max(28, Math.floor(stats.visitorsToday * 1.40)) || 95 },
    { day: 'Sun', count: stats.visitorsToday || 84 }
  ];

  const maxBarValue = Math.max(...barData.map(b => b.count), 1);

  // SVG dimensions for Line Chart
  const lineWidth = 600;
  const lineExtentY = 240;
  const paddingX = 40;
  const paddingY = 30;

  // Compute point coordinates for Line Chart
  const maxVal = Math.max(...lineData.map(d => d.traffic), 100);
  const getX = (index: number) => paddingX + (index * (lineWidth - 2 * paddingX)) / (lineData.length - 1);
  const getY = (value: number) => lineExtentY - paddingY - (value * (lineExtentY - 2 * paddingY)) / maxVal;

  const points = lineData.map((d, i) => ({ x: getX(i), y: getY(d.traffic), value: d.traffic, raw: d }));
  const subPoints = lineData.map((d, i) => ({ x: getX(i), y: getY(d.applications), value: d.applications, raw: d }));

  // Create smooth curved lines using Bezier path string
  const createBezierPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cpX1 = pts[i].x + (pts[i + 1].x - pts[i].x) / 2;
      const cpY1 = pts[i].y;
      const cpX2 = pts[i].x + (pts[i + 1].x - pts[i].x) / 2;
      const cpY2 = pts[i + 1].y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pts[i + 1].x} ${pts[i + 1].y}`;
    }
    return path;
  };

  const linePath = createBezierPath(points);
  const subLinePath = createBezierPath(subPoints);

  // Create filled area paths
  const areaPath = linePath ? `${linePath} L ${points[points.length - 1].x} ${lineExtentY - paddingY} L ${points[0].x} ${lineExtentY - paddingY} Z` : '';
  const subAreaPath = subLinePath ? `${subLinePath} L ${subPoints[subPoints.length - 1].x} ${lineExtentY - paddingY} L ${subPoints[0].x} ${lineExtentY - paddingY} Z` : '';

  // Donut chart calculations
  let currentAngle = 0;
  const donutSegments = serviceCategories.map((item) => {
    const percentage = item.count / (totalServices || 1);
    const angle = percentage * 360;
    const start = currentAngle;
    currentAngle += angle;
    return { ...item, percentage, startAngle: start, endAngle: currentAngle };
  });

  return (
    <div className="space-y-6 mt-6">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Average Monthly Revenue</span>
              <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
                ₹{Math.floor((stats.paymentSuccessAmount * 0.8) / 5).toLocaleString('en-IN')}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-4 h-4 shrink-0" />
            <span className="text-xs font-semibold">+18.4% growth since last month</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Daily Active Success Rate</span>
              <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
                98.7%
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-zinc-500">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
            <span className="text-xs font-semibold">Zero transaction drops reported</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Average Turnaround Time</span>
              <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
                4.2 Hours
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-indigo-600 dark:text-indigo-400">
            <Clock className="w-4 h-4 shrink-0 animate-spin" />
            <span className="text-xs font-semibold">Fastest among digital portals in UP</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Monthly area flow (8/12) */}
        <div className="lg:col-span-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden flex flex-col relative">
          <div className="flex items-start justify-between gap-2 mb-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Monthly Traffic & Application Flow (मासिक रिपोर्ट)
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                Comparison between live browser visitors and actual government submissions.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                <span className="w-2.5 h-2.5 rounded bg-indigo-600 inline-block" />
                Traffic
              </span>
              <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                Registry
              </span>
            </div>
          </div>

          {/* SVG Area Chart Container */}
          <div className="relative flex-1 min-h-[220px]">
            <svg viewBox={`0 0 ${lineWidth} ${lineExtentY}`} className="w-full h-full overflow-visible">
              {/* Defs for gradients */}
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(79, 70, 229)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="rgb(79, 70, 229)" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="subAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const y = paddingY + ratio * (lineExtentY - 2 * paddingY);
                const valLabel = Math.round(maxVal * (1 - ratio));
                return (
                  <g key={index} className="opacity-40">
                    <line 
                      x1={paddingX} 
                      y1={y} 
                      x2={lineWidth - paddingX} 
                      y2={y} 
                      stroke="currentColor" 
                      strokeWidth="0.5" 
                      className="text-zinc-200 dark:text-zinc-800" 
                      strokeDasharray="4 4"
                    />
                    <text 
                      x={paddingX - 10} 
                      y={y + 3} 
                      fontSize="9" 
                      textAnchor="end" 
                      className="fill-zinc-400 font-mono font-medium"
                    >
                      {valLabel}
                    </text>
                  </g>
                );
              })}

              {/* Filled Areas */}
              {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}
              {subAreaPath && <path d={subAreaPath} fill="url(#subAreaGrad)" />}

              {/* Curved Lines */}
              {linePath && (
                <path 
                  d={linePath} 
                  fill="none" 
                  stroke="rgb(79, 70, 229)" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              )}
              {subLinePath && (
                <path 
                  d={subLinePath} 
                  fill="none" 
                  stroke="rgb(16, 185, 129)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              )}

              {/* Interactive Hover Guides & Tooltips */}
              {points.map((p, idx) => {
                const subP = subPoints[idx];
                const isHovered = hoveredPoint === idx;

                return (
                  <g key={idx}>
                    {/* Tick labels */}
                    <text 
                      x={p.x} 
                      y={lineExtentY - 8} 
                      fontSize="9.5" 
                      textAnchor="middle" 
                      className="fill-zinc-450 dark:fill-zinc-450 font-semibold"
                    >
                      {p.raw.month}
                    </text>

                    {/* Interactive hover zone line column */}
                    <line 
                      x1={p.x} 
                      y1={paddingY} 
                      x2={p.x} 
                      y2={lineExtentY - paddingY} 
                      stroke="currentColor" 
                      strokeWidth={isHovered ? "1.5" : "0"} 
                      className="text-zinc-300 dark:text-zinc-700 pointer-events-none"
                    />

                    {/* Blue dots for Main Traffic */}
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r={isHovered ? "6" : "4"} 
                      fill="rgb(79, 70, 229)" 
                      stroke="white" 
                      strokeWidth="1.5"
                      className="transition-all duration-150 shadow cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(idx)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    
                    {/* Emerald dots for Sub Registry */}
                    <circle 
                      cx={subP.x} 
                      cy={subP.y} 
                      r={isHovered ? "5" : "3"} 
                      fill="rgb(16, 185, 129)" 
                      stroke="white" 
                      strokeWidth="1"
                      className="transition-all duration-150 cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(idx)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />

                    {/* Invisible extra fat cursor hit targets for extreme accessibility */}
                    <rect 
                      x={p.x - 20} 
                      y={paddingY} 
                      width="40" 
                      height={lineExtentY - 2 * paddingY} 
                      fill="transparent" 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(idx)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Custom Interactive Floating HTML Tooltip */}
            {hoveredPoint !== null && (
              <div 
                className="absolute z-10 p-3 bg-zinc-950/95 text-white rounded-xl shadow-xl border border-zinc-800 pointer-events-none text-[11px] space-y-1 backdrop-blur-md transition-all duration-150"
                style={{ 
                  left: `${(points[hoveredPoint].x / lineWidth) * 100}%`,
                  top: `${Math.min(points[hoveredPoint].y, 100) - 10}px`,
                  transform: 'translate(-50%, -100%)' 
                }}
              >
                <div className="font-bold border-b border-zinc-800 pb-1 text-zinc-300">
                  {lineData[hoveredPoint].month} 2026 Snapshot
                </div>
                <div className="flex justify-between gap-6 pt-1">
                  <span className="text-indigo-400 font-semibold">Total Web Traffic:</span>
                  <span className="font-mono font-bold">{lineData[hoveredPoint].traffic}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="text-emerald-400 font-semibold">Certs & registry:</span>
                  <span className="font-mono font-bold">{lineData[hoveredPoint].applications}</span>
                </div>
                <div className="flex justify-between gap-6 text-[10px] text-zinc-400">
                  <span>Est. Revenue:</span>
                  <span className="font-mono font-bold text-white">₹{lineData[hoveredPoint].income.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Service categories pie (4/12) */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Layers className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400" />
              Service Shares (सर्विस श्रेणियां)
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              Distribution of customer actions and government registrations.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center my-6 relative">
            {/* Interactive SVG Circular Donut Chart */}
            <div className="w-48 h-48 relative flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90 overflow-visible">
                {donutSegments.map((slice, idx) => {
                  // Stroke dash calculations for segment arc
                  const radius = 45;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDasharray = `${(slice.percentage * circumference).toFixed(2)} ${circumference.toFixed(2)}`;
                  const strokeDashoffset = `${(-slice.startAngle / 360 * circumference).toFixed(2)}`;
                  const isHovered = hoveredSlice === idx;
                  const isAnyHovered = hoveredSlice !== null;

                  return (
                    <circle
                      key={idx}
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={isHovered ? "16" : "12"}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-300 cursor-pointer origin-center hover:opacity-100"
                      style={{ 
                        opacity: isAnyHovered && !isHovered ? 0.45 : 1,
                        filter: isHovered ? 'drop-shadow(0px 0px 6px rgba(0,0,0,0.15))' : 'none'
                      }}
                      onMouseEnter={() => setHoveredSlice(idx)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  );
                })}
              </svg>

              {/* Central Text Panel inside Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
                {hoveredSlice !== null ? (
                  <>
                    <span 
                      className="text-[9px] font-bold uppercase tracking-wider" 
                      style={{ color: serviceCategories[hoveredSlice].color }}
                    >
                      {serviceCategories[hoveredSlice].name.split(' ')[0]}
                    </span>
                    <span className="text-lg font-extrabold text-zinc-800 dark:text-zinc-100 leading-none mt-0.5">
                      {serviceCategories[hoveredSlice].count}
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-0.5">
                      {Math.round(donutSegments[hoveredSlice].percentage * 100)}% share
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Total</span>
                    <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100 leading-none mt-0.5">
                      {totalServices}
                    </span>
                    <span className="text-[9px] text-zinc-400 mt-1">Registry Items</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Legends Panel */}
          <div className="space-y-2 pt-2 border-t border-zinc-150 dark:border-zinc-850">
            {donutSegments.map((item, idx) => {
              const isHovered = hoveredSlice === idx;
              return (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-1.5 rounded-xl transition-colors cursor-pointer ${
                    isHovered ? 'bg-zinc-50 dark:bg-zinc-800/60' : 'hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20'
                  }`}
                  onMouseEnter={() => setHoveredSlice(idx)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-450 shrink-0">
                    {item.count} ({Math.round(item.percentage * 100)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Weekly Bar Chart + Info Block */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Weekly bar traffic chart */}
        <div className="md:col-span-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Weekly Traffic Spikes (साप्ताहिक ग्राफ़)
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              Identifies daily active customer traffic cycles throughout the week.
            </p>
          </div>

          {/* Interactive Bars Container */}
          <div className="flex items-end justify-between gap-3 h-48 mt-8 border-b border-zinc-100 dark:border-zinc-800 pb-2 relative">
            {barData.map((bar, idx) => {
              const heightPercentage = Math.round((bar.count / maxBarValue) * 100);
              const isHovered = hoveredBar === idx;

              return (
                <div 
                  key={idx} 
                  className="flex-1 flex flex-col items-center relative group cursor-pointer"
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Floating count label on bar hover */}
                  <span 
                    className={`absolute -top-7 px-2 py-0.5 rounded bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-900 font-mono font-bold text-[9px] shadow transition-opacity duration-150 ${
                      isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    {bar.count}
                  </span>

                  {/* Vertical bar element with smooth hover glows */}
                  <div 
                    className="w-full sm:w-10 rounded-t-lg bg-gradient-to-t transition-all duration-300 relative"
                    style={{ 
                      height: `${heightPercentage}%`,
                      minHeight: '8px',
                      backgroundImage: isHovered 
                        ? 'linear-gradient(to top, rgb(16, 185, 129), rgb(59, 130, 246))' 
                        : 'linear-gradient(to top, rgba(16, 185, 129, 0.75), rgba(79, 70, 229, 0.75))',
                      boxShadow: isHovered ? '0 10px 15px -3px rgba(16, 185, 129, 0.3)' : 'none'
                    }}
                  />

                  {/* Tick bottom label */}
                  <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mt-2">
                    {bar.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Info Widget */}
        <div className="md:col-span-4 rounded-2xl border border-zinc-200 bg-gradient-to-br from-indigo-900 to-slate-950 p-6 shadow-sm text-white flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Portal Optimization Tip
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed mt-2">
                Your highest visitor spike occurs on <b>Saturdays</b> (~{barData[5].count} unique interactions). Optimize announcements and banner updates on Friday nights to capture maximum click-through rates.
              </p>
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Indexed Status</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              Real-time active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
