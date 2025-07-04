// cropImage.ts (Utility function for react-easy-crop)
const createImage = (url: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Needed for cross-origin images
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the cropped image URL.
 * @param {string} imageSrc - URL of the image.
 * @param {Object} pixelCrop - Object with x, y, width, and height of the crop area.
 * @param {number} rotation - Rotation degree of the image (optional).
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: any,
  rotation = 0
) {
  const image: any = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const rotRad = getRadianAngle(rotation);

 
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

 
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

 
  ctx?.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx?.rotate(rotRad);
  ctx?.scale(1, 1); 
  ctx?.translate(-image.width / 2, -image.height / 2);

 
  ctx?.drawImage(image, 0, 0);

  const data = ctx?.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  
  if (data) {
    ctx?.putImageData(data, 0, 0);
  }

  // As a blob
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file!));
    }, "image/jpeg"); // or 'image/png'
  });
}

// Function to rotate size for bounding box calculation (from react-easy-crop docs)
const rotateSize = (width: number, height: number, rotation: number) => {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};
