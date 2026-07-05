export function parseHref(href) {
  if (!href) return { game: '', set: '', card: '' }
  const parts = href.replace('/card/', '').split('/')
  return { game: parts[0], set: parts[1], card: parts[2] }
}
