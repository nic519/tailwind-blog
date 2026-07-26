import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const normalizeSegment = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const sectionId = (titles) => `nav-${titles.map(normalizeSegment).join('-')}`

const fail = (source, location, message) => {
  throw new Error(`${source} ${location}: ${message}`)
}

const normalizeItem = (item, ancestors, source, location, knownIds, depth) => {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    fail(source, location, 'navigation item must be an object')
  }
  if (typeof item.title !== 'string' || item.title.trim() === '') {
    fail(source, location, 'title must be a non-empty string')
  }
  if (item.nav !== undefined && !Array.isArray(item.nav)) {
    fail(source, location, 'nav must be an array')
  }
  if (item.itemNav !== undefined && !Array.isArray(item.itemNav)) {
    fail(source, location, 'itemNav must be an array')
  }
  if (item.nav && item.itemNav) {
    fail(source, location, 'nav and itemNav cannot both be present')
  }
  if (depth === 0 && item.itemNav !== undefined) {
    fail(source, location, 'root category must contain nav, not itemNav')
  }
  if (depth === 0 && item.nav === undefined) {
    fail(source, location, 'root category must contain nav')
  }
  if (depth === 1 && item.nav === undefined && item.itemNav === undefined) {
    fail(source, location, 'section must contain nav or itemNav')
  }
  if (depth === 2 && item.nav !== undefined) {
    fail(source, location, 'subsection cannot contain nested nav')
  }
  if (depth === 2 && item.itemNav === undefined) {
    fail(source, location, 'subsection must contain itemNav')
  }

  const titles = [...ancestors, item.title]
  const id = sectionId(titles)

  if (knownIds.has(id)) {
    fail(source, location, `duplicate section id ${id}`)
  }
  knownIds.add(id)

  item.itemNav?.forEach((link, index) => {
    const linkLocation = `${location}.itemNav[${index}]`
    if (!link || typeof link !== 'object' || Array.isArray(link)) {
      fail(source, linkLocation, 'link must be an object')
    }
    if (typeof link.name !== 'string' || link.name.trim() === '') {
      fail(source, linkLocation, 'name must be a non-empty string')
    }
    if (typeof link.url !== 'string' || link.url.trim() === '') {
      fail(source, linkLocation, 'url must be a non-empty string')
    }
  })

  return {
    ...item,
    id,
    nav: item.nav?.map((child, index) =>
      normalizeItem(child, titles, source, `${location}.nav[${index}]`, knownIds, depth + 1)
    ),
  }
}

export function loadNavigationCatalog(directory) {
  const knownIds = new Set()

  return readdirSync(directory)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort()
    .map((fileName) => {
      const category = JSON.parse(readFileSync(join(directory, fileName), 'utf8'))
      return normalizeItem(category, [], fileName, 'root', knownIds, 0)
    })
}
