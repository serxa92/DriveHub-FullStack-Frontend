import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiArrowLeft, FiCheckCircle, FiSave, FiUsers } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  getClientById,
  getClientCars,
  updateClient,
} from "../../services/clientService";
import { capitalize } from "../../utils/capitalize";
import "../AdminCarNew/AdminCarNew.css";
import "./AdminClientEdit.css";

const getFormValues = (client) => ({
  name: client.name ?? "",
  email: client.email ?? "",
  phone: client.phone ?? "",
  city: client.city ?? "",
  status: client.status ?? "Interested",
  notes: client.notes ?? "",
  // El formulario trabaja con los IDs de los coches seleccionados.
  interestedCars: (client.interestedCars || []).map((car) => car._id || car),
});

const AdminClientEdit = () => {
  const { id } = useParams();
  const { authFetch } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    let isActive = true;

    // Cargamos el cliente y los coches al mismo tiempo.
    Promise.all([getClientById(id, authFetch), getClientCars(authFetch)])
      .then(([client, availableCars]) => {
        if (!isActive) return;

        reset(getFormValues(client));
        setCars(availableCars);
      })
      .catch((requestError) => {
        if (isActive) setLoadError(requestError.message);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [authFetch, id, reset]);

  const onSubmit = async (data) => {
    if (isSaving) return;

    setApiError("");
    setIsSuccess(false);
    setIsSaving(true);

    try {
      await updateClient(
        id,
        {
          ...data,
          // Enviamos un array vacío si se desmarcan todos.
          interestedCars: data.interestedCars || [],
        },
        authFetch,
      );
      setIsSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 900));
      navigate("/admin/clients", { replace: true });
    } catch (requestError) {
      setApiError(requestError.message || t.clientEditError);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="admin-car-new admin-client-edit__state" aria-live="polite">
        <div className="admin-client-edit__spinner" />
        <p>{t.clientEditLoading}</p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="admin-car-new admin-client-edit__state" role="alert">
        <FiUsers aria-hidden="true" />
        <h1>{t.clientEditLoadError}</h1>
        <p>{loadError}</p>
        <Link className="admin-car-new__back" to="/admin/clients">
          <FiArrowLeft aria-hidden="true" />
          {t.adminClientsBack}
        </Link>
      </main>
    );
  }

  return (
    <main className="admin-car-new">
      <Link className="admin-car-new__back" to="/admin/clients">
        <FiArrowLeft aria-hidden="true" />
        {t.adminClientsBack}
      </Link>

      <header className="admin-car-new__header">
        <span>{t.adminClientsEyebrow}</span>
        <h1>{t.clientEditTitle}</h1>
        <p>{t.clientEditText}</p>
      </header>

      <form className="admin-car-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <section className="admin-car-form__section">
          <div className="admin-car-form__section-title">
            <h2>{t.clientContactData}</h2>
            <p>{t.clientContactDataText}</p>
          </div>

          <div className="admin-car-form__grid">
            <div className="admin-car-form__field">
              <label htmlFor="name">{t.clientName}</label>
              <input
                id="name"
                type="text"
                {...register("name", {
                  required: t.formRequired,
                  minLength: { value: 2, message: t.formNameMin },
                })}
              />
              {errors.name && <small>{errors.name.message}</small>}
            </div>

            <div className="admin-car-form__field">
              <label htmlFor="email">{t.formEmail}</label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: t.formRequired,
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t.formEmailInvalid,
                  },
                })}
              />
              {errors.email && <small>{errors.email.message}</small>}
            </div>

            <div className="admin-car-form__field">
              <label htmlFor="phone">{t.clientPhone}</label>
              <input
                id="phone"
                type="tel"
                {...register("phone", { required: t.formRequired })}
              />
              {errors.phone && <small>{errors.phone.message}</small>}
            </div>

            <div className="admin-car-form__field">
              <label htmlFor="city">{t.clientCity}</label>
              <input id="city" type="text" {...register("city")} />
            </div>

            <div className="admin-car-form__field">
              <label htmlFor="status">{t.carStatus}</label>
              <select id="status" {...register("status", { required: t.formRequired })}>
                <option value="Interested">{t.clientStatusInterested}</option>
                <option value="Contacted">{t.clientStatusContacted}</option>
                <option value="Negotiating">{t.clientStatusNegotiating}</option>
                <option value="Customer">{t.clientStatusCustomer}</option>
              </select>
            </div>
          </div>

          <div className="admin-car-form__field">
            <label htmlFor="notes">{t.carNotes}</label>
            <textarea
              id="notes"
              rows="5"
              placeholder={t.clientNotesPlaceholder}
              {...register("notes")}
            />
          </div>
        </section>

        <section className="admin-car-form__section">
          <div className="admin-car-form__section-title">
            <h2>{t.clientInterestedCars}</h2>
            <p>{t.clientInterestedCarsText}</p>
          </div>

          {cars.length > 0 ? (
            <div className="admin-client-edit__cars">
              {cars.map((car) => (
                <label key={car._id}>
                  <input
                    type="checkbox"
                    value={car._id}
                    {...register("interestedCars")}
                  />
                  <span>
                    <strong>
                      {capitalize(car.brand || "")} {capitalize(car.model || "")}
                    </strong>
                    <small>{car.year}</small>
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p className="admin-client-edit__empty">{t.clientCarsUnavailable}</p>
          )}
        </section>

        {apiError && (
          <p className="admin-car-form__message admin-car-form__message--error" role="alert">
            {apiError}
          </p>
        )}

        {isSuccess && (
          <p className="admin-car-form__message admin-car-form__message--success" role="status">
            <FiCheckCircle aria-hidden="true" />
            {t.clientEditSuccess}
          </p>
        )}

        <div className="admin-car-form__actions">
          <Link to="/admin/clients">{t.cancel}</Link>
          <button type="submit" disabled={isSaving || isSuccess}>
            <FiSave aria-hidden="true" />
            {isSaving ? t.clientSaving : t.carSave}
          </button>
        </div>
      </form>
    </main>
  );
};

export default AdminClientEdit;
