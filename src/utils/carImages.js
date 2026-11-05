import carPlaceholder from "../assets/car-placeholder.svg";
import demoCarImages from "../data/demoCarImages.json";

const demoImageModules = import.meta.glob("../assets/demo-cars/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});

const getImageUrl = (image) =>
  typeof image === "string" ? image : image?.url;

const isCloudinaryImage = (image) =>
  getImageUrl(image)?.includes("res.cloudinary.com");

const getDemoImage = (car) => {
  const key = `${car?.brand || ""}:${car?.model || ""}`.toLowerCase();
  const filename = demoCarImages[key];

  return filename
    ? demoImageModules[`../assets/demo-cars/${filename}`]
    : undefined;
};

export const handleCarImageError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = carPlaceholder;
};

export const hasCarPhoto = (car) =>
  Boolean(
    car?.images?.some((image) => getImageUrl(image)) ||
      car?.image ||
      getDemoImage(car),
  );

// Las imágenes subidas a Cloudinary siempre tienen prioridad.
export const getCarCover = (car) => {
  const images = car?.images || [];
  const cloudinaryImages = images.filter(isCloudinaryImage);
  const cloudinaryCover = cloudinaryImages.find((image) => image?.isCover);
  const fallbackCover = images.find((image) => image?.isCover);

  return (
    getImageUrl(cloudinaryCover) ||
    getImageUrl(cloudinaryImages[0]) ||
    getImageUrl(fallbackCover) ||
    getImageUrl(images[0]) ||
    car?.image ||
    getDemoImage(car) ||
    carPlaceholder
  );
};