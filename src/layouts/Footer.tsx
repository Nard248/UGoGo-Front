import "./Footer.scss";
import { FC } from "react";
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
                    </div>

                    <div className="footer-links">
                        {[
                            {
                                title: "Product",
                                links: ["Features", "Pricing", "Send an item", "Truck item", "Post an offer", "Manage offer"],
                            },
                            {
                                title: "Company",
                                links: ["About", "Contact us", "Careers", "Culture", "Blog"],
                            },
                            {
                                title: "Support",
                                links: ["Getting started", "Help center", "Chat support"],
                            },
                        ].map((section, index) => (
                            <div key={index}>
                                <h4>{section.title}</h4>
                                <ul>
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <a href="#">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

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
                        <a href="#">Terms and Conditions</a> | <a href="#">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};
