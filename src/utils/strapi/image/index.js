/**
 * Get the source from a Strapi image object (or array of Strapi image objects)
 * @constructor
 * @param {(array|object)} images     - An array of images or a single Image object.
 * @param {number} [index]            - Optionally the selected index of the props.images array.
 * @param {(string|boolean)} [format] - Optional thumbnail format to display. Fallback is the original image.
 * @param {(string)} [alt]            - Optionalalt text.
 * @return {string}                   - The image source.
 */
export const getImageURL = (images = [], index = 0, format = false) => {
  let img
  if (Array.isArray(images) && images.length > 0) {
    img = images[index]
  } else if (images !== null && images.length > 0) {
    img = images
  }

  if (img) {
    if (format === false) {
      return img.url
    } else {
      return img.formats[format].url
    }
  }

  return 'https://picsum.photos/600/400'
}

export default getImageURL
