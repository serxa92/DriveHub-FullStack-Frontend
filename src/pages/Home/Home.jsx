import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useCars } from "../../hooks/useCars";
import CarCard from "../../components/CarCard/CarCard";
import Loader from "../../components/Loader/Loader";
import { capitalize } from "../../utils/capitalize";
import { getCarCover, handleCarImageError } from "../../utils/carImages";
import "./Home.css";

const Home = () => {
  const { language, t } = useLanguage();
  const { cars, loading, error } = useCars();
  const locale = language === "es" ? "es-ES" : "en-US";

  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [transmissionFilter, setTransmissionFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [mileageFilter, setMileageFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // El catálogo público muestra los 100 coches, con placeholder si hiciera falta.
  const publicCars = cars;

  // Sacamos las marcas del propio catálogo para evitar otra lista.
  const brands = useMemo(() => {
    return [...new Set(publicCars.map((car) => car.brand))].sort();
  }, [publicCars]);

  // Los filtros vacíos dejan pasar todos los coches.
  const filteredCars = useMemo(() => {
    const normalize = (value) =>
      String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase(locale);
    const query = normalize(searchTerm.trim());
    const matches = publicCars.filter((car) => {
      const textMatch =
        !query || normalize(`${car.brand} ${car.model}`).includes(query);
      const brandMatch = !brandFilter || car.brand === brandFilter;
      const statusMatch = !statusFilter || car.status === statusFilter;
      const fuelMatch = !fuelFilter || car.fuel === fuelFilter;
      const transmissionMatch =
        !transmissionFilter || car.transmission === transmissionFilter;
      const yearMatch = !yearFilter || car.year >= Number(yearFilter);
      const mileageMatch =
        !mileageFilter || car.mileage <= Number(mileageFilter);
      const priceMatch = !priceFilter || car.price <= Number(priceFilter);

      return (
        textMatch &&
        brandMatch &&
        statusMatch &&
        fuelMatch &&
        transmissionMatch &&
        yearMatch &&
        mileageMatch &&
        priceMatch
      );
    });

    return [...matches].sort((firstCar, secondCar) => {
      if (sortOrder === "price-asc") return firstCar.price - secondCar.price;
      if (sortOrder === "price-desc") return secondCar.price - firstCar.price;
      if (sortOrder === "year-desc") return secondCar.year - firstCar.year;
      if (sortOrder === "mileage-asc") {
        return firstCar.mileage - secondCar.mileage;
      }
      return 0;
    });
  }, [
    publicCars,
    searchTerm,
    brandFilter,
    statusFilter,
    fuelFilter,
    transmissionFilter,
    yearFilter,
    mileageFilter,
    priceFilter,
    sortOrder,
    locale,
  ]);

  // El destacado va rotando entre los coches que todavía están disponibles.
  const featuredCars = useMemo(() => {
    const availableCars = publicCars.filter(
      (car) => car.status === "Available",
    );

    return availableCars.length > 0 ? availableCars : publicCars;
  }, [publicCars]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredCar =
    featuredCars.length > 0
      ? featuredCars[featuredIndex % featuredCars.length]
      : null;

  useEffect(() => {
    if (featuredCars.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setFeaturedIndex((currentIndex) => currentIndex + 1);
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, [featuredCars.length]);

  const statusLabels = {
    Available: t.carStatusAvailable,
    Reserved: t.carStatusReserved,
    Sold: t.carStatusSold,
  };

  const formatMileage = (value) =>
    new Intl.NumberFormat(locale).format(value ?? 0);

  const formatPrice = (value) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value ?? 0);

  const clearFilters = () => {
    setSearchTerm("");
    setBrandFilter("");
    setStatusFilter("");
    setFuelFilter("");
    setTransmissionFilter("");
    setYearFilter("");
    setMileageFilter("");
    setPriceFilter("");
    setSortOrder("");
  };

  if (loading) {
    return <Loader text={t.loadingCars} />;
  }

  if (error) {
    return <p style={{ padding: "2rem" }}>{error}</p>;
  }

  return (
    <section className="home">
      <section className="hero">
        <div className="hero__content">
          <span className="hero__eyebrow">{t.heroEyebrow}</span>

          <h1>
            <span>{t.heroTitle}</span>
            <strong>{t.heroTitleAccent}</strong>
          </h1>

          <p>{t.heroText}</p>

          <div className="search-panel">
            <div className="search-panel__top">
              <div className="search-panel__field search-panel__field--search">
                <label htmlFor="car-search">{t.searchCars}</label>
                <input
                  id="car-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={t.searchCarsPlaceholder}
                />
              </div>

              <button type="button" onClick={clearFilters}>
                {t.clearFilters}
              </button>
            </div>

            <div className="search-panel__filters">
              <div className="search-panel__field">
                <label htmlFor="brand-filter">{t.searchBrand}</label>
                <select
                  id="brand-filter"
                  value={brandFilter}
                  onChange={(event) => setBrandFilter(event.target.value)}
                >
                  <option value="">{t.allBrands}</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {capitalize(brand)}
                    </option>
                  ))}
                </select>
              </div>

            <div className="search-panel__field">
              <label htmlFor="status-filter">{t.searchStatus}</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="">{t.anyStatus}</option>
                <option value="Available">{t.carStatusAvailable}</option>
                <option value="Reserved">{t.carStatusReserved}</option>
                <option value="Sold">{t.carStatusSold}</option>
              </select>
            </div>

            <div className="search-panel__field">
              <label htmlFor="fuel-filter">{t.searchFuel}</label>
              <select
                id="fuel-filter"
                value={fuelFilter}
                onChange={(event) => setFuelFilter(event.target.value)}
              >
                <option value="">{t.anyFuel}</option>
                <option value="Gasoline">{t.carFuelGasoline}</option>
                <option value="Diesel">{t.carFuelDiesel}</option>
                <option value="Hybrid">{t.carFuelHybrid}</option>
                <option value="Electric">{t.carFuelElectric}</option>
                <option value="LPG">{t.carFuelLpg}</option>
              </select>
            </div>

            <div className="search-panel__field">
              <label htmlFor="transmission-filter">{t.searchTransmission}</label>
              <select
                id="transmission-filter"
                value={transmissionFilter}
                onChange={(event) => setTransmissionFilter(event.target.value)}
              >
                <option value="">{t.anyTransmission}</option>
                <option value="Manual">{t.carTransmissionManual}</option>
                <option value="Automatic">{t.carTransmissionAutomatic}</option>
              </select>
            </div>

            <div className="search-panel__field">
              <label htmlFor="year-filter">{t.searchYear}</label>
              <select
                id="year-filter"
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
              >
                <option value="">{t.anyYear}</option>
                <option value="2024">2024+</option>
                <option value="2020">2020+</option>
                <option value="2015">2015+</option>
                <option value="2010">2010+</option>
              </select>
            </div>

            <div className="search-panel__field">
              <label htmlFor="mileage-filter">{t.searchMileage}</label>
              <select
                id="mileage-filter"
                value={mileageFilter}
                onChange={(event) => setMileageFilter(event.target.value)}
              >
                <option value="">{t.anyMileage}</option>
                <option value="50000">50.000 km</option>
                <option value="100000">100.000 km</option>
                <option value="150000">150.000 km</option>
                <option value="200000">200.000 km</option>
              </select>
            </div>

            <div className="search-panel__field">
              <label htmlFor="price-filter">{t.searchMaxPrice}</label>
              <select
                id="price-filter"
                value={priceFilter}
                onChange={(event) => setPriceFilter(event.target.value)}
              >
                <option value="">{t.anyPrice}</option>
                {[15000, 20000, 25000, 30000, 40000].map((price) => (
                  <option key={price} value={price}>
                    {formatPrice(price)}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-panel__field">
              <label htmlFor="sort-order">{t.sortCars}</label>
              <select
                id="sort-order"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              >
                <option value="">{t.sortDefault}</option>
                <option value="price-asc">{t.sortPriceAsc}</option>
                <option value="price-desc">{t.sortPriceDesc}</option>
                <option value="year-desc">{t.sortYearDesc}</option>
                <option value="mileage-asc">{t.sortMileageAsc}</option>
              </select>
            </div>
            </div>
          </div>

          <div className="hero__benefits">
            <article>
              <span>✓</span>
              <div>
                <strong>{t.verifiedCars}</strong>
                <p>{t.verifiedCarsText}</p>
              </div>
            </article>

            <article>
              <span>€</span>
              <div>
                <strong>{t.noHiddenFees}</strong>
                <p>{t.noHiddenFeesText}</p>
              </div>
            </article>

            <article>
              <span>24</span>
              <div>
                <strong>{t.personalSupport}</strong>
                <p>{t.personalSupportText}</p>
              </div>
            </article>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__image">
            {featuredCar && (
              <img
                key={featuredCar._id}
                src={getCarCover(featuredCar)}
                alt={`${capitalize(featuredCar.brand)} ${capitalize(featuredCar.model)}`}
                decoding="async"
                onError={handleCarImageError}
              />
            )}
          </div>

          {featuredCar && (
            <article className="featured-card">
              <span>{t.featured}</span>
              <h2>
                {capitalize(featuredCar.brand)} {capitalize(featuredCar.model)}
              </h2>
              <p>
                {featuredCar.year} · {formatMileage(featuredCar.mileage)} km
              </p>

              <div className="featured-card__bottom">
                <div className="featured-card__price">
                  <strong>{formatPrice(featuredCar.price)}</strong>
                  <span>
                    {statusLabels[featuredCar.status] || featuredCar.status}
                  </span>
                </div>
                <Link to={`/cars/${featuredCar._id}`} state={{ from: "/" }}>
                  {t.viewDetails}
                </Link>
              </div>
            </article>
          )}
        </div>
      </section>

      <section className="recent">
        <div className="recent__header">
          <div>
            <span>{t.recentlyAdded}</span>
            <p>
              {filteredCars.length} {t.resultsFound}
            </p>
          </div>

          <a href="#cars">{t.viewAllCars}</a>
        </div>

        {filteredCars.length === 0 ? (
          <div className="no-results">
            <h2>{t.noResultsTitle}</h2>
            <p>{t.noResultsText}</p>
            <button type="button" onClick={clearFilters}>
              {t.clearFilters}
            </button>
          </div>
        ) : (
          <div className="car-grid" id="cars">
            {filteredCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
};

export default Home;
