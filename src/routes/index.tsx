import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUp, BadgeCheck, BadgeDollarSign, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, CircleHelp, CreditCard, Gift, Globe2, IdCard, Landmark, Lightbulb, LockKeyhole, MapPin, Menu, MessageCircleQuestion, Radar, ReceiptText, RefreshCcw, Search, Send, Settings, ShieldCheck, Smartphone, Star, Store, Tag, UsersRound, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/Primary_Black.svg.asset.json";
import wMark from "@/assets/wu-w-mark.svg.asset.json";
import squarespaceLogo from "@/assets/squarespace-logo.png.asset.json";
import nordvpnLogo from "@/assets/nordvpn-logo.png.asset.json";
import amazonLogo from "@/assets/amazon-logo.png.asset.json";
import deferitLogo from "@/assets/deferit-logo.png.asset.json";
import footerLogo from "@/assets/Primary_YellowWhite.svg.asset.json";
import appPhoto from "@/assets/section-786x560-1-1790132239916.webp.asset.json";
import morePhoto from "@/assets/GettyImages-2170511239-scaled-1790132239918.webp.asset.json";
import rewardsPhoto from "@/assets/media-1790132239914.webp.asset.json";
import reasonsPhoto from "@/assets/Dynamic_reasons-Canada-1790132241476.webp.asset.json";
import appStore from "@/assets/app-store-final.svg.asset.json";
import googlePlay from "@/assets/google-play-badge-ai.svg.asset.json";
import starReward from "@/assets/star_rewards.svg.asset.json";
import discountReward from "@/assets/discount_rewards.svg.asset.json";
import giftReward from "@/assets/gift.svg.asset.json";
import usFlag from "@/assets/us.svg.asset.json";
import mxFlag from "@/assets/mx.svg.asset.json";
import inFlag from "@/assets/in.svg.asset.json";
import euFlag from "@/assets/eu.svg.asset.json";
import indiaFlag from "@/assets/in-footer.svg.asset.json";
import pakistanFlag from "@/assets/pk-footer.svg.asset.json";
import chinaFlag from "@/assets/cn-footer.svg.asset.json";
import guatemalaFlag from "@/assets/gt-mobile.svg.asset.json";
import philippinesFlag from "@/assets/ph-mobile.svg.asset.json";
import socialFacebook from "@/assets/social/facebook-icon-1-1.svg";
import socialYoutube from "@/assets/social/youtube-icon-1-1.svg";
import socialInstagram from "@/assets/social/instagram.svg";
import socialX from "@/assets/social/icon-X-former-twitter-dark-web.svg";

