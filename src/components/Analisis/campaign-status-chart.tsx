"use client"

import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"

// Datos de ejemplo. En una aplicación real, esto vendría de tus props o API.
const data = [
  { name: "Completadas", value: 22, color: "#22c55e" },
  { name: "Activas", value: 5, color: "#3b82f6" },
  { name: "Borrador", value: 8, color: "#64748b" },
  { name: "Canceladas", value: 2, color: "#ef4444" },
]

// Calculamos el total para mostrarlo en el centro
const totalCampaigns = data.reduce((acc, curr) => acc + curr.value, 0);

export function CampaignStatusChart() {
  return (
    <div className="relative w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            cursor={{ fill: "transparent" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {payload[0].name}
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0].value} Campañas
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend 
            iconType="circle"
            layout="vertical"
            verticalAlign="middle"
            align="right"
            formatter={(value) => <span className="text-sm text-slate-600 dark:text-slate-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {totalCampaigns}
        </span>
        <p className="text-xs text-muted-foreground">Campañas</p>
      </div>
    </div>
  )
}