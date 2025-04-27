import React from "react";
import { Header } from "./layouts/Header";
import { SingleProductPage } from "./pages/singleProductPage/SingleProductPage";
import { PostOffer } from "./pages/postOffer/PostOffer";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Registration } from "./pages/auth/Registration";
import { Login } from "./pages/auth/Login";
import { ItemAdd } from "./pages/itemAdd/ItemAdd";
import { Sidenav } from "./layouts/Sidenav";
import { Payment } from "./pages/payment/Payment";
import { PaymentConfirmation } from "./pages/paymentConfirmation/PaymentConfirmation";
import { SearchResult } from "./pages/search/SearchResult";
import { AddProfileInfo } from "./pages/profile/AddProfileInfo";
import { ProfileVerification } from "./pages/profile/ProfileVerification";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { EmailVerification } from "./pages/auth/EmailVerification";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { Requests } from "./pages/requests/Requests";
import { Offers } from "./pages/offers/Offers";
import { Items } from "./pages/items/Items";
import { Transaction } from "./pages/transaction/Transaction";
import "./assets/scss/index.scss";
import { TwoFactorConfirmation } from "./pages/auth/TwoFactorConfirmation";
import { PaymentHistory } from "./pages/transaction/PaymentHistory";
import { Home } from "./pages/home/Home";

const Protected = () => {
  const location = useLocation();
  const accessToken = localStorage.getItem("access");
  const withSidenav = !["/payment-success", "/search-result"].includes(
    location.pathname
  );
  // const withHeader = ['/search-result'].includes(location.pathname);
  const withHeader = [
    "/search-result",
    "/single-product-page",
    "/post-offer",
    "/add-item",
    "/payment",
    "/payment-history",
    "/payment-success",
    "/search-result",
    "/add-profile-info",
    "/profile-verification",
    "/requests",
    "/offers",
    "/items",
    "/transaction",
    "/",
  ].includes(location.pathname);

  return accessToken ? (
    <>
      <Header withNavItems={withHeader} />
      <div className="flex w-full">
        {withSidenav && <Sidenav />}
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/login" />
  );
};

const Public = () => {
  const location = useLocation();
  const withHeader = ![
    "/login",
    "/registration",
    "/forgot-password",
    "/email-verification",
    "/reset-password",
    "/two-factor-verification",
  ].includes(location.pathname);
  const accessToken = localStorage.getItem("access");

  return !accessToken ? (
    <>
      {withHeader && <Header />}
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
};

function App() {
  return (
    <div className="App">
      <main className="mainContent">
        <BrowserRouter>
          <Routes>
            <Route element={<Protected />}>
              <Route path="offer/:id" element={<SingleProductPage />} />
              <Route path="post-offer" element={<PostOffer />} />
              <Route path="add-item" element={<ItemAdd />} />
              <Route path="payment" element={<Payment />} />
              <Route path="payment-history" element={<PaymentHistory />} />
              <Route path="payment-success" element={<PaymentConfirmation />} />
              <Route path="payment-error" element={<PaymentConfirmation isError={true} />} />
              <Route path="search-result" element={<SearchResult />} />
              <Route path="add-profile-info" element={<AddProfileInfo />} />
              <Route
                path="profile-verification"
                element={<ProfileVerification />}
              />
              <Route path="requests" element={<Requests />} />
              <Route path="offers" element={<Offers />} />
              <Route path="items" element={<Items />} />
              <Route path="transaction" element={<Transaction />} />
              <Route path="/" element={<Home />} />
            </Route>
            <Route element={<Public />}>
              <Route path="registration" element={<Registration />} />
              <Route path="login" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route
                path="email-verification"
                element={<EmailVerification />}
              />
              <Route
                path="two-factor-confirmation"
                element={<TwoFactorConfirmation />}
              />
              <Route
                path="two-factor-verification"
                element={<TwoFactorConfirmation />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