const official = "https://www.westernunion.com/us/en";
const sendUrl = `${official}/web/send-money/start`;
const loginUrl = `${official}/web/user/login`;
const registerUrl = `${official}/web/user/register`;
const footerFlags: Record<string, string> = {"United States":usFlag.url,India:indiaFlag.url,Mexico:mxFlag.url,Pakistan:pakistanFlag.url,China:chinaFlag.url};
const footerGroups = [
  { title: "Money Transfer", links: ["Send money", "Send money online", "Send money in person", "Send money by phone", "Send money to an inmate", "Track a transfer", "Receive money", "Find locations", "Download app", "Currency converter", "Money Orders", "Swift/BIC"] },
  { title: "Company", links: ["About us", "Help", "Blog", "Contact Us", "Careers", "Investor Relations", "Western Union Foundation"] },
  { title: "Quick Links", links: ["Log in / Register", "Become an agent", "Become a Bill Pay Partner", "Fraud awareness", "Customer care", "Western Union Rewards", "Refer a Friend", "Western Union Prepaid", "Transfer History Request"] },
  { title: "Legal", links: ["Terms and Conditions", "Intellectual Property", "Online Privacy Statement", "File a Complaint", "Vigo Money by Western Union Terms and Conditions", "Western Union Prepaid Visa® Card Terms and Conditions", "Rewards Terms and Conditions"] },
];
const footerHrefs: Record<string, string> = {
  "Send money": sendUrl, "Send money online": `${official}/send-money.html`, "Send money in person": `${official}/locations.html`, "Send money by phone": `${official}/mobile-app.html`, "Send money to an inmate": `${official}/send-money/app/sendinmatestart`, "Track a transfer": "https://www.westernunion.com/web/global-service/track-transfer", "Receive money": `${official}/receive-money.html`, "Find locations": "https://www.westernunion.com/global-services/find-locations?WUCountry=us&WULanguage=en", "Download app": `${official}/mobile-app.html`, "Currency converter": `${official}/currency-converter.html`, "Money Orders": `${official}/money-order.html`, "Swift/BIC": `${official}/swift-bic-codes.html`,
  "About us": "https://corporate.westernunion.com/", "Help": `${official}/frequently-asked-questions.html`, "Blog": "https://www.westernunion.com/blog/", "Contact Us": `${official}/contact-us.html`, "Careers": "https://careers.westernunion.com", "Investor Relations": "https://ir.westernunion.com/investor-relations/default.aspx", "Western Union Foundation": "https://www.westernunionfoundation.org/",
  "Log in / Register": loginUrl, "Become an agent": "https://agentportal.westernunion.com/ap/agentregister.do?pid=usFtBecomeAgent", "Become a Bill Pay Partner": "https://www.westernunion.com/corporate/biller-support.html", "Fraud awareness": "https://www.westernunion.com/global/en/fraud-awareness/fraud-home.html", "Customer care": `${official}/frequently-asked-questions.html`, "Western Union Rewards": `${official}/rewards/home.html`, "Refer a Friend": `${official}/refer-a-friend.html`, "Western Union Prepaid": "https://www.westernunion.com/prepaid/", "Transfer History Request": "https://www.westernunion.com/global/en/carf-form.html",
  "Terms and Conditions": `${official}/legal/terms-conditions.html`, "Intellectual Property": `${official}/legal/intellectual-property.html`, "Online Privacy Statement": "https://www.westernunion.com/global/en/privacy-statement.html", "File a Complaint": `${official}/legal/file-complaint.html`, "Vigo Money by Western Union Terms and Conditions": `${official}/wallet/terms-and-conditions.html`, "Western Union Prepaid Visa® Card Terms and Conditions": `${official}/prepaid/us-gpr-terms-and-conditions.html`, "Rewards Terms and Conditions": `${official}/rewards/rewards-terms-conditions.html`,
};
const menuItems: { label: string; href: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { label: "Send money", href: sendUrl, icon: Send },
  { label: "Track a transfer", href: "https://www.westernunion.com/web/global-service/track-transfer", icon: Radar },
  { label: "Prepaid Card", href: "https://www.westernunion.com/prepaid/", icon: CreditCard },
  { label: "Pay bills", href: `${official}/bill-pay.html`, icon: ReceiptText },
  { label: "Find locations", href: "https://www.westernunion.com/global-services/find-locations?WUCountry=us&WULanguage=en", icon: MapPin },
  { label: "Contact Us", href: `${official}/contact-us.html`, icon: MessageCircleQuestion },
  { label: "Western Union Rewards", href: `${official}/rewards/home.html`, icon: Star },
  { label: "Member Deals", href: `${official}/rewards.html`, icon: Tag },
  { label: "Refer a friend", href: `${official}/refer-a-friend.html`, icon: UsersRound },
  { label: "Mobile app", href: `${official}/mobile-app.html`, icon: Smartphone },
  { label: "Money orders", href: `${official}/money-order.html`, icon: CircleDollarSign },
  { label: "Money Order Refunds", href: `${official}/money-order-refunds.html`, icon: BadgeDollarSign },
  { label: "Pay inmate", href: `${official}/send-money/app/sendinmatestart`, icon: IdCard },
  { label: "Mobile top-up", href: `${official}/mobile-top-up.html`, icon: Smartphone },
  { label: "Update delivery method", href: `${official}/home.html`, icon: Landmark },
  { label: "Settings", href: `${official}/home.html`, icon: Settings },
  { label: "Help", href: `${official}/frequently-asked-questions.html`, icon: CircleHelp },
];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Send Money Online from the United States | Western Union" },
    { name: "description", content: "Send and receive money with Western Union online, in the app, or at an agent location." },
    { property: "og:title", content: "Send Money Online from the United States | Western Union" },
    { property: "og:description", content: "Send and receive money with Western Union online, in the app, or at an agent location." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HomePage,
});

