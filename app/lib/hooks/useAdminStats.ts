'use client'

import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api/admin'
import type { DashboardStats } from '@/lib/types/admin'

/**
 * Hook for fetching admin dashboard statistics
 */
export function useAdminStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminApi.getDashboard()
      setStats(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard stats'
      setError(errorMessage)
      console.error('Error fetching dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}
