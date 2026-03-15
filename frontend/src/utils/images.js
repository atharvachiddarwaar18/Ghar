export const getImageUrl = (url) => {
  if (!url) return '/images/placeholders/default.jpg'
  if (url.startsWith('http')) return url
  if (url.startsWith('/images/')) return url
  if (url.startsWith('/')) return `/images/products${url}`
  return `/images/products/${url}`
}
