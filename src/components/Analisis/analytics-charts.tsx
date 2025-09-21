"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

// Datos de ejemplo para la evolución en un rango de fechas (sin cambios)
const data = [
  { date: "15 Sep", aperturas: 22.5, clics: 3.1 },
  { date: "16 Sep", aperturas: 24.8, clics: 3.5 },
  { date: "17 Sep", aperturas: 21.2, clics: 2.9 },
  { date: "18 Sep", aperturas: 28.3, clics: 4.2 },
  { date: "19 Sep", aperturas: 26.9, clics: 3.9 },
  { date: "20 Sep", aperturas: 32.1, clics: 4.8 },
  { date: "21 Sep", aperturas: 30.5, clics: 4.5 },
]

export function AnalyticsCharts() {
  return (
    <div className="w-full h-full"> {/* Asegura que el div padre ocupa toda la altura disponible */}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorAperturas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorClics" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            strokeOpacity={0.2} 
            stroke="hsl(var(--border))"
          />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              backdropFilter: 'blur(5px)',
              color: 'hsl(var(--foreground))',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
            labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
          />
          <Legend 
            iconType="circle"
            layout="horizontal" // La leyenda se mostrará en horizontal
            verticalAlign="top" // Se alinea en la parte superior del gráfico
            align="right"       // Se alinea a la derecha
            wrapperStyle={{ paddingTop: 10, paddingRight: 20 }} // Espaciado para que no toque el borde
            formatter={(value) => <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">{value}</span>}
          />
          <Area 
            type="monotone" 
            dataKey="aperturas" 
            stroke="hsl(var(--chart-1))" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorAperturas)" 
          />
          <Area 
            type="monotone" 
            dataKey="clics" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorClics)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}