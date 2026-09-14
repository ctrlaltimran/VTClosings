"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { motion, useInView, useReducedMotion, useScroll } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, House, Landmark, Menu, Moon, Phone, ShieldCheck, Sun, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollStory } from "./scroll-story";
import { journeys, steps } from "./journey-data";

const Scene = dynamic(() => import("./closing-scene"), { ssr: false, loading: () => <div className="model-loading"><House size={30}/><span>A strong foundation.</span></div> });
const orderUrl = "https://vtclosings.com/order-title/";
const reviewUrl = "https://wanderlog.com/place/details/12565921/venture-title-agency";

function Brand() {
  return <a className="brand" href="#top" aria-label="Venture Title Agency home"><span className="brand-mark">v.</span><span>venture<small>TITLE AGENCY</small></span></a>;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ y: reduced ? 0 : 25 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: .75, ease: [.2,.65,.2,1] }}>{children}</motion.div>;
}

function ClosingJourney() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { margin: "150px" });
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  useEffect(() => { if (visible) setLoaded(true); }, [visible]);
  return <section ref={ref} id="process" className="process-section">
    <div className="shell process-grid">
      <div className="process-intro"><p className="eyebrow">A LITTLE GUIDANCE GOES A LONG WAY</p><h2>From “it’s the one”<br/>to <em>“it’s ours.”</em></h2><p>Five steps. One team beside you.<br/>We’ll keep the path ahead clear.</p><span className="model-note"><ShieldCheck size={16}/> A clear title. A strong foundation.</span></div>
      <div className="model-stage" role="group" aria-label="Interactive home model with a light switch">{loaded && <Scene reduced={!!reduced || !visible}/>}</div>
      <div className="process-steps"><div className="process-line"><motion.span style={{ scaleY: reduced ? 1 : scrollYProgress }}/></div>{steps.map((step,i) => <div className={`process-step ${active === i ? "active" : ""}`} key={step.label}><button aria-expanded={active === i} aria-controls={`step-${i}`} onClick={() => setActive(i)}><span className="step-number">0{i+1}</span><span><small>{step.label}</small><strong>{step.title}</strong></span><ChevronRight size={19}/></button><div className="process-answer" id={`step-${i}`} hidden={active !== i}><p>{step.text}</p>{i===4 && <a href={orderUrl} className="quiet-link">Start your own story <ArrowUpRight size={17}/></a>}</div></div>)}</div>
    </div>
  </section>;
}

