import { FiArrowLeft, FiImage, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCars } from "../../hooks/useCars";
import { useLanguage } from "../../context/LanguageContext";
import { capitalize } from "../../utils/capitalize";
import "./AdminCars.css";

// Priorizamos la portada, pero aceptamos datos antiguos con image.
const getCover = (car) => {
  const cover = car.images?.find((image) => image.isCover);
  return cover?.url || car.images?.[0]?.url || car.image || "";
};

const AdminCars = () => {
  const { cars, loading, error } = useCars();
  const { language, t } = useLanguage();
  const locale = language === "es" ? "es-ES" : "en-US";

  const formatNumber = (value) =>
    new Intl.NumberFormat(locale).format(value ?? 0);

  const formatPrice = (value) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value ?? 0);

  const enumLabels = {
    Gasoline: t.carFuelGasoline,
    Diesel: t.carFuelDiesel,
    Hybrid: t.carFuelHybrid,
    Electric: t.carFuelElectric,
    LPG: t.carFuelLpg,
    Manual: t.carTransmissionManual,
    Automatic: t.carTransmissionAutomatic,
    Available: t.carStatusAvailable,
    Reserved: t.carStatusReserved,
    Sold: t.carStatusSold,
  };

  return (
    <main className="admin-cars">
      <Link className="admin-cars__back" to="/admin">
        <FiArrowLeft aria-hidden="true" />
        {t.adminBack}
      </Link>

      <header className="admin-cars__header">
        <div>
          <span>{t.adminCarsEyebrow}</span>
          <h1>{t.adminCarsTitle}</h1>
          <p>{t.adminCarsText}</p>
        </div>

        <Link className="admin-cars__new" to="/admin/cars/new">
          <FiPlus aria-hidden="true" />
          {t.adminNewCar}
        </Link>
      </header>

      {loading ? (
        <section className="admin-cars__state" aria-live="polite">
          <div className="admin-cars__spinner" />
          <p>{t.adminCarsLoading}</p>
        </section>
      ) : error ? (
        <section
          className="admin-cars__state admin-cars__state--error"
          role="alert"
        >
          <h2>{t.adminCarsErrorTitle}</h2>
          <p>{t.adminCarsErrorText}</p>
        </section>
      ) : cars.length === 0 ? (
        <section className="admin-cars__state">
          <FiImage aria-hidden="true" />
          <h2>{t.adminCarsEmptyTitle}</h2>
          <p>{t.adminCarsEmptyText}</p>
        </section>
      ) : (
        <section className="admin-cars__inventory">
          <div className="admin-cars__count">
            <strong>{cars.length}</strong> {t.adminCarsCount}
          </div>

          <div className="admin-cars__table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">{t.carCover}</th>
                  <th scope="col">{t.carBrand}</th>
                  <th scope="col">{t.carModel}</th>
                  <th scope="col">{t.carYear}</th>
                  <th scope="col">{t.carMileage}</th>
                  <th scope="col">{t.carPrice}</th>
                  <th scope="col">{t.carFuel}</th>
                  <th scope="col">{t.carTransmission}</th>
                  <th scope="col">{t.carStatus}</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => {
                  const cover = getCover(car);

                  return (
                    <tr key={car._id}>
                      <td>
                        <div className="admin-car-cover">
                          <FiImage aria-hidden="true" />
                          {/* Si falla, queda visible el placeholder de debajo. */}
                          {cover && (
                            <img
                              src={cover}
                              alt={`${capitalize(car.brand)} ${capitalize(car.model)}`}
                              onError={(event) => event.currentTarget.remove()}
                            />
                          )}
                        </div>
                      </td>
                      <td>
                        <strong>{capitalize(car.brand)}</strong>
                      </td>
                      <td>{capitalize(car.model)}</td>
                      <td>{car.year}</td>
                      <td>{formatNumber(car.mileage)} km</td>
                      <td>
                        <strong>{formatPrice(car.price)}</strong>
                      </td>
                      <td>{enumLabels[car.fuel] || car.fuel}</td>
                      <td>
                        {enumLabels[car.transmission] || car.transmission}
                      </td>
                      <td>
                        <span
                          className={`admin-car-status admin-car-status--${car.status?.toLowerCase()}`}
                        >
                          {enumLabels[car.status] || car.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
};

export default AdminCars;
