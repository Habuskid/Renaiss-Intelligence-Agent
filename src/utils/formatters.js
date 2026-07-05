export function formatUSD(cents) {
  if (cents === null || cents === undefined) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(cents / 100)
}

export function formatDelta(pct) {
  if (pct === null || pct === undefined) return '—'
  const prefix = pct > 0 ? '+' : ''
  return `${prefix}${pct.toFixed(1)}%`
}

export function formatDate(iso) {
  if (!iso) return '—'
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function deltaColor(pct) {
  if (pct === null || pct === undefined || pct === 0) return 'text-stone-400'
  return pct > 0 ? 'text-green-600' : 'text-red-600'
}
