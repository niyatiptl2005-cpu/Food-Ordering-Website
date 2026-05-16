import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Homepage from "./pages/Homepage";
import Menu from "./pages/Menu";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import AdminLogin from "./pages/AdminLogin";
import AdminUser from "./pages/AdminUser";
import AdminMenu from "./pages/AdminMenu";
import AdminOrder from "./pages/AdminOrder";
import OrderSuccess from "./pages/OrderSuccess";
import OrderError from "./pages/OrderError";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastContainer from "./components/ToastContainer";
import { useCart } from "./context/CartContext";

function AppContent() {
  const { toasts, removeToast } = useCart();
  
  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Router>
        <Routes>
          {/* Normal user website */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <main className="content">
                  <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/order-error" element={<OrderError />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />

          {/* ✅ Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/user"
            element={
              <ProtectedRoute>
                <AdminUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <ProtectedRoute>
                <AdminMenu />
              </ProtectedRoute>
            }
          />
<Route path="/admin/orders" element={<AdminOrder />} />

        </Routes>
      </Router>
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