export function HomePage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [contact, setContact] = useState(false);
  useEffect(() => { setMounted(true); const update = () => setScrolled(window.scrollY > 24); update(); window.addEventListener("scroll",update,{ passive: true }); return () => window.removeEventListener("scroll",update); }, []);
  const dark = mounted && resolvedTheme === "dark";

  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-wrap"><Brand/><nav className="desktop-nav" aria-label="Main navigation"><a href="#difference">Our difference</a><a href="#journey">Your journey</a><a href="#process">How it works</a></nav><div className="nav-actions"><button className="theme-toggle" aria-label={`Switch to ${dark ? "light" : "dark"} mode`} onClick={() => setTheme(dark ? "light" : "dark")}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button><button className="contact-nav" onClick={() => setContact(true)}>Let’s talk</button><a className="nav-order" href={orderUrl}>Order Title <ArrowUpRight size={16}/></a><button className="menu-toggle" aria-label="Toggle menu" aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => setMenu(!menu)}>{menu ? <X size={21}/> : <Menu size={21}/>}</button></div></div>
      {menu && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{[["Our difference","#difference"],["Your journey","#journey"],["How it works","#process"]].map(([text,href]) => <a href={href} key={href} onClick={() => setMenu(false)}>{text}<ArrowUpRight size={17}/></a>)}<button onClick={() => { setMenu(false); setContact(true); }}>Let’s talk <ArrowUpRight size={17}/></button></nav>}
    </header>
    <main id="main">
      <ScrollStory/>
      <section id="difference" className="difference-section shell">
        <Reveal className="editorial-intro"><p className="eyebrow">TITLE INSURANCE. ESCROW. CLOSINGS. PEOPLE.</p><h2>A big life moment.<br/><span>A thousand little details.</span><br/>We’re here for <em>both.</em></h2><p>Buying a home should feel like a beginning, not a question mark. We’re the people behind the paperwork—bringing care, clarity, and a steady hand to your Michigan closing.</p></Reveal>
        <div className="difference-grid"><Reveal className="margin-note"><span className="note-star">✳</span><h3>Why thousands<br/>trust Venture.</h3><p>It isn’t just what we do.<br/>It’s how we make you feel.</p><a className="quiet-link" href="#stories">A few words from our clients <ArrowDown size={16}/></a></Reveal><Accordion type="single" defaultValue="care" collapsible className="difference-accordion">{[
          { value:"care",number:"01",title:"Real people. Actually there.",text:"A familiar voice when you call. A clear answer when you ask. One dedicated point of contact who knows your transaction and cares where it’s going." },
          { value:"precision",number:"02",title:"The details don’t slip by.",text:"We take a careful look at the property’s title history, coordinate requirements, and prepare your closing documents. The small things deserve our full attention." },
          { value:"experience",number:"03",title:"A steady hand, start to finish.",text:"Our team has handled thousands of closings. We bring that experience to yours, helping you understand what comes next and feel ready when it does." },
        ].map(item => <AccordionItem value={item.value} key={item.value}><AccordionTrigger><span className="row-index">{item.number}</span><span>{item.title}</span></AccordionTrigger><AccordionContent><p>{item.text}</p></AccordionContent></AccordionItem>)}</Accordion></div>
      </section>

      <section id="journey" className="journey-section"><div className="shell"><Reveal className="section-heading"><p className="eyebrow">THERE’S A PLACE FOR YOU HERE</p><h2>Different journeys.<br/>The same <em>good hands.</em></h2></Reveal><Tabs defaultValue="Buyers" className="journey-tabs"><TabsList className="journey-tab-list" aria-label="Choose your journey">{journeys.map(j => <TabsTrigger key={j.title} value={j.title}>{j.title}<ArrowUpRight size={16}/></TabsTrigger>)}</TabsList>{journeys.map((j,i) => <TabsContent key={j.title} value={j.title} className="journey-content"><div className="journey-photo"><Image src={i===0||i===1 ? "/images/moving-day.webp" : "/images/home-detail.webp"} alt={i===0||i===1 ? "Family settling into a new home" : "House keys ready for a new beginning"} fill sizes="(max-width: 700px) 90vw, 45vw" unoptimized/><span className="photo-tag">YOUR NEXT CHAPTER ↗</span></div><div className="journey-copy"><span className="journey-kicker">FOR {j.title.toUpperCase()}</span><h3>{j.intro}</h3><p>{j.body}</p><ul>{j.points.map(point => <li key={point}><Check size={17}/>{point}</li>)}</ul><a className="button button-primary" href={orderUrl}>Let’s get started <ArrowUpRight size={18}/></a></div></TabsContent>)}</Tabs></div></section>

      <ClosingJourney/>

      <section id="stories" className="stories-section shell"><Reveal className="section-heading"><p className="eyebrow">GOOD CLOSINGS. EVEN BETTER FEELINGS.</p><h2>Don’t just take<br/><em>our word for it.</em></h2></Reveal><div className="testimonials"><div className="main-quote"><span className="quote-symbol">“</span><blockquote>They made the process seamless and stress-free!</blockquote><div className="quote-credit"><span className="initial">Z</span><p>Zina M.<small>Client review · July 2025</small></p><a href={reviewUrl} target="_blank" rel="noreferrer" aria-label="Read Zina’s review"><ArrowUpRight size={22}/></a></div></div><div className="side-quotes"><article><span className="little-star">✳</span><blockquote>“Every question I had was answered quickly and thoroughly”</blockquote><p>M J <span>· July 2025</span></p></article><article><span className="little-star">✳</span><blockquote>“it was seamless and stress free.”</blockquote><p>Hailey H <span>· November 2025</span></p></article></div></div><div className="trust-facts"><div><strong>Thousands.</strong><span>of closings handled by our team</span></div><div><strong>Michigan.</strong><span>our home, and where we work</span></div><div><strong>One team.</strong><span>on your side, all the way through</span></div></div><div className="partners"><p>A local team.<br/><strong>National peace of mind.</strong></p><a href="https://www.firstam.com/" target="_blank" rel="noreferrer" className="first-american"><Landmark size={34} strokeWidth={1}/><span>First American<small>TITLE INSURANCE COMPANY</small></span></a><a href="https://wfgtitle.com/" target="_blank" rel="noreferrer" className="wfg">WFG<span>NATIONAL TITLE<br/>INSURANCE COMPANY</span></a></div></section>

      <section id="contact" className="closing-invitation"><div className="invitation-glow"/><div className="shell"><p className="eyebrow">WHENEVER YOU’RE READY. WE ARE TOO.</p><h2>Your next chapter<br/>looks <em>good on you.</em></h2><p>Let’s get you there with confidence.</p><div className="invitation-actions"><a className="button button-primary" href={orderUrl}>Begin your closing <ArrowUpRight size={18}/></a><button className="quiet-link" onClick={() => setContact(true)}>First, let’s talk <ArrowRight size={17}/></button></div><a className="phone-link" href="tel:+13134860100"><Phone size={15}/> (313) 486-0100</a></div></section>
    </main>
    <footer className="shell"><div className="footer-top"><div className="footer-brand"><Brand/><p>The people behind<br/>your next beginning.</p></div><div className="footer-links"><span>GET TO KNOW US</span><a href="#difference">Our difference</a><a href="#journey">Your journey</a><a href="#process">How it works</a><a href={orderUrl}>Order Title <ArrowUpRight size={14}/></a></div><div className="footer-links"><span>COME SAY HELLO</span><a href="https://www.google.com/maps/search/?api=1&query=22300+West+Village+Drive+Dearborn+MI+48124" target="_blank" rel="noreferrer">22300 West Village Drive<br/>Dearborn, MI 48124</a><a href="tel:+13134860100">(313) 486-0100</a><a href="https://www.linkedin.com/company/venture-title-agency-llc" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14}/></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Venture Title Agency</span><a href="https://vtclosings.com/privacy-policy/">Privacy Policy</a><a href="#top">Back to the beginning ↑</a></div><div className="footer-word" aria-hidden="true">venture<span>↗</span></div></footer>
    <Dialog open={contact} onOpenChange={setContact}><DialogContent className="contact-dialog"><p className="eyebrow">GOOD THINGS START WITH HELLO.</p><DialogTitle>Tell us what’s <em>next.</em></DialogTitle><DialogDescription>A first home, a fresh start, or a question about closing. We’d love to help.</DialogDescription><a className="contact-phone" href="tel:+13134860100"><Phone size={22}/><span>(313) 486-0100<small>Speak with the Venture team</small></span><ArrowUpRight size={20}/></a><p className="contact-address">22300 West Village Drive<br/>Dearborn, MI 48124</p><a className="button button-primary" href="https://vtclosings.com/contact/">Send us a message <ArrowUpRight size={18}/></a></DialogContent></Dialog>
  </>;
}
