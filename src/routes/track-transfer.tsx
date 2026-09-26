import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { trackTransfer } from "@/lib/transfers.functions";
import { TransferTimeline } from "@/components/TransferTimeline";
import { ArrowDownToLine, ArrowUpFromLine, Building2, CreditCard, Crosshair, HandCoins, Landmark, MapPin, Menu, MessageCircleQuestion, ReceiptText, Search, Send, Settings, Smartphone, Star, UsersRound, X } from "lucide-react";
import { countries } from "@/lib/countries";
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
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof trackTransfer>> | null>(null);
  const lookupTransfer = useServerFn(trackTransfer);
  const [mode, setMode] = useState<"mtcn" | "details">("mtcn");
  const [lookupBy, setLookupBy] = useState<"phone" | "names">("phone");
  const [phone, setPhone] = useState("");
  const [senderLast, setSenderLast] = useState("");
  const [receiverFirst, setReceiverFirst] = useState("");
  const [receiverLast, setReceiverLast] = useState("");
  const [amountKind, setAmountKind] = useState<"send" | "receive">("send");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [receiverCountry, setReceiverCountry] = useState(countries.find(item => item.iso === "us") ?? countries[0]!);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const valid = mtcn.length === 10 && firstName.trim().length > 0;
  const detailsValid = lookupBy === "phone" ? phone.trim().length >= 7 : firstName.trim().length > 0 && senderLast.trim().length > 0 && receiverFirst.trim().length > 0 && receiverLast.trim().length > 0;
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
      {menuOpen && <div className="track-menu-backdrop" aria-hidden="true" onClick={() => setMenuOpen(false)} />}
      {menuOpen && <nav className="track-menu-panel" aria-label="Site menu">
        <div className="track-menu-auth"><a href={`${official}/us/en/web/user/login`}>Log in</a><span aria-hidden="true"/><a href={`${official}/us/en/web/user/register`}>Sign up</a></div>
        <ul>
          <li><a href={`${official}/us/en/web/send-money/start`}><Send aria-hidden="true"/>Send money</a></li>
          <li><a href={`${official}/us/en/receive-money.html`}><HandCoins aria-hidden="true"/>Pick up cash</a></li>
          <li><Link to="/track-transfer" onClick={() => setMenuOpen(false)}><Crosshair aria-hidden="true"/>Track transfer</Link></li>
          <li><a href={`${official}/us/en/bill-pay.html`}><ReceiptText aria-hidden="true"/>Pay bills</a></li>
          <li><a href={`${official}/us/en/find-locations.html`}><MapPin aria-hidden="true"/>Find locations</a></li>
          <li><a href={`${official}/us/en/frequently-asked-questions.html`}><MessageCircleQuestion aria-hidden="true"/>Help</a></li>
          <li><a href={`${official}/us/en/rewards.html`}><Star aria-hidden="true"/><span>Western Union<br/>Rewards<em className="track-menu-new">New</em></span></a></li>
          <li><a href={`${official}/us/en/refer-a-friend.html`}><UsersRound aria-hidden="true"/>Refer a Friend</a></li>
          <li><a href={`${official}/us/en/pay-inmate.html`}><Landmark aria-hidden="true"/>Pay inmate</a></li>
          <li><a href={`${official}/us/en/mobile-top-up.html`}><Smartphone aria-hidden="true"/>Mobile top-up</a></li>
          <li><a href={`${official}/us/en/web/user/login`}><Building2 aria-hidden="true"/>Update delivery method</a></li>
          <li><a href={`${official}/us/en/prepaid-card.html`}><CreditCard aria-hidden="true"/>Western Union Prepaid</a></li>
          <li><a href={`${official}/us/en/web/user/login`}><Settings aria-hidden="true"/>Settings</a></li>
        </ul>
      </nav>}
    </header>
    <section className="track-main">
      <div className="track-form-wrap">
        <div className="track-heading-row"><h1>Track a Transfer</h1><span>English/United States</span></div>
        <div className="track-tabs" role="tablist" aria-label="Transfer role">
          <Button variant="ghost" role="tab" aria-selected={role === "sender"} className={role === "sender" ? "track-tab active" : "track-tab"} onClick={() => {setRole("sender");setSubmitted(false)}}><ArrowUpFromLine aria-hidden="true"/>I'm the sender</Button>
          <Button variant="ghost" role="tab" aria-selected={role === "receiver"} className={role === "receiver" ? "track-tab active" : "track-tab"} onClick={() => {setRole("receiver");setSubmitted(false)}}><ArrowDownToLine aria-hidden="true"/>I'm the receiver</Button>
        </div>
        {submitted && result?.found ? <TransferTimeline mtcn={result.transfer.mtcn} status={result.transfer.status} statusDetail={result.transfer.status_detail} events={result.transfer.events} onReset={() => {setSubmitted(false);setResult(null);setMtcn("");setFirstName("");setMode("mtcn");inputRef.current?.focus()}} /> : mode === "mtcn" ? (
        <form className="track-form" onSubmit={async event => {event.preventDefault(); if(!valid || searching) return; setSearching(true); setResult(null); try { setResult(await lookupTransfer({data: {mtcn, firstName: firstName.trim()}})); } catch { setResult({found: false}); } setSearching(false); setSubmitted(true); }}>
          <label htmlFor="track-mtcn" className="track-instruction">Please enter your 10-digit tracking number (MTCN).</label>
          <div className="track-number" onClick={() => inputRef.current?.focus()}>
            {Array.from({length: 10}, (_, index) => <span key={index} className={`track-digit ${index === 3 || index === 6 ? "track-digit-gap" : ""}`}>{mtcn[index] ?? ""}</span>)}
            <input ref={inputRef} id="track-mtcn" aria-label="10-digit tracking number (MTCN)" inputMode="numeric" autoComplete="off" pattern="[0-9]{10}" maxLength={16} value={mtcn} onChange={event => {const digits = event.target.value.replace(/\D/g, "").slice(0,10); if (event.target.value !== digits) event.target.value = digits; setMtcn(digits); setSubmitted(false); setResult(null)}}/>
          </div>
          <label className="track-name"><input aria-label="Sender's First Name" placeholder="Sender's First Name" autoComplete="given-name" value={firstName} onChange={event => {setFirstName(event.target.value);setSubmitted(false);setResult(null)}}/></label>
          <Button type="submit" className="track-continue" disabled={!valid || searching}>{searching ? "Searching…" : "Continue"}</Button>
          {submitted && result && !result.found && <p className="track-status" role="status">We couldn't find a transfer matching that tracking number and sender's first name. Please check the details and try again.</p>}
          <button type="button" className="track-help-link" onClick={() => {setMode("details");setSubmitted(false)}}>Don't know the MTCN?</button>
        </form>
        ) : (
        <form className="track-form track-alt-form" onSubmit={event => {event.preventDefault(); if(detailsValid) setSubmitted(true)}}>
          <div className="track-radio-row" role="radiogroup" aria-label="Lookup method">
            <label className="track-radio"><input type="radio" name="lookup-by" checked={lookupBy === "phone"} onChange={() => {setLookupBy("phone");setSubmitted(false)}}/>Sender's phone number</label>
            <label className="track-radio"><input type="radio" name="lookup-by" checked={lookupBy === "names"} onChange={() => {setLookupBy("names");setSubmitted(false)}}/>Sender and receiver names</label>
          </div>
          {lookupBy === "phone" ? (
            <div className="track-field-row">
              <label className="track-select-wrap track-country-code"><span className="track-select-label">Sender's Country</span>
                <select aria-label="Sender's country code" defaultValue="1"><option value="1">1 (US)</option><option value="52">52 (MX)</option><option value="63">63 (PH)</option><option value="91">91 (IN)</option><option value="502">502 (GT)</option></select>
              </label>
              <label className="track-input-wrap grow"><input aria-label="Sender's phone number" placeholder="Sender's phone number" inputMode="tel" autoComplete="tel" value={phone} onChange={event => {setPhone(event.target.value.replace(/[^\d\s()-]/g, ""));setSubmitted(false)}}/></label>
            </div>
          ) : (
            <>
            <div className="track-field-row">
              <label className="track-input-wrap grow"><input aria-label="Sender's first name" placeholder="Sender's first name" autoComplete="given-name" value={firstName} onChange={event => {setFirstName(event.target.value);setSubmitted(false)}}/></label>
              <label className="track-input-wrap grow"><input aria-label="Sender's last name" placeholder="Sender's last name" autoComplete="family-name" value={senderLast} onChange={event => {setSenderLast(event.target.value);setSubmitted(false)}}/></label>
            </div>
            <div className="track-field-row track-names-gap">
              <label className="track-input-wrap grow"><input aria-label="Receiver's first name" placeholder="Receiver's first name" value={receiverFirst} onChange={event => {setReceiverFirst(event.target.value);setSubmitted(false)}}/></label>
              <label className="track-input-wrap grow"><input aria-label="Receiver's last name" placeholder="Receiver's last name" value={receiverLast} onChange={event => {setReceiverLast(event.target.value);setSubmitted(false)}}/></label>
            </div>
            </>
          )}
          <div className="track-country-picker">
            <button type="button" className="track-select-wrap track-receiver-country" aria-haspopup="listbox" aria-expanded={countryOpen} onClick={() => {setCountryOpen(!countryOpen);setCountrySearch("")}}>
              <span className="track-select-label">Receiver's country</span>
              <span className="track-country-value"><img src={`https://flagcdn.com/w80/${receiverCountry.iso}.png`} alt="" width="34" height="24"/>{receiverCountry.name}</span>
            </button>
            {countryOpen && <div className="track-country-menu">
              <div className="track-country-search"><Search size={20} aria-hidden="true"/><input autoFocus aria-label="Search country" placeholder="Search" value={countrySearch} onChange={event => setCountrySearch(event.target.value)}/></div>
              <div className="track-country-options" role="listbox" aria-label="Receiver's country">
                {countries.filter(item => item.name.toLowerCase().includes(countrySearch.toLowerCase())).map(item => (
                  <button type="button" key={item.iso} role="option" aria-selected={item.name === receiverCountry.name} className={item.name === receiverCountry.name ? "track-country-option active" : "track-country-option"} onClick={() => {setReceiverCountry(item);setCountryOpen(false)}}>
                    <img src={item.flag} alt=""/>{item.name}
                  </button>
                ))}
              </div>
            </div>}
          </div>
          <div className="track-field-row">
            <label className="track-select-wrap grow"><select aria-label="Amount type" value={amountKind} onChange={event => setAmountKind(event.target.value as "send" | "receive")}><option value="send">Select send amount</option><option value="receive">Select receive amount</option></select></label>
            <label className="track-input-wrap grow track-amount"><input aria-label={amountKind === "send" ? "Enter send amount" : "Enter receive amount"} placeholder={amountKind === "send" ? "Enter send amount" : "Enter receive amount"} inputMode="decimal" value={amount} onChange={event => setAmount(event.target.value.replace(/[^\d.]/g, ""))}/><span className="track-amount-currency">USD</span></label>
          </div>
          <p className="track-date-hint"><span className="track-date-icon" aria-hidden="true">+</span>For better results, add transfer date (optional)</p>
          <fieldset className="track-date-fields"><legend>Date of transfer</legend>
            <label className="track-select-wrap"><select aria-label="Month" value={month} onChange={event => setMonth(event.target.value)}><option value="">Month</option>{months.map(name => <option key={name} value={name}>{name}</option>)}</select></label>
            <label className="track-select-wrap"><select aria-label="Day" value={day} onChange={event => setDay(event.target.value)}><option value="">Day</option>{Array.from({length: 31}, (_, index) => String(index + 1).padStart(2, "0")).map(value => <option key={value} value={value}>{value}</option>)}</select></label>
            <label className="track-select-wrap"><select aria-label="Year" value={year} onChange={event => setYear(event.target.value)}><option value="">Year</option>{years.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
          </fieldset>
          <Button type="submit" className="track-continue" disabled={!detailsValid}>Continue</Button>
          {submitted && <p className="track-status" role="status">For your security, check your transfer status directly on <a href={`${official}/web/global-service/track-transfer`}>Western Union's official tracking page</a>.</p>}
          <button type="button" className="track-help-link" onClick={() => {setMode("mtcn");setSubmitted(false)}}>I have an MTCN</button>
        </form>
        )}
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