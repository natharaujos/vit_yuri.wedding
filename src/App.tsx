import { Route, Routes, BrowserRouter } from "react-router-dom";
import GiftList from "./components/GiftList/GiftList";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
import OurHistory from "./components/OurHistory/OurHistory";
import GiftCheckout from "./pages/GiftCheckout";
import PaymentSuccess from "./components/PaymentSuccess/PaymentSuccess";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdminLogin from "./components/Auth/AdminLogin";
import PaymentOptions from "./pages/PaymentOptions";
import GiftsCRUD from "./pages/GiftsCRUD";
import AllGifts from "./pages/AllGifts";
import { ConfirmedGuests } from "./components/ConfirmedGuests";
import { MyContributions } from "./components/MyContributions";
import AdminRoute from "./components/AdminRoute";
import AllContributions from "./components/AllContributions";
import photoSession from "./assets/photo_session.jpeg";
import photoSession2 from "./assets/photo_session_2.jpeg";
import photoSession3 from "./assets/photo_session_3.jpeg";
import photoSession4 from "./assets/photo_session_4.jpeg";
import photoSession5 from "./assets/photo_session_5.jpeg";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Home />
                  {/* <Reception /> */}
                  <OurHistory images={[photoSession, photoSession2, photoSession3, photoSession4, photoSession5]} />
                  <GiftList />
                  <Footer />
                </>
              }
            />
            <Route
              path="/gift/:id"
              element={<GiftCheckout />}
            />
            <Route
              path="/gift/:id/options"
              element={<PaymentOptions />}
            />
            <Route
              path="/checkout"
              element={<GiftCheckout />}
            />
            <Route
              path="/checkout/options"
              element={<PaymentOptions />}
            />
            <Route
              path="/payment/:payment_id"
              element={<PaymentSuccess />}
            />
            <Route
              path="/confirmeds"
              element={
                <ProtectedRoute>
                  <ConfirmedGuests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-contributions"
              element={<MyContributions />}
            />
            <Route
              path="/all-contributions"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AllContributions />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/gifts"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <GiftsCRUD />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/gifts"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <GiftsCRUD />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/presentes"
              element={<AllGifts />}
            />
            <Route
              path="/login"
              element={<AdminLogin />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
