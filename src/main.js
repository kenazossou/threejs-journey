import './shared/navigation.js'

const ui = document.querySelector('.ui')
const canvas = document.querySelector('canvas.webgl')

if (canvas) {
    canvas.remove()
}

document.title = 'Three.js Journey'

if (ui) {
    ui.innerHTML = '<h1>Three.js Journey</h1><p>Select a lesson from the menu.</p>'
}