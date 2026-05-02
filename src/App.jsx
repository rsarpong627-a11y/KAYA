import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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
const MUTED = "#2E2E2E";
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
            Everything. Not just food.<br />
            Groceries. Pharmacy. Retail.<br />
            One tap — it's at your door.
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
              <div style={{ marginBottom: 32 }}>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "2.8rem", fontWeight: 900,
                  color: GOLD, lineHeight: 1,
                }}>{s.n}</span>
              </div>
              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: ".98rem", fontWeight: 800,
                color: WHITE, marginBottom: 10, lineHeight: 1.3,
              }}>{s.title}</h3>
              <p style={{ fontSize: ".84rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>{s.desc}</p>
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
              <BentoCard icon="📡" title="Live GPS tracking." desc="From pickup to your door." light />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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

// Maps emoji character to Twemoji SVG codepoint string
function twemojiCode(e) {
  const cp = [...e].map(c => c.codePointAt(0).toString(16)).filter(c => c !== 'fe0f').join('-');
  return cp;
}

function TwemojiImg({ emoji, size = 28 }) {
  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${twemojiCode(emoji)}.svg`}
      width={size} height={size} alt="" style={{ display: "block" }}
    />
  );
}

function BentoCard({ icon, emoji, stat, title, desc, light, dark: isDark, small }) {
  const glyph = emoji || icon;
  return (
    <div style={{
      background: isDark ? DARK : light ? WHITE : CREAM,
      borderRadius: 20, padding: small ? "20px" : "28px 24px",
      border: isDark ? "none" : `1px solid rgba(27,58,42,0.1)`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        {glyph && <TwemojiImg emoji={glyph} size={small ? 24 : 28} />}
        {stat && <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: "1.6rem", color: TEXT }}>{stat}</span>}
      </div>
      <h3 style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: small ? ".88rem" : "1rem", fontWeight: 800,
        color: isDark ? WHITE : TEXT, marginBottom: 6, lineHeight: 1.3,
      }}>{title}</h3>
      <p style={{ fontSize: small ? ".78rem" : ".85rem", color: isDark ? "rgba(255,255,255,0.75)" : "#2E2E2E", lineHeight: 1.65 }}>{desc}</p>
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
  ];

  return (
    <section style={{ background: CREAM, padding: mob ? "0 20px 48px" : "0 48px 80px" }}>
      <div ref={ref} style={{
        maxWidth: 1280, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: mob ? "1fr 1fr 1fr" : "repeat(3,1fr)",
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

        <button onClick={onWaitlist} style={{
          background: DARK, color: WHITE, border: "none", borderRadius: 999,
          padding: "16px 48px", fontWeight: 800, fontSize: "1rem",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}>Reserve your spot →</button>

        <p style={{ marginTop: 16, fontSize: ".78rem", color: "rgba(255,255,255,0.4)" }}>Free to join · No credit card needed</p>
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
          <p style={{ fontSize: ".82rem", color: "rgba(255,255,255,0.2)" }}>hello@kayafast.com</p>
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
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const w = useW();
  const mob = w < 768;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.city.trim()) e.city = true;
    if (!form.country.trim()) e.country = true;
    if (!/^\+?[\d\s\-()]{7,}$/.test(form.phone)) e.phone = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = true;
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
    if (error) { setLoading(false); setErrors({ email: true }); return; }
    await supabase.functions.invoke("send-waitlist-email", {
      body: { name: form.name, email: form.email, city: form.city, country: form.country },
    });
    setLoading(false);
    setAnimating(true);
  };

  if (!open) return null;

  // Field box — label inside the box at top, input below (exactly like reference)
  const Field = ({ label, children, error, span }) => (
    <div style={{ gridColumn: span ? "1 / -1" : "auto" }}>
      <div style={{
        border: `1.5px solid ${error ? "#e53e3e" : "rgba(27,58,42,0.15)"}`,
        borderRadius: 14, padding: "10px 16px 12px",
        background: WHITE, cursor: "text",
      }}>
        <div style={{ fontSize: ".72rem", color: error ? "#e53e3e" : "#888", fontWeight: 500, marginBottom: 3 }}>{label}{error ? " *" : ""}</div>
        {children}
      </div>
    </div>
  );

  const inputStyle = {
    width: "100%", border: "none", outline: "none",
    fontSize: ".95rem", color: TEXT,
    padding: "4px 0 2px", lineHeight: "1.5",
    background: "transparent", fontFamily: "'Inter', sans-serif",
    display: "block", minHeight: 28,
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "rgba(10,20,12,0.55)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: mob ? "flex-end" : "center",
      justifyContent: "center", padding: mob ? 0 : 24, overflowY: "auto",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div style={{
        background: WHITE,
        borderRadius: mob ? "20px 20px 0 0" : 20,
        width: "100%", maxWidth: 680,
        maxHeight: mob ? "96svh" : "92svh",
        overflowY: "auto", position: "relative",
        padding: mob ? "32px 20px 40px" : "56px 56px 48px",
        boxShadow: "0 32px 100px rgba(0,0,0,0.2)",
        animation: "fadeUp .35s ease",
      }}>

        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: 18, right: 18,
          background: "#f0f0f0", border: "none", color: "#888",
          borderRadius: "50%", width: 34, height: 34, cursor: "pointer",
          fontSize: ".9rem", display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>

        {animating ? (
          <div style={{ textAlign: "center", padding: "32px 0", minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DotLottieReact
              src="/Untitled file (1).lottie"
              autoplay
              loop={false}
              style={{ width: 280, height: 280 }}
              onComplete={() => { setAnimating(false); setSubmitted(true); }}
            />
          </div>
        ) : submitted ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: 20 }}>🎉</div>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "2rem", fontWeight: 900, color: DARK, marginBottom: 14 }}>
              You're on the list!
            </h3>
            <p style={{ color: MUTED, lineHeight: 1.8, marginBottom: 24 }}>
              Thanks <strong style={{ color: TEXT }}>{form.name.split(" ")[0]}</strong>! We'll reach out to{" "}
              <strong style={{ color: TEXT }}>{form.email}</strong> when Kaya launches in <strong>{form.city}</strong>.
            </p>
            <div style={{ background: "rgba(27,58,42,0.06)", border: "1px solid rgba(27,58,42,0.12)", borderRadius: 12, padding: "14px 18px" }}>
              <p style={{ fontSize: ".88rem", color: DARK, fontWeight: 600 }}>📱 Check your inbox for your exclusive early access invite.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header — centered like reference */}
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: mob ? "1.9rem" : "2.4rem",
                fontWeight: 900, color: TEXT,
                letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 12,
              }}>Join the waitlist</h3>
              <p style={{ color: MUTED, fontSize: mob ? ".88rem" : ".95rem", lineHeight: 1.7, maxWidth: 440, margin: "0 auto" }}>
                No strings attached. Simply reserve your spot and be first when Kaya launches in your city.
              </p>
            </div>

            {/* 2-column grid form — labels inside boxes */}
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 10 }}>

              <Field label="Full Name*" error={errors.name}>
                <input value={form.name} onChange={handle("name")} placeholder="Joyce Amoah" style={inputStyle} />
              </Field>

              <Field label="Email Address*" error={errors.email}>
                <input value={form.email} onChange={handle("email")} type="email" placeholder="you@example.com" style={inputStyle} />
              </Field>

              <Field label="City*" error={errors.city}>
                <input value={form.city} onChange={handle("city")} placeholder="Accra" style={inputStyle} />
              </Field>

              <Field label="Country*" error={errors.country}>
                <select value={form.country} onChange={handle("country")}
                  style={{ ...inputStyle, appearance: "none", WebkitAppearance: "none" }}>
                  <option value="" disabled>Select country</option>
                  {Object.keys(DIAL_CODES).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Phone Number*" error={errors.phone} span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {form.country && DIAL_CODES[form.country] && (
                    <span style={{ fontSize: ".9rem", fontWeight: 700, color: DARK, flexShrink: 0 }}>{DIAL_CODES[form.country]}</span>
                  )}
                  <input value={form.phone} onChange={handle("phone")} type="tel" placeholder="XX XXX XXXX" style={inputStyle} />
                </div>
              </Field>

            </div>

            {/* Submit — centered pill */}
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <button onClick={submit} disabled={loading} style={{
                background: loading ? "#ccc" : DARK, color: WHITE,
                border: "none", borderRadius: 999, padding: "15px 64px",
                fontWeight: 800, fontSize: "1rem",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                cursor: loading ? "default" : "pointer",
                display: "inline-flex", alignItems: "center", gap: 10,
              }}>
                {loading
                  ? <><div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: WHITE, borderRadius: "50%", animation: "spin .8s linear infinite" }} /> Securing spot…</>
                  : "Join now"}
              </button>
            </div>

            <p style={{ textAlign: "center", fontSize: ".76rem", color: MUTED, lineHeight: 1.65, marginTop: 16 }}>
              By submitting you agree to receive updates from Kaya. You may unsubscribe at any time.
            </p>
          </>
        )}
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

      <Partners onWaitlist={show} />
      <WaitlistCTA onWaitlist={show} />
      <Footer onWaitlist={show} />
      <WaitlistModal open={open} onClose={() => setOpen(false)} />
      <CookieNotice />
    </>
  );
}
