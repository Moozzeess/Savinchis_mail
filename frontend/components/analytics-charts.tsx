"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@frontend/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@frontend/components/ui/chart"

const chartData = [
  { month: "Enero", sent: 186, open: 80 },
  { month: "Febrero", sent: 305, open: 200 },
  { month: "Marzo", sent: 237, open: 120 },
  { month: "Abril", sent: 73, open: 190 },
  { month: "Mayo", sent: 209, open: 130 },
  { month: "Junio", sent: 214, open: 140 },
]

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
        <CardDescription>Enero - Junio 2024</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
