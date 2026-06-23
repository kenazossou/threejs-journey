export const lessonGroups = [
    {
        chapter: 'Chapter 01 Basics',
        lessons: [
            {
                id: 'lesson01-05',
                title: 'Lessons 01-05',
                path: './chapter-01-basics/lesson01-05/index.html',
                script: './chapter-01-basics/lesson01-05/script.js',
                style: './chapter-01-basics/lesson01-05/style.css'
            },
            {
                id: 'lesson06-camera',
                title: 'Lesson 06 Camera',
                path: './chapter-01-basics/lesson06-camera/index.html',
                script: './chapter-01-basics/lesson06-camera/script.js',
                style: './chapter-01-basics/lesson06-camera/style.css'
            },
            {
                id: 'lesson07-fullscreen-and-resizing',
                title: 'Lesson 07 Fullscreen and Resizing',
                path: './chapter-01-basics/lesson07-fullscreen-and-resizing/index.html',
                script: './chapter-01-basics/lesson07-fullscreen-and-resizing/script.js',
                style: './chapter-01-basics/lesson07-fullscreen-and-resizing/style.css'
            },
            {
                id: 'lesson08-geometries',
                title: 'Lesson 08 Geometries',
                path: './chapter-01-basics/lesson08-geometries/index.html',
                script: './chapter-01-basics/lesson08-geometries/script.js',
                style: './chapter-01-basics/lesson08-geometries/style.css'
            },
            {
                id: 'lesson09-debug-ui',
                title: 'Lesson 09 Debug UI',
                path: './chapter-01-basics/lesson09-debug-ui/index.html',
                script: './chapter-01-basics/lesson09-debug-ui/script.js',
                style: './chapter-01-basics/lesson09-debug-ui/style.css'
            },
            {
                id: 'lesson10-textures',
                title: 'Lesson 10 Textures',
                path: './chapter-01-basics/lesson10-textures/index.html',
                script: './chapter-01-basics/lesson10-textures/script.js',
                style: './chapter-01-basics/lesson10-textures/style.css'
            },
            {
                id: 'lesson11-materials',
                title: 'Lesson 11 Materials',
                path: './chapter-01-basics/lesson11-materials/index.html',
                script: './chapter-01-basics/lesson11-materials/script.js',
                style: './chapter-01-basics/lesson11-materials/style.css'
            },
            {
                id: 'lesson12-3dtext',
                title: 'Lesson 12 3D Text',
                path: './chapter-01-basics/lesson12-3dtext/index.html',
                script: './chapter-01-basics/lesson12-3dtext/script.js',
                style: './chapter-01-basics/lesson12-3dtext/style.css'
            }
        ]
    },
    {
        chapter: 'Chapter 02 Classic Techniques',
        lessons: [
            {
                id: 'lesson14-lights',
                title: 'Lesson 14 Lights',
                path: './chapter-02-classic-techniques/lesson14-lights/index.html',
                script: './chapter-02-classic-techniques/lesson14-lights/script.js',
                style: './chapter-02-classic-techniques/lesson14-lights/style.css'
            },
            {
                id: 'lesson15-shadows',
                title: 'Lesson 15 Shadows',
                path: './chapter-02-classic-techniques/lesson15-shadows/index.html',
                script: './chapter-02-classic-techniques/lesson15-shadows/script.js',
                style: './chapter-02-classic-techniques/lesson15-shadows/style.css'
            },
            {
                id: 'lesson16-haunted-house',
                title: 'Lesson 16 Haunted House',
                path: './chapter-02-classic-techniques/lesson16-haunted-house/index.html',
                script: './chapter-02-classic-techniques/lesson16-haunted-house/script.js',
                style: './chapter-02-classic-techniques/lesson16-haunted-house/style.css'
            },
            {
                id: 'lesson17-particles',
                title: 'Lesson 17 Particles',
                path: './chapter-02-classic-techniques/lesson17-particles/index.html',
                script: './chapter-02-classic-techniques/lesson17-particles/script.js',
                style: './chapter-02-classic-techniques/lesson17-particles/style.css'
            },
            {
                id: 'lesson18-galaxy-generator',
                title: 'Lesson 18 Galaxy Generator',
                path: './chapter-02-classic-techniques/lesson18-galaxy-generator/index.html',
                script: './chapter-02-classic-techniques/lesson18-galaxy-generator/script.js',
                style: './chapter-02-classic-techniques/lesson18-galaxy-generator/style.css'
            }
        ]
    }
]

export const lessons = lessonGroups.flatMap((group) => group.lessons)

export function findLessonById(id) {
    return lessons.find((lesson) => lesson.id === id)
}

export function getCurrentLessonPath() {
    const params = new URLSearchParams(window.location.search)
    const lessonId = params.get('lesson')

    if (!lessonId) {
        return lessons[0]?.path ?? './index.html'
    }

    const lesson = findLessonById(lessonId)
    return lesson?.path ?? lessons[0]?.path ?? './index.html'
}