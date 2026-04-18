import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://galtdialnwommzmxopgh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhbHRkaWFsbndvbW16bXhvcGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMDYzODIsImV4cCI6MjA4OTY4MjM4Mn0.9kukUE8DXjE7NYro5zUNUgb9Z3xuGkfJGT1F7K4VVXg"
);

const G = "#16c45e";
const DARK = "#0b0f1a";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Instrument Sans', sans-serif; background: #0b0f1a; color: #fff; overflow-x: hidden; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0b0f1a; }
  ::-webkit-scrollbar-thumb { background: #16c45e44; border-radius: 4px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-12px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.35; }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 24px #16c45e44, 0 0 60px #16c45e22; }
    50%       { box-shadow: 0 0 40px #16c45e88, 0 0 80px #16c45e44; }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @media (max-width: 640px) {
    .kaya-feature-row { gap: 32px !important; }
  }
`;

function useReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function useWindowWidth() {
  const [width, setWidth] = useState(() => typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return width;
}

function RevealBox({ children, delay = 0, style = {}, className = "" }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(36px)",
      transition: `opacity .75s ${delay}s ease, transform .75s ${delay}s ease`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      background: "rgba(22,196,94,.1)", border: "1px solid rgba(22,196,94,.3)",
      color: G, fontSize: ".72rem", fontWeight: 700,
      letterSpacing: ".1em", textTransform: "uppercase",
      padding: "6px 16px", borderRadius: 999, marginBottom: 18,
    }}>
      <span style={{ width: 7, height: 7, background: G, borderRadius: "50%", animation: "pulse 2s infinite" }} />
      {children}
    </span>
  );
}

function Label({ children }) {
  return (
    <span style={{
      fontSize: ".7rem", fontWeight: 700, letterSpacing: ".14em",
      textTransform: "uppercase", color: G, display: "block", marginBottom: 12,
    }}>
      {children}
    </span>
  );
}

function GhostBtn({ children, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#13b354" : G,
        color: "#fff", border: "none", borderRadius: 999,
        padding: "13px 28px", fontWeight: 700, fontSize: ".9rem",
        fontFamily: "'Instrument Sans', sans-serif", cursor: "pointer",
        transition: "background .2s, transform .15s, box-shadow .2s",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 6px 28px rgba(22,196,94,.45)" : "0 2px 12px rgba(22,196,94,.25)",
      }}>
      {children}
    </button>
  );
}

function Navbar({ onWaitlist }) {
  const [scrolled, setScrolled] = useState(false);
  const w = useWindowWidth();
  const isMobile = w < 640;
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      padding: isMobile ? "12px 16px" : "14px 28px",
      background: scrolled ? "rgba(11,15,26,0.94)" : "rgba(11,15,26,0.5)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,.06)" : "1px solid transparent",
      transition: "background .35s, border-color .35s, box-shadow .35s",
      boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,.35)" : "none",
    }}>
      {!isMobile && <div style={{ flex: "0 0 auto", width: 120 }} />}

      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "1.3rem" : "1.55rem", fontWeight: 800, letterSpacing: "-1px" }}>
        Kay<span style={{ color: G }}>a</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, flex: "0 0 auto", width: isMobile ? "auto" : 120, justifyContent: "flex-end" }}>
        {!isMobile && (
          <button style={{ background: "none", border: "none", color: "rgba(255,255,255,.8)", fontWeight: 600, fontSize: ".88rem", cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif" }}>
            Login
          </button>
        )}
        <button onClick={onWaitlist} style={{
          background: G, color: "#fff", border: "none", borderRadius: 999,
          padding: isMobile ? "8px 14px" : "10px 22px",
          fontWeight: 700, fontSize: isMobile ? ".8rem" : ".88rem",
          fontFamily: "'Instrument Sans', sans-serif", cursor: "pointer",
          transition: "background .2s", whiteSpace: "nowrap",
        }}
          onMouseEnter={e => e.target.style.background = "#13b354"}
          onMouseLeave={e => e.target.style.background = G}
        >
          Join Waitlist
        </button>
      </div>
    </nav>
  );
}

function Hero({ onWaitlist }) {
  return (
    <section style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "120px 24px 80px", textAlign: "center" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg')",
        backgroundSize: "cover", backgroundPosition: "center",
        transform: "scale(1.06)", animation: "float 18s ease-in-out infinite",
      }}/>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(11,15,26,.88) 0%,rgba(11,15,26,.65) 55%,rgba(11,15,26,.85) 100%)" }}/>

      <div style={{ position: "absolute", top: "20%", left: "10%", width: 340, height: 340, background: G, borderRadius: "50%", filter: "blur(120px)", opacity: .1, pointerEvents: "none" }}/>
      <div style={{ position: "absolute", bottom: "15%", right: "8%", width: 260, height: 260, background: "#6ee7b7", borderRadius: "50%", filter: "blur(100px)", opacity: .07, pointerEvents: "none" }}/>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 720 }}>
        <div style={{ animation: "fadeUp .9s .1s both" }}>
          <Badge>Coming soon — join the waitlist</Badge>
        </div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(2.8rem, 7.5vw, 5.4rem)",
          fontWeight: 800, lineHeight: 1.06, letterSpacing: "-2.5px",
          color: "#fff", marginBottom: 22,
          animation: "fadeUp .9s .2s both",
        }}>
          Everything you need,<br/>
          <span style={{ color: G }}>delivered.</span>
        </h1>
        <p style={{
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
          color: "rgba(255,255,255,.65)", lineHeight: 1.7,
          maxWidth: 520, margin: "0 auto 44px",
          animation: "fadeUp .9s .35s both",
        }}>
          Food, groceries, pharmacy, and more — one app for your entire day. Kaya is launching soon and we'd love to have you first.
        </p>
        <div style={{ animation: "fadeUp .9s .5s both" }}>
          <GhostBtn onClick={onWaitlist}>Get Early Access →</GhostBtn>
          <p style={{ marginTop: 18, fontSize: ".8rem", color: "rgba(255,255,255,.35)", fontWeight: 500 }}>
            No spam. Just your invite when we launch.
          </p>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Food Delivery", "Groceries", "Pharmacy", "Convenience Stores", "Retail", "Real-Time Tracking", "Live Support", "Scheduled Delivery"];
  const duped = [...items, ...items];
  return (
    <div style={{ background: G, padding: "14px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
      <div style={{ display: "inline-flex", gap: 40, animation: "marquee 24s linear infinite" }}>
        {duped.map((t, i) => (
          <span key={i} style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#0b0f1a", display: "inline-flex", alignItems: "center", gap: 14 }}>
            {t} <span style={{ opacity: .5 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function FeatureRow({ label, title, desc, imgUrl, imgAlt, reverse = false, onWaitlist }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: 56, alignItems: "center",
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : "translateY(40px)",
      transition: "opacity .8s ease, transform .8s ease",
    }}>
      <div style={{ order: reverse ? 2 : 1 }}>
        <div style={{
          borderRadius: 28, overflow: "hidden", aspectRatio: "4/3",
          border: "1px solid rgba(255,255,255,.07)",
          boxShadow: "0 24px 64px rgba(0,0,0,.5)",
          position: "relative",
        }}>
          <img src={imgUrl} alt={imgAlt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .6s ease" }}
            onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}
          />
          <div style={{ position: "absolute", top: 0, left: 0, width: 80, height: 4, background: G, borderRadius: "0 0 4px 0" }}/>
        </div>
      </div>
      <div style={{ order: reverse ? 1 : 2 }}>
        <Label>{label}</Label>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1px", color: "#fff", marginBottom: 16 }}>
          {title}
        </h2>
        <p style={{ fontSize: ".98rem", color: "rgba(255,255,255,.55)", lineHeight: 1.75, marginBottom: 32, maxWidth: 440 }}>
          {desc}
        </p>
        <button onClick={onWaitlist} style={{
          background: "transparent", color: G, border: `1.5px solid ${G}`,
          borderRadius: 999, padding: "11px 26px", fontWeight: 700, fontSize: ".88rem",
          fontFamily: "'Instrument Sans', sans-serif", cursor: "pointer",
          transition: "background .2s, color .2s",
        }}
          onMouseEnter={e => { e.target.style.background = G; e.target.style.color = "#0b0f1a"; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = G; }}
        >
          Join the Waitlist
        </button>
      </div>
    </div>
  );
}

function FullBgSection({ imgUrl, title, sub, onWaitlist }) {
  const [ref, vis] = useReveal();
  return (
    <div style={{ position: "relative", minHeight: 520, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url('${imgUrl}')`,
        backgroundSize: "cover", backgroundPosition: "center",
      }}/>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(11,15,26,.88) 0%,rgba(11,15,26,.6) 100%)" }}/>
      <div ref={ref} style={{
        position: "relative", zIndex: 2, textAlign: "center", padding: "100px 24px",
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(32px)",
        transition: "opacity .8s, transform .8s", maxWidth: 640, margin: "0 auto",
      }}>
        <Label>{sub}</Label>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 4.5vw, 3rem)", fontWeight: 800, letterSpacing: "-1.5px", color: "#fff", marginBottom: 16, lineHeight: 1.1 }}>
          {title}
        </h2>
        <p style={{ color: "rgba(255,255,255,.6)", marginBottom: 36, fontSize: "1.02rem", lineHeight: 1.7 }}>
          From fresh produce to everyday essentials — shop from hundreds of local stores, curated for you.
        </p>
        <GhostBtn onClick={onWaitlist}>Join the Waitlist →</GhostBtn>
      </div>
    </div>
  );
}

