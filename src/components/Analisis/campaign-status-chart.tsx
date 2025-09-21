"use client"

import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"

// Datos de ejemplo. En una aplicación real, esto vendría de tus props o API.
const data = [
  { name: "Completadas", value: 22, color: "hsl(var(--chart-2))" },
  { name: "Activas", value: 5, color: "hsl(var(--chart-1))" },
  { name: "Borrador", value: 8, color: "hsl(var(--muted-foreground))" },
  { name: "Canceladas", value: 2, color: "hsl(var(--destructive))" },
]

// Calculamos el total para mostrarlo en el centro
const totalCampaigns = data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);

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
                  <div className="rounded-lg border bg-background p-3 shadow-sm border-border">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: payload[0].payload.fill || payload[0].color }}
                        />
                        <span className="text-sm font-medium text-foreground">
                          {payload[0].name}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-foreground">
                        {payload[0]?.value || 0} Campañas
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {payload[0]?.value ? `${((Number(payload[0].value) / totalCampaigns) * 100).toFixed(1)}% del total` : '0% del total'}
                      </span>
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
            wrapperStyle={{
              paddingLeft: '10px',
            }}
            formatter={(value, entry: any, index) => (
              <span className="text-sm text-foreground/80">
                {value}
              </span>
            )}
            content={({ payload }) => {
              if (!payload) return null;
              return (
                <div className="flex flex-col gap-2">
                  {payload.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-foreground/80">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="text-2xl font-bold text-foreground">
          {totalCampaigns}
        </span>
        <p className="text-xs text-muted-foreground">Campañas en total</p>
      </div>
    </div>
  )
}