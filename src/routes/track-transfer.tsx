import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import footerLogo from "@/assets/Primary_YellowWhite.svg.asset.json";
import socialFacebook from "@/assets/social/facebook-icon-1-1.svg";
import socialYoutube from "@/assets/social/youtube-icon-1-1.svg";
import socialInstagram from "@/assets/social/instagram.svg";
import socialX from "@/assets/social/icon-X-former-twitter-dark-web.svg";

const official = "https://www.westernunion.com";
const links = [
  "Home", "About us", "Contact us", "Refer a Friend", "Blog", "Help", "Fraud awareness",
  "Report a security bug", "Investor relations", "Careers", "Western Union Foundation",
  "News", "Become an agent", "State licensing", "Law enforcement subpoena information",
  "Terms and Conditions", "Online Privacy Statement", "Sitemap", "Cookie Information",
  "Accessibility Statement", "How to find your WU tracking number", "Send money with confidence",
];
const hrefs: Record<string, string> = {
  "About us": "https://corporate.westernunion.com/", "Contact us": `${official}/us/en/contact-us.html`,
  "Refer a Friend": `${official}/us/en/refer-a-friend.html`, Blog: `${official}/blog/`,
  Help: `${official}/us/en/frequently-asked-questions.html`, "Fraud awareness": `${official}/global/en/fraud-awareness/fraud-home.html`,
  "Report a security bug": `${official}/us/en/fraud-awareness.html`, "Investor relations": "https://ir.westernunion.com/",
  Careers: "https://careers.westernunion.com/", "Western Union Foundation": "https://www.westernunionfoundation.org/",
  News: "https://corporate.westernunion.com/newsroom.html", "Become an agent": "https://agentportal.westernunion.com/",
  "State licensing": `${official}/us/en/legal/state-licenses.html`,
  "Law enforcement subpoena information": `${official}/us/en/legal/law-enforcement.html`,
  "Terms and Conditions": `${official}/us/en/legal/terms-conditions.html`,
  "Online Privacy Statement": `${official}/global/en/privacy-statement.html`,
  Sitemap: `${official}/us/en/sitemap.html`, "Cookie Information": `${official}/us/en/legal/cookie-information.html`,
  "Accessibility Statement": `${official}/us/en/accessibility.html`,
  "How to find your WU tracking number": `${official}/us/en/frequently-asked-questions/track-a-transfer.html`,
  "Send money with confidence": `${official}/us/en/fraud-awareness.html`,
};

