import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://galtdialnwommzmxopgh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhbHRkaWFsbndvbW16bXhvcGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMDYzODIsImV4cCI6MjA4OTY4MjM4Mn0.9kukUE8DXjE7NYro5zUNUgb9Z3xuGkfJGT1F7K4VVXg"
);

const BG    = "#f0ebe2";
const DARK  = "#0d3d2e";
const G     = "#16c45e";
const TEXT  = "#111a12";
const MUTED = "#7a8c7c";
const CARD  = "#e8e2d8";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; min-height: 100vh; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: ${BG}; color: ${TEXT}; overflow-x: hidden; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${BG}; }
  ::-webkit-scrollbar-thumb { background: ${DARK}44; border-radius: 4px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
`;

function useWindowWidth() {
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

// ── Navbar ──────────────────────────────────────────────────────────────────
function Navbar({ onWaitlist }) {
  const [scrolled, setScrolled] = useState(false);
  const w = useWindowWidth();
  const isMobile = w < 768;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: isMobile ? "16px 20px" : "20px 48px",
      background: scrolled ? "rgba(240,235,226,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(10px)" : "none",
      borderBottom: scrolled ? `1px solid rgba(13,61,46,0.1)` : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <img src="https://i.ibb.co/9mmjhR0Y/Untitled-4.png" alt="Kaya" style={{ height: 36, width: "auto", objectFit: "contain" }} />

      {!isMobile && (
        <div style={{ display: "flex", gap: 36 }}>
          {["How it works", "For Riders", "For Vendors"].map(l => (
            <a key={l} href="#" style={{ fontSize: ".9rem", color: DARK, fontWeight: 500, textDecoration: "none", opacity: 0.6, transition: "opacity .2s" }}
              onMouseEnter={e => e.target.style.opacity = 1}
              onMouseLeave={e => e.target.style.opacity = 0.6}
            >{l}</a>
          ))}
        </div>
      )}

      <button onClick={onWaitlist} style={{
        background: DARK, color: BG, border: "none", borderRadius: 999,
        padding: isMobile ? "9px 18px" : "11px 26px",
        fontWeight: 600, fontSize: ".88rem",
        fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
        transition: "opacity .2s",
      }}
        onMouseEnter={e => e.target.style.opacity = 0.82}
        onMouseLeave={e => e.target.style.opacity = 1}
      >
        Join Waitlist
      </button>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onWaitlist }) {
  const w = useWindowWidth();
  const isMobile = w < 768;

  return (
    <section style={{
      minHeight: "100svh",
      display: "flex", alignItems: "center",
      padding: isMobile ? "100px 20px 70px" : "120px 48px 80px",
      background: BG, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "5%", right: isMobile ? "-30%" : "2%",
        width: 600, height: 600,
        background: "rgba(22,196,94,0.06)", borderRadius: "50%",
        filter: "blur(80px)", pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: 1200, margin: "0 auto", width: "100%",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
        gap: isMobile ? 56 : 80,
        alignItems: "center",
      }}>
        {/* Left */}
        <div style={{ animation: "fadeUp 0.8s 0.1s both" }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(3rem, 5.5vw, 5rem)",
            lineHeight: 1.05, letterSpacing: "-2px",
            color: DARK, marginBottom: 28,
          }}>
            Everything<br />
            <em>you need</em>,<br />
            delivered.
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 1.6vw, 1.1rem)",
            color: MUTED, lineHeight: 1.8, maxWidth: 400, marginBottom: 44,
          }}>
            Food, groceries, pharmacy and more — one app for your entire day. Join the waitlist and be first when we launch.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <button onClick={onWaitlist} style={{
              background: DARK, color: BG, border: "none", borderRadius: 999,
              padding: "14px 34px", fontWeight: 700, fontSize: "1rem",
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              transition: "opacity .2s",
            }}
              onMouseEnter={e => e.target.style.opacity = 0.82}
              onMouseLeave={e => e.target.style.opacity = 1}
            >
              Get early access
            </button>
            <span style={{ fontSize: ".85rem", color: MUTED }}>No spam, ever.</span>
          </div>
        </div>

        {/* Right: phone mockup */}
        {!isMobile && (
          <div style={{ display: "flex", justifyContent: "center", animation: "fadeUp 0.8s 0.3s both" }}>
            <div style={{ position: "relative" }}>
              <div style={{
                width: 270, height: 550,
                background: DARK, borderRadius: 44, padding: 10,
                boxShadow: `0 48px 96px rgba(13,61,46,0.22), 0 0 0 1px rgba(13,61,46,0.08)`,
              }}>
                <div style={{ width: "100%", height: "100%", borderRadius: 36, overflow: "hidden" }}>
                  <img
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80"
                    alt="Kaya app preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>

              {/* Floating: delivery time */}
              <div style={{
                position: "absolute", bottom: 80, left: -80,
                background: "#fff", borderRadius: 18, padding: "14px 18px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                display: "flex", alignItems: "center", gap: 12, minWidth: 185,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "rgba(22,196,94,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem",
                }}>🛵</div>
                <div>
                  <div style={{ fontSize: ".72rem", color: MUTED, fontWeight: 500 }}>Arriving in</div>
                  <div style={{ fontSize: ".95rem", color: DARK, fontWeight: 700 }}>22 minutes</div>
                </div>
              </div>

              {/* Floating: rating */}
              <div style={{
                position: "absolute", top: 70, right: -65,
                background: "#fff", borderRadius: 16, padding: "10px 16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: "1.1rem" }}>⭐</span>
                <div>
                  <div style={{ fontSize: ".9rem", fontWeight: 700, color: DARK }}>4.9</div>
                  <div style={{ fontSize: ".7rem", color: MUTED }}>Top rated</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Bento card ────────────────────────────────────────────────────────────────
function BentoCard({ img, label, title, desc, height, large, onWaitlist }) {
  const [hov, setHov] = useState(false);
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 24, overflow: "hidden",
        height, position: "relative",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(20px)",
        transition: "opacity 0.6s, transform 0.6s",
      }}>
      <img src={img} alt={title} style={{
        width: "100%", height: "100%", objectFit: "cover", display: "block",
        transition: "transform 0.5s ease",
        transform: hov ? "scale(1.04)" : "scale(1)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(13,61,46,0.88) 0%, rgba(13,61,46,0.05) 55%)",
      }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: large ? "28px 28px" : "20px 20px" }}>
        <p style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: G, marginBottom: 6 }}>{label}</p>
        <h3 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: large ? "1.5rem" : "1.05rem",
          color: "#fff", lineHeight: 1.2, marginBottom: desc ? 8 : 0,
        }}>{title}</h3>
        {desc && (
          <p style={{ fontSize: ".88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.65, maxWidth: 320 }}>{desc}</p>
        )}
        {onWaitlist && large && (
          <button onClick={onWaitlist} style={{
            marginTop: 20, background: "#fff", color: DARK,
            border: "none", borderRadius: 999, padding: "10px 24px",
            fontWeight: 700, fontSize: ".88rem",
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "opacity .2s",
          }}
            onMouseEnter={e => e.target.style.opacity = 0.82}
            onMouseLeave={e => e.target.style.opacity = 1}
          >Get early access →</button>
        )}
      </div>
    </div>
  );
}

// ── Feature Bento ─────────────────────────────────────────────────────────────
function FeatureBento({ onWaitlist }) {
  const [ref, vis] = useReveal();
  const w = useWindowWidth();
  const isMobile = w < 768;

  return (
    <section style={{ padding: isMobile ? "60px 20px" : "100px 48px", background: BG }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{
          opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)",
          transition: "opacity 0.7s, transform 0.7s",
          marginBottom: 40,
        }}>
          <p style={{ fontSize: ".78rem", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: G, marginBottom: 12 }}>One app</p>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            color: DARK, lineHeight: 1.1, letterSpacing: "-1px",
          }}>
            Everything your<br />neighbourhood has to offer
          </h2>
        </div>

        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <BentoCard img="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80" label="Food delivery" title="Hot food at your door" desc="Hundreds of local restaurants, delivered in under 30 min." height={300} large onWaitlist={onWaitlist} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <BentoCard img="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80" label="Grocery" title="Fresh produce" height={200} />
              <BentoCard img="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80" label="Pharmacy" title="Essentials" height={200} />
            </div>
            <BentoCard img="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&q=80" label="Live tracking" title="Watch it arrive in real time" desc="Live GPS. Know exactly when to open your door." height={260} large />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <BentoCard img="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80" label="Food delivery" title="Hot food at your door" desc="Hundreds of local restaurants, delivered in under 30 min." height={440} large onWaitlist={onWaitlist} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <BentoCard img="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80" label="Grocery" title="Fresh produce delivered" height={210} />
              <BentoCard img="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80" label="Pharmacy" title="Medicines & essentials" height={210} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <BentoCard img="https://images.pexels.com/photos/6994304/pexels-photo-6994304.jpeg" label="Retail" title="Shop local stores" height={290} />
            </div>
            <BentoCard img="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&q=80" label="Live tracking" title="Watch it arrive in real time" desc="Live GPS map. Know exactly when to open your door." height={290} large />
          </div>
        )}
      </div>
    </section>
  );
}

// ── How it works ──────────────────────────────────────────────────────────────
const STEPS = [
  { n: "01", title: "Enter your location", desc: "Tell us where you are. We'll show you what's available nearby." },
  { n: "02", title: "Browse & order", desc: "Pick from restaurants, grocery stores, pharmacies and more." },
  { n: "03", title: "Track in real time", desc: "Watch your order on a live map from kitchen to door." },
  { n: "04", title: "Enjoy, delivered", desc: "Fast, fresh, exactly as ordered — right at your door." },
];

function HowItWorks() {
  const [ref, vis] = useReveal();
  const w = useWindowWidth();
  const isMobile = w < 768;

  return (
    <section style={{ padding: isMobile ? "60px 20px" : "100px 48px", background: CARD }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{
          opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)",
          transition: "opacity 0.7s, transform 0.7s",
          marginBottom: 56,
        }}>
          <p style={{ fontSize: ".78rem", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: G, marginBottom: 12 }}>Simple as that</p>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            color: DARK, letterSpacing: "-1px", lineHeight: 1.1,
          }}>How Kaya works</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 28 : 40 }}>
          {STEPS.map((s, i) => (
            <div key={i} ref={ref} style={{
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(20px)",
              transition: `opacity 0.6s ${i * 0.1}s, transform 0.6s ${i * 0.1}s`,
            }}>
              <div style={{
                fontSize: ".7rem", fontWeight: 700, letterSpacing: ".1em", color: MUTED,
                paddingBottom: 18, marginBottom: 20,
                borderBottom: `1.5px solid rgba(13,61,46,0.14)`,
              }}>{s.n}</div>
              <h3 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.15rem", color: DARK, marginBottom: 10, lineHeight: 1.3,
              }}>{s.title}</h3>
              <p style={{ fontSize: ".88rem", color: MUTED, lineHeight: 1.75 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Partners ──────────────────────────────────────────────────────────────────
function Partners({ onWaitlist }) {
  const [ref, vis] = useReveal();
  const w = useWindowWidth();
  const isMobile = w < 768;

  const cards = [
    { title: "Deliver with Kaya", desc: "Set your own hours. Earn on your terms. Deliver food, groceries and more — sign up takes minutes.", cta: "Become a Rider", img: "https://i.ibb.co/sJyvFVsL/P2.png" },
    { title: "Grow your business", desc: "Reach new customers, drive more orders and scale your store. Zero commission for the first 30 days.", cta: "Partner with Kaya", img: "https://i.ibb.co/prKTjV1H/Gemini-Generated-Image-mgbgpzmgbgpzmgbg.png" },
  ];

  return (
    <section style={{ padding: isMobile ? "60px 20px" : "100px 48px", background: BG }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{
          opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)",
          transition: "opacity 0.7s, transform 0.7s", marginBottom: 48,
        }}>
          <p style={{ fontSize: ".78rem", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: G, marginBottom: 12 }}>Join Kaya</p>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            color: DARK, letterSpacing: "-1px", lineHeight: 1.1,
          }}>For riders &amp; businesses</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
          {cards.map((c, i) => (
            <div key={i} style={{
              borderRadius: 24, overflow: "hidden",
              minHeight: 420, position: "relative",
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(20px)",
              transition: `opacity 0.7s ${i * 0.15}s, transform 0.7s ${i * 0.15}s`,
            }}>
              <img src={c.img} alt={c.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,61,46,0.92) 0%, rgba(13,61,46,0.08) 60%)" }} />
              <div style={{ position: "relative", zIndex: 2, padding: "36px 32px" }}>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: "#fff", marginBottom: 10, lineHeight: 1.2 }}>{c.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: ".93rem", lineHeight: 1.65, marginBottom: 28 }}>{c.desc}</p>
                <button onClick={onWaitlist} style={{
                  background: "#fff", color: DARK, border: "none", borderRadius: 999,
                  padding: "12px 26px", fontWeight: 700, fontSize: ".88rem",
                  fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "opacity .2s",
                }}
                  onMouseEnter={e => e.target.style.opacity = 0.82}
                  onMouseLeave={e => e.target.style.opacity = 1}
                >{c.cta} →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Waitlist CTA ──────────────────────────────────────────────────────────────
function WaitlistCTA({ onWaitlist }) {
  const [ref, vis] = useReveal();
  const w = useWindowWidth();
  const isMobile = w < 768;

  return (
    <section style={{ padding: isMobile ? "80px 20px" : "120px 48px", background: DARK }}>
      <div ref={ref} style={{
        maxWidth: 680, margin: "0 auto", textAlign: "center",
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)",
        transition: "opacity 0.7s, transform 0.7s",
      }}>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
          color: "#fff", lineHeight: 1.08, letterSpacing: "-1.5px", marginBottom: 20,
        }}>
          Be the first to<br /><em style={{ color: G }}>experience Kaya</em>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 44, fontSize: "1.05rem", lineHeight: 1.8 }}>
          Join thousands already on the waitlist. Get exclusive early access and launch-day perks.
        </p>
        <button onClick={onWaitlist} style={{
          background: BG, color: DARK, border: "none", borderRadius: 999,
          padding: "16px 44px", fontWeight: 700, fontSize: "1rem",
          fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "opacity .2s",
        }}
          onMouseEnter={e => e.target.style.opacity = 0.85}
          onMouseLeave={e => e.target.style.opacity = 1}
        >
          Reserve your spot →
        </button>
        <p style={{ marginTop: 16, fontSize: ".82rem", color: "rgba(255,255,255,0.25)" }}>Free to join. No credit card needed.</p>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
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
            <img src="https://i.ibb.co/9mmjhR0Y/Untitled-4.png" alt="Kaya" style={{ height: 32, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", marginBottom: 14 }} />
            <p style={{ fontSize: ".9rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: 200, marginBottom: 28 }}>
              Everything you need, delivered.
            </p>
            <button onClick={onWaitlist} style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff", borderRadius: 999, padding: "10px 22px",
              fontWeight: 600, fontSize: ".85rem",
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              transition: "background .2s",
            }}
              onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.14)"}
              onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.08)"}
            >Join Waitlist</button>
          </div>

          {[
            { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
            { title: "Services", links: ["Food", "Grocery", "Pharmacy", "Retail"] },
            { title: "Partners", links: ["Become a Rider", "Partner with Us", "Help Center", "Contact"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>{col.title}</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map((l, j) => (
                  <li key={j}>
                    <a href="#" style={{ fontSize: ".88rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color .2s" }}
                      onMouseEnter={e => e.target.style.color = "#fff"}
                      onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
                    >{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
        }}>
          <p style={{ fontSize: ".82rem", color: "rgba(255,255,255,0.25)" }}>© 2026 Kaya Technologies. All rights reserved.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {[{ label: "Privacy", href: "/privacy-policy.html" }, { label: "Terms", href: "/terms-of-service.html" }].map((l, i) => (
              <a key={i} href={l.href} style={{ fontSize: ".82rem", color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
              >{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Waitlist Modal ────────────────────────────────────────────────────────────
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
    await fetch("/api/send-confirmation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, city: form.city, country: form.country }) });
    setLoading(false);
    setSubmitted(true);
  };

  if (!open) return null;

  const inputStyle = (key) => ({
    width: "100%", padding: "13px 16px",
    background: focus === key ? "rgba(13,61,46,0.05)" : "#f7f3ee",
    border: `1.5px solid ${errors[key] ? "#e53e3e" : focus === key ? DARK : "rgba(13,61,46,0.15)"}`,
    borderRadius: 12, color: TEXT, fontSize: ".95rem",
    fontFamily: "'DM Sans', sans-serif", outline: "none",
    transition: "border-color .2s, background .2s",
  });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "8px" : 16, background: "rgba(13,61,46,0.5)", backdropFilter: "blur(12px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff", borderRadius: 28,
        padding: isMobile ? "28px 20px" : "48px 44px",
        maxWidth: 500, width: "100%",
        boxShadow: "0 40px 100px rgba(0,0,0,0.15)",
        position: "relative", maxHeight: "92svh", overflowY: "auto",
        animation: "fadeUp .4s ease",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 18, right: 18,
          background: "rgba(13,61,46,0.07)", border: "none", color: MUTED,
          borderRadius: "50%", width: 34, height: 34, cursor: "pointer",
          fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background .2s",
        }}
          onMouseEnter={e => e.target.style.background = "rgba(13,61,46,0.12)"}
          onMouseLeave={e => e.target.style.background = "rgba(13,61,46,0.07)"}
        >✕</button>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: DARK, marginBottom: 12 }}>You're on the list!</h3>
            <p style={{ color: MUTED, lineHeight: 1.7, marginBottom: 24 }}>
              Thanks {form.name.split(" ")[0]}! We'll reach out to <strong style={{ color: DARK }}>{form.email}</strong> when Kaya launches in <strong>{form.city}</strong>.
            </p>
            <div style={{ background: "rgba(22,196,94,0.08)", border: "1px solid rgba(22,196,94,0.2)", borderRadius: 12, padding: "12px 18px" }}>
              <p style={{ fontSize: ".85rem", color: DARK, fontWeight: 600 }}>📱 Watch your inbox for your exclusive early access invite.</p>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: G, marginBottom: 8 }}>Early access</p>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.7rem", color: DARK, marginBottom: 8 }}>Join the Kaya waitlist</h3>
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
                      background: "rgba(22,196,94,0.1)", border: `1.5px solid rgba(22,196,94,0.3)`,
                      color: DARK, whiteSpace: "nowrap", flexShrink: 0,
                    }}>{DIAL_CODES[form.country]}</div>
                  )}
                  <input value={form.phone} onChange={handle("phone")} type="tel" placeholder="" style={{ ...inputStyle("phone"), flex: 1 }} onFocus={() => setFocus("phone")} onBlur={() => setFocus("")} />
                </div>
                {errors.phone && <p style={{ color: "#e53e3e", fontSize: ".78rem", marginTop: 4 }}>{errors.phone}</p>}
              </div>

              <div>
                <label style={{ fontSize: ".75rem", fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Email</label>
                <input value={form.email} onChange={handle("email")} type="email" placeholder="you@example.com" style={inputStyle("email")} onFocus={() => setFocus("email")} onBlur={() => setFocus("")} />
                {errors.email && <p style={{ color: "#e53e3e", fontSize: ".78rem", marginTop: 4 }}>{errors.email}</p>}
              </div>

              <button onClick={submit} disabled={loading} style={{
                marginTop: 4, background: loading ? `${DARK}aa` : DARK, color: "#fff",
                border: "none", borderRadius: 14, padding: "15px", fontWeight: 700, fontSize: ".95rem",
                fontFamily: "'DM Serif Display', serif", cursor: loading ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "opacity .2s",
              }}>
                {loading ? (
                  <><div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> Securing your spot…</>
                ) : "Get Early Access"}
              </button>

              <p style={{ textAlign: "center", fontSize: ".78rem", color: MUTED }}>No spam, ever. Only your Kaya invite.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Cookie notice ─────────────────────────────────────────────────────────────
function CookieNotice() {
  const [visible, setVisible] = useState(() => !localStorage.getItem("kaya_cookie_ok"));
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99998,
      background: "#fff", borderTop: `1px solid rgba(13,61,46,0.1)`,
      padding: "14px 24px", display: "flex", alignItems: "center",
      justifyContent: "center", gap: 20, flexWrap: "wrap",
    }}>
      <p style={{ fontSize: ".85rem", color: MUTED, margin: 0, maxWidth: 680 }}>
        We use cookies to keep the site working and analyse usage. By continuing, you agree to our{" "}
        <a href="/privacy-policy.html" style={{ color: DARK, textDecoration: "underline" }}>Privacy Policy</a>.
      </p>
      <button onClick={() => { localStorage.setItem("kaya_cookie_ok", "1"); setVisible(false); }} style={{
        background: DARK, color: "#fff", border: "none", borderRadius: 999,
        padding: "9px 22px", fontWeight: 600, fontSize: ".85rem",
        fontFamily: "'DM Sans', sans-serif", cursor: "pointer", whiteSpace: "nowrap",
      }}>Got it</button>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openWaitlist = () => setModalOpen(true);

  return (
    <>
      <style>{styles}</style>
      <Navbar onWaitlist={openWaitlist} />
      <Hero onWaitlist={openWaitlist} />
      <FeatureBento onWaitlist={openWaitlist} />
      <HowItWorks />
      <Partners onWaitlist={openWaitlist} />
      <WaitlistCTA onWaitlist={openWaitlist} />
      <Footer onWaitlist={openWaitlist} />
      <WaitlistModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <CookieNotice />
    </>
  );
}
