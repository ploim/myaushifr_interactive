import { SpeakingMascot } from './SpeakingMascot'

interface WelcomeScreenProps {
  onStart: () => void
  doneCount: number
}

/** Первый экран приключения: правила, прогресс и говорящий Мяушифр. */
export function WelcomeScreen({ onStart, doneCount }: WelcomeScreenProps) {
  return (
    <div className="welcome">
      <header className="welcome__hero">
        <p className="welcome__eyebrow px-text">Интерактивный стенд защиты информации</p>
        <h1 className="welcome__title px-text">Киберприключение Мяушифра</h1>
        <p className="welcome__lead">
          Средства защиты информации в деле: сначала — азбука, где простыми
          словами объяснено каждое решение и подразделение, затем — сценарии
          настоящих атак. Прогресс отслеживается: пройди любые три сценария
          и получи сладкий подарок!
        </p>

        <ol className="welcome__steps">
          <li>
            <span className="px-chip st-info px-text">1</span>
            Прочитай «Азбуку защиты» до конца
          </li>
          <li>
            <span className="px-chip st-info px-text">2</span>
            Отрази любые три атаки из тринадцати сценариев
          </li>
          <li>
            <span className="px-chip st-info px-text">3</span>
            Забери сладкий приз у Мяушифра
          </li>
        </ol>

        <SpeakingMascot
          mood="idle"
          quote="Мяу! Я Мяушифр, кот-защитник. Пойдём вместе: сначала теория, потом поймаем пару атак!"
          size={150}
        />

        {doneCount > 0 && (
          <p className="welcome__progress px-text" role="status">
            Пройдено сценариев: {doneCount}
          </p>
        )}

        <button type="button" className="btn btn--primary btn--pixel" onClick={onStart}>
          Начать приключение →
        </button>
      </header>
    </div>
  )
}