export const Route = createFileRoute("/track-transfer")({
  head: () => ({ meta: [
    { title: "Track a Transfer | Western Union" },
    { name: "description", content: "Enter your tracking number (MTCN) to track your Western Union money transfer." },
    { property: "og:title", content: "Track a Transfer | Western Union" },
    { property: "og:description", content: "Enter your tracking number (MTCN) to track your Western Union money transfer." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: TrackTransfer,
});

function TrackTransfer() {
  const [role, setRole] = useState<"sender" | "receiver">("sender");
  const [mtcn, setMtcn] = useState("");
  const [firstName, setFirstName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<"mtcn" | "details">("mtcn");
  const [lookupBy, setLookupBy] = useState<"phone" | "names">("phone");
  const [phone, setPhone] = useState("");
  const [amountKind, setAmountKind] = useState<"send" | "receive">("send");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const valid = mtcn.length === 10 && firstName.trim().length > 0;
  const detailsValid = lookupBy === "phone" ? phone.trim().length >= 7 : firstName.trim().length > 0;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const years = Array.from({length: 6}, (_, index) => String(2026 - index));

  return <main className="track-page">
    <header className="track-header">
      <div className="track-header-inner">
        <Link to="/" aria-label="Western Union home" className="track-logo"><img src={footerLogo.url} alt="Western Union" /></Link>
        <nav className="track-nav" aria-label="Primary navigation">
          <a href={`${official}/us/en/web/send-money/start`}>Send money</a><a href={`${official}/us/en/receive-money.html`}>Pick up cash</a>
          <Link to="/track-transfer">Track transfer</Link><a href={`${official}/us/en/bill-pay.html`}>Pay bills</a><a href={`${official}/us/en/frequently-asked-questions.html`}>Help</a>
        </nav>
        <Button variant="ghost" className="track-menu-trigger" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span className="track-menu-desktop">{menuOpen ? <X size={26}/> : <Menu size={29}/>}</span><span className="track-menu-mobile">{menuOpen ? "Close" : "Menu"}</span></Button>
        <div className="track-auth"><a href={`${official}/us/en/web/user/login`}>Log in</a><a href={`${official}/us/en/web/user/register`}>Register</a></div>
      </div>
      {menuOpen && <nav className="track-menu-list" aria-label="Site menu"><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link><a href={`${official}/us/en/web/send-money/start`}>Send money</a><Link to="/track-transfer" onClick={() => setMenuOpen(false)}>Track a transfer</Link><a href={`${official}/us/en/frequently-asked-questions.html`}>Help</a><a href={`${official}/us/en/web/user/login`}>Log in</a><a href={`${official}/us/en/web/user/register`}>Register</a></nav>}
    </header>
    <section className="track-main">
      <div className="track-form-wrap">
        <div className="track-heading-row"><h1>Track a Transfer</h1><span>English/United States</span></div>
        <div className="track-tabs" role="tablist" aria-label="Transfer role">
          <Button variant="ghost" role="tab" aria-selected={role === "sender"} className={role === "sender" ? "track-tab active" : "track-tab"} onClick={() => {setRole("sender");setSubmitted(false)}}><ArrowUpFromLine aria-hidden="true"/>I'm the sender</Button>
          <Button variant="ghost" role="tab" aria-selected={role === "receiver"} className={role === "receiver" ? "track-tab active" : "track-tab"} onClick={() => {setRole("receiver");setSubmitted(false)}}><ArrowDownToLine aria-hidden="true"/>I'm the receiver</Button>
        </div>
        <form className="track-form" onSubmit={event => {event.preventDefault(); if(valid) setSubmitted(true)}}>
          <label htmlFor="track-mtcn" className="track-instruction">Please enter your 10-digit tracking number (MTCN).</label>
          <div className="track-number" onClick={() => inputRef.current?.focus()}>
            {Array.from({length: 10}, (_, index) => <span key={index} className={`track-digit ${index === 3 || index === 6 ? "track-digit-gap" : ""}`}>{mtcn[index] ?? ""}</span>)}
            <input ref={inputRef} id="track-mtcn" aria-label="10-digit tracking number (MTCN)" inputMode="numeric" autoComplete="off" pattern="[0-9]{10}" maxLength={10} value={mtcn} onChange={event => {setMtcn(event.target.value.replace(/\D/g, "").slice(0,10));setSubmitted(false)}}/>
          </div>
          <label className="track-name"><input aria-label="Sender's First Name" placeholder="Sender's First Name" autoComplete="given-name" value={firstName} onChange={event => {setFirstName(event.target.value);setSubmitted(false)}}/></label>
          <Button type="submit" className="track-continue" disabled={!valid}>Continue</Button>
          {submitted && <p className="track-status" role="status">For your security, check your transfer status directly on <a href={`${official}/web/global-service/track-transfer`}>Western Union's official tracking page</a>.</p>}
          <a className="track-help-link" href={hrefs["How to find your WU tracking number"]}>Don't know the MTCN?</a>
        </form>
      </div>
    </section>
    <footer className="track-footer">
      <div className="track-footer-inner">
        <nav className="track-footer-links" aria-label="Footer navigation">{links.map((label, index) => <span key={label}>{index > 0 && <span className="track-separator" aria-hidden="true">|</span>}{label === "Home" ? <Link to="/">Home</Link> : <a href={hrefs[label]}>{label}</a>}{" "}</span>)}</nav>
        <p className="track-legal">Services may be provided by Western Union Financial Services, Inc. NMLS# 906983 and/or Western Union International Services, LLC NMLS# 906985, which are licensed as Money Transmitters by the New York State Department of Financial Services. See terms and conditions for details.</p>
        <div className="track-footer-bottom"><p>© 2026 Western Union Holdings, Inc. All Rights Reserved</p><div className="track-social"><strong>Follow us on</strong><div><a href="https://www.facebook.com/WesternUnion" aria-label="Facebook"><img src={socialFacebook} alt=""/></a><a href="https://www.youtube.com/user/WesternUnion" aria-label="YouTube"><img src={socialYoutube} alt=""/></a><a href="https://www.instagram.com/westernunion/" aria-label="Instagram"><img src={socialInstagram} alt=""/></a><a href="https://x.com/WesternUnion" aria-label="X"><img src={socialX} alt=""/></a></div></div></div>
      </div>
    </footer>
  </main>;
}