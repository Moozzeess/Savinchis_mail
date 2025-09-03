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
    <Card hoverable className="border-primary/20 dark:border-primary/30 bg-gradient-to-br from-card to-primary/5 dark:from-card/80 dark:to-primary/10">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-primary dark:text-primary-foreground">{title}</CardTitle>
          {timeRemaining ? (
            <div className="hidden sm:flex items-center text-xs sm:text-sm text-muted-foreground bg-primary/5 dark:bg-primary/20 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4 mr-1.5 text-primary dark:text-primary-foreground/80" />
              <span className="text-primary dark:text-primary-foreground/80">{timeRemaining}</span>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between text-sm text-muted-foreground">
            <span className="font-medium">Progreso: <span className="text-primary dark:text-primary-foreground">{progress}%</span></span>
            <span className="font-medium">{sent} de {total} correos</span>
          </div>
          <Progress
            value={progress}
            thickness="md"
            animated
            showMarker
            className="bg-primary/10 dark:bg-primary/20"
            indicatorClassName="bg-gradient-to-r from-primary to-primary/70"
          />
        </div>
      </CardContent>
    </Card>
  )
}