function Action({ children, href, variant = "wuBlack", className = "" }: {children: React.ReactNode; href: string; variant?: "wuBlack" | "wuYellow" | "wuOutline" | "wuLightOutline"; className?: string}) {
  return <Button asChild variant={variant} className={`h-[52px] px-8 text-[16px] ${className}`}><a href={href}>{children}</a></Button>;
}

function HomePage() {
  const [amount, setAmount] = useState("100.00");
  const [currency, setCurrency] = useState("MXN");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");
  const [waysTab, setWaysTab] = useState<"send" | "receive">("send");
  const [wayIndex, setWayIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [footerLocation, setFooterLocation] = useState("United States");
  const [footerOpen, setFooterOpen] = useState<string | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setCtaVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const numericAmount = Math.max(0, Number(amount) || 0);
  const rate = currency === "MXN" ? 17.9977 : currency === "INR" ? 83.47 : currency === "GTQ" ? 7.67 : currency === "PHP" ? 56.8 : currency === "USD" ? 1 : 0.92;
  const currencies = [{code:"MXN",name:"Mexico",flag:mxFlag.url},{code:"GTQ",name:"Guatemala",flag:guatemalaFlag.url},{code:"PHP",name:"Philippines",flag:philippinesFlag.url},{code:"USD",name:"Philippines",flag:philippinesFlag.url},{code:"INR",name:"India",flag:inFlag.url},{code:"EUR",name:"Europe",flag:euFlag.url}];
  const selectedCurrencyFlag = currencies.find(item=>item.code === currency && (currency !== "USD" || item.name === "Philippines"))?.flag ?? mxFlag.url;
  const receiverAmount = (numericAmount * rate).toFixed(2);
  const wayCards = waysTab === "send" ? [
    { title: "Send online", text: <> <a className="text-link underline" href={loginUrl}>Log in</a> or <a className="text-link underline" href={registerUrl}>sign up</a> and create your free profile to send money online.</>, action: "Send money instantly", link: sendUrl, icon: ArrowUp },
    { title: "Send with our app", text: <>Send money, pay bills, check exchange rates, or start a transfer in the app and pay in-store — all on the go.</>, action: "Download Western Union App", link: `${official}/mobile-app.html`, icon: Smartphone },
    { title: "Send in person", text: <>Reliable money transfer service at thousands of Western Union® US agent locations.</>, action: "Find locations near you", link: `${official}/agent-locator.html`, icon: Store },
  ] : [
    { title: "Receive in a bank account", text: <>Have money sent directly to your bank account from around the world.</>, action: "Learn more", link: `${official}/receive-money.html`, icon: Wallet },
    { title: "Receive with the app", text: <>Keep track of your incoming transfer on the Western Union app.</>, action: "Download the app", link: `${official}/mobile-app.html`, icon: Smartphone },
    { title: "Pick up cash", text: <>Collect your money at a participating Western Union agent location.</>, action: "Find locations near you", link: `${official}/agent-locator.html`, icon: Store },
  ];
  return <main>
    <header className="wu-nav"><div className="wu-shell wu-nav-inner">
      <a href="#top" aria-label="Western Union home"><img src={logo.url} alt="Western Union" className="wu-logo-desktop w-[220px] h-auto" /><img src={wMark.url} alt="Western Union" className="wu-logo-mobile" /></a>
      <nav className="wu-nav-links" aria-label="Primary navigation">
        <a className="wu-desktop" href={sendUrl}>Send money</a>
        <a className="wu-desktop" href={`${official}/track-transfer.html`}>Track a transfer</a>
        <a className="wu-language flex items-center gap-2" href={`${official}/home.html`} aria-label="Language: English"><Globe2 size={26} /> EN</a>
        <Button variant="ghost" size="icon" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={26} /> : <Menu size={26} />}</Button>
        <Action href={loginUrl} className="wu-desktop">Log in</Action>
        <Action href={registerUrl} variant="wuOutline" className="wu-register">Register</Action>
      </nav>
    </div>{menuOpen && <nav className="wu-menu-panel" aria-label="Site menu">
      <div className="wu-menu-auth"><a href={loginUrl} onClick={()=>setMenuOpen(false)}>Log in</a><span aria-hidden="true"/><a href={registerUrl} onClick={()=>setMenuOpen(false)}>Register</a></div>
      <ul>{menuItems.map(item=><li key={item.label}><a href={item.href} onClick={()=>setMenuOpen(false)}><span className="wu-menu-icon" aria-hidden="true"><item.icon size={22} strokeWidth={1.4}/></span>{item.label}</a></li>)}</ul>
    </nav>}</header>
    <section id="top" className="wu-hero"><div className="wu-shell wu-hero-inner">
      <div className="wu-hero-copy"><h1 className="wu-heading">Send money<br className="wu-mobile-break"/> online from the<br className="wu-mobile-break"/><br className="hidden xl:block" /> United States at<br className="wu-mobile-break"/> our best price</h1>
        <div className="wu-intro"><Lightbulb size={29} className="shrink-0 mt-1" strokeWidth={1.8}/><span>Join millions of customers around the world and start sending and receiving money with Western Union.</span></div>
        <div className="wu-trust"><div><div className="font-display font-medium text-[18px] leading-none"><span className="text-teal text-[28px]">★</span>Trustpilot</div><div className="wu-trust-stars">{[1,2,3,4,5].map(i => <span key={i}>★</span>)}</div></div><strong>4.3</strong><span className="wu-trust-divider"/><strong className="leading-6"><span className="wu-trust-desktop">Excellent<br/>169,837+ reviews</span><span className="wu-trust-mobile">Great<br/>112,576+ reviews</span></strong></div>
        <a className="wu-fraud underline underline-offset-2" href={`${official}/fraud-awareness.html`}><ShieldCheck size={23} strokeWidth={1.8} /><span>Smarter. Safer. Together. Learn how to #BeFraudSmart.</span></a>
      </div>
      <div className="wu-quote"><div className="wu-offer"><Gift size={27} strokeWidth={1.5}/><span>Get a <strong>0 USD transfer fee*</strong> on your first online transfer!</span></div>
        <div className="wu-field"><div><label htmlFor="amount">You’re sending</label><input id="amount" aria-label="Amount you are sending in USD" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value.replace(/[^\d.]/g,""))} onBlur={()=>setAmount(numericAmount.toFixed(2))}/></div><span className="wu-currency"><img className="wu-flag" src={usFlag.url} alt="United States"/> USD</span></div>
        <div className="wu-currency-wrap"><div className="wu-field"><div><label htmlFor="currency">Your receiver gets</label><strong className="text-[17px]">{receiverAmount}</strong></div><span className="wu-desktop-currency wu-currency"><img className="wu-flag" src={selectedCurrencyFlag} alt=""/><select id="currency" value={currency} onChange={e=>setCurrency(e.target.value)} aria-label="Receiver currency" className="bg-transparent outline-none">{currencies.map(item=><option key={`${item.code}-${item.name}`} value={item.code}>{item.code}</option>)}</select><ChevronDown size={17}/></span><Button variant="ghost" className="wu-mobile-currency wu-currency" aria-label="Receiver currency" aria-expanded={currencyOpen} onClick={()=>{setCurrencyOpen(!currencyOpen);setCurrencySearch("")}}><img className="wu-flag" src={selectedCurrencyFlag} alt=""/>{currency}<ChevronDown size={17}/></Button></div>{currencyOpen && <div className="wu-currency-menu"><div className="wu-currency-search"><Search size={22}/><input autoFocus aria-label="Search currency" placeholder="Search" value={currencySearch} onChange={e=>setCurrencySearch(e.target.value)}/></div><div className="wu-currency-options">{currencies.filter(item=>`${item.code} ${item.name}`.toLowerCase().includes(currencySearch.toLowerCase())).map(item=><Button variant="ghost" key={`${item.code}-${item.name}`} className="wu-currency-option" onClick={()=>{setCurrency(item.code);setCurrencyOpen(false)}}><img className="wu-flag" src={item.flag} alt=""/>{item.code} - {item.name}</Button>)}</div></div>}</div>
        <div className="wu-summary"><div className="wu-summary-row"><span>Exchange rate</span><span><s className="text-muted-foreground mr-2">17.3417 MXN</s><strong>{rate.toFixed(4)} {currency}</strong></span></div><div className="wu-summary-row"><span>Our fees</span><span><s className="text-muted-foreground">1.99 USD</s> 0.00 USD <strong className="ml-2 bg-mint rounded-full px-3">100% off</strong></span></div><div className="wu-summary-row"><span>Delivery time</span><strong>In minutes</strong></div><div className="wu-summary-row wu-summary-total"><span>Total Amount</span><span>{numericAmount.toFixed(2)} USD</span></div></div>
        <Action href={sendUrl} className="w-full mt-[26px] text-brand">Send now</Action>
        <p className="wu-disclaimer">*Western Union makes money from FX. Fees and rates subject to change without notice. Offer not available for Quick Collect, transfers within the United States, credit cards and Google Pay.</p>
      </div>
    </div></section>
    <section className="wu-benefits"><div className="wu-shell wu-benefits-inner"><div className="wu-benefits-item"><LockKeyhole size={23}/><span>We are committed to keeping your data secured.</span></div><div className="wu-benefits-item"><Tag size={23}/><span>Send money to 200+ countries or territories online or in-store.</span></div><div className="wu-benefits-item"><Wallet size={23}/><span>Reliable service since 1851.</span></div></div></section>
    <section className="wu-ways"><div className="wu-shell"><h2 className="wu-heading wu-section-title">Convenient ways to send and receive money</h2><div className="wu-tabs-wrap"><Button variant="ghost" size="icon" className="wu-tab-arrow" aria-label="Ways to send money" onClick={()=>{setWaysTab("send");setWayIndex(0)}}><ChevronLeft/></Button><div className="wu-tabs" role="tablist" aria-label="Money transfer options"><Button variant="ghost" role="tab" aria-selected={waysTab === "send"} className={`wu-tab rounded-none h-auto font-normal ${waysTab === "send" ? "active" : ""}`} onClick={()=>{setWaysTab("send");setWayIndex(0)}}>Ways to send money</Button><Button variant="ghost" role="tab" aria-selected={waysTab === "receive"} className={`wu-tab rounded-none h-auto font-normal ${waysTab === "receive" ? "active" : ""}`} onClick={()=>{setWaysTab("receive");setWayIndex(0)}}>Ways to receive money</Button></div><Button variant="ghost" size="icon" className="wu-tab-arrow" aria-label="Ways to receive money" onClick={()=>{setWaysTab("receive");setWayIndex(0)}}><ChevronRight/></Button></div><div className="wu-ways-grid">{wayCards.map((card,index)=><article className={`wu-way ${index === wayIndex ? "wu-way-current" : ""}`} key={card.title}><card.icon size={36} strokeWidth={1.6}/><h3>{card.title}</h3><p>{card.text}</p><Action href={card.link} variant="wuYellow" className="mt-auto h-[38px] px-5 text-[14px] max-w-[225px] whitespace-normal text-center">{card.action}</Action></article>)}</div><div className="wu-way-dots" aria-label="Choose transfer option">{wayCards.map((card,index)=><Button key={card.title} variant="ghost" size="icon" aria-label={`Show ${card.title}`} aria-current={index === wayIndex ? "true" : undefined} onClick={()=>setWayIndex(index)}><span/></Button>)}</div></div></section>
    <section className="wu-app"><img className="wu-app-photo" src={appPhoto.url} alt="Western Union app displayed on a smartphone"/><div className="wu-shell"><div className="wu-app-copy"><div className="wu-app-copy-content"><h2 className="wu-heading wu-section-title">Money transfers at your fingertips with the Western Union® app</h2><ul className="wu-app-list"><li><ArrowUp size={33}/>Send money quickly or start a transfer and pay in-store.</li><li><RefreshCcw size={33}/>Track your money transfer in real time.</li><li><Wallet size={33}/>Send again quickly to friends and family.</li></ul><Action href={`${official}/mobile-app.html`}>Download the app</Action><div className="wu-badges"><a href="https://apps.apple.com/us/app/western-union-send-money/id424716908" aria-label="Download on the App Store"><b>4.8 ★★★★★</b><img src={appStore.url} alt="Download on the App Store"/></a><a href="https://play.google.com/store/apps/details?id=com.westernunion.android.mtapp" aria-label="Get it on Google Play"><b>4.6 ★★★★★</b><img src={googlePlay.url} alt="Get it on Google Play"/></a></div><small>Rating as of September 14, 2026</small></div></div></div></section>
    <section className="wu-shell wu-more"><img src={morePhoto.url} alt="Customer at his business counter"/><div><h2 className="wu-heading wu-section-title">Get more with Western Union</h2><p>Bill pay, money orders, prepaid card, mobile top-ups, and much more. Learn more about all the financial services you can depend on.</p><p>Streamline your finances, prepare for the unexpected, and stay connected to those you care about. For everything you do with your money, Western Union is your home for it all, and more.</p><p>One name, many possibilities.</p><Action href={`${official}/money-services.html`} variant="wuOutline" className="min-w-[295px] mt-9">Get more</Action></div></section>
    <aside className="wu-shell wu-referral"><h2 className="wu-heading">Join us today</h2><span>Refer your friends to Western Union and earn exciting rewards for every successful referral.</span><Action href={`${official}/refer-a-friend.html`} variant="wuLightOutline" className="min-w-[200px]">Learn more</Action></aside>
    <section className="wu-rewards"><div className="wu-shell wu-rewards-inner"><img src={rewardsPhoto.url} alt="Mother and child embracing"/><div><h2 className="wu-heading">Western Union <span>Rewards</span></h2><p>Ready to turn your money transfers into rewards? Just log in or register with Western Union, complete your profile and start earning points!</p><div className="wu-reward-cards"><div className="wu-reward-card"><img src={starReward.url} alt=""/><strong>Earn 100 points</strong><small>with every online money transfer.</small></div><div className="wu-reward-card"><img src={discountReward.url} alt=""/>500 points = up to 2 USD discount on money transfer fees.⁵</div><div className="wu-reward-card">Member exclusive deals from brands you love.<img src={giftReward.url} alt="" className="!w-32 !h-32 !mt-8"/></div><img className="wu-reward-mobile-photo" src={rewardsPhoto.url} alt="Mother and child embracing"/></div><div className="wu-reward-actions"><Action href={registerUrl} className="min-w-[225px]">Register</Action><Action href={loginUrl} variant="wuOutline" className="min-w-[225px]">Login</Action></div></div></div></section>
    <section className="wu-deals"><div className="wu-shell"><h2 className="wu-heading text-[40px]">Deals and discounts, just for you <LockKeyhole className="inline float-right" size={31}/></h2><p className="mt-5">Discover offers exclusively selected for Western Union Rewards members.</p><div className="wu-deals-grid">{[{label:"Deal of the week",brand:"▧",name:"Squarespace",offer:"10% Off New Paid Website Sub...",detail:"Save 10% on new paid subscriptions for the website product. This offer is..."},{label:"Trending",brand:"◉ NordVPN",name:"NordVPN",offer:"NordVPN 70% Off for 2 Years ...",detail:"NordVPN offers secure and reliable online protection with discounted..."},{label:"Trending",brand:"↗",name:"Amazon Music Affiliate Program",offer:"30-Day Free Trial of Amazon M...",detail:"Enjoy a 30-day free trial of Amazon Music Unlimited to explore its extensiv..."},{label:"",brand:"deferit",name:"Deferit",offer:"Deferit pays your bill now. You ...",detail:"Get up to $500 for bills right now. Pay it back later, in 4 smaller payments."}].map((item,index)=><article className="wu-deal" key={item.name}><div className="wu-deal-label">{item.label || " "}</div><div className="wu-deal-logo"><span className="wu-deal-logo-desktop">{index===0?<img src={squarespaceLogo.url} alt="Squarespace"/>:index===1?<img className="wu-deal-logo-nordvpn" src={nordvpnLogo.url} alt="NordVPN"/>:index===2?<img src={amazonLogo.url} alt="Amazon"/>:index===3?<img className="wu-deal-logo-deferit" src={deferitLogo.url} alt="Deferit"/>:item.brand}</span><span className={`wu-deal-logo-mobile wu-deal-brand-${index}`}>{index===0?<img src={squarespaceLogo.url} alt="Squarespace"/>:index===1?<img className="wu-deal-logo-nordvpn" src={nordvpnLogo.url} alt="NordVPN"/>:index===2?<img src={amazonLogo.url} alt="Amazon"/>:index===3?<img className="wu-deal-logo-deferit" src={deferitLogo.url} alt="Deferit"/>:<strong>deferit➤</strong>}</span></div><div className="wu-deal-body">{item.name}<strong className="truncate">{item.offer}</strong><p>{item.detail}</p></div></article>)}</div><Action href={`${official}/rewards.html`} variant="wuOutline" className="min-w-[235px]">View all offers</Action></div></section>
    <aside className="wu-shell wu-pickup"><Wallet size={60} className="text-brand shrink-0"/><div className="flex-1"><h2 className="wu-heading">Send money online, available for pickup in minutes⁵</h2><p>Simply transfer money to an agent location, and your recipient can collect the cash within minutes.</p></div><Action href={sendUrl} variant="wuLightOutline" className="min-w-[225px]">Send now</Action></aside>
    <section className="wu-shell wu-reasons"><img src={reasonsPhoto.url} alt="Customer checking her phone outdoors"/><div><h2 className="wu-heading wu-section-title">Our customers made millions of money transfers with Western Union last year. Here’s why:</h2><div className="wu-reasons-grid"><div><Tag size={34}/><h3>Ease and convenience</h3><p>Send and receive money the way that’s convenient for you: online, with our app, or in person at an agent location.</p></div><div><ShieldCheck size={34}/><h3>Commitment to security</h3><p>Our encryption and fraud prevention efforts help protect your Western Union® money transfers.</p></div><div><Globe2 size={34}/><h3><span className="wu-reason-desktop">Global reach</span><span className="wu-reason-mobile">We’re international</span></h3><p><span className="wu-reason-desktop">Send money to loved ones around the world.</span><span className="wu-reason-mobile">We transfer money from the US to over 200 countries and territories.</span></p></div><div><BadgeCheck size={34}/><h3>Trusted service</h3><p>Reliable money transfers for generations.</p></div></div><Action href={sendUrl} className="wu-reasons-action text-brand">Get started</Action></div></section>
    <section className="wu-review"><h2 className="wu-heading wu-section-title">Review us on Trustpilot!</h2><p className="my-7 text-[17px]">Help us improve your experience by giving us a review today.</p><Action href="https://www.trustpilot.com/review/www.westernunion.com" variant="wuYellow">Leave review</Action></section>
    <section className="wu-shell wu-faq"><h2 className="wu-heading wu-section-title">Frequently asked questions</h2>{[{q:"How can I send someone money immediately?",a:"You can send and receive money quickly with Western Union using our website, mobile app, or in person at an agent location. Many transfers may be available for pickup in minutes, depending on service type, destination, and receiver method."},{q:"How do I send money to someone with Western Union?",a:"Register or log in, choose the destination and amount, enter your receiver’s details, then review and pay for your transfer."},{q:"Does Western Union have a digital wallet?",a:"The Western Union app is a money transfer app allowing you to send money, track transfers, and pay bills."}].map(item=><details key={item.q}><summary><span>+</span>{item.q}</summary><p>{item.a}</p></details>)}</section>
    <section className="wu-legal-notes"><div className="wu-shell">
      <p><sup>1</sup>Fee reductions apply only to the Western Union transfer fee for a single Western Union Money Transfer. Excludes all other services. Cannot be combined with other Western Union promotional offers.</p>
      <p><sup>2</sup> Western Union also makes money from currency exchange. When choosing a money transmitter, carefully compare both transfer fees and exchange rates. Fees, foreign exchange rates and taxes may vary by brand, channel, and location based on a number of factors. Fees and rates subject to change without notice.</p>
      <p><sup>3</sup> If you’re using a credit card, a card-issuer cash advance fee and associated interest charges may apply. To avoid these fees or for reduced fees, use a debit card or check other payment methods.</p>
      <p><sup>4</sup> Funds may be delayed or services unavailable based on certain transaction conditions, including amount sent, destination country, currency availability, regulatory issues, identification requirements, Agent location hours, differences in time zones, or selection of delayed options. For mobile transactions funds will be paid to receiver’s mWallet account provider for credit to account tied to receiver’s mobile number. Additional third-party charges may apply, including SMS and account over-limit and cash-out fees. See the transfer form for restrictions.</p>
      <p><em>Please contact Upwardli at <a href="mailto:support@upwardli.zendesk.com">support@upwardli.zendesk.com</a> for a complete list of states where credit building services are available.</em></p>
    </div></section>
    <footer className="wu-footer"><div className="wu-shell">
      <section className="wu-footer-directory" aria-labelledby="wu-directory-title"><h2 id="wu-directory-title" className="wu-heading">Can’t find what you’re looking for?</h2><div className="wu-footer-directory-grid">{footerGroups.map(group=><div className="wu-footer-directory-column" key={group.title}><h3><Button variant="ghost" className="wu-footer-directory-toggle" aria-expanded={footerOpen === group.title} onClick={()=>setFooterOpen(footerOpen === group.title ? null : group.title)}><ChevronDown size={24}/>{group.title}</Button></h3><ul className={footerOpen === group.title ? "wu-footer-directory-open" : ""}>{group.links.map(label=><li key={label}><a href={footerHrefs[label] ?? `${official}/home.html`}>{label}</a></li>)}</ul></div>)}</div></section>
      <section className="wu-footer-worldwide" aria-labelledby="wu-worldwide-title"><h2 id="wu-worldwide-title" className="wu-heading">We transfer world-wide</h2><p>Send money online to 200 countries and territories with hundreds of thousands of Western Union agent locations.</p><div className="wu-footer-destinations"><label className="wu-footer-location"><span>Your location</span><span className="wu-footer-location-value"><img src={footerFlags[footerLocation]} alt=""/> {footerLocation} <ChevronDown aria-hidden="true" size={25}/></span><select aria-label="Your location" value={footerLocation} onChange={e=>setFooterLocation(e.target.value)}><option>United States</option><option>India</option><option>Mexico</option><option>Pakistan</option><option>China</option></select></label><div className="wu-footer-popular"><span>POPULAR DESTINATIONS</span><div className="wu-footer-destination-list">{[{name:"India",flag:indiaFlag.url},{name:"Mexico",flag:mxFlag.url},{name:"Pakistan",flag:pakistanFlag.url},{name:"China",flag:chinaFlag.url}].map(destination=><Button key={destination.name} asChild variant="ghost" className="wu-footer-destination"><a href={sendUrl} aria-label={`Send money to ${destination.name}`}><img src={destination.flag} alt=""/><span>{destination.name}</span><ArrowRight size={23} strokeWidth={1.5}/></a></Button>)}</div></div></div></section>
      <section className="wu-footer-connect" aria-label="Important pages and social media"><div><h3>IMPORTANT PAGES</h3><div className="wu-footer-links">{["Home","About us","Contact us","Fraud awareness","Online Privacy Statement","Your Privacy Choices","Terms & Conditions","Ad Choices","Cookie Information","Law Enforcement Assistance"].map((label,i)=><a key={label} href={i===0?"#top":`${official}/${["","about-us.html","contact-us.html","fraud-awareness.html","privacy-statement.html","privacy-choices.html","terms-conditions.html","ad-choices.html","cookie-information.html","law-enforcement.html"][i]}`}>{label}</a>)}</div></div><div className="wu-footer-social"><h3>FIND US ON SOCIAL</h3><div><a aria-label="Facebook" href="https://www.facebook.com/WesternUnion"><img src={socialFacebook} alt="" width={27} height={27}/></a><a aria-label="YouTube" href="https://www.youtube.com/user/WesternUnion"><img src={socialYoutube} alt="" width={27} height={27}/></a><a aria-label="Instagram" href="https://www.instagram.com/westernunion/"><img src={socialInstagram} alt="" width={27} height={27}/></a><a aria-label="X" href="https://x.com/WesternUnion"><img src={socialX} alt="" width={27} height={27}/></a></div></div></section>
      <div className="wu-footer-bottom"><img src={footerLogo.url} alt="Western Union" className="w-[295px]"/><div><p>Services may be provided by Western Union Financial Services, Inc. NMLS# 906983 and/or Western Union International Services, LLC NMLS# 906985. These licensed companies may be verified through the NMLS Consumer Access website<span className="wu-footer-mobile-link"> - <a href="https://www.nmlsconsumeraccess.org/">https://www.nmlsconsumeraccess.org/</a></span>.</p><p>Western Union Financial Services, Inc. and Western Union International Services, LLC are licensed as Money Transmitters by the New York State Department of Financial Services. See terms and conditions for details.</p><p className="wu-footer-mobile-footnote"><sup>1</sup>Fee reductions apply only to the Western Union transfer fee for a single Western Union Money Transfer. Excludes all other services. Cannot be combined with other Western Union promotional offers.</p><p className="mt-12 wu-copyright">© 2026 Western Union Holdings, Inc. All Rights Reserved</p></div></div>
    </div></footer>
    <div className={`wu-mobile-cta ${ctaVisible ? "wu-mobile-cta-visible" : ""}`}><Action href={sendUrl} className="w-full text-brand">Start now</Action></div>
  </main>;
}
