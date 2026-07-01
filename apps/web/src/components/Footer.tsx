import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

const footerLinks = {
  Shop: [
    "Prayer Mats",
    "Abayas & Modest Wear",
    "Hijabs & Scarves",
    "Islamic Home Décor",
    "Gift Sets",
    "New Arrivals",
  ],
  Learn: [
    "Our Story",
    "Artisan Process",
    "Sustainability",
    "The Journal",
    "Ramadan Guide",
  ],
  Support: [
    "Shipping & Returns",
    "Size Guide",
    "Care Instructions",
    "Track My Order",
    "Contact Us",
    "FAQ",
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal">
      {/* Top section */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 lg:pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <a href="#" className="flex flex-col mb-8">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-px h-6 bg-brand-gold" />
                <span className="font-serif text-3xl tracking-[0.25em] uppercase text-brand-cream">
                  Ourالسنة
                </span>
                <div className="w-px h-6 bg-brand-gold" />
              </div>
              <span className="text-[10px] tracking-[0.4em] uppercase font-sans font-light text-brand-gold ml-10">
                Islamic Lifestyle
              </span>
            </a>

            <p className="text-brand-cream/50 font-sans text-sm leading-relaxed max-w-xs mb-8">
              A modern Islamic lifestyle brand rooted in craftsmanship,
              heritage, and mindful living. Every piece is created with
              intention.
            </p>

            <div className="space-y-3 text-sm mb-8">
              <div className="flex items-start gap-3 text-brand-cream/40">
                <MapPin size={13} className="text-brand-gold mt-0.5 shrink-0" />
                <span className="font-sans">
                  Downtown Dubai, UAE — Global Flagship
                </span>
              </div>
              <div className="flex items-center gap-3 text-brand-cream/40">
                <Phone size={13} className="text-brand-gold shrink-0" />
                <span className="font-sans">+971 4 000 0000</span>
              </div>
              <div className="flex items-center gap-3 text-brand-cream/40">
                <Mail size={13} className="text-brand-gold shrink-0" />
                <span className="font-sans">hello@noor.co</span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-4">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Youtube, label: "YouTube" },
                { Icon: Twitter, label: "Twitter" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 border border-brand-cream/10 flex items-center justify-center text-brand-cream/40
                    hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-2">
              <h4 className="text-label uppercase tracking-widest text-brand-gold mb-6">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-brand-cream/40 font-sans text-sm hover:text-brand-cream/80 transition-colors duration-300 flex items-center gap-1.5 group"
                    >
                      <ArrowRight
                        size={10}
                        className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand-gold"
                      />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* App / certifications */}
          <div className="lg:col-span-2">
            <h4 className="text-label uppercase tracking-widest text-brand-gold mb-6">
              Secure Payment
            </h4>
            <div className="grid grid-cols-3 gap-2 mb-8">
              {["Visa", "MC", "AMEX", "Apple", "Google", "PayPal"].map(
                (card) => (
                  <div
                    key={card}
                    className="h-8 border border-brand-cream/10 flex items-center justify-center"
                  >
                    <span className="text-brand-cream/30 text-[9px] font-sans tracking-wider uppercase">
                      {card}
                    </span>
                  </div>
                ),
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-brand-cream/30 text-label">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                <span className="uppercase tracking-widest">SSL Secured</span>
              </div>
              <div className="flex items-center gap-2 text-brand-cream/30 text-label">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                <span className="uppercase tracking-widest">
                  Halal Certified
                </span>
              </div>
              <div className="flex items-center gap-2 text-brand-cream/30 text-label">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                <span className="uppercase tracking-widest">Free Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-cream/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-cream/25 font-sans text-xs tracking-wide">
            © 2025 Noor Islamic Lifestyle. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Use", "Cookie Settings"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-brand-cream/25 font-sans text-xs hover:text-brand-cream/60 transition-colors duration-300"
                >
                  {item}
                </a>
              ),
            )}
          </div>
          <p className="text-brand-cream/15 font-sans text-xs">
            Crafted with intention —{" "}
            <span className="text-brand-gold/40">بِسْمِ اللَّهِ</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
