import carPlaceholder from "../assets/car-placeholder.svg";
import audiA3 from "../assets/demo-cars/audi-a3.jpg";
import bmw118i from "../assets/demo-cars/bmw-118i.jpg";
import cupraFormentor from "../assets/demo-cars/cupra-formentor.jpg";
import kiaEniro from "../assets/demo-cars/kia-eniro.jpg";
import mazdaCx5 from "../assets/demo-cars/mazda-cx5.jpg";
import mazdaMx5 from "../assets/demo-cars/mazda-mx5.jpg";
import mercedesC220d from "../assets/demo-cars/mercedes-c220d.jpg";
import nissanLeaf from "../assets/demo-cars/nissan-leaf.jpg";
import porscheMacan from "../assets/demo-cars/porsche-macan.jpg";
import renaultMegane from "../assets/demo-cars/renault-megane.jpg";
import seatLeon from "../assets/demo-cars/seat-leon.jpg";
import toyotaGt86 from "../assets/demo-cars/toyota-gt86.jpg";

const demoCarImages = {
  "audi:a3": audiA3,
  "bmw:118i": bmw118i,
  "cupra:formentor": cupraFormentor,
  "kia:e-niro": kiaEniro,
  "mazda:cx-5": mazdaCx5,
  "mazda:mx-5": mazdaMx5,
  "mercedes-benz:c 220 d": mercedesC220d,
  "nissan:leaf": nissanLeaf,
  "porsche:macan": porscheMacan,
  "renault:mégane": renaultMegane,
  "seat:león": seatLeon,
  "toyota:gt86": toyotaGt86,
};

const getDemoImage = (car) => {
  const key = `${car?.brand || ""}:${car?.model || ""}`.toLowerCase();
  return demoCarImages[key];
};

export const hasCarPhoto = (car) =>
  Boolean(car?.images?.length || car?.image || getDemoImage(car));

// Las imágenes subidas desde el panel siempre tienen prioridad.
export const getCarCover = (car) => {
  const cover = car?.images?.find((image) => image.isCover);

  return (
    cover?.url ||
    car?.images?.[0]?.url ||
    car?.image ||
    getDemoImage(car) ||
    carPlaceholder
  );
};