const CATS = [
  { name: "Food", img: "https://i.ibb.co/QFnSQSS8/Screenshot-2026-03-21-at-10-58-28.png" },
  { name: "Groceries", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80" },
  { name: "Pharmacy", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80" },
  { name: "Retail", img: "https://images.pexels.com/photos/6994304/pexels-photo-6994304.jpeg" },
  { name: "Rides", soon: true, img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80" },
];

function CatCard({ cat, delay }) {
  const [ref, vis] = useReveal();
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 20, overflow: "hidden", aspectRatio: "3/4",
        position: "relative", cursor: "default",
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(32px)",
        transition: `opacity .7s ${delay}s, transform .7s ${delay}s`,
        border: "1px solid rgba(255,255,255,.06)",
      }}>
      <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .6s", transform: hov ? "scale(1.08)" : "scale(1)" }}/>
      <div style={{ position: "absolute", inset: 0, background: hov ? "linear-gradient(to top,rgba(0,0,0,.85) 0%,rgba(0,0,0,.1) 55%)" : "linear-gradient(to top,rgba(0,0,0,.72) 0%,rgba(0,0,0,0) 50%)", transition: "background .3s" }}/>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 14px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: ".9rem", fontWeight: 700, color: "#fff" }}>{cat.name}</div>
        {cat.soon && (
          <div style={{ display: "inline-block", marginTop: 6, background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.2)", color: "#fff", fontSize: ".62rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 999 }}>
            Coming soon
          </div>
        )}
      </div>
    </div>
  );
}

