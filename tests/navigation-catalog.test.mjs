import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { loadNavigationCatalog } from '../lib/navigation/catalog.mjs'

test('the navigation catalog loads files in stable order and assigns shared section IDs', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'navigation-catalog-'))
  t.after(() => rmSync(directory, { recursive: true }))

  writeFileSync(
    join(directory, '02-second.json'),
    JSON.stringify({ title: 'Second', nav: [{ title: 'Later', itemNav: [] }] })
  )
  writeFileSync(
    join(directory, '01-first.json'),
    JSON.stringify({
      title: '实用工具',
      nav: [
        {
          title: '开发相关',
          nav: [{ title: '开发神器', itemNav: [] }],
        },
      ],
    })
  )

  const navigation = loadNavigationCatalog(directory)

  assert.deepEqual(
    navigation.map(({ title }) => title),
    ['实用工具', 'Second']
  )
  assert.equal(navigation[0].nav[0].id, 'nav-实用工具-开发相关')
  assert.equal(navigation[0].nav[0].nav[0].id, 'nav-实用工具-开发相关-开发神器')
})

test('the navigation catalog rejects malformed data before it reaches rendering modules', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'navigation-catalog-'))
  t.after(() => rmSync(directory, { recursive: true }))

  writeFileSync(
    join(directory, 'broken.json'),
    JSON.stringify({ title: 'Broken', nav: [{ itemNav: [] }] })
  )

  assert.throws(() => loadNavigationCatalog(directory), /broken\.json.*nav\[0\].*title/)
})

test('the navigation catalog rejects structures the renderer cannot display', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'navigation-catalog-'))
  t.after(() => rmSync(directory, { recursive: true }))

  writeFileSync(
    join(directory, 'root-links.json'),
    JSON.stringify({ title: 'Root links', itemNav: [] })
  )
  assert.throws(() => loadNavigationCatalog(directory), /root category must contain nav/)

  writeFileSync(
    join(directory, 'root-links.json'),
    JSON.stringify({
      title: 'Too deep',
      nav: [{ title: 'Section', nav: [{ title: 'Subsection', nav: [] }] }],
    })
  )
  assert.throws(() => loadNavigationCatalog(directory), /subsection cannot contain nested nav/)
})
