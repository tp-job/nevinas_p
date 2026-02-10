# Dashboard Code Examples - Before & After

## 1. StatsCard Component

### Before (Recharts)
```tsx
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

<div className="w-28 h-24">
    <ResponsiveContainer width="120%" height="100%">
        <AreaChart data={data}>
            <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${dataKey})`}
            />
        </AreaChart>
    </ResponsiveContainer>
</div>
```

### After (MUI X-Charts)
```tsx
import { LineChart } from '@mui/x-charts/LineChart';

const xAxisData = data.map((_, index) => index);
const seriesData = data.map(item => item[dataKey]);

<div className="h-20 -mx-2 mt-4">
    <LineChart
        xAxis={[{ 
            data: xAxisData,
            hideTooltip: true,
            disableLine: true,
            disableTicks: true,
        }]}
        series={[
            {
                data: seriesData,
                color: color,
                area: true,
                showMark: false,
            },
        ]}
        height={80}
        margin={{ top: 10, bottom: 0, left: 0, right: 0 }}
        sx={{
            '& .MuiLineElement-root': {
                strokeWidth: 2.5,
            },
            '& .MuiAreaElement-root': {
                fill: `url(#gradient-${dataKey})`,
                fillOpacity: 0.3,
            },
        }}
    >
        <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
        </defs>
    </LineChart>
</div>
```

**Benefits:**
- ✅ Cleaner API with better TypeScript support
- ✅ Built-in responsive behavior
- ✅ Better performance with optimized rendering
- ✅ Easier customization via `sx` prop
- ✅ More consistent with Material Design

---

## 2. PieChart Component

### Before (Recharts)
```tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const languageData = [
    { name: 'TypeScript', value: 45, color: 'url(#gradient-blue)' },
    { name: 'JavaScript', value: 25, color: 'url(#gradient-yellow)' },
    // ...
];

<ResponsiveContainer width="100%" height="100%">
    <PieChart>
        <defs>
            <linearGradient id="gradient-blue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
        </defs>
        <Pie
            data={languageData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
        >
            {languageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="bottom" height={36} />
    </PieChart>
</ResponsiveContainer>
```

### After (MUI X-Charts)
```tsx
import { PieChart } from '@mui/x-charts/PieChart';

const languageData = [
    { id: 0, value: 45, label: 'TypeScript', color: '#6B9FE8' },
    { id: 1, value: 25, label: 'JavaScript', color: '#F4C542' },
    // ...
];

<PieChart
    series={[
        {
            data: languageData,
            innerRadius: 70,
            outerRadius: 110,
            paddingAngle: 2,
            cornerRadius: 6,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 65, additionalRadius: -5, color: 'gray' },
        },
    ]}
    height={320}
    slotProps={{
        legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: { top: 20 },
            itemMarkWidth: 12,
            itemMarkHeight: 12,
            markGap: 6,
            itemGap: 16,
            labelStyle: {
                fontSize: 13,
                fill: isDark ? '#bfc0d1' : '#64748b',
                fontWeight: 500,
            },
        },
    }}
    sx={{
        '& .MuiChartsLegend-mark': {
            rx: 2,
        },
    }}
/>
```

**Benefits:**
- ✅ No need for manual Cell mapping
- ✅ Built-in highlight effects
- ✅ Better legend customization
- ✅ Rounded corners support
- ✅ Simpler data structure

---

## 3. BarChart Component

### Before (Recharts)
```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const frameworkData = [
    { name: 'React', value: 90, color: 'url(#gradient-cyan)' },
    { name: 'Tailwind', value: 85, color: 'url(#gradient-blue)' },
    // ...
];

