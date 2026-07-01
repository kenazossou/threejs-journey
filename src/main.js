import './style.css'
import './shared/navigation.js'
import { getLessonEntries, toLessonHref } from './shared/navigation.js'

const ui = document.querySelector('.ui')
const canvas = document.querySelector('canvas.webgl')

if (canvas) {
    canvas.remove()
}

document.title = 'Three.js Journey'

if (ui) {
    const lessons = getLessonEntries()
    const groupedLessons = lessons.reduce((groups, lesson) => {
        if (!groups.has(lesson.chapter)) {
            groups.set(lesson.chapter, [])
        }
        groups.get(lesson.chapter).push(lesson)
        return groups
    }, new Map())

    const lessonGroupsMarkup = Array.from(groupedLessons.entries())
        .map(([chapter, chapterLessons]) => {
            const buttonsMarkup = chapterLessons
                .map((lesson) => `
                    <a class="lesson-link" href="${toLessonHref(`./${lesson.path}`)}">
                        ${lesson.title}
                    </a>
                `)
                .join('')

            return `
                <div class="lesson-group">
                    <h2>${chapter}</h2>
                    <div class="lesson-links">${buttonsMarkup}</div>
                </div>
            `
        })
        .join('')

    ui.innerHTML = `
        <div class="welcome-card">
            <p class="eyebrow">Three.js Journey</p>
            <h1>Build immersive 3D experiences</h1>
            <p>Browse the lesson catalog, open a chapter, and jump straight into a lesson with a single click.</p>
            <div class="actions">
                <button type="button" class="primary-action">Open lessons</button>
            </div>
            <div class="lesson-panel">
                ${lessonGroupsMarkup}
            </div>
        </div>
    `

    const primaryAction = ui.querySelector('.primary-action')
    const menuToggle = document.querySelector('.menu-toggle')

    if (primaryAction && menuToggle) {
        primaryAction.addEventListener('click', () => {
            menuToggle.click()
        })
    }
}