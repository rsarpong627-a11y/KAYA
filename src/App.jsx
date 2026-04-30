import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://galtdialnwommzmxopgh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhbHRkaWFsbndvbW16bXhvcGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMDYzODIsImV4cCI6MjA4OTY4MjM4Mn0.9kukUE8DXjE7NYro5zUNUgb9Z3xuGkfJGT1F7K4VVXg"
);

// ── Design tokens ──────────────────────────────────────────────────────────────
const WHITE  = "#FFFFFF";
const CREAM  = "#F7FFF0";
const GREEN  = "#16C45E";
const DARK   = "#1C2E1C";
const MUTED  = "#5A7A5A";
const SOFT   = "#E8F5ED";
const BORDER = "#D0E8B0";
const TEXT   = "#111A12";

// ── Global styles ──────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; min-height: 100vh; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', sans-serif; background: ${WHITE}; color: ${TEXT}; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${WHITE}; }
  ::-webkit-scrollbar-thumb { background: ${GREEN}44; border-radius: 4px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes spin     { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  @keyframes float    { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
  @keyframes marquee  { from { transform:translateX(0); } to { transform:translateX(-50%); } }

  .cat-pill:hover { background: ${GREEN} !important; color: #fff !important; transform: translateY(-2px); }
  .nav-link:hover { color: ${GREEN} !important; }
  .step-card:hover { border-color: ${GREEN} !important; transform: translateY(-4px); }
  .partner-card:hover .partner-btn { background: ${GREEN} !important; color: #fff !important; }
  .feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(22,196,94,0.15) !important; }
`;

// ── Helpers ────────────────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(() => typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar({ onWaitlist }) {
  const [scrolled, setScrolled] = useState(false);
  const w = useWindowWidth();
  const isMobile = w < 768;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: isMobile ? "14px 20px" : "0 48px",
      height: isMobile ? "auto" : 72,
      background: scrolled ? "rgba(255,255,255,0.96)" : WHITE,
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: `1px solid ${scrolled ? BORDER : "transparent"}`,
      transition: "all 0.25s ease",
    }}>
      <img src="https://i.ibb.co/9mmjhR0Y/Untitled-4.png" alt="Kaya" style={{ height: 52, width: "auto", objectFit: "contain" }} />

      {!isMobile && (
        <div style={{ display: "flex", gap: 32 }}>
          {["How it works", "For Riders", "For Vendors"].map(l => (
            <a key={l} href="#" className="nav-link" style={{
              fontSize: ".9rem", color: MUTED, fontWeight: 500,
              textDecoration: "none", transition: "color .2s",
            }}>{l}</a>
          ))}
        </div>
      )}

      <button onClick={onWaitlist} style={{
        background: GREEN, color: WHITE, border: "none", borderRadius: 999,
        padding: isMobile ? "9px 18px" : "11px 24px",
        fontWeight: 700, fontSize: ".88rem", fontFamily: "Inter, sans-serif",
        cursor: "pointer", transition: "opacity .2s",
      }}
        onMouseEnter={e => e.target.style.opacity = 0.85}
        onMouseLeave={e => e.target.style.opacity = 1}
      >
        Join Waitlist
      </button>
    </nav>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────────
function Hero({ onWaitlist }) {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const [email, setEmail] = useState("");

  const handleCTA = () => onWaitlist();

  const categories = [
    { icon: "🍔", label: "Food" },
    { icon: "🛒", label: "Grocery" },
    { icon: "💊", label: "Pharmacy" },
    { icon: "🛍️", label: "Retail" },
    { icon: "🥤", label: "Drinks" },
  ];

  return (
    <section style={{
      minHeight: "100svh",
      background: WHITE,
      display: "flex", alignItems: "center",
      padding: isMobile ? "100px 20px 60px" : "0 48px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background accent */}
      <div style={{
        position: "absolute", top: "-10%", right: "-5%",
        width: "50vw", height: "80vh",
        background: CREAM, borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%",
        zIndex: 0, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", left: "-8%",
        width: "30vw", height: "30vw",
        background: SOFT, borderRadius: "50%",
        zIndex: 0, pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 48 : 64,
          alignItems: "center",
        }}>
          {/* Left */}
          <div style={{ animation: "fadeUp 0.7s 0.1s both" }}>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: SOFT, border: `1px solid ${BORDER}`,
              borderRadius: 999, padding: "6px 14px", marginBottom: 28,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, display: "inline-block" }} />
              <span style={{ fontSize: ".8rem", fontWeight: 600, color: DARK }}>Now launching in Ghana</span>
            </div>

            <h1 style={{
              fontSize: isMobile ? "2.6rem" : "clamp(3rem, 5vw, 4.4rem)",
              fontWeight: 900, lineHeight: 1.06,
              letterSpacing: "-2px", color: DARK,
              marginBottom: 22,
            }}>
              Order anything,<br />
              <span style={{ color: GREEN }}>delivered fast.</span>
            </h1>

            <p style={{
              fontSize: isMobile ? "1rem" : "1.1rem",
              color: MUTED, lineHeight: 1.75, maxWidth: 440, marginBottom: 36,
            }}>
              Food, groceries, pharmacy and retail — one app for your entire day. Launching in Kumasi & Accra. Join the waitlist today.
            </p>

            {/* Inline CTA — Uber Eats style */}
            <div style={{
              display: "flex", gap: 0,
              background: WHITE, border: `2px solid ${DARK}`,
              borderRadius: 999, overflow: "hidden",
              maxWidth: 440, marginBottom: 32,
              boxShadow: "0 8px 32px rgba(28,46,28,0.12)",
            }}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCTA()}
                style={{
                  flex: 1, border: "none", outline: "none",
                  padding: "14px 20px", fontSize: ".95rem",
                  fontFamily: "Inter, sans-serif", background: "transparent",
                  color: DARK,
                }}
              />
              <button onClick={handleCTA} style={{
                background: DARK, color: WHITE, border: "none",
                padding: "14px 24px", fontWeight: 700, fontSize: ".9rem",
                fontFamily: "Inter, sans-serif", cursor: "pointer",
                whiteSpace: "nowrap",
              }}>
                Get Early Access
              </button>
            </div>

            {/* Category pills */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {categories.map(c => (
                <button key={c.label} className="cat-pill" onClick={onWaitlist} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: SOFT, color: DARK, border: `1.5px solid ${BORDER}`,
                  borderRadius: 999, padding: "8px 16px",
                  fontSize: ".85rem", fontWeight: 600, cursor: "pointer",
                  transition: "all .2s", fontFamily: "Inter, sans-serif",
                }}>
                  <span>{c.icon}</span> {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: floating food cards grid */}
          {!isMobile && (
            <div style={{ position: "relative", height: 520, animation: "fadeUp 0.7s 0.3s both" }}>
              {/* Main large card */}
              <div style={{
                position: "absolute", top: 0, right: 0, width: 280, height: 340,
                borderRadius: 28, overflow: "hidden",
                boxShadow: "0 24px 80px rgba(28,46,28,0.18)",
                animation: "float 4s ease-in-out infinite",
              }}>
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80" alt="Food" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,46,28,0.7) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", bottom: 20, left: 20 }}>
                  <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".1em", color: GREEN, textTransform: "uppercase", marginBottom: 4 }}>Food delivery</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: WHITE }}>Hot & fresh</div>
                </div>
              </div>

              {/* Second card */}
              <div style={{
                position: "absolute", top: 120, left: 0, width: 220, height: 260,
                borderRadius: 24, overflow: "hidden",
                boxShadow: "0 16px 60px rgba(28,46,28,0.14)",
                animation: "float 4s ease-in-out 0.8s infinite",
              }}>
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80" alt="Grocery" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,46,28,0.75) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", bottom: 16, left: 16 }}>
                  <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".1em", color: GREEN, textTransform: "uppercase", marginBottom: 3 }}>Grocery</div>
                  <div style={{ fontSize: ".95rem", fontWeight: 700, color: WHITE }}>Fresh produce</div>
                </div>
              </div>

              {/* Third card */}
              <div style={{
                position: "absolute", bottom: 0, right: 40, width: 200, height: 200,
                borderRadius: 24, overflow: "hidden",
                boxShadow: "0 12px 48px rgba(28,46,28,0.12)",
                animation: "float 4s ease-in-out 1.6s infinite",
              }}>
                <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80" alt="Pharmacy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,46,28,0.75) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", bottom: 14, left: 14 }}>
                  <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".1em", color: GREEN, textTransform: "uppercase", marginBottom: 3 }}>Pharmacy</div>
                  <div style={{ fontSize: ".9rem", fontWeight: 700, color: WHITE }}>Essentials</div>
                </div>
              </div>

              {/* Floating badge: delivery time */}
              <div style={{
                position: "absolute", top: 40, left: 40,
                background: WHITE, borderRadius: 18, padding: "12px 18px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                display: "flex", alignItems: "center", gap: 12,
                animation: "float 3.5s ease-in-out 0.4s infinite",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: SOFT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
                }}>🛵</div>
                <div>
                  <div style={{ fontSize: ".7rem", color: MUTED, fontWeight: 500 }}>Arriving in</div>
                  <div style={{ fontSize: ".95rem", color: DARK, fontWeight: 800 }}>22 min</div>
                </div>
              </div>

              {/* Rating badge */}
              <div style={{
                position: "absolute", top: 280, right: -10,
                background: GREEN, borderRadius: 16, padding: "10px 16px",
                boxShadow: "0 8px 24px rgba(22,196,94,0.35)",
                display: "flex", alignItems: "center", gap: 8,
                animation: "float 3s ease-in-out 1.2s infinite",
              }}>
                <span style={{ fontSize: "1rem" }}>⭐</span>
                <div>
                  <div style={{ fontSize: ".9rem", fontWeight: 800, color: WHITE }}>4.9</div>
                  <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,0.8)" }}>Top rated</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Stats bar ──────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: "30 min", label: "Average delivery" },
    { value: "0%", label: "Commission — first 30 days" },
    { value: "100+", label: "Local vendors at launch" },
    { value: "Live", label: "GPS order tracking" },
  ];
  const w = useWindowWidth();
  const isMobile = w < 768;
  const [ref, vis] = useReveal();

  return (
    <section style={{ background: DARK, padding: isMobile ? "48px 20px" : "56px 48px" }}>
      <div ref={ref} style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: isMobile ? 32 : 0,
        opacity: vis ? 1 : 0, transition: "opacity 0.8s",
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            textAlign: "center",
            borderRight: !isMobile && i < stats.length - 1 ? `1px solid rgba(255,255,255,0.1)` : "none",
            padding: "0 32px",
          }}>
            <div style={{ fontSize: isMobile ? "2rem" : "2.4rem", fontWeight: 900, color: GREEN, lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
            <div style={{ fontSize: ".85rem", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Categories ─────────────────────────────────────────────────────────────────
function Categories({ onWaitlist }) {
  const [ref, vis] = useReveal();
  const w = useWindowWidth();
  const isMobile = w < 768;

  const cats = [
    { icon: "🍔", label: "Food", desc: "Local restaurants & chops bars", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80" },
    { icon: "🛒", label: "Grocery", desc: "Fresh produce & daily items", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80" },
    { icon: "💊", label: "Pharmacy", desc: "Medicines & health essentials", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80" },
    { icon: "🛍️", label: "Retail", desc: "Local shops & boutiques", img: "https://images.pexels.com/photos/6994304/pexels-photo-6994304.jpeg" },
  ];

  return (
    <section style={{ padding: isMobile ? "64px 20px" : "100px 48px", background: WHITE }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{
          opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
          transition: "opacity 0.7s, transform 0.7s",
          marginBottom: 48,
        }}>
          <div style={{ display: "inline-block", background: SOFT, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: ".78rem", fontWeight: 700, color: GREEN, letterSpacing: ".08em", textTransform: "uppercase" }}>One app</span>
          </div>
          <h2 style={{ fontSize: isMobile ? "2rem" : "clamp(2.2rem,3.5vw,3rem)", fontWeight: 900, color: DARK, letterSpacing: "-1.5px", lineHeight: 1.1, maxWidth: 480 }}>
            Everything your city has to offer
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16 }}>
          {cats.map((c, i) => (
            <div key={i} className="feature-card" onClick={onWaitlist} style={{
              borderRadius: 20, overflow: "hidden", cursor: "pointer",
              position: "relative", height: isMobile ? 200 : 280,
              boxShadow: "0 4px 24px rgba(28,46,28,0.08)",
              transition: "all .3s ease",
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(24px)",
              transitionDelay: `${i * 0.1}s`,
            }}>
              <img src={c.img} alt={c.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,46,28,0.88) 0%, rgba(28,46,28,0.1) 60%)" }} />
              <div style={{ position: "absolute", top: 14, left: 14 }}>
                <div style={{
                  background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                  borderRadius: 12, padding: "6px 10px", display: "inline-block",
                }}>
                  <span style={{ fontSize: "1.1rem" }}>{c.icon}</span>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 18px" }}>
                <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".1em", color: GREEN, textTransform: "uppercase", marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: isMobile ? ".85rem" : ".95rem", fontWeight: 700, color: WHITE, lineHeight: 1.3 }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How it works ───────────────────────────────────────────────────────────────
const STEPS = [
  { n: "01", icon: "📍", title: "Share your location", desc: "Tell us where you are. We show you everything available nearby in seconds." },
  { n: "02", icon: "🛒", title: "Browse & order", desc: "Pick from restaurants, grocery stores, pharmacies, retail shops and more." },
  { n: "03", icon: "📡", title: "Track in real time", desc: "Watch your order live on a map from the moment it's packed to your door." },
  { n: "04", icon: "🎉", title: "Enjoy, delivered", desc: "Fast, fresh, exactly as ordered. Right at your door in under 30 minutes." },
];

function HowItWorks() {
  const [ref, vis] = useReveal();
  const w = useWindowWidth();
  const isMobile = w < 768;

  return (
    <section style={{ padding: isMobile ? "64px 20px" : "100px 48px", background: CREAM }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{
          opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
          transition: "opacity 0.7s, transform 0.7s",
          textAlign: "center", marginBottom: 64,
        }}>
          <div style={{ display: "inline-block", background: SOFT, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: ".78rem", fontWeight: 700, color: GREEN, letterSpacing: ".08em", textTransform: "uppercase" }}>Simple as that</span>
          </div>
          <h2 style={{ fontSize: isMobile ? "2rem" : "clamp(2.2rem,3.5vw,3rem)", fontWeight: 900, color: DARK, letterSpacing: "-1.5px", lineHeight: 1.1 }}>
            How Kaya works
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 16 }}>
          {STEPS.map((s, i) => (
            <div key={i} className="step-card" style={{
              background: WHITE, borderRadius: 20, padding: "28px 24px",
              border: `1.5px solid ${BORDER}`,
              transition: "all .25s ease",
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(24px)",
              transitionDelay: `${i * 0.1}s`,
            }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 16 }}>{s.icon}</div>
              <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".1em", color: GREEN, textTransform: "uppercase", marginBottom: 10 }}>{s.n}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: DARK, marginBottom: 10, lineHeight: 1.3 }}>{s.title}</h3>
              <p style={{ fontSize: ".88rem", color: MUTED, lineHeight: 1.75 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Why Kaya ───────────────────────────────────────────────────────────────────
function WhyKaya() {
  const [ref, vis] = useReveal();
  const w = useWindowWidth();
  const isMobile = w < 768;

  const perks = [
    { icon: "⚡", title: "30-minute delivery", desc: "We're built for speed. Our network of riders ensures your order arrives fast, every time." },
    { icon: "💰", title: "Zero commission — first 30 days", desc: "Every vendor on Kaya starts with 30 days completely commission-free. We grow together." },
    { icon: "📍", title: "Live GPS tracking", desc: "Know exactly where your order is from the moment it leaves the store to your front door." },
    { icon: "🇬🇭", title: "Built for Ghana", desc: "Mobile money native, local brand, local riders. Kaya is designed specifically for the Ghanaian market." },
    { icon: "🛡️", title: "Secure payments", desc: "Powered by Paystack. Pay with card or mobile money — your transactions are always protected." },
    { icon: "🤝", title: "Fair for everyone", desc: "Lower commission than any competitor. Better pay for riders. Better prices for customers." },
  ];

  return (
    <section style={{ padding: isMobile ? "64px 20px" : "100px 48px", background: WHITE }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{
          opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
          transition: "opacity 0.7s, transform 0.7s",
          textAlign: "center", marginBottom: 56,
        }}>
          <div style={{ display: "inline-block", background: SOFT, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: ".78rem", fontWeight: 700, color: GREEN, letterSpacing: ".08em", textTransform: "uppercase" }}>Why Kaya</span>
          </div>
          <h2 style={{ fontSize: isMobile ? "2rem" : "clamp(2.2rem,3.5vw,3rem)", fontWeight: 900, color: DARK, letterSpacing: "-1.5px", lineHeight: 1.1 }}>
            Delivery done right
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 20 }}>
          {perks.map((p, i) => (
            <div key={i} style={{
              background: CREAM, borderRadius: 20, padding: "28px 26px",
              border: `1px solid ${BORDER}`,
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(24px)",
              transition: `opacity 0.6s ${i * 0.08}s, transform 0.6s ${i * 0.08}s`,
            }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 14 }}>{p.icon}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: DARK, marginBottom: 8, lineHeight: 1.3 }}>{p.title}</h3>
              <p style={{ fontSize: ".88rem", color: MUTED, lineHeight: 1.75 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Partners (Riders & Vendors) ────────────────────────────────────────────────
function Partners({ onWaitlist }) {
  const [ref, vis] = useReveal();
  const w = useWindowWidth();
  const isMobile = w < 768;

  const cards = [
    {
      title: "Deliver with Kaya",
      desc: "Set your own hours. Earn on your terms. Deliver food, groceries and more across your city.",
      cta: "Become a Rider →",
      img: "https://i.ibb.co/sJyvFVsL/P2.png",
      badge: "🛵 Riders",
    },
    {
      title: "Grow your business",
      desc: "Reach new customers across your city. Zero commission for the first 30 days. No hidden fees.",
      cta: "Partner with Kaya →",
      img: "https://i.ibb.co/prKTjV1H/Gemini-Generated-Image-mgbgpzmgbgpzmgbg.png",
      badge: "🏪 Vendors",
    },
  ];

  return (
    <section style={{ padding: isMobile ? "64px 20px" : "100px 48px", background: CREAM }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{
          opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
          transition: "opacity 0.7s, transform 0.7s", marginBottom: 48,
        }}>
          <div style={{ display: "inline-block", background: SOFT, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: ".78rem", fontWeight: 700, color: GREEN, letterSpacing: ".08em", textTransform: "uppercase" }}>Join Kaya</span>
          </div>
          <h2 style={{ fontSize: isMobile ? "2rem" : "clamp(2.2rem,3.5vw,3rem)", fontWeight: 900, color: DARK, letterSpacing: "-1.5px", lineHeight: 1.1 }}>
            For riders &amp; businesses
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
          {cards.map((c, i) => (
            <div key={i} className="partner-card" style={{
              borderRadius: 24, overflow: "hidden",
              minHeight: 420, position: "relative",
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(24px)",
              transition: `opacity 0.7s ${i * 0.15}s, transform 0.7s ${i * 0.15}s`,
              cursor: "pointer",
            }}>
              <img src={c.img} alt={c.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,46,28,0.94) 0%, rgba(28,46,28,0.1) 60%)" }} />
              <div style={{ position: "absolute", top: 20, left: 20 }}>
                <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "6px 14px", display: "inline-block" }}>
                  <span style={{ fontSize: ".78rem", fontWeight: 700, color: WHITE }}>{c.badge}</span>
                </div>
              </div>
              <div style={{ position: "relative", zIndex: 2, padding: "36px 32px" }}>
                <h3 style={{ fontSize: "1.7rem", fontWeight: 900, color: WHITE, marginBottom: 10, lineHeight: 1.15, letterSpacing: "-0.5px" }}>{c.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: ".92rem", lineHeight: 1.7, marginBottom: 24 }}>{c.desc}</p>
                <button className="partner-btn" onClick={onWaitlist} style={{
                  background: WHITE, color: DARK, border: "none", borderRadius: 999,
                  padding: "12px 26px", fontWeight: 700, fontSize: ".9rem",
                  fontFamily: "Inter, sans-serif", cursor: "pointer",
                  transition: "background .2s, color .2s",
                }}>{c.cta}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Waitlist CTA ───────────────────────────────────────────────────────────────
function WaitlistCTA({ onWaitlist }) {
  const [ref, vis] = useReveal();
  const w = useWindowWidth();
  const isMobile = w < 768;

  return (
    <section style={{ padding: isMobile ? "80px 20px" : "120px 48px", background: DARK, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "60vw", height: "60vw", background: `${GREEN}0F`, borderRadius: "50%", pointerEvents: "none" }} />
      <div ref={ref} style={{
        maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1,
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
        transition: "opacity 0.7s, transform 0.7s",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(22,196,94,0.15)", border: "1px solid rgba(22,196,94,0.3)", borderRadius: 999, padding: "6px 16px", marginBottom: 28 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, display: "inline-block" }} />
          <span style={{ fontSize: ".8rem", fontWeight: 600, color: GREEN }}>Waitlist now open</span>
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: isMobile ? "2.4rem" : "clamp(2.4rem,4.5vw,3.8rem)",
          color: WHITE, lineHeight: 1.08, letterSpacing: "-1.5px", marginBottom: 20,
        }}>
          Be the first to<br /><em style={{ color: GREEN }}>experience Kaya</em>
        </h2>

        <p style={{ color: "rgba(255,255,255,0.45)", marginBottom: 44, fontSize: "1rem", lineHeight: 1.8 }}>
          Join thousands already on the waitlist. Get exclusive early access and launch-day perks when we go live.
        </p>

        <button onClick={onWaitlist} style={{
          background: GREEN, color: WHITE, border: "none", borderRadius: 999,
          padding: "16px 48px", fontWeight: 800, fontSize: "1rem",
          fontFamily: "Inter, sans-serif", cursor: "pointer",
          boxShadow: "0 8px 32px rgba(22,196,94,0.35)", transition: "opacity .2s",
        }}
          onMouseEnter={e => e.target.style.opacity = 0.85}
          onMouseLeave={e => e.target.style.opacity = 1}
        >
          Reserve your spot →
        </button>
        <p style={{ marginTop: 16, fontSize: ".82rem", color: "rgba(255,255,255,0.2)" }}>Free to join. No credit card needed.</p>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer({ onWaitlist }) {
  const w = useWindowWidth();
  const isMobile = w < 768;

  return (
    <footer style={{ background: "#080e0a", padding: isMobile ? "56px 20px 32px" : "72px 48px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
          gap: isMobile ? 40 : 48, marginBottom: 56,
        }}>
          <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
            <img src="https://i.ibb.co/9mmjhR0Y/Untitled-4.png" alt="Kaya" style={{ height: 48, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", marginBottom: 14 }} />
            <p style={{ fontSize: ".88rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.75, maxWidth: 220, marginBottom: 24 }}>
              Everything you need, delivered fast. Kumasi &amp; Accra.
            </p>
            <button onClick={onWaitlist} style={{
              background: GREEN, color: WHITE, border: "none", borderRadius: 999,
              padding: "10px 22px", fontWeight: 700, fontSize: ".85rem",
              fontFamily: "Inter, sans-serif", cursor: "pointer", transition: "opacity .2s",
            }}
              onMouseEnter={e => e.target.style.opacity = 0.85}
              onMouseLeave={e => e.target.style.opacity = 1}
            >Join Waitlist</button>
          </div>

          {[
            { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
            { title: "Services", links: ["Food", "Grocery", "Pharmacy", "Retail"] },
            { title: "Partners", links: ["Become a Rider", "Partner with Us", "Help Center", "Contact"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>{col.title}</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map((l, j) => (
                  <li key={j}>
                    <a href="#" style={{ fontSize: ".88rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color .2s" }}
                      onMouseEnter={e => e.target.style.color = WHITE}
                      onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
                    >{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: ".82rem", color: "rgba(255,255,255,0.2)" }}>© 2026 Kaya Technologies. All rights reserved.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {[{ label: "Privacy", href: "/privacy-policy.html" }, { label: "Terms", href: "/terms-of-service.html" }].map((l, i) => (
              <a key={i} href={l.href} style={{ fontSize: ".82rem", color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = WHITE}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
              >{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Waitlist Modal (unchanged logic) ──────────────────────────────────────────
const DIAL_CODES = {
  "Algeria":"+213","Angola":"+244","Benin":"+229","Botswana":"+267","Burkina Faso":"+226","Burundi":"+257","Cabo Verde":"+238","Cameroon":"+237","Central African Republic":"+236","Chad":"+235","Comoros":"+269","Congo (Brazzaville)":"+242","Congo (DRC)":"+243","Djibouti":"+253","Egypt":"+20","Equatorial Guinea":"+240","Eritrea":"+291","Eswatini":"+268","Ethiopia":"+251","Gabon":"+241","Gambia":"+220","Ghana":"+233","Guinea":"+224","Guinea-Bissau":"+245","Ivory Coast":"+225","Kenya":"+254","Lesotho":"+266","Liberia":"+231","Libya":"+218","Madagascar":"+261","Malawi":"+265","Mali":"+223","Mauritania":"+222","Mauritius":"+230","Morocco":"+212","Mozambique":"+258","Namibia":"+264","Niger":"+227","Nigeria":"+234","Rwanda":"+250","São Tomé & Príncipe":"+239","Senegal":"+221","Seychelles":"+248","Sierra Leone":"+232","Somalia":"+252","South Africa":"+27","South Sudan":"+211","Sudan":"+249","Tanzania":"+255","Togo":"+228","Tunisia":"+216","Uganda":"+256","Zambia":"+260","Zimbabwe":"+263",
};

function WaitlistModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", city: "", country: "", phone: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focus, setFocus] = useState("");
  const w = useWindowWidth();
  const isMobile = w < 640;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!form.city.trim()) e.city = "Please enter your city";
    if (!form.country.trim()) e.country = "Please select your country";
    if (!/^\+?[\d\s\-()]{7,}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    return e;
  };

  const handle = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: undefined }));
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    const { error } = await supabase.from("waitlist").insert([{ name: form.name, email: form.email, phone: form.phone, city: form.city, country: form.country }]);
    if (error) { setLoading(false); setErrors({ email: "Something went wrong. Please try again." }); return; }
    await supabase.functions.invoke("send-waitlist-email", {
      body: { name: form.name, email: form.email, city: form.city, country: form.country },
    });
    setLoading(false);
    setSubmitted(true);
  };

  if (!open) return null;

  const inputStyle = (key) => ({
    width: "100%", padding: "13px 16px",
    background: focus === key ? SOFT : "#f9fafb",
    border: `1.5px solid ${errors[key] ? "#e53e3e" : focus === key ? GREEN : BORDER}`,
    borderRadius: 12, color: TEXT, fontSize: ".95rem",
    fontFamily: "Inter, sans-serif", outline: "none",
    transition: "border-color .2s, background .2s",
  });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "8px" : 16, background: "rgba(28,46,28,0.6)", backdropFilter: "blur(16px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: WHITE, borderRadius: 28,
        padding: isMobile ? "28px 20px" : "48px 44px",
        maxWidth: 500, width: "100%",
        boxShadow: "0 40px 120px rgba(0,0,0,0.2)",
        position: "relative", maxHeight: "92svh", overflowY: "auto",
        animation: "fadeUp .4s ease",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 18, right: 18,
          background: SOFT, border: "none", color: MUTED,
          borderRadius: "50%", width: 34, height: 34, cursor: "pointer",
          fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background .2s",
        }}
          onMouseEnter={e => e.target.style.background = BORDER}
          onMouseLeave={e => e.target.style.background = SOFT}
        >✕</button>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 64, height: 64, background: SOFT, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "1.8rem" }}>🎉</div>
            <h3 style={{ fontSize: "1.8rem", fontWeight: 900, color: DARK, marginBottom: 12, letterSpacing: "-0.5px" }}>You're on the list!</h3>
            <p style={{ color: MUTED, lineHeight: 1.7, marginBottom: 24 }}>
              Thanks {form.name.split(" ")[0]}! We'll reach out to <strong style={{ color: DARK }}>{form.email}</strong> when Kaya launches in <strong>{form.city}</strong>.
            </p>
            <div style={{ background: SOFT, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 18px" }}>
              <p style={{ fontSize: ".85rem", color: DARK, fontWeight: 600 }}>📱 Watch your inbox for your exclusive early access invite.</p>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "inline-block", background: SOFT, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "4px 12px", marginBottom: 14 }}>
                <span style={{ fontSize: ".72rem", fontWeight: 700, color: GREEN, letterSpacing: ".08em", textTransform: "uppercase" }}>Early access</span>
              </div>
              <h3 style={{ fontSize: "1.7rem", fontWeight: 900, color: DARK, marginBottom: 8, letterSpacing: "-0.5px" }}>Join the Kaya waitlist</h3>
              <p style={{ color: MUTED, fontSize: ".92rem", lineHeight: 1.65 }}>Be among the first to experience delivery reimagined.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: ".75rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Full Name</label>
                <input value={form.name} onChange={handle("name")} placeholder="Richmond Sarpong" style={inputStyle("name")} onFocus={() => setFocus("name")} onBlur={() => setFocus("")} />
                {errors.name && <p style={{ color: "#e53e3e", fontSize: ".78rem", marginTop: 4 }}>{errors.name}</p>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: ".75rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>City</label>
                  <input value={form.city} onChange={handle("city")} placeholder="Accra" style={inputStyle("city")} onFocus={() => setFocus("city")} onBlur={() => setFocus("")} />
                  {errors.city && <p style={{ color: "#e53e3e", fontSize: ".78rem", marginTop: 4 }}>{errors.city}</p>}
                </div>
                <div>
                  <label style={{ fontSize: ".75rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Country</label>
                  <select value={form.country} onChange={handle("country")} onFocus={() => setFocus("country")} onBlur={() => setFocus("")}
                    style={{ ...inputStyle("country"), appearance: "none", WebkitAppearance: "none" }}>
                    <option value="" disabled>Select country</option>
                    {Object.keys(DIAL_CODES).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.country && <p style={{ color: "#e53e3e", fontSize: ".78rem", marginTop: 4 }}>{errors.country}</p>}
                </div>
              </div>

              <div>
                <label style={{ fontSize: ".75rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Phone</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {form.country && DIAL_CODES[form.country] && (
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "0 14px", borderRadius: 12, fontWeight: 700, fontSize: ".9rem",
                      background: SOFT, border: `1.5px solid ${BORDER}`,
                      color: DARK, whiteSpace: "nowrap", flexShrink: 0,
                    }}>{DIAL_CODES[form.country]}</div>
                  )}
                  <input value={form.phone} onChange={handle("phone")} type="tel" placeholder="XX XXX XXXX" style={{ ...inputStyle("phone"), flex: 1 }} onFocus={() => setFocus("phone")} onBlur={() => setFocus("")} />
                </div>
                {errors.phone && <p style={{ color: "#e53e3e", fontSize: ".78rem", marginTop: 4 }}>{errors.phone}</p>}
              </div>

              <div>
                <label style={{ fontSize: ".75rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Email</label>
                <input value={form.email} onChange={handle("email")} type="email" placeholder="you@example.com" style={inputStyle("email")} onFocus={() => setFocus("email")} onBlur={() => setFocus("")} />
                {errors.email && <p style={{ color: "#e53e3e", fontSize: ".78rem", marginTop: 4 }}>{errors.email}</p>}
              </div>

              <button onClick={submit} disabled={loading} style={{
                marginTop: 4, background: loading ? `${DARK}aa` : DARK, color: WHITE,
                border: "none", borderRadius: 14, padding: "15px", fontWeight: 800, fontSize: ".95rem",
                fontFamily: "Inter, sans-serif", cursor: loading ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "opacity .2s",
              }}>
                {loading ? (
                  <><div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: WHITE, borderRadius: "50%", animation: "spin .8s linear infinite" }} /> Securing your spot…</>
                ) : "Get Early Access →"}
              </button>

              <p style={{ textAlign: "center", fontSize: ".78rem", color: MUTED }}>No spam, ever. Only your Kaya invite.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Cookie notice ──────────────────────────────────────────────────────────────
function CookieNotice() {
  const [visible, setVisible] = useState(() => !localStorage.getItem("kaya_cookie_ok"));
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99998,
      background: WHITE, borderTop: `1px solid ${BORDER}`,
      padding: "14px 24px", display: "flex", alignItems: "center",
      justifyContent: "center", gap: 20, flexWrap: "wrap",
    }}>
      <p style={{ fontSize: ".85rem", color: MUTED, margin: 0, maxWidth: 680 }}>
        We use cookies to keep the site working and analyse usage. By continuing, you agree to our{" "}
        <a href="/privacy-policy.html" style={{ color: DARK, textDecoration: "underline" }}>Privacy Policy</a>.
      </p>
      <button onClick={() => { localStorage.setItem("kaya_cookie_ok", "1"); setVisible(false); }} style={{
        background: DARK, color: WHITE, border: "none", borderRadius: 999,
        padding: "9px 22px", fontWeight: 700, fontSize: ".85rem",
        fontFamily: "Inter, sans-serif", cursor: "pointer", whiteSpace: "nowrap",
      }}>Got it</button>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openWaitlist = () => setModalOpen(true);

  return (
    <>
      <style>{styles}</style>
      <Navbar onWaitlist={openWaitlist} />
      <Hero onWaitlist={openWaitlist} />
      <StatsBar />
      <Categories onWaitlist={openWaitlist} />
      <HowItWorks />
      <WhyKaya />
      <Partners onWaitlist={openWaitlist} />
      <WaitlistCTA onWaitlist={openWaitlist} />
      <Footer onWaitlist={openWaitlist} />
      <WaitlistModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <CookieNotice />
    </>
  );
}