const STEPS = [
  { n: "01", icon: "📍", title: "Enter your address", desc: "Tell us where you are and we'll show you what's available nearby — restaurants, stores, and more." },
  { n: "02", icon: "🛒", title: "Browse & order", desc: "Scroll menus, add items to your cart and customise everything exactly how you like it." },
  { n: "03", icon: "📍", title: "Track in real time", desc: "Watch your order move on a live map and chat with your driver directly through the app." },
  { n: "04", icon: "✅", title: "Enjoy, delivered", desc: "Your food, groceries or essentials arrive at your door — fast, fresh, and exactly as ordered." },
];

function Steps() {
  return (
    <section style={{ padding: "100px 24px", background: "#0d1220" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <RevealBox style={{ textAlign: "center", marginBottom: 60 }}>
          <Label>Simple as that</Label>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1px", color: "#fff" }}>
            How Kaya works
          </h2>
        </RevealBox>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
          {STEPS.map((s, i) => (
            <RevealBox key={i} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 24, padding: "36px 28px", height: "100%", transition: "border-color .3s, background .3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${G}55`; e.currentTarget.style.background = "rgba(22,196,94,.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; e.currentTarget.style.background = "rgba(255,255,255,.04)"; }}
              >
                <div style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: ".14em", color: G, marginBottom: 18 }}>{s.n}</div>
                <div style={{ fontSize: "2rem", marginBottom: 16 }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: ".9rem", color: "rgba(255,255,255,.5)", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </RevealBox>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerCards({ onWaitlist }) {
  const cards = [
    { title: "Deliver with Kaya", desc: "Set your own hours. Earn on your terms. Deliver food, groceries and more in your city — sign up takes minutes.", cta: "Become a Driver", img: "https://i.ibb.co/sJyvFVsL/P2.png" },
    { title: "Grow with Kaya", desc: "Reach new customers, drive more orders and scale your business. Zero commission for the first 30 days.", cta: "Partner with Us", img: "https://i.ibb.co/prKTjV1H/Gemini-Generated-Image-mgbgpzmgbgpzmgbg.png" },
  ];
  return (
    <section style={{ padding: "100px 24px", background: DARK }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <RevealBox style={{ textAlign: "center", marginBottom: 56 }}>
          <Label>Unlocking opportunity</Label>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1px", color: "#fff" }}>
            For drivers &amp; businesses
          </h2>
        </RevealBox>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {cards.map((c, i) => (
            <RevealBox key={i} delay={i * 0.15}>
              <div style={{ borderRadius: 24, overflow: "hidden", position: "relative", minHeight: 420, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <img src={c.img} alt={c.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}/>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(11,15,26,.95) 0%,rgba(11,15,26,.15) 65%)" }}/>
                <div style={{ position: "relative", zIndex: 2, padding: "36px 32px" }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff", marginBottom: 10 }}>{c.title}</h3>
                  <p style={{ color: "rgba(255,255,255,.65)", fontSize: ".93rem", lineHeight: 1.65, marginBottom: 28 }}>{c.desc}</p>
                  <button onClick={onWaitlist} style={{
                    background: G, color: "#0b0f1a", border: "none", borderRadius: 999,
                    padding: "12px 26px", fontWeight: 700, fontSize: ".88rem",
                    fontFamily: "'Instrument Sans', sans-serif", cursor: "pointer", transition: "background .2s",
                  }}
                    onMouseEnter={e => e.target.style.background = "#13b354"}
                    onMouseLeave={e => e.target.style.background = G}
                  >
                    {c.cta} →
                  </button>
                </div>
              </div>
            </RevealBox>
          ))}
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { num: "1M+", label: "Users targeted at launch", sub: "across Africa" },
  { num: "50K+", label: "Daily deliveries capacity", sub: "at full network scale" },
  { num: "100+", label: "Cities in our roadmap", sub: "over the next 18 months" },
];

function Stats() {
  return (
    <section style={{ padding: "80px 24px", background: "#0d1220", borderTop: "1px solid rgba(255,255,255,.05)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 2, background: "rgba(255,255,255,.05)", borderRadius: 24, overflow: "hidden" }}>
        {STATS.map((s, i) => (
          <RevealBox key={i} delay={i * 0.12}>
            <div style={{ background: "#0d1220", padding: "52px 40px", textAlign: "center", transition: "background .3s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#111827"}
              onMouseLeave={e => e.currentTarget.style.background = "#0d1220"}
            >
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.4rem, 5vw, 3.4rem)", fontWeight: 800, letterSpacing: "-2px", color: "#fff", lineHeight: 1, marginBottom: 8 }}>
                {s.num.replace("+", "")}<span style={{ color: G }}>+</span>
              </div>
              <div style={{ fontSize: ".95rem", color: "rgba(255,255,255,.8)", fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: ".8rem", color: "rgba(255,255,255,.35)" }}>{s.sub}</div>
            </div>
          </RevealBox>
        ))}
      </div>
    </section>
  );
}

const DIAL_CODES = {
  "Algeria": "+213", "Angola": "+244", "Benin": "+229", "Botswana": "+267",
  "Burkina Faso": "+226", "Burundi": "+257", "Cabo Verde": "+238",
  "Cameroon": "+237", "Central African Republic": "+236", "Chad": "+235",
  "Comoros": "+269", "Congo (Brazzaville)": "+242", "Congo (DRC)": "+243",
  "Djibouti": "+253", "Egypt": "+20", "Equatorial Guinea": "+240",
  "Eritrea": "+291", "Eswatini": "+268", "Ethiopia": "+251", "Gabon": "+241",
  "Gambia": "+220", "Ghana": "+233", "Guinea": "+224", "Guinea-Bissau": "+245",
  "Ivory Coast": "+225", "Kenya": "+254", "Lesotho": "+266", "Liberia": "+231",
  "Libya": "+218", "Madagascar": "+261", "Malawi": "+265", "Mali": "+223",
  "Mauritania": "+222", "Mauritius": "+230", "Morocco": "+212",
  "Mozambique": "+258", "Namibia": "+264", "Niger": "+227", "Nigeria": "+234",
  "Rwanda": "+250", "São Tomé & Príncipe": "+239", "Senegal": "+221",
  "Seychelles": "+248", "Sierra Leone": "+232", "Somalia": "+252",
  "South Africa": "+27", "South Sudan": "+211", "Sudan": "+249",
  "Tanzania": "+255", "Togo": "+228", "Tunisia": "+216", "Uganda": "+256",
  "Zambia": "+260", "Zimbabwe": "+263",
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
    if (!form.country.trim()) e.country = "Please enter your country";
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
    const { error } = await supabase.from("waitlist").insert([{
      name: form.name,
      email: form.email,
      phone: form.phone,
      city: form.city,
      country: form.country,
    }]);
    if (error) {
      setLoading(false);
      setErrors({ email: "Something went wrong. Please try again." });
      return;
    }
    await fetch("/api/send-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, city: form.city, country: form.country }),
    });
    setLoading(false);
    setSubmitted(true);
  };

  if (!open) return null;

  const inputStyle = (key) => ({
    width: "100%", padding: "14px 18px",
    background: focus === key ? "rgba(22,196,94,.08)" : "rgba(255,255,255,.05)",
    border: `1.5px solid ${errors[key] ? "#f87171" : focus === key ? G : "rgba(255,255,255,.1)"}`,
    borderRadius: 14, color: "#fff", fontSize: ".95rem",
    fontFamily: "'Instrument Sans', sans-serif", outline: "none",
    transition: "border-color .2s, background .2s",
  });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "8px" : 16, background: "rgba(0,0,0,.75)", backdropFilter: "blur(12px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#0f1626", border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 28, padding: isMobile ? "28px 18px" : "48px 40px", maxWidth: 520, width: "100%",
        boxShadow: "0 40px 100px rgba(0,0,0,.7)",
        animation: "fadeUp .45s ease",
        position: "relative",
        maxHeight: "90svh", overflowY: "auto",
      }}>
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,.07)", border: "none", color: "rgba(255,255,255,.5)", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.14)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.07)"}
        >✕</button>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: 20 }}>🎉</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginBottom: 12, letterSpacing: "-.5px" }}>
              You're on the list!
            </h3>
            <p style={{ color: "rgba(255,255,255,.55)", lineHeight: 1.7, marginBottom: 28 }}>
              Thanks {form.name.split(" ")[0]}! We'll reach out to <strong style={{ color: G }}>{form.email}</strong> when Kaya launches in <strong style={{ color: "#fff" }}>{form.city}</strong>.
            </p>
            <div style={{ background: `rgba(22,196,94,.1)`, border: `1px solid rgba(22,196,94,.25)`, borderRadius: 14, padding: "14px 20px" }}>
              <p style={{ fontSize: ".85rem", color: G, fontWeight: 600 }}>📱 Watch your inbox for your exclusive early access invite.</p>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 32 }}>
              <Badge>Early access</Badge>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.7rem", fontWeight: 800, color: "#fff", letterSpacing: "-.5px", marginBottom: 8 }}>
                Join the Kaya waitlist
              </h3>
              <p style={{ color: "rgba(255,255,255,.5)", fontSize: ".92rem", lineHeight: 1.65 }}>
                Be among the first to experience delivery reimagined. We'll let you know the moment Kaya launches in your city.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: ".78rem", fontWeight: 600, letterSpacing: ".06em", color: "rgba(255,255,255,.5)", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Full Name</label>
                <input value={form.name} onChange={handle("name")} placeholder="Richmond Sarpong" style={inputStyle("name")}
                  onFocus={() => setFocus("name")} onBlur={() => setFocus("")}/>
                {errors.name && <p style={{ color: "#f87171", fontSize: ".78rem", marginTop: 4 }}>{errors.name}</p>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: ".78rem", fontWeight: 600, letterSpacing: ".06em", color: "rgba(255,255,255,.5)", textTransform: "uppercase", display: "block", marginBottom: 7 }}>City</label>
                  <input value={form.city} onChange={handle("city")} placeholder="Accra" style={inputStyle("city")}
                    onFocus={() => setFocus("city")} onBlur={() => setFocus("")}/>
                  {errors.city && <p style={{ color: "#f87171", fontSize: ".78rem", marginTop: 4 }}>{errors.city}</p>}
                </div>
                <div>
                  <label style={{ fontSize: ".78rem", fontWeight: 600, letterSpacing: ".06em", color: "rgba(255,255,255,.5)", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Country</label>
                  <select value={form.country} onChange={handle("country")}
                    onFocus={() => setFocus("country")} onBlur={() => setFocus("")}
                    style={{ ...inputStyle("country"), appearance: "none", WebkitAppearance: "none" }}>
                    <option value="" disabled>Select country</option>
                    {["Algeria","Angola","Benin","Botswana","Burkina Faso","Burundi","Cabo Verde","Cameroon","Central African Republic","Chad","Comoros","Congo (Brazzaville)","Congo (DRC)","Djibouti","Egypt","Equatorial Guinea","Eritrea","Eswatini","Ethiopia","Gabon","Gambia","Ghana","Guinea","Guinea-Bissau","Ivory Coast","Kenya","Lesotho","Liberia","Libya","Madagascar","Malawi","Mali","Mauritania","Mauritius","Morocco","Mozambique","Namibia","Niger","Nigeria","Rwanda","São Tomé & Príncipe","Senegal","Seychelles","Sierra Leone","Somalia","South Africa","South Sudan","Sudan","Tanzania","Togo","Tunisia","Uganda","Zambia","Zimbabwe"].map(c => (
                      <option key={c} value={c} style={{ background: "#0f1626", color: "#fff" }}>{c}</option>
                    ))}
                  </select>
                  {errors.country && <p style={{ color: "#f87171", fontSize: ".78rem", marginTop: 4 }}>{errors.country}</p>}
                </div>
              </div>

              <div>
                <label style={{ fontSize: ".78rem", fontWeight: 600, letterSpacing: ".06em", color: "rgba(255,255,255,.5)", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Phone Number</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {form.country && DIAL_CODES[form.country] && (
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "0 14px", borderRadius: 14, fontWeight: 700, fontSize: ".95rem",
                      background: "rgba(22,196,94,.12)", border: `1.5px solid ${G}`,
                      color: G, whiteSpace: "nowrap", flexShrink: 0,
                    }}>
                      {DIAL_CODES[form.country]}
                    </div>
                  )}
                  <input value={form.phone} onChange={handle("phone")} placeholder="" type="tel"
                    style={{ ...inputStyle("phone"), flex: 1 }}
                    onFocus={() => setFocus("phone")} onBlur={() => setFocus("")}/>
                </div>
                {errors.phone && <p style={{ color: "#f87171", fontSize: ".78rem", marginTop: 4 }}>{errors.phone}</p>}
              </div>

              <div>
                <label style={{ fontSize: ".78rem", fontWeight: 600, letterSpacing: ".06em", color: "rgba(255,255,255,.5)", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Email Address</label>
                <input value={form.email} onChange={handle("email")} placeholder="sarpong@example.com" type="email" style={inputStyle("email")}
                  onFocus={() => setFocus("email")} onBlur={() => setFocus("")}/>
                {errors.email && <p style={{ color: "#f87171", fontSize: ".78rem", marginTop: 4 }}>{errors.email}</p>}
              </div>

              <button onClick={submit} disabled={loading} style={{
                marginTop: 8,
                background: loading ? "#13b354aa" : G,
                color: "#0b0f1a", border: "none", borderRadius: 14,
                padding: "16px", fontWeight: 800, fontSize: "1rem",
                fontFamily: "'Syne', sans-serif", cursor: loading ? "default" : "pointer",
                transition: "background .2s, transform .15s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                animation: !loading ? "glow 2.5s infinite" : "none",
              }}>
                {loading ? (
                  <>
                    <div style={{ width: 18, height: 18, border: "2.5px solid rgba(0,0,0,.3)", borderTopColor: "#0b0f1a", borderRadius: "50%", animation: "spin .8s linear infinite" }}/>
                    Securing your spot…
                  </>
                ) : "Get Early Access"}
              </button>

              <p style={{ textAlign: "center", fontSize: ".78rem", color: "rgba(255,255,255,.3)" }}>
                No spam, ever. We'll only contact you about your Kaya invite.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function WaitlistSection({ onWaitlist }) {
  return (
    <section style={{ padding: "120px 24px", background: DARK, textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 300, background: G, borderRadius: "50%", filter: "blur(140px)", opacity: .08, pointerEvents: "none" }}/>
      <div style={{ maxWidth: 620, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <RevealBox>
          <Badge>Limited early spots</Badge>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 800, letterSpacing: "-1.5px", color: "#fff", marginBottom: 18, lineHeight: 1.1 }}>
            Be among the first to experience Kaya
          </h2>
          <p style={{ color: "rgba(255,255,255,.5)", marginBottom: 40, fontSize: "1.02rem", lineHeight: 1.75 }}>
            Join thousands already on the waitlist. Get exclusive early access, launch-day perks, and be the first to experience delivery reimagined.
          </p>
          <GhostBtn onClick={onWaitlist}>Reserve Your Spot →</GhostBtn>
          <p style={{ marginTop: 16, fontSize: ".8rem", color: "rgba(255,255,255,.28)" }}>Free to join. No credit card needed.</p>
        </RevealBox>
      </div>
    </section>
  );
}

function Footer({ onWaitlist }) {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w < 900;
  const cols = [
    { title: "Company", links: ["About Kaya", "Newsroom", "Careers", "Investors", "Accessibility"] },
    { title: "Services", links: ["Food Delivery", "Groceries", "Pharmacy", "Retail", "Rides (soon)"] },
    { title: "Business", links: ["Become a Driver", "Partner with Kaya", "Enterprise", "Help Center"] },
  ];
  return (
    <footer style={{ background: "#080c15", color: "rgba(255,255,255,.5)", padding: "72px 24px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "1fr 1fr 1fr" : "1.6fr 1fr 1fr 1fr", gap: 48, marginBottom: 56, flexWrap: "wrap" }}>
          <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 14 }}>
              Kay<span style={{ color: G }}>a</span>
            </div>
            <p style={{ fontSize: ".9rem", lineHeight: 1.7, maxWidth: 240, marginBottom: 28 }}>
              Everything you need, delivered. One app for your entire day.
            </p>
            <button onClick={onWaitlist} style={{ background: G, color: "#0b0f1a", border: "none", borderRadius: 999, padding: "10px 22px", fontWeight: 700, fontSize: ".85rem", fontFamily: "'Instrument Sans', sans-serif", cursor: "pointer" }}>
              Join Waitlist
            </button>
          </div>
          {cols.map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#fff", marginBottom: 20 }}>{col.title}</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map((l, j) => (
                  <li key={j}><a href="#" style={{ color: "rgba(255,255,255,.45)", fontSize: ".9rem", textDecoration: "none", transition: "color .2s" }}
                    onMouseEnter={e => e.target.style.color = "#fff"}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.45)"}
                  >{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: ".82rem" }}>© 2026 Kaya Technologies Inc. All rights reserved.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { label: "Terms", href: "/terms-of-service.html" },
              { label: "Privacy", href: "/privacy-policy.html" },
            ].map((l, i) => (
              <a key={i} href={l.href} style={{ fontSize: ".82rem", color: "rgba(255,255,255,.35)", textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.35)"}
              >{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openWaitlist = () => setModalOpen(true);

  return (
    <>
      <style>{styles}</style>
      <Navbar onWaitlist={openWaitlist}/>
      <Hero onWaitlist={openWaitlist}/>
      <Marquee/>

      <section style={{ padding: "100px 24px", background: DARK }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FeatureRow
            label="Food delivery"
            title="Everything you crave, delivered."
            desc="Hundreds of local restaurants and your favourite chains — browse menus, customise your order, and get it delivered hot to your door in under 30 minutes."
            imgUrl="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80"
            imgAlt="Delicious food"
            onWaitlist={openWaitlist}
          />
        </div>
      </section>

      <FullBgSection
        imgUrl="https://images.unsplash.com/photo-1543168256-418811576931?w=1600&q=80"
        title="Groceries delivered your way"
        sub="Grocery delivery"
        onWaitlist={openWaitlist}
      />

      <section style={{ padding: "100px 24px", background: "#0d1220" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FeatureRow
            label="Convenience & pharmacy"
            title="Convenience at your doorstep"
            desc="Snacks, vitamins, household essentials, over-the-counter medication — all delivered in under an hour. No trip to the store, ever again."
            imgUrl="https://i.ibb.co/Y7V9RjXJ/P1.png"
            imgAlt="Convenience delivery"
            reverse
            onWaitlist={openWaitlist}
          />
        </div>
      </section>

      <section style={{ padding: "100px 24px", background: DARK }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <RevealBox style={{ textAlign: "center", marginBottom: 56 }}>
            <Label>One app, everything</Label>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1px", color: "#fff" }}>
              Get more from your neighbourhood
            </h2>
          </RevealBox>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
            {CATS.map((c, i) => <CatCard key={i} cat={c} delay={i * 0.1}/>)}
          </div>
        </div>
      </section>

      <Steps/>

      <section style={{ padding: "100px 24px", background: "#0d1220" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FeatureRow
            label="Live tracking"
            title="Track your order in real time."
            desc="Watch your delivery move on a live GPS map. Chat directly with your driver, get milestone notifications, and know exactly when to open the door."
            imgUrl="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&q=80"
            imgAlt="App tracking experience"
            onWaitlist={openWaitlist}
          />
        </div>
      </section>

      <Stats/>
      <PartnerCards onWaitlist={openWaitlist}/>
      <WaitlistSection onWaitlist={openWaitlist}/>
      <Footer onWaitlist={openWaitlist}/>

      <WaitlistModal open={modalOpen} onClose={() => setModalOpen(false)}/>
    </>
  );
}
