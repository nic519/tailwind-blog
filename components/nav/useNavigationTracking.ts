'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { NavData } from './types/nav'

const collectSectionIds = (navItems: NavData) =>
  navItems.flatMap((category) =>
    (category.nav ?? []).flatMap((section) => [
      section.id,
      ...(section.nav ?? []).map((subSection) => subSection.id),
    ])
  )

export function useNavigationTracking(navItems: NavData) {
  const [activeId, setActiveId] = useState('')
  const sectionIds = useMemo(() => collectSectionIds(navItems), [navItems])

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              Math.abs(left.boundingClientRect.top) - Math.abs(right.boundingClientRect.top)
          )

        if (visibleSections[0]) {
          setActiveId(visibleSections[0].target.id)
        }
      },
      {
        rootMargin: '-80px 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 1],
      }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [sectionIds])

  const navigate = useCallback((id: string) => {
    const section = document.getElementById(id)
    if (!section) return

    setActiveId(id)
    const top = section.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
  }, [])

  return { activeId, navigate }
}
