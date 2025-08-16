import React, { useState } from "react";
import { Button } from "../../components/button/Button";
import { useNotification } from "../../components/notification/NotificationProvider";
import "./Contact.scss";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  urgency: "low" | "medium" | "high";
}

interface FAQ {
  question: string;
  answer: string;
}

export const Contact = () => {
  const { showSuccess, showError, showWarning } = useNotification();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    urgency: "medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const contactMethods = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
            stroke="#73B2B2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Email Support",
      description: "Get help within 24 hours",
      contact: "support@ugogo.com",
      action: "mailto:support@ugogo.com",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.09514 3.90347 2.12788 3.62476 2.21649 3.36162C2.3051 3.09849 2.44748 2.85669 2.63467 2.65162C2.82186 2.44655 3.04974 2.28271 3.30372 2.17052C3.55771 2.05833 3.83227 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06632 2.16708 8.43376 2.48353C8.80121 2.79999 9.04211 3.23945 9.10999 3.72C9.23662 4.68007 9.47143 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
            stroke="#73B2B2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Phone Support",
      description: "Mon-Fri 9AM-6PM EST",
      contact: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
            stroke="#73B2B2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
            stroke="#73B2B2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Visit Our Office",
      description: "New York, NY",
      contact: "123 Business Ave, Suite 100",
      action: "#map",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="#73B2B2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13"
            stroke="#73B2B2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 17H12.01"
            stroke="#73B2B2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Help Center",
      description: "Self-service resources",
      contact: "Browse FAQs & guides",
      action: "/help-center",
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "How does UGoGo work?",
      answer:
        "UGoGo connects travelers with people who need to send items. Travelers can offer space in their luggage and earn money, while senders can ship items affordably through verified couriers.",
    },
    {
      question: "Is it safe to use UGoGo?",
      answer:
        "Yes! We verify all users through multiple checks including ID verification, background checks, and user ratings. All transactions are protected and insured.",
    },
    {
      question: "What items can I send?",
      answer:
        "You can send most personal items including documents, gifts, electronics (with restrictions), and personal belongings. Prohibited items include hazardous materials, illegal substances, and restricted goods.",
    },
    {
      question: "How much does it cost?",
      answer:
        "Costs vary based on item size, weight, destination, and urgency. Our platform shows transparent pricing with no hidden fees. Typically 60-80% cheaper than traditional shipping.",
    },
    {
      question: "What if something goes wrong?",
      answer:
        "We offer comprehensive protection including item insurance, dispute resolution, and 24/7 customer support. All transactions are tracked and monitored for your safety.",
    },
    {
      question: "How do I become a courier?",
      answer:
        "Sign up, complete our verification process, and start posting your travel routes. You can earn money by utilizing unused luggage space on trips you're already taking.",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      showWarning("Please enter your name");
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      showWarning("Please enter a valid email address");
      return false;
    }
    if (!formData.subject.trim()) {
      showWarning("Please enter a subject");
      return false;
    }
    if (!formData.message.trim()) {
      showWarning("Please enter your message");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showSuccess(
        `Thank you ${formData.name}! We'll get back to you within 24 hours.`
      );
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        urgency: "medium",
      });
    } catch (error) {
      showError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactClick = (action: string) => {
    if (action.startsWith("mailto:") || action.startsWith("tel:")) {
      window.location.href = action;
    } else if (action.startsWith("#")) {
      document.querySelector(action)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = action;
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero__content">
          <h1 className="contact-hero__title">Get in Touch</h1>
          <p className="contact-hero__subtitle">
            We're here to help! Reach out to us through any of the methods
            below.
          </p>
        </div>
        <div className="contact-hero__illustration">
          <svg width="300" height="200" viewBox="0 0 300 200" fill="none">
            <circle cx="150" cy="100" r="80" fill="#E8F5F5" />
            <rect
              x="100"
              y="60"
              width="100"
              height="80"
              rx="8"
              fill="#AEE6E6"
            />
            <rect x="110" y="80" width="80" height="4" rx="2" fill="#73B2B2" />
            <rect x="110" y="90" width="60" height="4" rx="2" fill="#73B2B2" />
            <rect x="110" y="100" width="70" height="4" rx="2" fill="#73B2B2" />
            <circle cx="180" cy="40" r="15" fill="#73B2B2" />
            <path
              d="M170 40 L175 45 L190 30"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="contact-methods">
        <div className="contact-methods__grid">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="contact-card"
              onClick={() => handleContactClick(method.action)}
            >
              <div className="contact-card__icon">{method.icon}</div>
              <h3 className="contact-card__title">{method.title}</h3>
              <p className="contact-card__description">{method.description}</p>
              <span className="contact-card__contact">{method.contact}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form & Info */}
      <div className="contact-main">
        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="urgency">Priority</label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Need help</option>
                  <option value="high">High - Urgent issue</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us how we can help you..."
                rows={6}
                required
              />
            </div>

            <div className="form-actions">
              <Button
                title={isSubmitting ? "Sending..." : "Send Message"}
                type="primary"
                handleClick={() => {}}
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>

        <div className="contact-info-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${
                  openFAQ === index ? "faq-item--open" : ""
                }`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                  type="button"
                >
                  {faq.question}
                  <span className="faq-toggle">
                    {openFAQ === index ? "−" : "+"}
                  </span>
                </button>
                {openFAQ === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="contact-map">
        <div className="contact-map__header">
          <svg
            className="contact-map__icon"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
              stroke="#73B2B2"
              strokeWidth="2"
            />
            <path
              d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
              stroke="#73B2B2"
              strokeWidth="2"
            />
          </svg>
          <h2 className="contact-map__title">Find Us</h2>
        </div>

        <div className="contact-map__wrapper">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d96812.67614635454!2d-74.08060425459138!3d40.68727260853679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1s123%20Business%20Avenue%20New%20York%20NY!5e0!3m2!1sen!2sam!4v1755259591854!5m2!1sen!2sam"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>

          <div className="contact-map__info">
            <h3>UGoGo Headquarters</h3>
            <p>
              123 Business Avenue
              <br />
              Suite 100
              <br />
              New York, NY 10001
            </p>
            <Button
              title="Get Directions"
              type="secondary"
              handleClick={() =>
                window.open(
                  "https://maps.google.com/?q=123+Business+Avenue+New+York+NY",
                  "_blank"
                )
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
};
