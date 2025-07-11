'use client'

import { FC } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
  total: number;
  limit: number;
}

export const PaginationControls: FC<PaginationControlsProps> = (
  { total, limit }
) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = searchParams.get('page') ?? '1'

  const hasPrevPage = Number(page) > 1
  const hasNextPage = (Number(page) * limit) < total

  return (
    <div className='flex gap-2 justify-center'>
      <Button
        variant="outline"
        disabled={!hasPrevPage}
        onClick={() => {
          router.push(`?page=${Number(page) - 1}`)
        }}>
        Anterior
      </Button>

      <div className='flex items-center justify-center px-4'>
        Página {page}
      </div>

      <Button
        variant="outline"
        disabled={!hasNextPage}
        onClick={() => {
          router.push(`?page=${Number(page) + 1}`)
        }}>
        Siguiente
      </Button>
    </div>
  )
}
