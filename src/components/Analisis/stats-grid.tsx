"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle2, XCircle } from "lucide-react"
import { AnimatedNumber } from "@/components/ui/animated-number"

export type CampaignStats = {
  totalEmails: number
  sent: number
  pending: number
  opened: number
  clicked: number
  failed: number
}

type Props = {
  stats: CampaignStats
}

export function StatsGrid({ stats }: Props) {
  const openRate = Math.round((stats.opened / (stats.sent || 1)) * 100) || 0
  const clickRate = Math.round((stats.clicked / (stats.sent || 1)) * 100) || 0
  const failRate = Math.round((stats.failed / (stats.totalEmails || 1)) * 100) || 0

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Total */}
      <Card hoverable className="border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Total de correos</CardTitle>
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
            <Mail className="h-4 w-4 text-blue-600 dark:text-blue-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            <AnimatedNumber value={stats.totalEmails} />
          </div>
          <p className="text-xs text-blue-700/80 dark:text-blue-300/80">
            {stats.sent} enviados • {stats.pending} pendientes
          </p>
        </CardContent>
      </Card>

      {/* Apertura */}
      <Card hoverable className="border-green-200 dark:border-green-900/50 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Tasa de apertura</CardTitle>
          <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            <AnimatedNumber value={openRate} formatter={(n) => `${Math.round(n)}%`} />
          </div>
          <p className="text-xs text-green-700/80 dark:text-green-300/80">
            {stats.opened} de {stats.sent} correos abiertos
          </p>
        </CardContent>
      </Card>

      {/* Clics */}
      <Card hoverable className="border-purple-200 dark:border-purple-900/50 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">Tasa de clics</CardTitle>
        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
            <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            <AnimatedNumber value={clickRate} formatter={(n) => `${Math.round(n)}%`} />
          </div>
          <p className="text-xs text-purple-700/80 dark:text-purple-300/80">
            {stats.clicked} de {stats.sent} clics registrados
          </p>
        </CardContent>
      </Card>

      {/* Fallidos */}
      <Card hoverable className="border-rose-200 dark:border-rose-900/50 bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/20 dark:to-rose-900/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-rose-800 dark:text-rose-200">Correos fallidos</CardTitle>
          <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-900/50">
            <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-900 dark:text-rose-100">
            <AnimatedNumber value={stats.failed} />
          </div>
          <p className="text-xs text-rose-700/80 dark:text-rose-300/80">
            <AnimatedNumber value={failRate} formatter={(n) => `${Math.round(n)}%`} /> de tasa de error
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
