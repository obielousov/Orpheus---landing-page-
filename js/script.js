"use strict"

window.addEventListener("load", windowLoad)

const html = document.documentElement

function windowLoad() {
	document.addEventListener("click", documentActions)
	html.classList.add("loaded")

	preloader()
	initThemeSwitcher()
	initAnimations()
	initScrollReveal()
	scrollToSection(".hero__button", "#recent")
	getHeaderHeight()
}

function documentActions(e) {
	const targetElemnt = e.target

	if (targetElemnt.closest(".icon-menu")) {
		html.classList.toggle("menu-open")

		const isOpen = html.classList.contains("menu-open")
		const icon = document.querySelector(".icon-menu")
		if (icon) {
			icon.setAttribute("aria-expanded", isOpen)
			icon.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu")
		}
	}
}

//====================================================================================================

function preloader() {
	const preloader = document.querySelector("#preloader")
	setTimeout(() => {
		preloader.remove()
	}, 500)
}

//====================================================================================================

const swiper = new Swiper(".swiper", {
	direction: "horizontal",
	pagination: {
		el: ".swiper-pagination",
		clickable: true,
	},

	// Responsive breakpoints
	breakpoints: {
		// when window width is >= 320px

		// when window width is >= 480px
		320: {
			slidesPerView: 1,
			spaceBetween: 30,
		},
		// when window width is >= 640px
		640: {
			slidesPerView: 2,
			spaceBetween: 25,
		},
		1000: {
			slidesPerView: 3,
			spaceBetween: 40,
		},
		1300: {
			slidesPerView: 3,
			spaceBetween: 50,
		},
		1400: {
			slidesPerView: 3,
			spaceBetween: 79,
		},
	},
})

//====================================================================================================

function initThemeSwitcher() {
	const themeSwitch = document.getElementById("theme-switcher")

	const setThemeLabel = () => {
		const isLight = document.body.classList.contains("lightmode")
		themeSwitch.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode")
	}

	const enableLightmode = () => {
		document.body.classList.add("lightmode")
		localStorage.setItem("lightmode", "active")
		setThemeLabel()
	}

	const disableLightmode = () => {
		document.body.classList.remove("lightmode")
		localStorage.removeItem("lightmode")
		setThemeLabel()
	}

	if (localStorage.getItem("lightmode") === "active") {
		enableLightmode()
	} else {
		setThemeLabel()
	}

	themeSwitch.addEventListener("click", () => {
		if (document.body.classList.contains("lightmode")) {
			disableLightmode()
		} else {
			enableLightmode()
		}
	})
}

//====================================================================================================

function scrollToSection(buttonSelector, sectionSelector) {
	const button = document.querySelector(buttonSelector)
	const section = document.querySelector(sectionSelector)

	if (!button || !section) return

	button.addEventListener("click", () => {
		section.scrollIntoView({
			behavior: "smooth",
			block: "end",
		})
	})
}

function getHeaderHeight() {
	const header = document.querySelector(".header")
	const cssVariableName = "--header-height"

	if (!header) return

	const setHeaderHeight = () => {
		const height = header.getBoundingClientRect().height
		document.documentElement.style.setProperty(cssVariableName, `${height}px`)
	}

	setHeaderHeight()
	window.addEventListener("resize", () => {
		setHeaderHeight()
	})
}

//====================================================================================================

function initAnimations() {
	const scrollers = document.querySelectorAll(".scroller")
	const columns = document.querySelectorAll(".media-banner__column")

	const isReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches

	if (!isReducedMotion) {
		initInfinite(scrollers, columns)
	}
}

function initInfinite(scrollers, columns) {
	scrollers.forEach((scroller) => {
		scroller.setAttribute("data-animated", "true")
	})

	columns.forEach((column) => {
		column.setAttribute("data-animated", "true")

		const list = column.querySelector(".media-banner__list")
		const items = Array.from(list.children)

		// Clone items for seamless loop
		items.forEach((item) => {
			const clone = item.cloneNode(true)

			clone.setAttribute("aria-hidden", "true")

			list.appendChild(clone)
		})
	})
}

//====================================================================================================

function initScrollReveal() {
	const reveals = document.querySelectorAll(".reveal")

	if (!reveals.length) return

	// Respect reduced motion: reveal immediately without animation
	const isReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches

	if (isReducedMotion) {
		reveals.forEach((el) => el.classList.add("active"))
		return
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("active")
					observer.unobserve(entry.target)
				}
			})
		},
		{
			threshold: 0.15,
		},
	)

	reveals.forEach((el) => observer.observe(el))
}
