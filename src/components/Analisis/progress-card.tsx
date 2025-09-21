"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

export type ProgressStats = {
  progress: number
  timeRemaining?: string
  sent: number
  total: number
}

type Props = {
  stats: ProgressStats
  title?: string
}

export function ProgressCard({ stats, title = "Progreso de campaña" }: Props) {
  const { progress, timeRemaining, sent, total } = stats

  return (
    <Card className="group relative overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:bg-card/90 dark:hover:bg-card/80">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-foreground">{title}</CardTitle>
          {timeRemaining ? (
            <div className="hidden sm:flex items-center text-xs sm:text-sm bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground/90 px-3 py-1.5 rounded-full transition-colors duration-300 group-hover:bg-primary/20 dark:group-hover:bg-primary/30">
              <Clock className="w-4 h-4 mr-1.5" />
              <span>{timeRemaining}</span>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between text-sm">
            <span className="font-medium text-foreground/80">
              Progreso: <span className="font-semibold text-primary">{progress}%</span>
            </span>
            <span className="font-medium text-foreground/80">
              {sent} de {total} correos
            </span>
          </div>
          <div className="relative">
            <Progress
              value={progress}
              thickness="md"
              animated
              showMarker
              className="h-2.5 bg-muted/50 dark:bg-muted/30"
              indicatorClassName="bg-gradient-to-r from-primary to-primary/80"
            />
            <div 
              className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
