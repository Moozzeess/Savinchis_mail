"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle2, XCircle, MousePointerClick } from "lucide-react"
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
      <Card className="group relative overflow-hidden border border-border/50 bg-card hover:border-primary/30 transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground/80">Total de correos</CardTitle>
          <div className="p-2 rounded-full bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 transition-colors duration-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50">
            <Mail className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold text-foreground">
            <AnimatedNumber value={stats.totalEmails} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="text-blue-600 dark:text-blue-400">{stats.sent} enviados</span> • 
            <span className="text-amber-600 dark:text-amber-400"> {stats.pending} pendientes</span>
          </p>
        </CardContent>
      </Card>

      {/* Apertura */}
      <Card className="group relative overflow-hidden border border-border/50 bg-card hover:border-primary/30 transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground/80">Tasa de apertura</CardTitle>
          <div className="p-2 rounded-full bg-green-100/80 dark:bg-green-900/30 text-green-600 dark:text-green-300 transition-colors duration-300 group-hover:bg-green-100 dark:group-hover:bg-green-900/50">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold text-foreground">
            <AnimatedNumber value={openRate} formatter={(n) => `${Math.round(n)}%`} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="text-green-600 dark:text-green-400">{stats.opened}</span> de {stats.sent} correos abiertos
          </p>
        </CardContent>
      </Card>

      {/* Clics */}
      <Card className="group relative overflow-hidden border border-border/50 bg-card hover:border-primary/30 transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground/80">Tasa de clics</CardTitle>
          <div className="p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 transition-colors duration-300 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50">
            <MousePointerClick className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold text-foreground">
            <AnimatedNumber value={clickRate} formatter={(n) => `${Math.round(n)}%`} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="text-purple-600 dark:text-purple-400">{stats.clicked}</span> de {stats.sent} clics registrados
          </p>
        </CardContent>
      </Card>

      {/* Fallidos */}
      <Card className="group relative overflow-hidden border border-border/50 bg-card hover:border-primary/30 transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground/80">Correos fallidos</CardTitle>
          <div className="p-2 rounded-full bg-rose-100/80 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 transition-colors duration-300 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/50">
            <XCircle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold text-foreground">
            <AnimatedNumber value={stats.failed} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="text-rose-600 dark:text-rose-400">
              <AnimatedNumber value={failRate} formatter={(n) => `${Math.round(n)}%`} />
            </span> de tasa de error
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
