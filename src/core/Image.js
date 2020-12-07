export const translateEndpoint = (url='') => {
  return url.replace(/(https?:\/\/)([\da-z\.\-])(.*)\/(.*)/g, 'https://ik.imagekit.io/hque/$4');
}

export const getImageURL = (images = [], index=0, format=false) => {
  let img;
  if (Array.isArray(images) && images.length > 0) {
    img = images[index];
  } else if(images !== null) {
    img = images;
  }

  if (img) {
    if (format && img.formats && format in img.formats) {
      return translateEndpoint(img.formats[format].url);
    } else {
      return translateEndpoint(img.url);
    }
  }

  return "https://picsum.photos/600/400";
}
