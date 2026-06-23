import { Layers, Grid3x3, Box, FileText, Droplet, Brush, type LucideProps } from 'lucide-react'

const MAP: Record<string, React.ComponentType<LucideProps>> = {
  trowel: Layers,
  wall: Grid3x3,
  box: Box,
  doc: FileText,
  layers: Layers,
  drop: Droplet,
  brush: Brush,
}

export const ICON_KEYS = ['trowel', 'wall', 'box', 'doc', 'layers', 'drop', 'brush']

export function CatIcon({ iconKey, size = 21 }: { iconKey?: string | null; size?: number }) {
  const C = MAP[iconKey ?? 'box'] ?? Box
  return <C size={size} />
}
