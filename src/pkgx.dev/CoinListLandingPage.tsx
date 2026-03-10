import { ArrowUpRight, ExternalLink, Calendar, CheckCircle, Diamond, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useIsMobile } from "../utils/useIsMobile";
import { cn } from "../utils/cn";
import partnersImg from "../assets/partners.webp";
import tractionImg from "../assets/traction.svg";
import techImg from "../assets/tech.webp";
import teaLogoImg from "../assets/tea-3d-logo.webp";

function useCountdown(target: Date) {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds };
}

function CountdownDisplay({ t }: { t: ReturnType<typeof useCountdown> }) {
  return (
    <div className="inline-flex items-center gap-2 bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] rounded-lg px-3 py-2">
      <span className="text-[rgb(34,197,94)] font-semibold uppercase tracking-wide text-xs">Sale ends in</span>
      <div className="flex gap-1 items-center">
        {[
          { value: t.days, label: "d" },
          { value: t.hours, label: "h" },
          { value: t.minutes, label: "m" },
          { value: t.seconds, label: "s" },
        ].map((item, index) => (
          <div key={item.label} className="flex items-center">
            <div className="bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] rounded px-1.5 py-0.5 min-w-[40px] text-center">
              <span className="font-bold text-[rgb(34,197,94)] font-mono">{item.value.toString().padStart(2, "0")}</span>
            </div>
            <span className="text-[rgb(34,197,94)] font-medium ml-0.5 text-[0.7rem]">{item.label}</span>
            {index < 3 && <span className="text-[rgba(34,197,94,0.5)] mx-0.5 font-semibold">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CoinListLandingPage() {
  const isxs = useIsMobile();
  const target = useMemo(() => new Date("2025-10-02T13:00:00-04:00"), []);
  const t = useCountdown(target);

  const [formEmail, setFormEmail] = useState("");
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!formEmail) { setFormError("Please enter your email address"); return; }
    if (!validateEmail(formEmail)) { setFormError("Enter a valid email to continue"); return; }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("u", "9"); formData.append("f", "9"); formData.append("s", "");
      formData.append("c", "0"); formData.append("m", "0"); formData.append("act", "sub");
      formData.append("v", "2"); formData.append("or", "a62f1522a75f4801557d059720d472e2");
      formData.append("email", formEmail);
      formData.append("field[5]", isDeveloper ? "Yes" : "No");
      const response = await fetch("https://teaxyz.activehosted.com/proc.php", { method: "POST", body: formData });
      if (response.ok) { setShowThankYou(true); setFormEmail(""); setIsDeveloper(false); }
      else { setFormError("Something went wrong. Please try again."); }
    } catch { setFormError("Network error. Please check your connection and try again."); }
    finally { setIsSubmitting(false); }
  };

  return (
    <>
      <Helmet defer={false}>
        <title>tea is now live on CoinList - Early Access</title>
        <meta property="og:title" content="tea is now live on CoinList - Early Access" />
        <meta property="og:description" content="Be part of the future of open source. Join the official CoinList sale and support the tea protocol." />
        <meta property="og:image" content={`https://${import.meta.env.VITE_HOST}/coinlist-og.jpg`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://${import.meta.env.VITE_HOST}/coinlist`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="tea is now live on CoinList - Early Access" />
        <meta name="twitter:description" content="Be part of the future of open source. Join the official CoinList sale and support the tea protocol." />
        <meta name="twitter:image" content={`https://${import.meta.env.VITE_HOST}/coinlist-og.jpg`} />
      </Helmet>

      <div
        className="min-h-dvh"
        style={{
          background: "radial-gradient(1200px 600px at 20% -10%, rgba(124,58,237,.25), transparent 55%), radial-gradient(1200px 600px at 120% 10%, rgba(14,165,233,.25), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,0))",
        }}
      >
        {/* Hero */}
        <div className="max-w-5xl mx-auto pt-4 md:pt-4 pb-8 md:pb-12 px-4">
          <div className="space-y-8">
            <span className="inline-block border border-[#F26212] rounded-full px-3 py-0.5 text-[#F26212] text-sm font-bold">
              Early Access
            </span>
            <div className="flex flex-col items-center gap-4">
              <img src={teaLogoImg} alt="tea" className="w-full max-w-[70%] h-auto" />
              <h1 className={cn("font-extrabold tracking-tight", isxs ? "text-3xl" : "text-5xl")}>
                now available on CoinList
              </h1>
            </div>
            <p className="text-lg text-[rgba(237,242,239,0.7)] max-w-[800px]">
              Be part of the future of open source. PKGX built tea, and now you can join the movement by participating in the official CoinList sale.
            </p>
            <div className={cn("flex gap-2", isxs ? "flex-col" : "flex-row items-center")}>
              <a href="https://coinlist.co" target="_blank" rel="noreferrer noopener"
                className="inline-flex items-center gap-2 bg-[#4156E1] text-white px-6 py-3 rounded font-medium hover:bg-[#3348c4] transition-colors no-underline">
                Join the CoinList Sale <ExternalLink className="w-4 h-4" />
              </a>
              <a href="https://tea.xyz" target="_blank" rel="noreferrer noopener"
                className="inline-flex items-center gap-2 border border-[#F26212] text-[#F26212] px-6 py-3 rounded font-medium hover:bg-[#F26212]/10 transition-colors no-underline">
                Learn more at tea.xyz <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
            <CountdownDisplay t={t} />
          </div>
        </div>

        {/* Why tea */}
        <div className="max-w-5xl mx-auto py-4 px-4">
          <div className={cn("grid gap-4", isxs ? "grid-cols-1" : "grid-cols-2")}>
            <div>
              <h2 className="text-2xl font-extrabold mb-2">Why tea?</h2>
              <p className="text-[rgba(237,242,239,0.7)] mb-4">
                Open source powers the apps, tools, and platforms you use every day — but the people who build it rarely get rewarded. <strong>tea changes that.</strong>
              </p>
              <div className="space-y-3">
                {["A universal app store for open source", "Fair rewards for developers and maintainers", "Built to scale with the next generation of software and AI"].map(text => (
                  <div key={text} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#4156E1] shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <img src={techImg} alt="Technology Stack" className="max-w-full h-auto" loading="lazy" />
              </div>
            </div>
            <div className="rounded-lg border border-white/5 p-6 h-full" style={{ background: "linear-gradient(180deg, rgba(124,58,237,.12), rgba(14,165,233,.08))" }}>
              <h3 className="text-xl font-extrabold mb-2">The CoinList Sale: Your Early Access</h3>
              <p className="text-[rgba(237,242,239,0.7)] mb-4">
                The tea association has partnered with CoinList — trusted by millions of investors — to launch the tea token sale.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-[#F26212] shrink-0" /><span><strong>Sale ends:</strong> October 2nd, 2025 — 1 PM EST</span></div>
                <div className="flex items-center gap-3"><Diamond className="w-5 h-5 text-[#F26212] shrink-0" /><span><strong>Token supply:</strong> Selling 4bn (Total supply 100bn)</span></div>
                <div className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-[#F26212] shrink-0" /><span><strong>How to join:</strong> Sign up on CoinList, complete verification, and participate</span></div>
              </div>
              <div className={cn("flex gap-2 mt-6", isxs ? "flex-col" : "flex-row")}>
                <a href="https://coinlist.co" target="_blank" rel="noreferrer noopener"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#4156E1] text-white px-4 py-2 rounded font-medium hover:bg-[#3348c4] transition-colors no-underline">
                  Go to CoinList <ExternalLink className="w-4 h-4" />
                </a>
                <a href="#signup"
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-[#F26212] text-[#F26212] px-4 py-2 rounded font-medium hover:bg-[#F26212]/10 transition-colors no-underline">
                  Get Updates
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <img src={tractionImg} alt="Traction" className="max-w-[60%] h-auto" loading="lazy" />
        </div>

        {/* Backed by Builders */}
        <div className="max-w-5xl mx-auto py-10 px-4 text-center">
          <h2 className="text-2xl font-extrabold mb-2">Backed by Builders & Trusted Platforms</h2>
          <p className="text-[rgba(237,242,239,0.7)] max-w-[700px] mx-auto text-left mb-6">
            tea was built by <strong>PKGX</strong>, trusted across the developer ecosystem. The tea association ensures transparent, community-driven governance.
          </p>
          <div className="mt-4 flex justify-center">
            <img src={partnersImg} alt="Partners" className="max-w-[80%] h-auto" loading="lazy" />
          </div>
        </div>

        {/* Signup */}
        <div id="signup" className="max-w-5xl mx-auto py-6 px-4">
          <div className={cn("grid gap-4", isxs ? "grid-cols-1" : "grid-cols-12")}>
            <div className={isxs ? "" : "col-span-7"}>
              <h2 className="text-2xl font-extrabold mb-2">Don't Miss Out</h2>
              <p className="text-[rgba(237,242,239,0.7)]">This is your chance to support the future of open source — and to be early.</p>
              <div className="mt-4"><CountdownDisplay t={t} /></div>
              <a href="https://coinlist.co" target="_blank" rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-[#4156E1] hover:underline mt-4">
                Join the CoinList Sale Now <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-[rgba(237,242,239,0.7)] text-sm mt-4">
                The tea token sale is offered through CoinList. Availability subject to regulations and eligibility. Nothing here is investment advice.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="https://tea.xyz" target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-[#F26212] hover:underline text-sm">
                  tea.xyz <ArrowUpRight className="w-3 h-3" />
                </a>
                <a href="https://pkgx.dev" target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-[#F26212] hover:underline text-sm">
                  pkgx.dev <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div className={isxs ? "" : "col-span-5"}>
              <div className="rounded-lg border border-white/5 p-6" style={{ background: "linear-gradient(180deg, rgba(2,132,199,.14), rgba(124,58,237,.12))" }}>
                {!showThankYou ? (
                  <>
                    <h3 className="text-xl font-extrabold mb-2">Stay Updated</h3>
                    <p className="text-[rgba(237,242,239,0.7)] mb-4">Get the latest updates about tea and the future of open source development.</p>
                    <form onSubmit={handleFormSubmit} noValidate className="space-y-4">
                      <input
                        type="email" required placeholder="Enter your email" value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full bg-transparent border border-[rgba(149,178,184,0.3)] rounded px-3 py-2 text-sm text-[#EDF2EF] placeholder:text-[rgba(237,242,239,0.5)] focus:outline-none focus:border-[#4156E1]"
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={isDeveloper} onChange={(e) => setIsDeveloper(e.target.checked)} className="accent-[#4156E1]" />
                        <span className="text-sm">Are you a developer?</span>
                      </label>
                      {formError && <div className="bg-red-900/30 border border-red-500/30 rounded p-2 text-red-300 text-sm">{formError}</div>}
                      <button
                        type="submit" disabled={isSubmitting}
                        className="w-full bg-[#4156E1] text-white py-3 rounded font-medium hover:bg-[#3348c4] transition-colors disabled:opacity-50">
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    </form>
                    <p className="text-xs text-[rgba(237,242,239,0.5)] mt-4 text-center">
                      By submitting your email, you consent with our{" "}
                      <a href="/privacy-policy" className="text-[#4156E1] underline">Privacy Policy</a>.
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-extrabold mb-2">Thank You!</h3>
                    <p className="text-[rgba(237,242,239,0.7)]">We'll keep you updated on tea and the future of open source.</p>
                    <button onClick={() => setShowThankYou(false)} className="text-[#4156E1] hover:underline mt-4 bg-transparent border-0 cursor-pointer">
                      Submit Another Email
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
