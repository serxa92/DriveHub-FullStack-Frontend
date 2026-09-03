export const carImages = {
  bmw:
    "https://images.unsplash.com/photo-1557053964-937650b63311?q=80&w=1297&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  audi:
    "https://1000logos.net/wp-content/uploads/2018/05/Color-Audi-logo.jpg",
  mercedes:
    "https://cdnwp.dealerk.com/c7e0802e/uploads/sites/9/2023/07/logotipo-mercedes-benz-1.jpg",
  volkswagen:
    "https://www.designboom.com/wp-content/uploads/2020/04/volkswagen-new-logo-designboom-001.jpg",
  ford:
    "https://api.freelogodesign.org/assets/blog/thumb/20200529073158937ford-logo_1176x840.jpg?t=638398865830000000",
  renault:
    "https://www.diariomotor.com/imagenes/2021/03/nuevo-logo-renault-2021-p.jpg?class=XL",
  peugeot:
    "https://cdn.motor1.com/images/mgl/zOg34/s1/4x3/logo-peugeot-2021.webp",
  toyota:
    "https://www.diariomotor.com/imagenes/2022/11/logo-de-toyota-6376f7ae393e5.jpg?class=XL",
  honda:
    "https://static.vecteezy.com/system/resources/previews/020/336/704/non_2x/honda-logo-honda-icon-free-free-vector.jpg",
  seat:
    "https://brandemia.org/contenido/subidas/2014/03/logo_principal_seat.jpg",
    kia:
    "https://motor.flexicar.es/wp-content/uploads/2024/11/logo-kia-kn-1.jpg",
  default:
    "https://images.unsplash.com/photo-1557053964-937650b63311?q=80&w=1297&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export const getCarImage = (brand) => {
  return carImages[brand?.toLowerCase()] || carImages.default;
};