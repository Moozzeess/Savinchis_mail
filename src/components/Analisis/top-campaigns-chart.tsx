"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

// Datos de ejemplo para las campañas con mejor rendimiento
const data = [
  { name: "Lanzamiento Producto X", openRate: 45.8, fill: "#8884d8" },
  { name: "Boletín Mensual Sept.", openRate: 35.2, fill: "#82ca9d" },
  { name: "Promoción Verano", openRate: 28.5, fill: "#ffc658" },
  { name: "Webinar Tech", openRate: 25.1, fill: "#ff8042" },
  { name: "Encuesta de Satisfacción", openRate: 22.7, fill: "#00C49F" },
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
          <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.2} />
          <XAxis 
            type="number" 
            tickFormatter={(value) => `${value}%`} 
            domain={[0, 'dataMax + 5']}
            stroke="#888888"
            fontSize={12}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={120}
            tick={{ fontSize: 12, fill: '#888888' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(240, 240, 240, 0.2)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <p className="font-bold">{`${payload[0].payload.name}`}</p>
                    <p className="text-sm text-muted-foreground">
                      Tasa de apertura: {`${payload[0].value}%`}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="openRate" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}