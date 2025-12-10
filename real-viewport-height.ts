
let lastViewportHeight: number | undefined

function realViewportHeight()
{
	const { documentElement } = document
	const height              = (window.visualViewport && ((typeof window.visualViewport.height) === 'number'))
		? window.visualViewport.height
		: window.innerHeight

	if (height === lastViewportHeight) return
	lastViewportHeight = height

	documentElement.style.setProperty('--real-vh', height + 'px')
}

function realViewportHeightinit()
{
	// Initial
	(document.readyState === 'loading')
		? window.addEventListener('DOMContentLoaded', realViewportHeight, { once: true })
		: realViewportHeight()

	// Virtual keyboard & UI chrome changes often surface via focus/blur/visibility
	document.addEventListener('visibilitychange', realViewportHeight)
	window.addEventListener('blur', realViewportHeight, true)
	window.addEventListener('focus', realViewportHeight, true)

	// Orientation / Resize
	window.addEventListener('orientationchange', () => { setTimeout(realViewportHeight, 250) })
	window.addEventListener('resize', realViewportHeight)

	// visualViewport specific events
	if (window.visualViewport) {
		window.visualViewport.addEventListener('resize', realViewportHeight)
		window.visualViewport.addEventListener('scroll', realViewportHeight)
	}
}

realViewportHeightinit()
