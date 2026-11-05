// Треки узлов инфраструктуры: у каждого сценария свой конвейер.
// Порядок массива = порядок на треке. evil — узлы атакующего (красная подсветка).
import {
  ICON_CHART,
  ICON_CHIP,
  ICON_CODE,
  ICON_EDR,
  ICON_ENVELOPE,
  ICON_EYE,
  ICON_FLASK,
  ICON_FUNNEL,
  ICON_GEAR,
  ICON_GLOBE,
  ICON_GRAPH,
  ICON_HONEYPOT,
  ICON_IDCARD,
  ICON_KEY,
  ICON_LOCK,
  ICON_MAGNIFIER,
  ICON_MONITOR,
  ICON_PHONE,
  ICON_RADAR,
  ICON_SERVER,
  ICON_SHIELD,
  ICON_USER,
  ICON_VAULT,
  ICON_WALL,
  ICON_WAVES,
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

/** Брутфорс: атакующий → VPN → локауты и MFA → SIEM/SOC. */
export const BRUTE_STAGES: readonly Stage[] = [
  { id: 'bot', icon: ICON_GLOBE, label: 'Атакующий', evil: true },
  { id: 'entry', icon: ICON_KEY, label: 'VPN-шлюз' },
  { id: 'lockout', icon: ICON_SHIELD, label: 'Политика учётных записей' },
  { id: 'mfa', icon: ICON_PHONE, label: 'MFA' },
  { id: 'siem', icon: ICON_MONITOR, label: 'SIEM' },
  { id: 'soc', icon: ICON_EYE, label: 'SOC' },
] as const

/** PAM: похититель секретов → заявка → хранилище → сессия → аудит → SOC. */
export const PAM_STAGES: readonly Stage[] = [
  { id: 'thief', icon: ICON_MONITOR, label: 'Атакующий', evil: true },
  { id: 'request', icon: ICON_ENVELOPE, label: 'Заявка на доступ' },
  { id: 'vault', icon: ICON_VAULT, label: 'Хранилище PAM' },
  { id: 'session', icon: ICON_CHIP, label: 'Сессия под записью' },
  { id: 'audit', icon: ICON_MAGNIFIER, label: 'Аудит сессий' },
  { id: 'soc', icon: ICON_EYE, label: 'SOC' },
] as const

/** IAM: сотрудник → HR-событие → каталог → единый вход → ревизия → СБ. */
export const IAM_STAGES: readonly Stage[] = [
  { id: 'person', icon: ICON_USER, label: 'Сотрудник' },
  { id: 'hr', icon: ICON_MONITOR, label: 'Кадровое событие' },
  { id: 'catalog', icon: ICON_IDCARD, label: 'Каталог IAM' },
  { id: 'sso', icon: ICON_KEY, label: 'Единый вход' },
  { id: 'review', icon: ICON_MAGNIFIER, label: 'Ревизия прав' },
  { id: 'ib', icon: ICON_EYE, label: 'Служба безопасности' },
] as const

/** NDR: заражённый АРМ → зеркало трафика → сенсор → модель → SOC → отсечка. */
export const NDR_STAGES: readonly Stage[] = [
  { id: 'infected', icon: ICON_CHIP, label: 'Заражённый АРМ', evil: true },
  { id: 'mirror', icon: ICON_SERVER, label: 'Зеркало трафика' },
  { id: 'sensor', icon: ICON_WAVES, label: 'Сенсор NDR' },
  { id: 'model', icon: ICON_CHART, label: 'Модель поведения' },
  { id: 'soc', icon: ICON_EYE, label: 'SOC' },
  { id: 'seg', icon: ICON_WALL, label: 'Сегментация' },
] as const

/** WAF: атакующий → экран → правила → позитивная модель → приложение → БД. */
export const WAF_STAGES: readonly Stage[] = [
  { id: 'attacker', icon: ICON_MONITOR, label: 'Атакующий', evil: true },
  { id: 'waf', icon: ICON_CODE, label: 'WAF' },
  { id: 'rules', icon: ICON_MAGNIFIER, label: 'Правила и сигнатуры' },
  { id: 'learn', icon: ICON_CHART, label: 'Позитивная модель' },
  { id: 'app', icon: ICON_SERVER, label: 'Веб-приложение' },
  { id: 'db', icon: ICON_CHIP, label: 'База данных' },
] as const

/** Honeypot: сканер → периметр → ловушка → приманка → SOC → блокировка. */
export const HP_STAGES: readonly Stage[] = [
  { id: 'scanner', icon: ICON_MONITOR, label: 'Сканер', evil: true },
  { id: 'edge', icon: ICON_WALL, label: 'Периметр' },
  { id: 'pot', icon: ICON_HONEYPOT, label: 'Ловушка' },
  { id: 'decoy', icon: ICON_SERVER, label: 'Ложный сервис' },
  { id: 'soc', icon: ICON_EYE, label: 'SOC' },
  { id: 'block', icon: ICON_LOCK, label: 'Блокировка' },
] as const

/** SOAR: волна алертов → оркестратор → плейбук → автодействия → SOC → отчёт. */
export const SOAR_STAGES: readonly Stage[] = [
  { id: 'alert', icon: ICON_MONITOR, label: 'События SIEM' },
  { id: 'orchestrator', icon: ICON_GEAR, label: 'Оркестратор SOAR' },
  { id: 'playbook', icon: ICON_GRAPH, label: 'Плейбук' },
  { id: 'actions', icon: ICON_LOCK, label: 'Автодействия' },
  { id: 'soc', icon: ICON_EYE, label: 'SOC' },
  { id: 'report', icon: ICON_ENVELOPE, label: 'Тикет и отчёт' },
] as const

/** XDR: письмо → АРМ → облако → телеметрия → корреляция → SOC. */
export const XDR_STAGES: readonly Stage[] = [
  { id: 'mail', icon: ICON_ENVELOPE, label: 'Письмо', evil: true },
  { id: 'endpoint', icon: ICON_USER, label: 'Рабочее место' },
  { id: 'cloud', icon: ICON_GLOBE, label: 'Облачный сервис' },
  { id: 'telemetry', icon: ICON_RADAR, label: 'Датчики телеметрии' },
  { id: 'correlation', icon: ICON_GRAPH, label: 'Корреляция XDR' },
  { id: 'soc', icon: ICON_EYE, label: 'SOC' },
] as const
