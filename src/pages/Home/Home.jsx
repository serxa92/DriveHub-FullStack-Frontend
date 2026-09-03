import { useMemo, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useCars } from "../../hooks/useCars";
import CarCard from "../../components/CarCard/CarCard";
import Loader from "../../components/Loader/Loader";
import { capitalize } from "../../utils/capitalize";
import "./Home.css";

const Home = () => {
  const { t } = useLanguage();
  const { cars, loading, error } = useCars();

  const [brandFilter, setBrandFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [mileageFilter, setMileageFilter] = useState("");

  const brands = useMemo(() => {
    return [...new Set(cars.map((car) => car.brand))].sort();
  }, [cars]);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const brandMatch = !brandFilter || car.brand === brandFilter;
      const yearMatch = !yearFilter || car.year >= Number(yearFilter);
      const mileageMatch =
        !mileageFilter || car.mileage <= Number(mileageFilter);

      return brandMatch && yearMatch && mileageMatch;
    });
  }, [cars, brandFilter, yearFilter, mileageFilter]);

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
          <div className="hero__image" />

          <article className="featured-card">
            <span>{t.featured}</span>
            <h2>Porsche Panamera Turbo</h2>
            <p>2019 · 60.000 km · 550 cv</p>

            <div className="featured-card__bottom">
              <strong>Available</strong>
              <a href="#cars">{t.viewDetails}</a>
            </div>
          </article>
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
