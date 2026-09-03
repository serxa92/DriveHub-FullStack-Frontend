import { Link, useLocation, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMessageCircle,
} from "react-icons/fi";
import { useCar } from "../../hooks/useCar";
import { useLanguage } from "../../context/LanguageContext";
import { getCarImage } from "../../utils/carImages";
import { capitalize } from "../../utils/capitalize";
import Loader from "../../components/Loader/Loader";
import "./CarDetail.css";

const CarDetail = () => {
  const { id } = useParams();
  const { car, loading, error } = useCar(id);
  const { t } = useLanguage();
  const location = useLocation();

  const backUrl = location.state?.from || "/";

  if (loading) {
    return <Loader text={t.detailLoading} />;
  }

  if (error || !car) {
    return <Loader text={t.detailNotFound} />;
  }

  return (
    <section className="car-detail">
      <Link to={backUrl} className="car-detail__back">
        <FiArrowLeft />
        {t.detailBack}
      </Link>

      <div className="car-detail__grid">
        <div
          className="car-detail__image"
          style={{
            backgroundImage: `url(${car.image || getCarImage(car.brand)})`,
          }}
        />

        <aside className="car-detail__panel">
          <span className="car-detail__label">{t.detailAvailable}</span>

          <h1>
            {capitalize(car.brand)} {capitalize(car.model)}
          </h1>

          <p className="car-detail__subtitle">
            {car.notes ? capitalize(car.notes) : t.detailSelectedVehicle}
          </p>

          <div className="car-detail__specs">
            <article>
              <FiCalendar />
              <div>
                <span>{t.detailYear}</span>
                <strong>{car.year}</strong>
              </div>
            </article>

            <article>
              <FiClock />
              <div>
                <span>{t.detailMileage}</span>
                <strong>{car.mileage} km</strong>
              </div>
            </article>
          </div>

          <div className="car-detail__description">
            <h2>{t.detailDescription}</h2>
            <p>{t.detailDescriptionText}</p>
          </div>

          <div className="car-detail__actions">
            <Link to="/contact" className="car-detail__primary">
              <FiMessageCircle />
              {t.detailContactSeller}
            </Link>

            <button type="button" className="car-detail__secondary">
              {t.detailAddFavorites}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CarDetail;
