// Returns inline style object for a tag given its hex color (or a fallback palette color)
const FALLBACK_COLORS = [
  '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981',
  '#f59e0b', '#f97316', '#ef4444', '#ec4899',
  '#6366f1', '#14b8a6',
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getTagStyle(tagName, tagColor) {
  const color = tagColor || FALLBACK_COLORS[hashString(tagName) % FALLBACK_COLORS.length];
  return { backgroundColor: color, color: '#fff' };
}

export function getPrimaryTagStyle(tags, tagMap) {
  if (!tags || tags.length === 0) return null;
  const firstName = tags[0];
  const tagObj = tagMap?.[firstName];
  return { style: getTagStyle(firstName, tagObj?.color), name: firstName };
}