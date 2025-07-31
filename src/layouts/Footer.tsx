import "./Footer.scss";
import { FC } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import FacebookIcon from "../assets/icons/Facebook.svg";
import InstagramIcon from "../assets/icons/Instagram.svg";
import LinkedInIcon from "../assets/icons/Linkedin.svg";
import TwitterIcon from "../assets/icons/Twitter.svg";
import YouTubeIcon from "../assets/icons/YouTube.svg";
import EmailIcon from "../assets/icons/EmailFooter.svg";
import PhoneIcon from "../assets/icons/PhoneFooter.svg";
import LocationIcon from "../assets/icons/MarkFooter.svg";

export const Footer: FC = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-logo">
                        <img src={Logo} alt="UGOGO Logo" />
                        <p>Your Journey, Our Delivery!!</p>
                        <div className="social-links">
                            {[
                                { href: "#", src: FacebookIcon, alt: "Facebook" },
                                { href: "#", src: TwitterIcon, alt: "Twitter" },
                                { href: "#", src: InstagramIcon, alt: "Instagram" },
                                { href: "#", src: LinkedInIcon, alt: "LinkedIn" },
                                { href: "#", src: YouTubeIcon, alt: "YouTube" },
                            ].map((icon, index) => (
                                <a key={index} href={icon.href} aria-label={icon.alt}>
                                    <img src={icon.src} alt={icon.alt} />
                                </a>
                            ))}
                        </div>
                    <div className="footer-links">
                        {[
                            {
                                title: "Product",
                                links: [
                                    { label: "Features", path: "/features" },
                                    { label: "Pricing", path: "/pricing" },
                                    { label: "Send an item", path: "/add-item" },
                                    { label: "Truck item", path: "/truck-item" },
                                    { label: "Post an offer", path: "/post-offer" },
                                    { label: "Manage offer", path: "/manage-offer" },
                                ],
                            },
                            {
                                title: "Company",
                                links: [
                                    { label: "About", path: "/about" },
                                    { label: "Contact us", path: "/contact-us" },
                                    { label: "Careers", path: "/careers" },
                                    { label: "Culture", path: "/culture" },
                                    { label: "Blog", path: "/blog" },
                                ],
                            },
                            {
                                title: "Support",
                                links: [
                                    { label: "Getting started", path: "/getting-started" },
                                    { label: "Help center", path: "/help-center" },
                                    { label: "Chat support", path: "/chat-support" },
                                ],
                            },
                        ].map((section, index) => (
                            <div key={index}>
                                <h4>{section.title}</h4>
                                <ul>
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <Link to={link.path}>{link.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    </div>


                        <div>
                            <h4>Contact us</h4>
                            <ul className="contact-info">
                                {[
                                    { src: EmailIcon, text: "contact@company.com", href: "mailto:contact@company.com" },
                                    { src: PhoneIcon, text: "(414) 687 - 5892", href: "tel:+14146875892" },
                                    { src: LocationIcon, text: "794 Mcallister St, San Francisco, 94102" },
                                ].map((item, index) => (
                                    <li key={index}>
                                        <img src={item.src} alt="" />
                                        {item.href ? <a href={item.href}>{item.text}</a> : <span>{item.text}</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>Copyright © 2024 UGOGO</p>
                    <p>
                        <Link to="/terms">Terms and Conditions</Link> | <Link to="/privacy-policy">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </footer>
    );
};
