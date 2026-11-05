// Треки узлов инфраструктуры: у каждого сценария свой конвейер.
// Порядок массива = порядок на треке. evil — узлы атакующего (красная подсветка).
import {
  ICON_CHART,
  ICON_CHIP,
  ICON_EDR,
  ICON_ENVELOPE,
  ICON_EYE,
  ICON_FLASK,
  ICON_FUNNEL,
  ICON_GLOBE,
  ICON_KEY,
  ICON_LOCK,
  ICON_MAGNIFIER,
  ICON_MONITOR,
  ICON_PHONE,
  ICON_RADAR,
  ICON_SERVER,
  ICON_SHIELD,
  ICON_USER,
  ICON_WALL,
  type PixelMap,
} from '../pixel/maps'

/** Состояние узла на треке (переопределяет палитру иконки). */
export type NodeState =
  | 'future'
  | 'current'
  | 'passed'
  | 'blocked'
  | 'quarantine'
  | 'delivered'
  | 'defended'

export interface Stage {
  id: string
  icon: PixelMap
  label: string
  evil?: boolean
}

/** Путь письма: злоумышленник → … → карантин. */
export const MAIL_STAGES: readonly Stage[] = [
  { id: 'sender', icon: ICON_MONITOR, label: 'Злоумышленник', evil: true },
  { id: 'internet', icon: ICON_GLOBE, label: 'Интернет' },
  { id: 'gateway', icon: ICON_SHIELD, label: 'Почтовый шлюз' },
  { id: 'checks', icon: ICON_MAGNIFIER, label: 'Антиспам и антивирус' },
  { id: 'sandbox', icon: ICON_FLASK, label: 'Песочница' },
  { id: 'endpoint', icon: ICON_ENVELOPE, label: 'Карантин' },
] as const

/** Компрометация АРМ: рабочее место → EDR → SIEM/SOC → ликвидация. */
export const EDR_STAGES: readonly Stage[] = [
  { id: 'host', icon: ICON_USER, label: 'АРМ сотрудника' },
  { id: 'agent', icon: ICON_EDR, label: 'EDR-агент' },
  { id: 'manager', icon: ICON_SERVER, label: 'Менеджер EDR' },
  { id: 'siem', icon: ICON_MONITOR, label: 'SIEM' },
  { id: 'soc', icon: ICON_EYE, label: 'SOC' },
  { id: 'fix', icon: ICON_LOCK, label: 'Ликвидация' },
] as const

/** Сетевая атака: атакующий → периметр → DMZ → сегментация → SOC. */
export const NET_STAGES: readonly Stage[] = [
  { id: 'inet', icon: ICON_GLOBE, label: 'Атакующий', evil: true },
  { id: 'fw', icon: ICON_WALL, label: 'Межсетевой экран' },
  { id: 'ips', icon: ICON_RADAR, label: 'IPS' },
  { id: 'dmz', icon: ICON_SERVER, label: 'Веб-сервер DMZ' },
  { id: 'core', icon: ICON_CHIP, label: 'Внутренняя сеть' },
  { id: 'soc', icon: ICON_EYE, label: 'SOC' },
] as const

/** IPS изнутри: трафик → сенсор → сигнатуры/аномалии → политика → SIEM. */
export const IPS_STAGES: readonly Stage[] = [
  { id: 'traffic', icon: ICON_GLOBE, label: 'Входящий трафик' },
  { id: 'sensor', icon: ICON_RADAR, label: 'Сенсор IPS' },
  { id: 'sig', icon: ICON_MAGNIFIER, label: 'Сигнатурный анализ' },
  { id: 'anomaly', icon: ICON_CHART, label: 'Анализ аномалий' },
  { id: 'policy', icon: ICON_SHIELD, label: 'Политика IPS' },
  { id: 'siem', icon: ICON_MONITOR, label: 'SIEM' },
] as const

/** DLP: сотрудник → каналы → сенсоры → сервер → служба безопасности. */
export const DLP_STAGES: readonly Stage[] = [
  { id: 'emp', icon: ICON_USER, label: 'Сотрудник' },
  { id: 'chan', icon: ICON_ENVELOPE, label: 'Каналы данных' },
  { id: 'sensor', icon: ICON_FUNNEL, label: 'DLP-сенсор' },
  { id: 'core', icon: ICON_SERVER, label: 'Сервер DLP' },
  { id: 'ib', icon: ICON_EYE, label: 'Служба безопасности' },
  { id: 'fix', icon: ICON_LOCK, label: 'Разбор' },
] as const

/** Брутфорс: атакующий → VPN → локраунты и MFA → SIEM/SOC. */
export const BRUTE_STAGES: readonly Stage[] = [
  { id: 'bot', icon: ICON_GLOBE, label: 'Атакующий', evil: true },
  { id: 'entry', icon: ICON_KEY, label: 'VPN-шлюз' },
  { id: 'lockout', icon: ICON_SHIELD, label: 'Политика учётных записей' },
  { id: 'mfa', icon: ICON_PHONE, label: 'MFA' },
  { id: 'siem', icon: ICON_MONITOR, label: 'SIEM' },
  { id: 'soc', icon: ICON_EYE, label: 'SOC' },
] as const
