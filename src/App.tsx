import React, { Suspense, useEffect } from "react";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import { NotificationProvider } from "./components/notification/NotificationProvider";
import { ChatProvider } from "./stores/ChatContext";
import { storeUserDetails, isAuthenticated } from "./utils/auth";

import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./assets/scss/index.scss";
import classNames from "classnames";

// Lazy-loaded page components for route-based code splitting
const SingleProductPage = React.lazy(() => import("./pages/singleProductPage/SingleProductPage").then(m => ({ default: m.SingleProductPage })));
const PostOffer = React.lazy(() => import("./pages/postOffer/PostOffer"));
const ItemAdd = React.lazy(() => import("./pages/itemAdd/ItemAdd").then(m => ({ default: m.ItemAdd })));
const Payment = React.lazy(() => import("./pages/payment/Payment").then(m => ({ default: m.Payment })));
const PaymentHistory = React.lazy(() => import("./pages/transaction/PaymentHistory").then(m => ({ default: m.PaymentHistory })));
const PaymentConfirmation = React.lazy(() => import("./pages/paymentConfirmation/PaymentConfirmation").then(m => ({ default: m.PaymentConfirmation })));
const SearchResult = React.lazy(() => import("./pages/search/SearchResult").then(m => ({ default: m.SearchResult })));
const AddProfileInfo = React.lazy(() => import("./pages/profile/AddProfileInfo").then(m => ({ default: m.AddProfileInfo })));
const ProfileVerification = React.lazy(() => import("./pages/profile/ProfileVerification").then(m => ({ default: m.ProfileVerification })));
const Requests = React.lazy(() => import("./pages/requests/Requests").then(m => ({ default: m.Requests })));
const RequestDetails = React.lazy(() => import("./pages/requests/RequestDetails").then(m => ({ default: m.RequestDetails })));
const SentRequests = React.lazy(() => import("./pages/sentRequests/SentRequests").then(m => ({ default: m.SentRequests })));
const Offers = React.lazy(() => import("./pages/offers/Offers").then(m => ({ default: m.Offers })));
const Items = React.lazy(() => import("./pages/items/Items").then(m => ({ default: m.Items })));
const Transaction = React.lazy(() => import("./pages/transaction/Transaction").then(m => ({ default: m.Transaction })));
const Payout = React.lazy(() => import("./pages/payout/Payout").then(m => ({ default: m.Payout })));
const Balance = React.lazy(() => import("./pages/balance/Balance").then(m => ({ default: m.Balance })));
const Messages = React.lazy(() => import("./pages/messages/ChatPage"));
const Home = React.lazy(() => import("./pages/home/Home").then(m => ({ default: m.Home })));

// Auth pages
const Registration = React.lazy(() => import("./pages/auth/Registration").then(m => ({ default: m.Registration })));
const Login = React.lazy(() => import("./pages/auth/Login").then(m => ({ default: m.Login })));
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword").then(m => ({ default: m.ForgotPassword })));
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword").then(m => ({ default: m.ResetPassword })));
const EmailVerification = React.lazy(() => import("./pages/auth/EmailVerification").then(m => ({ default: m.EmailVerification })));
const TwoFactorConfirmation = React.lazy(() => import("./pages/auth/TwoFactorConfirmation").then(m => ({ default: m.TwoFactorConfirmation })));

