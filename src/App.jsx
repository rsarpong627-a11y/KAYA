import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://galtdialnwommzmxopgh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhbHRkaWFsbndvbW16bXhvcGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMDYzODIsImV4cCI6MjA4OTY4MjM4Mn0.9kukUE8DXjE7NYro5zUNUgb9Z3xuGkfJGT1F7K4VVXg"
);

// ── Design tokens ──────────────────────────────────────────────────────────────
const CREAM = "#F0EBE0";
const DARK  = "#1B3A2A";
const TERRA = "#C85A38";
const GOLD  = "#E8B83C";
const TEXT  = "#1A1A1A";
const WHITE = "#FFFFFF";
const MUTED = "#7A7A6A";
const SOFT  = "rgba(27,58,42,0.06)";

// ── Global styles ──────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; min-height: 100vh; max-width: 100%; }
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { font-family: 'Inter', sans-serif; background: ${CREAM}; color: ${TEXT}; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: ${DARK}44; border-radius: 4px; }

  @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin   { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }

  .nav-a:hover { opacity: 0.5 !important; }
  .pill-role { transition: all .2s; cursor: pointer; }
  .pill-role:hover { background: ${DARK} !important; color: ${WHITE} !important; border-color: ${DARK} !important; }
  .cat-card { transition: transform .3s; cursor: pointer; overflow: hidden; }
  .cat-card:hover { transform: scale(1.015); }
  .cat-card img { transition: transform .5s; }
  .cat-card:hover img { transform: scale(1.06); }
