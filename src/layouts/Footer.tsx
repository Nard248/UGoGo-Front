import "./Footer.scss";
import {FC} from "react";

export const Footer: FC = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-logo">
                    <img src="/path/to/logo.png" alt="UGOGO Logo"/>
                    <p>Your Journey, Our Delivery!!</p>
                    <div className="social-links">
                        <a href="#">Facebook</a>
                        <a href="#">Twitter</a>
                        <a href="#">Instagram</a>
                        <a href="#">LinkedIn</a>
                        <a href="#">YouTube</a>
                    </div>
                </div>
                <div className="footer-links">
                    <div>
                        <h4>Product</h4>
                        <a href="#">Features</a>
                        <a href="#">Pricing</a>
                        <a href="#">Send an item</a>
                        <a href="#">Truck item</a>
                        <a href="#">Post an offer</a>
                        <a href="#">Manage offer</a>
                    </div>
                    <div>
                        <h4>Company</h4>
                        <a href="#">About</a>
                        <a href="#">Contact us</a>
                        <a href="#">Careers</a>
                        <a href="#">Culture</a>
                        <a href="#">Blog</a>
                    </div>
                    <div>
                        <h4>Support</h4>
                        <a href="#">Getting started</a>
                        <a href="#">Help center</a>
                        <a href="#">Chat support</a>
                    </div>
                    <div>
                        <h4>Contacts us</h4>
                        <p>Email: contact@company.com</p>
                        <p>Phone: (414) 687 - 5892</p>
                        <p>Address: 794 Mcallister St, San Francisco, 94102</p>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Copyright © 2024 UGOGO</p>
                <a href="#">Terms and Conditions</a> | <a href="#">Privacy Policy</a>
            </div>
        </footer>
    );
};