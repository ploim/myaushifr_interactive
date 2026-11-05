import type { CSSProperties, ReactNode } from 'react'
import type { PixelMap } from './maps'

interface PixelSpriteProps {
  map: PixelMap
  palette?: Record<string, string>
  className?: string
  title?: string
  style?: CSSProperties
}

/** Рисует пиксельную карту как SVG из прямоугольников (1 символ = 1 пиксель). */
export function PixelSprite({ map, palette, className, title, style }: PixelSpriteProps) {
  const w = map[0].length
  const h = map.length
  const rects: ReactNode[] = []
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const ch = map[y][x]
      if (ch === '.') continue
      rects.push(
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={palette?.[ch] ?? 'currentColor'} />,
      )
    }
  }
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      style={style}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      shapeRendering="crispEdges"
    >
      {title && <title>{title}</title>}
      {rects}
    </svg>
  )
}
