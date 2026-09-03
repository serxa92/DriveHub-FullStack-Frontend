import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import CarDetail from "./pages/CarDetail/CarDetail";
import Contact from "./pages/Contact/Contact";
import Favorites from "./pages/Favorites/Favorites";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Admin from "./pages/Admin/Admin";
import AdminCars from "./pages/AdminCars/AdminCars";
import AdminCarNew from "./pages/AdminCarNew/AdminCarNew";
import AdminCarEdit from "./pages/AdminCarEdit/AdminCarEdit";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./utils/ScrollToTop";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* El panel comprueba primero la sesión y después el rol. */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/cars" element={<AdminCars />} />
            <Route path="/admin/cars/new" element={<AdminCarNew />} />
            <Route path="/admin/cars/:id/edit" element={<AdminCarEdit />} />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </>
  );
};

export default App;
