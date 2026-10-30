import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useCars } from "../../hooks/useCars";
import CarCard from "../../components/CarCard/CarCard";
import Loader from "../../components/Loader/Loader";
import { capitalize } from "../../utils/capitalize";
import { getCarCover, hasCarPhoto } from "../../utils/carImages";
import "./Home.css";

const Home = () => {
  const { language, t } = useLanguage();
  const { cars, loading, error } = useCars();
  const locale = language === "es" ? "es-ES" : "en-US";

  const [brandFilter, setBrandFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [mileageFilter, setMileageFilter] = useState("");

  // En el catálogo enseñamos coches activos que ya tienen una foto útil.
  const publicCars = useMemo(
    () =>
      cars.filter((car) => car.status !== "Sold" && hasCarPhoto(car)),
    [cars],
  );

  // Sacamos las marcas del propio catálogo para evitar otra lista.
  const brands = useMemo(() => {
    return [...new Set(publicCars.map((car) => car.brand))].sort();
  }, [publicCars]);

  // Los filtros vacíos dejan pasar todos los coches.
  const filteredCars = useMemo(() => {
    return publicCars.filter((car) => {
      const brandMatch = !brandFilter || car.brand === brandFilter;
      const yearMatch = !yearFilter || car.year >= Number(yearFilter);
      const mileageMatch =
        !mileageFilter || car.mileage <= Number(mileageFilter);

      return brandMatch && yearMatch && mileageMatch;
    });
  }, [publicCars, brandFilter, yearFilter, mileageFilter]);

  // Enseñamos un coche real y damos prioridad a los que tienen portada.
  const featuredCar = useMemo(
    () =>
      publicCars.find((car) => car.status === "Available") || publicCars[0],
    [publicCars],
  );

  const statusLabels = {
    Available: t.carStatusAvailable,
    Reserved: t.carStatusReserved,
    Sold: t.carStatusSold,
  };

  const formatMileage = (value) =>
    new Intl.NumberFormat(locale).format(value ?? 0);

  const clearFilters = () => {
    setBrandFilter("");
    setYearFilter("");
    setMileageFilter("");
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

          <h1>{t.heroTitle}</h1>

          <p>{t.heroText}</p>

          <div className="search-panel">
            <div className="search-panel__field">
              <label>{t.searchBrand}</label>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
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
              <label>{t.searchYear}</label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="">{t.anyYear}</option>
                <option value="2024">2024+</option>
                <option value="2020">2020+</option>
                <option value="2015">2015+</option>
                <option value="2010">2010+</option>
              </select>
            </div>

            <div className="search-panel__field">
              <label>{t.searchMileage}</label>
              <select
                value={mileageFilter}
                onChange={(e) => setMileageFilter(e.target.value)}
              >
                <option value="">{t.anyMileage}</option>
                <option value="50000">50.000 km</option>
                <option value="100000">100.000 km</option>
                <option value="150000">150.000 km</option>
                <option value="200000">200.000 km</option>
              </select>
            </div>

            <button type="button" onClick={clearFilters}>
              {t.clearFilters}
            </button>
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
          <div
            className="hero__image"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(5, 5, 6, 0.3), rgba(5, 5, 6, 0.1)), url("${getCarCover(featuredCar)}")`,
            }}
          />

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
                <strong>
                  {statusLabels[featuredCar.status] || featuredCar.status}
                </strong>
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
