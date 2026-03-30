const lessons = import.meta.glob('./lesson*.js')

const sidebar = document.querySelector('.sidebar')
const toggleBtn = document.querySelector('.menu-toggle')
const canvas = document.querySelector('canvas.webgl')

// 👇 default = CLOSED
let isOpen = false

toggleBtn.textContent = '☰'

// URL params
const params = new URLSearchParams(window.location.search)
let currentLesson = params.get('lesson')

if (!currentLesson) {
    currentLesson = Object.keys(lessons)[0]
}

// Create tabs
Object.keys(lessons).forEach((path) => {
    const name = path.split('/').pop()

    const link = document.createElement('a')
    link.textContent = name
    link.href = `?lesson=${path}`

    if (path === currentLesson) {
        link.classList.add('active')
    }

    sidebar.appendChild(link)
})

// Load lesson
lessons[currentLesson]().then((module) => {
    if (module.default) {
        module.default(canvas)
    }
})

const app = document.querySelector('.app')

toggleBtn.addEventListener('click', () => {
    isOpen = !isOpen

    sidebar.classList.toggle('open', isOpen)
    app.classList.toggle('sidebar-open', isOpen)

    toggleBtn.textContent = isOpen ? '✖' : '☰'
})

function formatLessonTitle(path) {
    const fileName = path.split('/').pop() // lesson07-fullscreen-and-resizing.js

    const noExt = fileName.replace('.js', '') // lesson07-fullscreen-and-resizing

    const parts = noExt.split('-')

    const lessonPart = parts[0] // lesson07
    const titlePart = parts.slice(1).join(' ') // fullscreen and resizing

    const lessonNumber = lessonPart.replace('lesson', 'Lesson ')

    return `${lessonNumber} – ${titlePart}`
}

document.title = formatLessonTitle(currentLesson)