`;

// ── Helpers ────────────────────────────────────────────────────────────────────
function useW() {
  const [w, setW] = useState(() => typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

function useReveal(threshold = 0.1) {
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
  const w = useW();
  const mob = w < 768;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: mob ? "14px 20px" : "0 48px",
      height: mob ? "auto" : 68,
      background: scrolled ? "rgba(240,235,224,0.96)" : CREAM,
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: `1px solid ${scrolled ? "rgba(27,58,42,0.1)" : "transparent"}`,
      transition: "all .25s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/kaya-logo.png" alt="Kaya" style={{ height: mob ? 32 : 36, width: "auto", objectFit: "contain" }} />
      </div>

      {!mob && (
        <div style={{ display: "flex", gap: 36 }}>
          {["What we deliver", "How it works", "Why Kaya", "Partners"].map(l => (
            <a key={l} href="#" className="nav-a" style={{
              fontSize: ".88rem", color: TEXT, fontWeight: 500,
              textDecoration: "none", transition: "opacity .2s",
            }}>{l}</a>
          ))}
        </div>
      )}

      <button onClick={onWaitlist} style={{
        background: DARK, color: WHITE, border: "none", borderRadius: 999,
        padding: mob ? "9px 18px" : "11px 26px",
        fontWeight: 700, fontSize: ".85rem",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
      }}>
        Get early access {!mob && "↗"}
      </button>
    </nav>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────────
function Hero({ onWaitlist }) {
  const w = useW();
  const mob = w < 768;
  const [role, setRole] = useState("order");

  const roles = [
    { id: "order", label: "I want to order" },
    { id: "ride",  label: "Ride with Kaya" },
    { id: "sell",  label: "Sell on Kaya" },
  ];

  return (
    <section style={{
      minHeight: "100svh", background: CREAM,
      display: "flex", alignItems: "center",
      padding: mob ? "100px 20px 60px" : "0 48px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto", width: "100%",
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : "1.1fr 0.9fr",
        gap: mob ? 40 : 80, alignItems: "center",
      }}>
        {/* Left */}
        <div style={{ animation: "fadeUp .8s .1s both" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            border: `1.5px solid rgba(27,58,42,0.2)`,
            borderRadius: 999, padding: "6px 16px", marginBottom: 28,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: TERRA, display: "inline-block" }} />
            <span style={{ fontSize: ".78rem", fontWeight: 600, color: TEXT, letterSpacing: ".06em", textTransform: "uppercase" }}>Now launching in Ghana</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: mob ? "clamp(2.6rem,11vw,3.4rem)" : "clamp(3.6rem,5.5vw,5.2rem)",
            fontWeight: 900, lineHeight: 1.04,
            letterSpacing: "-2.5px", color: TEXT,
            marginBottom: 20, wordBreak: "break-word",
          }}>
            Order<br />
            <em style={{ fontStyle: "normal", color: TERRA }}>anything.</em><br />
            Delivered in<br />
            <span style={{ position: "relative", display: "inline-block" }}>
              30 min.
              <span style={{
                position: "absolute", bottom: -6, left: 0, right: 0, height: 5,
                background: GOLD, borderRadius: 99,
              }} />
            </span>
          </h1>

          <p style={{
            fontSize: mob ? ".95rem" : "1.05rem",
            color: MUTED, lineHeight: 1.75,
            maxWidth: 460, marginBottom: 36, marginTop: 16,
          }}>
            Food, groceries, pharmacy and retail — one app for your entire day.
            Built for <strong style={{ color: TEXT }}>Kumasi</strong> &amp; <strong style={{ color: TEXT }}>Accra</strong>.
            Ride with mobile money, land at your door.
          </p>

          {/* Role pills */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
            {roles.map(r => (
              <button key={r.id} className="pill-role" onClick={() => { setRole(r.id); onWaitlist(); }} style={{
                padding: "11px 22px", borderRadius: 999,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700, fontSize: ".88rem", cursor: "pointer",
                background: role === r.id ? DARK : "transparent",
                color: role === r.id ? WHITE : TEXT,
                border: `2px solid ${role === r.id ? DARK : "rgba(27,58,42,0.22)"}`,
                transition: "all .2s",
              }}>{r.label}</button>
            ))}
          </div>
        </div>

        {/* Right: image */}
        {!mob && (
          <div style={{ position: "relative", animation: "fadeUp .8s .3s both" }}>
            {/* Main food image */}
            <div style={{ borderRadius: 24, overflow: "hidden", position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=85"
                alt="Food"
                style={{ width: "100%", height: 500, objectFit: "cover", display: "block" }}
              />
              {/* Circular badge overlay */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
              }}>
                <CircularBadge />
              </div>
            </div>

            {/* Floating delivery badge */}
            <div style={{
              position: "absolute", bottom: 48, left: -32,
              background: GOLD, borderRadius: 999, padding: "12px 20px",
              display: "flex", alignItems: "center", gap: 10,
              boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
            }}>
              <span style={{ fontSize: "1.1rem" }}>📡</span>
              <div>
                <div style={{ fontSize: ".68rem", color: DARK, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Arriving in</div>
                <div style={{ fontSize: "1rem", color: DARK, fontWeight: 900 }}>22 min</div>
              </div>
            </div>

            {/* Grocery image below */}
            <div style={{ borderRadius: 16, overflow: "hidden", marginTop: 12, height: 160 }}>
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
                alt="Grocery"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Circular badge ─────────────────────────────────────────────────────────────
function CircularBadge() {
  return (
    <svg width="148" height="148" viewBox="0 0 148 148">
      <circle cx="74" cy="74" r="74" fill={DARK} fillOpacity=".88" />
      <circle cx="74" cy="74" r="26" fill={GOLD} />
      <path d="M77 54 L68 74 L74 74 L71 94 L80 74 L74 74 L77 54Z" fill={DARK} />
      <defs>
        <path id="ctext" d="M74,74 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1,-104,0" />
      </defs>
      <text fill={WHITE} fontSize="9.5" fontWeight="700" letterSpacing="4.5" fontFamily="Inter,sans-serif">
        <textPath href="#ctext">KUMASI · ACCRA · KUMASI · ACCRA ·</textPath>
      </text>
    </svg>
  );
}

// ── Ticker ─────────────────────────────────────────────────────────────────────
function Ticker() {
  const items = ["MOBILE MONEY NATIVE", "LIVE GPS TRACKING", "BUILT IN GHANA", "30-MIN DELIVERY", "ZERO COMMISSION — FIRST 30 DAYS", "ONE APP · EVERYTHING"];
  const text = items.join("   ·   ") + "   ·   ";
  const doubled = text + text;

  return (
    <div style={{ background: GOLD, overflow: "hidden", padding: "14px 0", borderTop: `1px solid rgba(27,58,42,0.12)`, borderBottom: `1px solid rgba(27,58,42,0.12)` }}>
      <div style={{ display: "flex", width: "max-content", animation: "ticker 28s linear infinite" }}>
        {[...Array(2)].map((_, i) => (
          <span key={i} style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: ".85rem",
            color: DARK, letterSpacing: ".12em",
            textTransform: "uppercase", whiteSpace: "nowrap",
            padding: "0 2px",
          }}>{doubled}</span>
        ))}
      </div>
    </div>
  );
}

// ── Categories ─────────────────────────────────────────────────────────────────
function Categories({ onWaitlist }) {
  const [ref, vis] = useReveal();
  const w = useW();
  const mob = w < 768;

  const cats = [
    { label: "Food", sub: "LOCAL CHOPS BARS & RESTAURANTS", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80", large: true },
    { label: "Grocery", sub: "FRESH MARKET TO DOOR", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80" },
    { label: "Pharmacy", sub: "MEDS & HEALTH ESSENTIALS", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80" },
    { label: "Retail", sub: "LOCAL SHOPS & BOUTIQUES", img: "https://images.pexels.com/photos/6994304/pexels-photo-6994304.jpeg", wide: true },
  ];

  return (
    <section style={{ padding: mob ? "64px 20px" : "100px 48px", background: CREAM }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div ref={ref} style={{
          display: mob ? "block" : "flex",
          justifyContent: "space-between", alignItems: "flex-end",
          marginBottom: 40,
          opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
          transition: "opacity .7s, transform .7s",
        }}>
          <div>
            <p style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", color: MUTED, textTransform: "uppercase", marginBottom: 12 }}>ONE APP · MANY SHELVES</p>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: mob ? "2rem" : "clamp(2.4rem,3.5vw,3.2rem)",
              fontWeight: 900, color: TEXT,
              letterSpacing: "-1.5px", lineHeight: 1.1,
            }}>
              Everything your city<br />
              <em style={{ fontStyle: "normal", color: TERRA }}>has to offer.</em>
            </h2>
          </div>
          {!mob && (
            <p style={{ maxWidth: 300, fontSize: ".95rem", color: MUTED, lineHeight: 1.75, textAlign: "right" }}>
              From midnight jollof to a last-minute prescription — Kaya is the single tap between you and your day.
            </p>
          )}
        </div>

        {/* Bento grid */}
        {mob ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cats.map((c, i) => <CatCard key={i} cat={c} height={i === 0 ? 260 : 180} vis={vis} onClick={onWaitlist} />)}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gridTemplateRows: "340px 340px", gap: 10 }}>
            {/* Food — spans 2 rows */}
            <div style={{ gridRow: "1 / 3" }}>
              <CatCard cat={cats[0]} height="100%" vis={vis} onClick={onWaitlist} />
            </div>
            <CatCard cat={cats[1]} height="100%" vis={vis} onClick={onWaitlist} delay=".1s" />
            <CatCard cat={cats[2]} height="100%" vis={vis} onClick={onWaitlist} delay=".2s" />
          </div>
        )}
        {/* Retail — full width below */}
        {!mob && (
          <div style={{ marginTop: 10 }}>
            <CatCard cat={cats[3]} height={240} vis={vis} onClick={onWaitlist} delay=".3s" />
          </div>
        )}
      </div>
    </section>
  );
}

function CatCard({ cat, height, vis, onClick, delay = "0s" }) {
  return (
    <div className="cat-card" onClick={onClick} style={{
      borderRadius: 20, position: "relative",
      height: typeof height === "number" ? height : "100%",
      opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
      transition: `opacity .7s ${delay}, transform .7s ${delay}`,
    }}>
      <img src={cat.img} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: 20 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(27,58,42,0.86) 0%, transparent 55%)", borderRadius: 20 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: cat.large ? "28px 28px" : "20px 20px" }}>
        <p style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: ".12em", color: GOLD, textTransform: "uppercase", marginBottom: 6 }}>{cat.sub}</p>
        <h3 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: cat.large ? "2.4rem" : "1.6rem",
          fontWeight: 900, color: WHITE, lineHeight: 1.05, letterSpacing: "-1px",
        }}>{cat.label}</h3>
      </div>
    </div>
  );
}

// ── How it works ───────────────────────────────────────────────────────────────
const STEPS = [
  { n: "01", icon: "📍", title: "Share your location", desc: "Tell us where you are. We surface everything available nearby in seconds." },
  { n: "02", icon: "🛒", title: "Browse & order", desc: "Pick from restaurants, grocery stores, pharmacies, retail and more." },
  { n: "03", icon: "📡", title: "Track in real time", desc: "Watch your order live on the map — from pack-up to your front door." },
  { n: "04", icon: "⚡", title: "Enjoy, delivered", desc: "Fast, fresh, exactly as ordered. Right at your door in under 30 minutes." },
];

function HowItWorks() {
  const [ref, vis] = useReveal();
  const w = useW();
  const mob = w < 768;

  return (
    <section style={{ background: DARK, padding: mob ? "64px 20px" : "100px 48px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div ref={ref} style={{
          opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
          transition: "opacity .7s, transform .7s", marginBottom: 56,
        }}>
          <p style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", color: GOLD, textTransform: "uppercase", marginBottom: 14 }}>Simple as that</p>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: mob ? "2.4rem" : "clamp(2.8rem,4vw,3.8rem)",
            fontWeight: 900, color: WHITE, letterSpacing: "-2px", lineHeight: 1.05,
          }}>How Kaya works.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4,1fr)", gap: 12 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.06)", borderRadius: 20,
              padding: "28px 24px", border: "1px solid rgba(255,255,255,0.1)",
              opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
              transition: `opacity .6s ${i * .12}s, transform .6s ${i * .12}s`,
              position: "relative",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "2.8rem", fontWeight: 900,
                  color: GOLD, lineHeight: 1,
                }}>{s.n}</span>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem",
                }}>{s.icon}</div>
              </div>
              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: ".98rem", fontWeight: 800,
                color: WHITE, marginBottom: 10, lineHeight: 1.3,
              }}>{s.title}</h3>
              <p style={{ fontSize: ".84rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{s.desc}</p>
              {i < STEPS.length - 1 && !mob && (
                <span style={{ position: "absolute", top: "50%", right: -18, color: "rgba(255,255,255,0.2)", fontSize: "1.2rem" }}>→</span>
              )}
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
  const w = useW();
  const mob = w < 768;

  return (
    <section style={{ background: CREAM, padding: mob ? "64px 20px" : "100px 48px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div ref={ref} style={{
          opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
          transition: "opacity .7s, transform .7s", marginBottom: 48,
        }}>
          <p style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", color: MUTED, textTransform: "uppercase", marginBottom: 14 }}>Why Kaya</p>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: mob ? "2.2rem" : "clamp(2.6rem,4vw,3.6rem)",
            fontWeight: 900, color: TEXT, letterSpacing: "-2px", lineHeight: 1.05,
          }}>
            Delivery, done <em style={{ fontStyle: "normal", color: TERRA }}>right.</em>
          </h2>
        </div>

        {mob ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, opacity: vis ? 1 : 0, transition: "opacity .7s .2s" }}>
            <BentoZero />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <BentoCard icon="⚡" stat="30min" title="Under 30-min delivery." desc="Our rider network is built for speed." light />
              <BentoCard icon="📡" title="Live GPS tracking." desc="From pickup to your door." dark />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <BentoCard emoji="🇬🇭" title="Built for Ghana." desc="Mobile money native." light small />
              <BentoCard icon="🛡" title="Secure payments." desc="Powered by Paystack." light small />
              <BentoCard icon="🤝" title="Fair for all." desc="Lower rates, better pay." light small />
            </div>
          </div>
        ) : (
          <div style={{ opacity: vis ? 1 : 0, transition: "opacity .7s .2s" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <BentoZero />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <BentoCard icon="⚡" stat="30min" title="Under~30-minute delivery." desc="Our rider network is built for speed — every time." light />
                <BentoCard icon="📡" title="Live GPS tracking." desc="Know exactly where your order is — from pickup to your door." dark />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <BentoCard emoji="🇬🇭" title="Built for Ghana." desc="Mobile money native. Local brand. Local riders." light />
              <BentoCard icon="🛡" title="Secure payments." desc="Powered by Paystack. Card or mobile money — always protected." light />
              <BentoCard icon="🤝" title="Fair for everyone." desc="Lower commission than competitors. Better pay for riders." light />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function BentoZero() {
  return (
    <div style={{
      background: WHITE, borderRadius: 20, padding: "36px 32px",
      border: `1px solid rgba(27,58,42,0.1)`,
    }}>
      <p style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".12em", color: MUTED, textTransform: "uppercase", marginBottom: 8 }}>For Vendors</p>
      <div style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "clamp(5rem,12vw,8rem)", fontWeight: 900,
        color: DARK, lineHeight: .9, letterSpacing: "-4px",
        marginBottom: 20,
      }}>0%</div>
      <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.15rem", fontWeight: 800, color: TEXT, marginBottom: 8 }}>Zero commission — first 30 days.</h3>
      <p style={{ fontSize: ".88rem", color: MUTED, lineHeight: 1.7 }}>Every vendor on Kaya launches commission-free. We grow together, not at your expense.</p>
    </div>
  );
}

function BentoCard({ icon, emoji, stat, title, desc, light, dark: isDark, small }) {
  return (
    <div style={{
      background: isDark ? DARK : light ? WHITE : CREAM,
      borderRadius: 20, padding: small ? "20px" : "28px 24px",
      border: isDark ? "none" : `1px solid rgba(27,58,42,0.1)`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <span style={{ fontSize: isDark ? "1.2rem" : "1.1rem" }}>{emoji || icon}</span>
        {stat && <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: "1.6rem", color: TEXT }}>{stat}</span>}
      </div>
      <h3 style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: small ? ".88rem" : "1rem", fontWeight: 800,
        color: isDark ? WHITE : TEXT, marginBottom: 6, lineHeight: 1.3,
      }}>{title}</h3>
      <p style={{ fontSize: small ? ".78rem" : ".85rem", color: isDark ? "rgba(255,255,255,0.45)" : MUTED, lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}

// ── Stats ──────────────────────────────────────────────────────────────────────
function Stats() {
  const [ref, vis] = useReveal();
  const w = useW();
  const mob = w < 768;

  const items = [
    { value: "30 min", label: "Average delivery" },
    { value: "4.9★", label: "App store rating" },
    { value: "100+", label: "Vendors at launch" },
    { value: "Accra · Kumasi", label: "Launch cities" },
  ];

  return (
    <section style={{ background: CREAM, padding: mob ? "0 20px 48px" : "0 48px 80px" }}>
      <div ref={ref} style={{
        maxWidth: 1280, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4,1fr)",
        gap: 10,
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
        transition: "opacity .7s, transform .7s",
      }}>
        {items.map((s, i) => (
          <div key={i} style={{
            background: WHITE, borderRadius: 16, padding: "24px 20px",
            border: `1px solid rgba(27,58,42,0.1)`, textAlign: "center",
          }}>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: mob ? "1.4rem" : "1.7rem", fontWeight: 900,
              color: TEXT, lineHeight: 1, marginBottom: 8,
            }}>{s.value}</div>
            <div style={{ fontSize: ".78rem", color: MUTED, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Partners ───────────────────────────────────────────────────────────────────
function Partners({ onWaitlist }) {
  const [ref, vis] = useReveal();
  const w = useW();
  const mob = w < 768;

  const cards = [
    {
      img: "/rider-illustration.svg",
      alt: "Rider illustration",
      title: "Deliver with Kaya",
      desc: "Set your own hours. Earn on your terms. Deliver food, groceries and more across your city. Sign up in minutes.",
      cta: "Start earning →",
      ctaColor: GOLD,
    },
    {
      img: "/vendor-illustration.svg",
      alt: "Vendor illustration",
      title: "Grow your business",
      desc: "Attract new customers and grow your sales, starting with 0% commission for your first 30 days. No hidden fees.",
      cta: "Partner with Kaya →",
      ctaColor: TERRA,
    },
  ];

  return (
    <section style={{ background: CREAM, padding: mob ? "64px 20px" : "100px 48px" }}>
      <div ref={ref} style={{
        maxWidth: 900, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
        gap: mob ? 56 : 64,
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
        transition: "opacity .7s, transform .7s",
      }}>
        {cards.map((c, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ width: mob ? 180 : 220, height: mob ? 180 : 220, margin: "0 auto 28px" }}>
              <img src={c.img} alt={c.alt} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
            </div>
            <h3 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: mob ? "1.8rem" : "2rem",
              fontWeight: 900, color: DARK,
              lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 14,
            }}>{c.title}</h3>
            <p style={{
              fontSize: ".95rem", color: MUTED,
              lineHeight: 1.75, marginBottom: 20,
              maxWidth: 340, margin: "0 auto 20px",
            }}>{c.desc}</p>
            <button onClick={onWaitlist} style={{
              background: "none", border: "none", padding: 0,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800, fontSize: "1rem",
              color: c.ctaColor, cursor: "pointer",
            }}>{c.cta}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Waitlist CTA ───────────────────────────────────────────────────────────────
function WaitlistCTA({ onWaitlist }) {
  const [ref, vis] = useReveal();
  const [role, setRole] = useState("order");
  const w = useW();
  const mob = w < 768;

  const roles = [
    { id: "order", label: "I want to order" },
    { id: "ride",  label: "Ride with Kaya" },
    { id: "sell",  label: "Sell on Kaya" },
  ];

  return (
    <section style={{ background: TERRA, padding: mob ? "80px 20px" : "120px 48px", position: "relative", overflow: "hidden" }}>
      <div ref={ref} style={{
        maxWidth: 800, margin: "0 auto", textAlign: "center",
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(28px)",
        transition: "opacity .7s, transform .7s",
      }}>
        <p style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".16em", color: GOLD, textTransform: "uppercase", marginBottom: 24 }}>Waitlist now open</p>

        <h2 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: mob ? "2.8rem" : "clamp(3.2rem,6vw,5.2rem)",
          fontWeight: 900, color: WHITE, lineHeight: 1.04,
          letterSpacing: "-2.5px", marginBottom: 12,
        }}>
          Be the first to<br />experience Kaya.
        </h2>

        {/* Gold underline */}
        <div style={{ width: mob ? 200 : 320, height: 5, background: GOLD, borderRadius: 99, margin: "0 auto 28px" }} />

        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: mob ? ".9rem" : "1rem", lineHeight: 1.8, marginBottom: 36 }}>
          Join thousands already on the waitlist. Get exclusive early access, launch-day perks, and founder pricing when we go live.
        </p>

        {/* Role pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
          {roles.map(r => (
            <button key={r.id} onClick={() => setRole(r.id)} style={{
              padding: "10px 22px", borderRadius: 999, cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: ".88rem",
              background: role === r.id ? GOLD : "transparent",
              color: role === r.id ? DARK : WHITE,
              border: `2px solid ${role === r.id ? GOLD : "rgba(255,255,255,0.4)"}`,
              transition: "all .2s",
            }}>{r.label}</button>
          ))}
        </div>

        {/* Email CTA */}
        <div style={{
          display: "flex", gap: 0, maxWidth: 520, margin: "0 auto",
          background: "rgba(255,255,255,0.15)", borderRadius: 999,
          border: "2px solid rgba(255,255,255,0.3)", overflow: "hidden",
        }}>
          <input type="email" placeholder="you@kaya.gh" style={{
            flex: 1, border: "none", outline: "none",
            padding: "15px 22px", fontSize: ".95rem",
            fontFamily: "'Inter', sans-serif",
            background: "transparent", color: WHITE,
          }} />
          <button onClick={onWaitlist} style={{
            background: DARK, color: WHITE, border: "none",
            padding: "15px 26px", fontWeight: 800, fontSize: ".9rem",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            cursor: "pointer", whiteSpace: "nowrap",
            display: "flex", alignItems: "center", gap: 8,
          }}>Join the waitlist →</button>
        </div>

        <p style={{ marginTop: 14, fontSize: ".78rem", color: "rgba(255,255,255,0.4)" }}>Free to join · No credit card · Launch perks included</p>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer({ onWaitlist }) {
  const w = useW();
  const mob = w < 768;

  return (
    <footer style={{ background: DARK, padding: mob ? "60px 20px 32px" : "80px 48px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : "1.8fr 1fr 1fr 1fr",
          gap: mob ? 40 : 48, marginBottom: 56,
        }}>
          {/* Brand */}
          <div style={{ gridColumn: mob ? "1 / -1" : "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <img src="/kaya-logo.png" alt="Kaya" style={{ height: 32, filter: "brightness(0) invert(1)", objectFit: "contain" }} />
            </div>
            <p style={{ fontSize: ".88rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.75, maxWidth: 240, marginBottom: 24 }}>
              Ghana's everything-app. Food, groceries, pharmacy and retail — delivered in under 30 minutes.
            </p>
            <button onClick={onWaitlist} style={{
              background: TERRA, color: WHITE, border: "none", borderRadius: 999,
              padding: "10px 22px", fontWeight: 700, fontSize: ".85rem",
              fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: "pointer",
            }}>Join Waitlist</button>
          </div>

          {[
            { title: "Product", links: ["What we deliver", "How it works", "Why Kaya"] },
            { title: "Join", links: ["Customers", "Riders", "Vendors"] },
            { title: "Company", links: ["Privacy", "hello@kayafast.com", "Accra · Kumasi"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>{col.title}</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
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

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 28, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 0 }}>
          <p style={{ fontSize: ".82rem", color: "rgba(255,255,255,0.2)" }}>© 2026 Kaya. Built in Ghana 🇬🇭.</p>
          <p style={{ fontSize: ".82rem", color: "rgba(255,255,255,0.2)" }}>Powered by Paystack. Made with love for Accra &amp; Kumasi.</p>
        </div>

        {/* Watermark */}
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: mob ? "18vw" : "13vw", fontWeight: 900,
          color: "rgba(255,255,255,0.04)", lineHeight: 1,
          letterSpacing: "-4px", marginTop: -8,
          userSelect: "none", pointerEvents: "none",
          overflow: "hidden",
        }}>KAYA</div>
      </div>
    </footer>
  );
}

// ── Waitlist Modal ─────────────────────────────────────────────────────────────
const DIAL_CODES = {
  "Algeria":"+213","Angola":"+244","Benin":"+229","Botswana":"+267","Burkina Faso":"+226","Burundi":"+257","Cabo Verde":"+238","Cameroon":"+237","Central African Republic":"+236","Chad":"+235","Comoros":"+269","Congo (Brazzaville)":"+242","Congo (DRC)":"+243","Djibouti":"+253","Egypt":"+20","Equatorial Guinea":"+240","Eritrea":"+291","Eswatini":"+268","Ethiopia":"+251","Gabon":"+241","Gambia":"+220","Ghana":"+233","Guinea":"+224","Guinea-Bissau":"+245","Ivory Coast":"+225","Kenya":"+254","Lesotho":"+266","Liberia":"+231","Libya":"+218","Madagascar":"+261","Malawi":"+265","Mali":"+223","Mauritania":"+222","Mauritius":"+230","Morocco":"+212","Mozambique":"+258","Namibia":"+264","Niger":"+227","Nigeria":"+234","Rwanda":"+250","São Tomé & Príncipe":"+239","Senegal":"+221","Seychelles":"+248","Sierra Leone":"+232","Somalia":"+252","South Africa":"+27","South Sudan":"+211","Sudan":"+249","Tanzania":"+255","Togo":"+228","Tunisia":"+216","Uganda":"+256","Zambia":"+260","Zimbabwe":"+263",
};

function WaitlistModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", city: "", country: "", phone: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focus, setFocus] = useState("");
  const w = useW();
  const mob = w < 768;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.country.trim()) e.country = "Required";
    if (!/^\+?[\d\s\-()]{7,}$/.test(form.phone)) e.phone = "Invalid number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
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
    if (error) { setLoading(false); setErrors({ email: "Something went wrong. Try again." }); return; }
    await supabase.functions.invoke("send-waitlist-email", {
      body: { name: form.name, email: form.email, city: form.city, country: form.country },
    });
    setLoading(false);
    setSubmitted(true);
  };

  if (!open) return null;

  const inp = (key) => ({
    width: "100%", padding: "14px 16px",
    background: WHITE,
    border: `1.5px solid ${errors[key] ? "#e53e3e" : focus === key ? DARK : "rgba(27,58,42,0.18)"}`,
    borderRadius: 12, color: TEXT, fontSize: ".95rem",
    fontFamily: "'Inter', sans-serif", outline: "none",
    transition: "border-color .2s",
  });

  const Label = ({ text }) => (
    <label style={{ fontSize: ".72rem", fontWeight: 600, color: MUTED, letterSpacing: ".06em", display: "block", marginBottom: 6 }}>{text}</label>
  );

  const Err = ({ k }) => errors[k] ? <p style={{ color: "#e53e3e", fontSize: ".74rem", marginTop: 4 }}>{errors[k]}</p> : null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "rgba(10,20,12,0.7)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: mob ? 0 : 24, overflow: "auto",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      {/* Full-screen card */}
      <div style={{
        background: CREAM,
        borderRadius: mob ? "24px 24px 0 0" : 28,
        width: "100%", maxWidth: mob ? "100%" : 960,
        maxHeight: mob ? "95svh" : "90svh",
        overflowY: "auto",
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
        boxShadow: "0 48px 120px rgba(0,0,0,0.3)",
        animation: "fadeUp .4s ease",
        marginTop: mob ? "auto" : 0,
        position: "relative",
      }}>

        {/* ── Left panel — brand ─────────────────────────── */}
        {!mob && (
          <div style={{
            background: DARK, borderRadius: "28px 0 0 28px",
            padding: "48px 40px", display: "flex", flexDirection: "column",
            justifyContent: "space-between", position: "relative", overflow: "hidden",
          }}>
            {/* Decorative grid lines */}
            <div style={{
              position: "absolute", inset: 0, opacity: 0.06,
              backgroundImage: `repeating-linear-gradient(0deg, ${WHITE} 0px, ${WHITE} 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, ${WHITE} 0px, ${WHITE} 1px, transparent 1px, transparent 40px)`,
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Barcode decoration */}
              <div style={{ display: "flex", gap: 2, marginBottom: 32, opacity: 0.4 }}>
                {[3,1,4,1,5,2,3,1,2,4,1,3,2,1,4,2,3,1,4,2,1,3,4,1,2].map((h, i) => (
                  <div key={i} style={{ width: 2, height: h * 5, background: WHITE, borderRadius: 1 }} />
                ))}
              </div>

              <img src="/kaya-logo.png" alt="Kaya" style={{ height: 36, objectFit: "contain", filter: "brightness(0) invert(1)", marginBottom: 28 }} />

              <h2 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "2rem", fontWeight: 900, color: WHITE,
                lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 16,
              }}>
                Join our<br />waitlist
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: ".9rem", lineHeight: 1.75, maxWidth: 260 }}>
                Be the first to experience Kaya when we launch in Kumasi &amp; Accra. Early access includes launch-day perks and founder pricing.
              </p>
            </div>

            {/* Floating delivery card */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16, padding: "16px 20px", marginBottom: 20,
                display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>📡</div>
                <div>
                  <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>Arriving in</div>
                  <div style={{ fontSize: "1.1rem", color: WHITE, fontWeight: 900 }}>22 minutes</div>
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["🔒 Secure", "🇬🇭 Ghana-built", "⚡ 30-min delivery"].map(t => (
                  <span key={t} style={{
                    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 999, padding: "5px 12px",
                    fontSize: ".74rem", color: "rgba(255,255,255,0.55)", fontWeight: 600,
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Right panel — form ─────────────────────────── */}
        <div style={{ padding: mob ? "32px 20px 40px" : "48px 44px", position: "relative" }}>

          {/* Close */}
          <button onClick={onClose} style={{
            position: "absolute", top: 18, right: 18,
            background: "rgba(27,58,42,0.08)", border: "none", color: MUTED,
            borderRadius: "50%", width: 36, height: 36, cursor: "pointer",
            fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: 20 }}>🎉</div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "2rem", fontWeight: 900, color: DARK, marginBottom: 14, letterSpacing: "-0.5px" }}>
                You're on the list!
              </h3>
              <p style={{ color: MUTED, lineHeight: 1.8, marginBottom: 28, fontSize: ".95rem" }}>
                Thanks <strong style={{ color: TEXT }}>{form.name.split(" ")[0]}</strong>! We'll reach out to{" "}
                <strong style={{ color: TEXT }}>{form.email}</strong> when Kaya launches in <strong>{form.city}</strong>.
              </p>
              <div style={{ background: "rgba(27,58,42,0.06)", border: `1px solid rgba(27,58,42,0.12)`, borderRadius: 14, padding: "16px 20px" }}>
                <p style={{ fontSize: ".88rem", color: DARK, fontWeight: 700 }}>📱 Check your inbox for your exclusive early access invite.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile logo */}
              {mob && <img src="/kaya-logo.png" alt="Kaya" style={{ height: 30, objectFit: "contain", marginBottom: 24 }} />}

              <h3 style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: mob ? "1.8rem" : "2rem", fontWeight: 900,
                color: DARK, marginBottom: 8, letterSpacing: "-0.8px", lineHeight: 1.1,
                paddingRight: 40,
              }}>Join the waitlist</h3>
              <p style={{ color: MUTED, fontSize: ".9rem", lineHeight: 1.65, marginBottom: 32 }}>
                No strings attached. Reserve your spot and be first when we go live.
              </p>

              {/* 2-column form grid (image 2 style) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Row 1: Name + Email */}
                <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 12 }}>
                  <div>
                    <Label text="Full Name*" />
                    <input value={form.name} onChange={handle("name")} placeholder="Richmond Sarpong" style={inp("name")} onFocus={() => setFocus("name")} onBlur={() => setFocus("")} />
                    <Err k="name" />
                  </div>
                  <div>
                    <Label text="Email Address*" />
                    <input value={form.email} onChange={handle("email")} type="email" placeholder="you@example.com" style={inp("email")} onFocus={() => setFocus("email")} onBlur={() => setFocus("")} />
                    <Err k="email" />
                  </div>
                </div>

                {/* Row 2: City + Country */}
                <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 12 }}>
                  <div>
                    <Label text="City*" />
                    <input value={form.city} onChange={handle("city")} placeholder="Accra" style={inp("city")} onFocus={() => setFocus("city")} onBlur={() => setFocus("")} />
                    <Err k="city" />
                  </div>
                  <div>
                    <Label text="Country*" />
                    <select value={form.country} onChange={handle("country")} onFocus={() => setFocus("country")} onBlur={() => setFocus("")}
                      style={{ ...inp("country"), appearance: "none", WebkitAppearance: "none" }}>
                      <option value="" disabled>Select country</option>
                      {Object.keys(DIAL_CODES).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <Err k="country" />
                  </div>
                </div>

                {/* Row 3: Phone full width */}
                <div>
                  <Label text="Phone Number*" />
                  <div style={{ display: "flex", gap: 8 }}>
                    {form.country && DIAL_CODES[form.country] && (
                      <div style={{
                        display: "flex", alignItems: "center", padding: "0 14px",
                        borderRadius: 12, fontWeight: 700, fontSize: ".9rem",
                        background: WHITE, border: `1.5px solid rgba(27,58,42,0.18)`,
                        color: DARK, whiteSpace: "nowrap", flexShrink: 0,
                      }}>{DIAL_CODES[form.country]}</div>
                    )}
                    <input value={form.phone} onChange={handle("phone")} type="tel" placeholder="XX XXX XXXX" style={{ ...inp("phone"), flex: 1 }} onFocus={() => setFocus("phone")} onBlur={() => setFocus("")} />
                  </div>
                  <Err k="phone" />
                </div>

                {/* Submit — centered pill (image 2 style) */}
                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <button onClick={submit} disabled={loading} style={{
                    background: loading ? `${DARK}99` : DARK, color: WHITE,
                    border: "none", borderRadius: 999,
                    padding: "15px 56px",
                    fontWeight: 900, fontSize: "1rem",
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    cursor: loading ? "default" : "pointer",
                    display: "inline-flex", alignItems: "center", gap: 10,
                    transition: "opacity .2s",
                  }}>
                    {loading
                      ? <><div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: WHITE, borderRadius: "50%", animation: "spin .8s linear infinite" }} /> Securing your spot…</>
                      : "Join now →"}
                  </button>
                </div>

                <p style={{ textAlign: "center", fontSize: ".76rem", color: MUTED, lineHeight: 1.6 }}>
                  By submitting you agree to receive updates from Kaya.<br />No spam — you can unsubscribe at any time.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Cookie ─────────────────────────────────────────────────────────────────────
function CookieNotice() {
  const [vis, setVis] = useState(() => !localStorage.getItem("kaya_cookie_ok"));
  if (!vis) return null;
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99998,
      background: WHITE, borderTop: `1px solid rgba(27,58,42,0.1)`,
      padding: "14px 24px", display: "flex", alignItems: "center",
      justifyContent: "center", gap: 20, flexWrap: "wrap",
    }}>
      <p style={{ fontSize: ".85rem", color: MUTED, margin: 0, maxWidth: 680 }}>
        We use cookies to keep the site working. By continuing you agree to our{" "}
        <a href="/privacy-policy.html" style={{ color: DARK, textDecoration: "underline" }}>Privacy Policy</a>.
      </p>
      <button onClick={() => { localStorage.setItem("kaya_cookie_ok", "1"); setVis(false); }} style={{
        background: DARK, color: WHITE, border: "none", borderRadius: 999,
        padding: "9px 22px", fontWeight: 700, fontSize: ".85rem",
        fontFamily: "'Plus Jakarta Sans',sans-serif", cursor: "pointer",
      }}>Got it</button>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [open, setOpen] = useState(false);
  const show = () => setOpen(true);

  return (
    <>
      <style>{styles}</style>
      <Navbar onWaitlist={show} />
      <Hero onWaitlist={show} />

      <Categories onWaitlist={show} />
      <HowItWorks />
      <WhyKaya />
      <Stats />
      <Partners onWaitlist={show} />
      <WaitlistCTA onWaitlist={show} />
      <Footer onWaitlist={show} />
      <WaitlistModal open={open} onClose={() => setOpen(false)} />
      <CookieNotice />
    </>
  );
}
