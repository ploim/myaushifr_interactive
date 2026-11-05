import { forwardRef } from 'react'
import { PixelSprite } from '../pixel/PixelSprite'
import { CAP, CAP_PALETTE, ICON_PALETTE } from '../pixel/maps'
import { Mascot } from './Mascot'
import { THEORY } from '../data/theory'

interface TheoryScreenProps {
  onStart: () => void
}

/** Теоретический модуль: короткие объяснения всех СЗИ и подразделений.
 *  Кнопка «К сценариям» — только в самом конце: страницу читают целиком. */
export const TheoryScreen = forwardRef<HTMLDivElement, TheoryScreenProps>(function TheoryScreen(
  { onStart },
  ref,
) {
  return (
    <div className="theory" ref={ref} tabIndex={-1}>
      <header className="theory__head">
        <div className="theory__headtext">
          <p className="theory__eyebrow px-text">Теория перед демонстрациями</p>
          <h1 className="theory__title px-text">Азбука защиты</h1>
          <p className="theory__lead">
            Для профессии в области информационной безопасности характерны
            некоторые понятия и концепции, ниже они раскрыты в нескольких
            словах. Дальше каждое покажет себя в деле!
          </p>
        </div>
        <div className="acad-cat">
          <PixelSprite map={CAP} palette={CAP_PALETTE} className="acad-cat__cap" />
          <Mascot mood="idle" size={148} />
        </div>
      </header>

      {THEORY.map((group) => (
        <section className="theory__group" key={group.id} aria-labelledby={`theory-${group.id}`}>
          <h2 className="theory__group-title px-text" id={`theory-${group.id}`}>
            {group.title}
          </h2>
          <ul className="theory__cards">
            {group.terms.map((term) => (
              <li className="term" key={term.name}>
                <span className="term__icon" aria-hidden="true">
                  <PixelSprite map={term.icon} palette={ICON_PALETTE} className="term__sprite" />
                </span>
                <div className="term__body">
                  <h3 className="term__name">{term.name}</h3>
                  <p className="term__full">{term.full}</p>
                  <p className="term__text">{term.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="theory__foot">
        <button type="button" className="btn btn--primary btn--pixel" onClick={onStart}>
          К сценариям →
        </button>
      </div>
    </div>
  )
})
