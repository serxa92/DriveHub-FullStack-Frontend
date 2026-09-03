import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    navCars: "CARS",
    navFavorites: "FAVORITES",
    navContact: "CONTACT",

    heroEyebrow: "Premium used cars",
    heroTitle: "Drive what you love",
    heroText:
      "Handpicked performance and sport cars. Transparent details. Real drivers.",

    searchBrand: "Brand",
    allBrands: "All brands",

    searchMaxPrice: "Max price",
    anyPrice: "Any price",

    searchYear: "Year",
    anyYear: "Any year",

    searchCars: "Search cars",

    verifiedCars: "Verified cars",
    verifiedCarsText: "Checked and inspected",

    noHiddenFees: "No hidden fees",
    noHiddenFeesText: "What you see is what you pay",

    personalSupport: "Personal support",
    personalSupportText: "We're here to help",

    featured: "Featured",
    viewDetails: "View details",

    recentlyAdded: "Recently added",
    viewAllCars: "View all cars",
    contactEyebrow: "Contact",
    contactTitle: "Let’s talk about your next car",
    contactText:
      "Send us a message and we will help you with buying, selling or finding the right vehicle.",
    contactPhone: "Phone",
    contactLocation: "Location",
    contactBoxTitle: "Personal support",
    contactBoxText:
      "We review every request and guide you through the process with clear information and no pressure.",
    formName: "Name",
    formNamePlaceholder: "Your name",
    formEmail: "Email",
    formSubject: "Subject",
    formSubjectPlaceholder: "Choose an option",
    formSubjectBuy: "I want to buy a car",
    formSubjectSell: "I want to sell my car",
    formSubjectSupport: "I need support",
    formMessage: "Message",
    formMessagePlaceholder: "Tell us what you need...",
    formSubmit: "Send message",
    formRequired: "This field is required",
    formNameMin: "Name must be at least 2 characters",
    formEmailInvalid: "Enter a valid email",
    formMessageMin: "Message must be at least 10 characters",
    formSuccess: "Message sent successfully. We will contact you soon.",
    detailBack: "Back to cars",
    detailAvailable: "Available now",
    detailSelectedVehicle: "Selected vehicle",
    detailYear: "Year",
    detailMileage: "Mileage",
    detailDescription: "Description",
    detailDescriptionText:
      "This vehicle is part of our selected inventory. It includes clear basic information, mileage and relevant notes provided by the seller.",
    detailContactSeller: "Contact seller",
    detailAddFavorites: "Add to favorites",
    detailLoading: "Loading car...",
    detailNotFound: "Car not found.",
    loadingCars: "Loading cars...",
    loadingCar: "Loading car...",
    favoritesEyebrow: "Favorites",
    favoritesTitle: "Your saved cars",
    favoritesText:
      "Keep track of the cars you like and come back to them whenever you want.",
    favoritesEmptyTitle: "No favorite cars yet",
    favoritesEmptyText:
      "Start exploring the catalog and save the cars that catch your attention.",
    searchMileage: "Mileage",
    anyMileage: "Any mileage",
    clearFilters: "Clear filters",
    resultsFound: "results found",
    noResultsTitle: "No cars found",
    noResultsText:
      "Try changing your filters to discover more available vehicles.",
    footerText: "Browse selected vehicles and find the right car for you.",

    footerNavigation: "Navigation",

    footerResources: "Resources",

    footerRights: "All rights reserved.",
  },

  es: {
    navCars: "COCHES",
    navFavorites: "FAVORITOS",
    navContact: "CONTACTO",

    heroEyebrow: "Coches premium de ocasión",
    heroTitle: "Conduce lo que te apasiona",
    heroText:
      "Una selección de deportivos y vehículos de altas prestaciones con total transparencia.",

    searchBrand: "Marca",
    allBrands: "Todas las marcas",

    searchMaxPrice: "Precio máximo",
    anyPrice: "Cualquier precio",

    searchYear: "Año",
    anyYear: "Cualquier año",

    searchCars: "Buscar coches",

    verifiedCars: "Coches verificados",
    verifiedCarsText: "Inspeccionados y revisados",

    noHiddenFees: "Sin costes ocultos",
    noHiddenFeesText: "El precio es el precio",

    personalSupport: "Asesoramiento",
    personalSupportText: "Te acompañamos durante la compra",

    featured: "Destacado",
    viewDetails: "Ver detalles",

    recentlyAdded: "Últimos vehículos",
    viewAllCars: "Ver todos",
    contactEyebrow: "Contacto",
    contactTitle: "Hablemos de tu próximo coche",
    contactText:
      "Envíanos un mensaje y te ayudaremos a comprar, vender o encontrar el vehículo adecuado.",
    contactPhone: "Teléfono",
    contactLocation: "Ubicación",
    contactBoxTitle: "Asesoramiento personal",
    contactBoxText:
      "Revisamos cada solicitud y te guiamos durante el proceso con información clara y sin presión.",
    formName: "Nombre",
    formNamePlaceholder: "Tu nombre",
    formEmail: "Email",
    formSubject: "Asunto",
    formSubjectPlaceholder: "Elige una opción",
    formSubjectBuy: "Quiero comprar un coche",
    formSubjectSell: "Quiero vender mi coche",
    formSubjectSupport: "Necesito ayuda",
    formMessage: "Mensaje",
    formMessagePlaceholder: "Cuéntanos qué necesitas...",
    formSubmit: "Enviar mensaje",
    formRequired: "Este campo es obligatorio",
    formNameMin: "El nombre debe tener al menos 2 caracteres",
    formEmailInvalid: "Introduce un email válido",
    formMessageMin: "El mensaje debe tener al menos 10 caracteres",
    formSuccess: "Mensaje enviado correctamente. Contactaremos contigo pronto.",
    detailBack: "Volver a coches",
    detailAvailable: "Disponible ahora",
    detailSelectedVehicle: "Vehículo seleccionado",
    detailYear: "Año",
    detailMileage: "Kilometraje",
    detailDescription: "Descripción",
    detailDescriptionText:
      "Este vehículo forma parte de nuestro catálogo seleccionado. Incluye información básica clara, kilometraje y notas relevantes aportadas por el vendedor.",
    detailContactSeller: "Contactar con el vendedor",
    detailAddFavorites: "Añadir a favoritos",
    detailLoading: "Cargando coche...",
    detailNotFound: "Coche no encontrado.",
    loadingCars: "Cargando vehículos...",
    loadingCar: "Cargando vehículo...",
    favoritesEyebrow: "Favoritos",
    favoritesTitle: "Tus coches guardados",
    favoritesText:
      "Guarda los coches que te interesan y vuelve a ellos cuando quieras.",
    favoritesEmptyTitle: "Aún no tienes coches favoritos",
    favoritesEmptyText:
      "Explora el catálogo y guarda los vehículos que te llamen la atención.",
    searchMileage: "Kilometraje",
    anyMileage: "Cualquier kilometraje",
    clearFilters: "Limpiar filtros",
    resultsFound: "resultados encontrados",
    noResultsTitle: "No se encontraron coches",
    noResultsText:
      "Prueba a cambiar los filtros para descubrir más vehículos disponibles.",
    footerText:
      "Explora vehículos seleccionados y encuentra el coche adecuado para ti.",

    footerNavigation: "Navegación",

    footerResources: "Recursos",

    footerRights: "Todos los derechos reservados.",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("drivehub-lang") || "en",
  );

  const changeLanguage = (code) => {
    setLanguage(code);
    localStorage.setItem("drivehub-lang", code);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
