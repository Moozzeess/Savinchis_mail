"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts"

// Datos de ejemplo para las campañas con mejor rendimiento
const data = [
  { name: "Lanzamiento Producto X", openRate: 45.8, fill: "hsl(var(--chart-1))" },
  { name: "Boletín Mensual Sept.", openRate: 35.2, fill: "hsl(var(--chart-2))" },
  { name: "Promoción Verano", openRate: 28.5, fill: "hsl(var(--chart-3))" },
  { name: "Webinar Tech", openRate: 25.1, fill: "hsl(var(--chart-4))" },
  { name: "Encuesta de Satisfacción", openRate: 22.7, fill: "hsl(var(--chart-5))" },
]

export function TopCampaignsChart() {
  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            horizontal={false} 
            strokeOpacity={0.2} 
            stroke="hsl(var(--border))"
          />
          <XAxis 
            type="number" 
            tickFormatter={(value) => `${value}%`} 
            domain={[0, 'dataMax + 5']}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={120}
            tick={{ 
              fontSize: 12, 
              fill: 'hsl(var(--muted-foreground))',
            }}
            className="capitalize"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ 
              fill: 'hsl(var(--accent) / 0.1)',
              stroke: 'hsl(var(--accent))',
              strokeWidth: 1,
              strokeDasharray: '3 3',
            }}
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            itemStyle={{ 
              color: 'hsl(var(--foreground))',
              textTransform: 'capitalize',
              fontSize: '0.875rem',
            }}
            labelStyle={{
              color: 'hsl(var(--muted-foreground))',
              fontSize: '0.75rem',
              marginBottom: '4px',
              borderBottom: '1px solid hsl(var(--border))',
              paddingBottom: '4px',
            }}
            formatter={(value, name, props) => {
              return [`${value}%`, 'Tasa de apertura'];
            }}
          />
          <Bar 
            dataKey="openRate" 
            radius={[0, 4, 4, 0]} 
            fill="hsl(var(--primary))"
            className="fill-primary"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill}
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}