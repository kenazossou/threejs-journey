const ERUDA_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/eruda'

export function initEruda() {
    if (typeof window === 'undefined') {
        return
    }

    if (window.eruda || window.__THREEJS_JOURNEY_ERUDA_LOADED__) {
        return
    }

    const script = document.createElement('script')
    script.src = ERUDA_SCRIPT_URL
    script.async = true

    script.onload = () => {
        if (window.eruda) {
            window.eruda.init()
        }
        window.__THREEJS_JOURNEY_ERUDA_LOADED__ = true
    }

    document.head.appendChild(script)
}

initEruda()