// Info pages
const About = React.lazy(() => import("./pages/info/About").then(m => ({ default: m.About })));
const Blog = React.lazy(() => import("./pages/info/Blog").then(m => ({ default: m.Blog })));
const Careers = React.lazy(() => import("./pages/info/Careers").then(m => ({ default: m.Careers })));
const ChatSupport = React.lazy(() => import("./pages/info/ChatSupport").then(m => ({ default: m.ChatSupport })));
const Contact = React.lazy(() => import("./pages/info/Contact").then(m => ({ default: m.Contact })));
const Culture = React.lazy(() => import("./pages/info/Culture").then(m => ({ default: m.Culture })));
const Features = React.lazy(() => import("./pages/info/Features").then(m => ({ default: m.Features })));
const GettingStarted = React.lazy(() => import("./pages/info/GettingStarted").then(m => ({ default: m.GettingStarted })));
const HelpCenter = React.lazy(() => import("./pages/info/HelpCenter").then(m => ({ default: m.HelpCenter })));
const ManageOffer = React.lazy(() => import("./pages/info/ManageOffer").then(m => ({ default: m.ManageOffer })));
const Pricing = React.lazy(() => import("./pages/info/Pricing").then(m => ({ default: m.Pricing })));
const PrivacyPolicy = React.lazy(() => import("./pages/info/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicy })));
const SendItem = React.lazy(() => import("./pages/info/SendItem").then(m => ({ default: m.SendItem })));
const Terms = React.lazy(() => import("./pages/info/Terms").then(m => ({ default: m.Terms })));
const TruckItem = React.lazy(() => import("./pages/info/TruckItem").then(m => ({ default: m.TruckItem })));

const PageLoader = () => (
  <div className="flex items-center justify-center w-full min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#559999]"></div>
  </div>
);

const Protected = () => {
  const location = useLocation();
  const accessToken = localStorage.getItem("access");
  const withHeader = [
    "/search-result",
    "/single-product-page",
    "/post-offer",
    "/add-item",
    "/payment",
    "/payment-history",
    "/payment-success",
    "/add-profile-info",
    "/profile-verification",
    "/requests",
    "/sent-requests",
    "/offers",
    "/items",
    "/transaction",
    "/payout",
    "/features",
    "/pricing",
    "/send-item",
    "/truck-item",
    "/manage-offer",
    "/about",
    "/contact-us",
    "/careers",
    "/culture",
    "/blog",
    "/getting-started",
    "/help-center",
    "/chat-support",
    "/terms",
    "/privacy-policy",
    "/balance",
    "/offer/",
    "/messages",
  ].includes(location.pathname) || location.pathname.startsWith("/offer/") || location.pathname.startsWith("/request/");

  return accessToken ? (
    <>
      <Header withNavItems={withHeader} />
      <div className="flex w-full">
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/" />
  );
};

// Routes accessible by everyone (authenticated or not)
const OpenRoute = () => {
  const accessToken = localStorage.getItem("access");
  return (
    <>
      <Header withNavItems={true} />
      <div className="flex w-full">
        <Outlet />
      </div>
    </>
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

const ConditionalFooter = () => {
  const location = useLocation();
  const authPages = [
    "/login",
    "/registration",
    "/forgot-password",
    "/reset-password",
    "/email-verification",
    "/two-factor-confirmation",
    "/two-factor-verification",
  ];

  const shouldHideFooter = authPages.includes(location.pathname);

  return shouldHideFooter ? null : <Footer />;
};

function App() {
  useEffect(() => {
    const initializeUser = async () => {
      if (isAuthenticated()) {
        const userId = localStorage.getItem('user_id');
        if (!userId || userId === '0') {
          try {
            await storeUserDetails();
          } catch (error) {
            console.error('Failed to initialize user details:', error);
          }
        }
      }
    };

    initializeUser();
  }, []);

  return (
    <div className="App">
      <NotificationProvider>
        <ChatProvider>
        <main className={classNames("mainContent", {
          'p-0': window.location.pathname === '/'
        })}>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
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
              <Route path="request/:id" element={<RequestDetails />} />
              <Route path="sent-requests" element={<SentRequests />} />
              <Route path="offers" element={<Offers />} />
              <Route path="items" element={<Items />} />
              <Route path="transaction" element={<Transaction />} />
              <Route path="payout" element={<Payout />} />
              <Route path="balance" element={<Balance />} />
              <Route path="features" element={<Features />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="send-item" element={<SendItem />} />
              <Route path="truck-item" element={<TruckItem />} />
              <Route path="manage-offer" element={<ManageOffer />} />
              <Route path="about" element={<About />} />
              <Route path="contact-us" element={<Contact />} />
              <Route path="careers" element={<Careers />} />
              <Route path="culture" element={<Culture />} />
              <Route path="blog" element={<Blog />} />
              <Route path="getting-started" element={<GettingStarted />} />
              <Route path="help-center" element={<HelpCenter />} />
              <Route path="chat-support" element={<ChatSupport />} />
              <Route path="terms" element={<Terms />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="messages" element={<Messages />} />
            </Route>
            <Route element={<OpenRoute />}>
              <Route path="/" element={<Home />} />
            </Route>
            <Route element={<Public />}>
              <Route path="registration" element={<Registration />} />
              <Route path="login" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:uid/:token" element={<ResetPassword />} />
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
            </Suspense>
            <ConditionalFooter />
          </BrowserRouter>
        </main>
        </ChatProvider>
      </NotificationProvider>
    </div>
  );
}

export default App;
