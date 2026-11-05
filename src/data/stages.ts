// Узлы конвейера обработки письма. Порядок массива = порядок на треке.
import {
  ICON_ENVELOPE,
  ICON_FLASK,
  ICON_GLOBE,
  ICON_MAGNIFIER,
  ICON_MONITOR,
  ICON_SHIELD,
  type PixelMap,
} from '../pixel/maps'

export type StageId = 'sender' | 'internet' | 'gateway' | 'checks' | 'sandbox' | 'endpoint'

export interface Stage {
  id: StageId
  icon: PixelMap
  label: string
  hint: string
}

export const STAGES: readonly Stage[] = [
  { id: 'sender', icon: ICON_MONITOR, label: 'Отправитель', hint: 'Откуда выходит письмо' },
  { id: 'internet', icon: ICON_GLOBE, label: 'Интернет', hint: 'Передача почты между серверами' },
  { id: 'gateway', icon: ICON_SHIELD, label: 'Почтовый шлюз', hint: 'Приём письма и проверка подлинности' },
  { id: 'checks', icon: ICON_MAGNIFIER, label: 'Антиспам и антивирус', hint: 'Оценка письма и сигнатурный контроль' },
  { id: 'sandbox', icon: ICON_FLASK, label: 'Анализ и песочница', hint: 'Глубокая проверка вложения' },
  { id: 'endpoint', icon: ICON_ENVELOPE, label: 'Финал', hint: 'Ящик адресата или карантин' },
] as const

export const STAGE_ORDER: Record<StageId, number> = Object.fromEntries(
  STAGES.map((s, i) => [s.id, i]),
) as Record<StageId, number>