<ResponsiveContainer width="100%" height="100%">
    <BarChart
        data={frameworkData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
    >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis 
            dataKey="name" 
            type="category" 
            tick={{ fill: '#64748b', fontSize: 12 }}
            width={70}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
            {frameworkData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
        </Bar>
    </BarChart>
</ResponsiveContainer>
```

### After (MUI X-Charts)
```tsx
import { BarChart } from '@mui/x-charts/BarChart';

const frameworkData = [
    { framework: 'React', value: 90 },
    { framework: 'Tailwind', value: 85 },
    // ...
];

<BarChart
    dataset={frameworkData}
    yAxis={[{ 
        scaleType: 'band', 
        dataKey: 'framework',
        categoryGapRatio: 0.4,
        barGapRatio: 0.2,
    }]}
    xAxis={[{ 
        min: 0, 
        max: 100,
        tickMinStep: 20,
    }]}
    series={[
        { 
            dataKey: 'value',
            color: '#B18FE8',
        },
    ]}
    layout="horizontal"
    height={320}
    margin={{ left: 80, right: 20, top: 10, bottom: 30 }}
    grid={{ vertical: true }}
    sx={{
        '& .MuiChartsAxis-line': {
            stroke: isDark ? '#334155' : '#e2e8f0',
        },
        '& .MuiChartsAxis-tickLabel': {
            fill: isDark ? '#bfc0d1' : '#64748b',
            fontSize: 13,
            fontWeight: 500,
        },
        '& .MuiChartsGrid-line': {
            stroke: isDark ? '#334155' : '#f1f5f9',
            strokeDasharray: '4 4',
        },
        '& .MuiBarElement-root': {
            rx: 6,
            ry: 6,
        },
    }}
/>
```

**Benefits:**
- ✅ Dataset-based API (cleaner data structure)
- ✅ Better axis configuration
- ✅ More flexible styling with `sx`
- ✅ Built-in grid support
- ✅ No need for manual Cell mapping

---

## 4. Card Styling Evolution

### Before
```tsx
<div className={`
    relative overflow-hidden rounded-xl p-6 border transition-all duration-300
    ${isDark
        ? 'bg-[#1e202c] border-[#2d3748] shadow-[0_0_20px_rgba(0,0,0,0.3)]'
        : 'bg-light-surface border-light-border'}
`}>
```

### After
```tsx
<div className={`
    relative overflow-hidden rounded-2xl p-6 transition-all duration-300 
    hover:shadow-xl hover:-translate-y-1
    ${isDark
        ? 'bg-[#1e202c] border border-[#2d3748] shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
        : 'bg-white border-0 shadow-[0_2px_16px_rgba(0,0,0,0.06)]'}
`}>
    {/* Subtle gradient accent */}
    <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-60"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}99)` }}
    />
```

**Improvements:**
- ✅ Softer corners (`rounded-2xl` vs `rounded-xl`)
- ✅ Floating effect with subtle shadow
- ✅ Hover animations (lift + shadow increase)
- ✅ Gradient accent bar for visual interest
- ✅ Clean white background in light mode

---

## 5. Dashboard Header Evolution

### Before
```tsx
<div className="flex flex-col lg:flex-row items-center justify-between mb-8">
    <div>
        <h4 className="mb-1 text-lg">Developer Analytics</h4>
        <h2 className="mb-1 text-4xl sm:text-5xl">Dashboard</h2>
        <h3 className="text-xl font-zen">概要</h3>
    </div>
</div>
```

### After
```tsx
<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 pb-6 
     border-b border-slate-200/60">
    <div>
        <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center 
                 ${isDark 
                     ? 'bg-gradient-to-br from-cyan-500 to-blue-600' 
                     : 'bg-gradient-to-br from-blue-500 to-purple-600'} 
                 shadow-lg`}>
                <i className="ri-dashboard-3-line text-white text-xl"></i>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">
                    Developer Analytics
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                    Dashboard
                </h2>
            </div>
        </div>
        <p className="text-sm ml-15 text-slate-600">
            概要 • Overview of your development activity
        </p>
    </div>
    <div className="mt-4 lg:mt-0 flex gap-3">
        <button className="px-4 py-2 rounded-xl text-sm font-medium 
                bg-white text-slate-700 hover:bg-slate-50 shadow-sm">
            <i className="ri-filter-3-line mr-2"></i>
            Filter
        </button>
        <button className="px-4 py-2 rounded-xl text-sm font-medium 
                bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                hover:from-blue-500 hover:to-purple-500 shadow-md">
            <i className="ri-download-2-line mr-2"></i>
            Export
        </button>
    </div>
</div>
```

**Improvements:**
- ✅ Icon badge for visual hierarchy
- ✅ Better typography structure
- ✅ Action buttons with gradients
- ✅ Border separator
- ✅ Enhanced spacing and alignment

---

## 6. Repository Card Enhancement

### Before
```tsx
<a className="block p-6 rounded-xl border transition-all duration-300">
    <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold truncate pr-4">
            {name}
        </h3>
        <div className="px-2 py-1 rounded-full text-xs font-medium border">
            Public
        </div>
    </div>
    <p className="text-sm mb-4 line-clamp-2">{description}</p>
    <div className="flex items-center gap-4 text-xs">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: languageColor }} />
        <span>{language}</span>
        {/* ... */}
    </div>
</a>
```

### After
```tsx
<a className="group block p-6 rounded-2xl transition-all duration-300 
     hover:-translate-y-1 hover:shadow-xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
    <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50">
                <i className="ri-folder-3-line text-lg text-blue-500"></i>
            </div>
            <h3 className="text-lg font-bold truncate text-slate-800 
                 group-hover:text-blue-600 transition-colors">
                {name}
            </h3>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-semibold 
             bg-slate-100 text-slate-600">
            Public
        </div>
    </div>
    <p className="text-sm mb-5 line-clamp-2 min-h-[2.5rem] text-slate-600">
        {description}
    </p>
    <div className="flex items-center gap-4 text-xs flex-wrap">
        <span className="w-3 h-3 rounded-full ring-2 ring-offset-2" 
              style={{ backgroundColor: languageColor }} />
        <span className="font-medium text-slate-600">{language}</span>
        <i className="ri-time-line mr-1"></i>
        {/* ... */}
    </div>
</a>
```

**Improvements:**
- ✅ Folder icon with background
- ✅ Group hover effects
- ✅ Ring effect on language indicator
- ✅ Better spacing and typography
- ✅ Enhanced visual hierarchy

---

## Color Palette Comparison

### Before (Bold Colors)
```tsx
const colors = {
    green: '#10b981',   // Bright green
    blue: '#3b82f6',    // Bright blue
    purple: '#8b5cf6',  // Bright purple
};
```

### After (Soft Pastels)
```tsx
const colors = {
    green: '#6FD195',   // Soft pastel green
    blue: '#6B9FE8',    // Soft pastel blue
    purple: '#B18FE8',  // Soft pastel purple
    cyan: '#5EC4CD',    // Soft pastel cyan
    yellow: '#F4C542',  // Soft pastel yellow
    orange: '#FF9A76',  // Soft pastel orange
    pink: '#F4A6D7',    // Soft pastel pink
};
```

**Why Soft Pastels?**
- ✅ More professional and modern
- ✅ Better for long viewing sessions (less eye strain)
- ✅ Matches SaaS design trends
- ✅ Works better with white backgrounds
- ✅ Creates a calm, focused atmosphere

---

## Summary of Key Changes

### Technical Improvements
1. **Recharts → MUI X-Charts**: Better performance, cleaner API
2. **TypeScript Support**: Improved type safety
3. **Responsive Design**: Built-in responsive behavior
4. **Accessibility**: Better ARIA support

### Design Improvements
1. **Color Palette**: Bold → Soft pastels
2. **Shadows**: Harsh → Soft floating effect
3. **Corners**: Sharp → Rounded (2xl)
4. **Spacing**: Tighter → More breathing room
5. **Typography**: Simple → Hierarchical
6. **Interactions**: Basic → Smooth animations

### User Experience
1. **Visual Hierarchy**: Clear information structure
2. **Hover Effects**: Engaging micro-interactions
3. **Loading States**: Smooth transitions
4. **Responsive**: Works on all screen sizes
5. **Accessibility**: Screen reader friendly

---

## Migration Guide

If you want to apply similar changes to other components:

1. **Replace Recharts imports:**
   ```tsx
   // Before
   import { AreaChart, Area } from 'recharts';
   
   // After
   import { LineChart } from '@mui/x-charts/LineChart';
   ```

2. **Update data structure:**
   ```tsx
   // Before
   const data = [{ name: 'A', value: 10 }];
   
   // After
   const data = [{ id: 0, label: 'A', value: 10 }];
   ```

3. **Use sx prop for styling:**
   ```tsx
   sx={{
       '& .MuiLineElement-root': { strokeWidth: 2.5 },
       '& .MuiChartsAxis-tickLabel': { fill: '#64748b' },
   }}
   ```

4. **Update card styling:**
   ```tsx
   className="rounded-2xl p-6 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] 
              hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
   ```

5. **Add gradient accents:**
   ```tsx
   <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ background: 'linear-gradient(90deg, #6B9FE8, #B18FE8)' }} />
   ```

---

## Resources

- [MUI X-Charts Documentation](https://mui.com/x/react-charts/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Figma Design Inspiration](https://www.figma.com/community)
- [Dribbble SaaS Designs](https://dribbble.com/tags/saas-dashboard)

---

**Last Updated:** December 11, 2025
**Version:** 2.0.0
**Author:** Dashboard Redesign Project

