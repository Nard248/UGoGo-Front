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

const Protected = () => {
    const token = localStorage.getItem("token");
    return token ?
        <>
            <Header withNavItems={false}/>
            <div className="flex w-full">
                <Sidenav/>
                <Outlet/>
            </div>
        </> :
        <Navigate to="/login"/>;
};

const Public = () => {
    const location = useLocation();
    const withHeader = !['/login', '/registration'].includes(location.pathname)
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
