import React, {FC} from 'react';
import {Header} from "./layouts/Header";
import {SingleProductPage} from "./pages/singleProductPage/SingleProductPage";
import './assets/scss/index.scss'
import {PostOffer} from './pages/postOffer/PostOffer';
import {BrowserRouter, Navigate, Outlet, Route, Routes, useLocation} from 'react-router-dom';
import {Registration} from "./pages/auth/Registration";
import {Login} from "./pages/auth/Login";
import {ItemAdd} from "./pages/itemAdd/ItemAdd";
import {Sidenav} from "./layouts/Sidenav";
import {Payment} from "./pages/payment/Payment";
import {PaymentConfirmation} from "./pages/paymentConfirmation/PaymentConfirmation";
import {SearchResult} from "./pages/search/SearchResult";
import {AddProfileInfo} from "./pages/profile/AddProfileInfo";
import {ProfileVerification} from "./pages/profile/ProfileVerification";

const Protected = () => {
    const location = useLocation();
    const token = localStorage.getItem("token");
    const withSidenav = !['/payment-success', '/search-result'].includes(location.pathname);
    const withHeader = ['/search-result'].includes(location.pathname);
    return token ?
        <>
            <Header withNavItems={withHeader}/>
            <div className="flex w-full">
                {withSidenav &&
                    <Sidenav/>
                }
                <Outlet/>
            </div>
        </> :
        <Navigate to="/login"/>;
};

const Public = () => {
    const location = useLocation();
    const withHeader = !['/login', '/registration'].includes(location.pathname);
    const token = localStorage.getItem("token");

    return !token ?
        <>
        {withHeader &&
            <Header />
        }
            <Outlet/>
        </> :
        <Navigate to="/single-product-page"/>;
};

function App() {
    return (
        <div className="App">
            <main className="mainContent">
                <BrowserRouter>
                    <Routes>
                        <Route element={<Protected/>}>
                            <Route path="single-product-page" element={<SingleProductPage/>}/>
                            <Route path="post-offer" element={<PostOffer/>}/>
                            <Route path="add-item" element={<ItemAdd/>}/>
                            <Route path="payment" element={<Payment/>}/>
                            <Route path="payment-success" element={<PaymentConfirmation/>}/>
                            <Route path="search-result" element={<SearchResult/>}/>
                            <Route path="add-profile-info" element={<AddProfileInfo/>}/>
                            <Route path="profile-verification" element={<ProfileVerification/>}/>
                        </Route>
                        <Route element={<Public/>}>
                            <Route path="registration" element={<Registration/>}/>
                            <Route path="login" element={<Login/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </main>
            {/*<Footer />*/}
        </div>
    );
}

export default App;
