"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData: any[] = []

const chartConfig = {
  sent: {
    label: "Enviados",
    color: "hsl(var(--chart-1))",
  },
  open: {
    label: "Aperturas",
    color: "hsl(var(--chart-2))",
  },
}

/**
 * Componente que renderiza los gráficos de analíticas para el rendimiento de las campañas.
 * Muestra un gráfico de barras con datos de correos enviados y tasas de apertura.
 */
export function AnalyticsCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimiento de Campañas</CardTitle>
        <CardDescription>Datos de los últimos 6 meses.</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-muted-foreground">
            <p>No hay datos para mostrar.</p>
            <p className="text-xs">Envía campañas para ver el rendimiento aquí.</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="sent" fill="var(--color-sent)" radius={4} />
              <Bar dataKey="open" fill="var(--color-open)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
