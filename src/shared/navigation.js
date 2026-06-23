import '../style.css'

function formatChapterTitle(folderName) {
    const match = folderName.match(/^chapter-(\d+)-(.+)$/)

    if (!match) {
        return folderName
            .replace(/^chapter-/, '')
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')
    }

    const [, number, title] = match
    const formattedTitle = title
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')

    return `Chapter ${number} ${formattedTitle}`
}

function formatLessonTitle(folderName) {
    const cleaned = folderName.replace(/^lesson/, '')

    return cleaned
        .replace(/^[-_]+/, '')
        .split(/[-_]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
}

function getLessonEntries() {
    const entries = import.meta.glob('../chapter-*/**/index.html', { eager: true, as: 'url' })

    return Object.keys(entries)
        .filter((entry) => entry !== '../index.html')
        .map((entry) => {
            const normalized = entry.replace(/^\.\.\//, '')
            const [chapterFolder, lessonFolder] = normalized.split('/').filter(Boolean)

            return {
                chapter: formatChapterTitle(chapterFolder),
                title: formatLessonTitle(lessonFolder),
                path: normalized
            }
        })
}

function toLessonHref(path) {
    return new URL(path.replace(/^\.\//, ''), window.location.origin + import.meta.env.BASE_URL).toString()
}

function ensureSidebarMarkup() {
    let sidebar = document.querySelector('.sidebar')
    let toggleBtn = document.querySelector('.menu-toggle')

    if (!sidebar) {
        sidebar = document.createElement('nav')
        sidebar.className = 'sidebar'
        document.body.prepend(sidebar)
    }

    if (!toggleBtn) {
        toggleBtn = document.createElement('button')
        toggleBtn.className = 'menu-toggle'
        toggleBtn.type = 'button'
        toggleBtn.textContent = '☰'
        document.body.prepend(toggleBtn)
    }

    return { sidebar, toggleBtn }
}

export function initLessonNavigation() {
    const { sidebar, toggleBtn } = ensureSidebarMarkup()

    if (!sidebar || !toggleBtn) {
        return
    }

    const app = document.querySelector('.app')
    const currentPath = new URL(window.location.href).pathname
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'
    const lessons = getLessonEntries()

    sidebar.innerHTML = ''
    toggleBtn.textContent = '☰'

    const homeLink = document.createElement('a')
    homeLink.href = new URL('.', window.location.origin + import.meta.env.BASE_URL).toString()
    homeLink.textContent = 'Home'
    homeLink.className = 'home-link'

    if (currentPath === basePath || currentPath === `${basePath}/`) {
        homeLink.classList.add('active')
    }

    sidebar.appendChild(homeLink)

    const groupedLessons = lessons.reduce((groups, lesson) => {
        if (!groups.has(lesson.chapter)) {
            groups.set(lesson.chapter, [])
        }
        groups.get(lesson.chapter).push(lesson)
        return groups
    }, new Map())

    groupedLessons.forEach((groupLessons, chapter) => {
        const chapterLabel = document.createElement('div')
        chapterLabel.className = 'chapter'
        chapterLabel.textContent = chapter
        sidebar.appendChild(chapterLabel)

        groupLessons.forEach((lesson) => {
            const link = document.createElement('a')
            link.textContent = lesson.title
            link.href = toLessonHref(`./${lesson.path}`)

            if (currentPath === new URL(link.href).pathname) {
                link.classList.add('active')
            }

            sidebar.appendChild(link)
        })
    })

    let isOpen = false

    toggleBtn.addEventListener('click', () => {
        isOpen = !isOpen
        sidebar.classList.toggle('open', isOpen)

        if (app) {
            app.classList.toggle('sidebar-open', isOpen)
        }

        toggleBtn.textContent = isOpen ? '✖' : '☰'
    })
}

initLessonNavigation()
