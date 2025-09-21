import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: t("footer.about"), href: "/about" },
      { name: t("footer.contact"), href: "/contact" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "FAQ", href: "/faq" },
      { name: "Contact Support", href: "/support" },
      { name: "Community", href: "/community" },
    ],
    legal: [
      { name: t("footer.privacy"), href: "/privacy" },
      { name: t("footer.terms"), href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Disclaimer", href: "/disclaimer" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", href: "#", icon: "📘" },
    { name: "Twitter", href: "#", icon: "🐦" },
    { name: "LinkedIn", href: "#", icon: "💼" },
    { name: "Instagram", href: "#", icon: "📷" },
    { name: "YouTube", href: "#", icon: "📺" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient
                      id="footerBookGradient"
                      cx="50%"
                      cy="50%"
                      r="50%"
                    >
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </radialGradient>
                    <radialGradient
                      id="footerLeafGradient"
                      cx="50%"
                      cy="50%"
                      r="50%"
                    >
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#10b981" />
                    </radialGradient>
                    <filter
                      id="footerShadow"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feDropShadow
                        dx="1"
                        dy="2"
                        stdDeviation="2"
                        floodColor="#000000"
                        floodOpacity="0.1"
                      />
                    </filter>
                  </defs>

                  {/* Open Book with enhanced 3D effect and shadow */}
                  <path
                    d="M6 22C6 20.5 7.5 19 9 19H23C24.5 19 26 20.5 26 22V28C26 29.5 24.5 31 23 31H9C7.5 31 6 29.5 6 28V22Z"
                    fill="url(#footerBookGradient)"
                    stroke="#d97706"
                    strokeWidth="0.3"
                    filter="url(#footerShadow)"
                  />

                  {/* Book pages with depth */}
                  <path
                    d="M7 23L25 23M7 25L25 25M7 27L25 27M7 29L25 29"
                    stroke="#d97706"
                    strokeWidth="0.2"
                    opacity="0.6"
                  />

                  {/* Book spine with shadow */}
                  <rect x="15.5" y="19" width="1" height="12" fill="#d97706" />
                  <rect
                    x="15.7"
                    y="19"
                    width="0.3"
                    height="12"
                    fill="#92400e"
                    opacity="0.5"
                  />

                  {/* Tree trunk with gradient */}
                  <rect
                    x="15"
                    y="22"
                    width="2"
                    height="6"
                    fill="url(#footerBookGradient)"
                  />
                  <rect
                    x="15.2"
                    y="22"
                    width="0.3"
                    height="6"
                    fill="#92400e"
                    opacity="0.3"
                  />

                  {/* Main tree branches with enhanced styling */}
                  <path
                    d="M13 20L15 22L17 20L19 22L17 24L15 22Z"
                    fill="url(#footerBookGradient)"
                    stroke="#d97706"
                    strokeWidth="0.2"
                  />
                  <path
                    d="M12 18L14 20L16 18L18 20L16 22L14 20Z"
                    fill="url(#footerBookGradient)"
                    stroke="#d97706"
                    strokeWidth="0.2"
                  />
                  <path
                    d="M11 16L13 18L15 16L17 18L15 20L13 18Z"
                    fill="url(#footerBookGradient)"
                    stroke="#d97706"
                    strokeWidth="0.2"
                  />
                  <path
                    d="M10 14L12 16L14 14L16 16L14 18L12 16Z"
                    fill="url(#footerBookGradient)"
                    stroke="#d97706"
                    strokeWidth="0.2"
                  />

                  {/* Tree leaves with gradient and depth - creating fuller canopy */}
                  <circle
                    cx="10"
                    cy="12"
                    r="1.8"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="12"
                    cy="10"
                    r="1.8"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="14"
                    cy="12"
                    r="1.8"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="16"
                    cy="10"
                    r="1.8"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="18"
                    cy="12"
                    r="1.8"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="20"
                    cy="10"
                    r="1.8"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="22"
                    cy="12"
                    r="1.8"
                    fill="url(#footerLeafGradient)"
                  />

                  <circle
                    cx="11"
                    cy="14"
                    r="1.5"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="13"
                    cy="14"
                    r="1.5"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="15"
                    cy="14"
                    r="1.5"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="17"
                    cy="14"
                    r="1.5"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="19"
                    cy="14"
                    r="1.5"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="21"
                    cy="14"
                    r="1.5"
                    fill="url(#footerLeafGradient)"
                  />

                  <circle
                    cx="12"
                    cy="16"
                    r="1.2"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="14"
                    cy="16"
                    r="1.2"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="1.2"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="18"
                    cy="16"
                    r="1.2"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="20"
                    cy="16"
                    r="1.2"
                    fill="url(#footerLeafGradient)"
                  />

                  <circle
                    cx="13"
                    cy="18"
                    r="1"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="15"
                    cy="18"
                    r="1"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="17"
                    cy="18"
                    r="1"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="19"
                    cy="18"
                    r="1"
                    fill="url(#footerLeafGradient)"
                  />

                  <circle
                    cx="14"
                    cy="20"
                    r="0.8"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="16"
                    cy="20"
                    r="0.8"
                    fill="url(#footerLeafGradient)"
                  />
                  <circle
                    cx="18"
                    cy="20"
                    r="0.8"
                    fill="url(#footerLeafGradient)"
                  />

                  {/* Subtle highlights on leaves for 3D effect */}
                  <circle
                    cx="10.3"
                    cy="11.5"
                    r="0.4"
                    fill="#6ee7b7"
                    opacity="0.6"
                  />
                  <circle
                    cx="12.3"
                    cy="9.5"
                    r="0.4"
                    fill="#6ee7b7"
                    opacity="0.6"
                  />
                  <circle
                    cx="14.3"
                    cy="11.5"
                    r="0.4"
                    fill="#6ee7b7"
                    opacity="0.6"
                  />
                  <circle
                    cx="16.3"
                    cy="9.5"
                    r="0.4"
                    fill="#6ee7b7"
                    opacity="0.6"
                  />
                  <circle
                    cx="18.3"
                    cy="11.5"
                    r="0.4"
                    fill="#6ee7b7"
                    opacity="0.6"
                  />
                  <circle
                    cx="20.3"
                    cy="9.5"
                    r="0.4"
                    fill="#6ee7b7"
                    opacity="0.6"
                  />
                  <circle
                    cx="22.3"
                    cy="11.5"
                    r="0.4"
                    fill="#6ee7b7"
                    opacity="0.6"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold">AdhyayanMarg</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm text-sm sm:text-base leading-relaxed">
              Your comprehensive career guidance platform. Discover your
              potential and build your future with expert guidance and
              resources.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@adhyayanmarg.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91 98540 42222</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Bengaluru, India</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-6 sm:py-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-center lg:text-left">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-400 text-sm max-w-md">
                Get the latest career guidance tips and opportunities delivered
                to your inbox.
              </p>
            </div>
            <div className="flex w-full max-w-md lg:max-w-none">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-64 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
              <button className="px-6 py-3 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors duration-200 text-base font-medium min-h-[48px]">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-400 text-sm mb-4 md:mb-0">
            <span>
              © {currentYear} AdhyayanMarg. {t("footer.rights")}
            </span>
            <Heart className="w-4 h-4 text-red-500" />
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label={social.name}
              >
                <span className="text-lg">{social.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
