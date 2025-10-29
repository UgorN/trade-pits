// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe all sponsor cards and stat cards
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".sponsor-card, .stat-card, .commitment-item")

  cards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
    observer.observe(card)
  })

  // Parallax effect for hero
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const hero = document.querySelector(".hero-content")
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`
      hero.style.opacity = 1 - scrolled / 600
    }
  })

  // Add hover effect to sponsor cards
  const sponsorCards = document.querySelectorAll(".sponsor-card")
  sponsorCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.borderColor = "var(--color-primary)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.borderColor = "var(--color-border)"
    })
  })

  // Animate numbers in stats section
  const animateNumbers = () => {
    const statNumbers = document.querySelectorAll(".stat-number")

    statNumbers.forEach((stat) => {
      const text = stat.textContent
      const hasPercent = text.includes("%")
      const hasPlus = text.includes("+")
      const number = Number.parseInt(text.replace(/\D/g, ""))

      let current = 0
      const increment = number / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= number) {
          current = number
          clearInterval(timer)
        }

        let displayText = Math.floor(current).toString()
        if (hasPercent) displayText += "%"
        if (hasPlus) displayText += "+"

        stat.textContent = displayText
      }, 30)
    })
  }

  // Trigger number animation when stats section is visible
  const statsSection = document.querySelector(".stats")
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateNumbers()
            statsObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )

    statsObserver.observe(statsSection)
  }
})

// Add loading animation
window.addEventListener("load", () => {
  document.body.style.opacity = "0"
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease"
    document.body.style.opacity = "1"
  }, 100)
})
