"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";

const photos = [
  { image: "/images/family-home.webp", alt: "A family sharing a happy moment outside their home", className: "photo-one", rotation: -11, label: "A place to belong." },
  { image: "/images/moving-day.webp", alt: "A family carrying boxes into their new home", className: "photo-two", rotation: 10, label: "Room for what’s next." },
  { image: "/images/home-detail.webp", alt: "The small details that make a house feel like home", className: "photo-three", rotation: -8, label: "A fresh start." },
];

function FloatingPhoto({ photo, progress }: { photo: typeof photos[number]; progress: MotionValue<number> }) {
  const index = photos.indexOf(photo);
  const delay = index * .045;
  // Each print follows its own continuous downward arc, rather than converging
  // on a single point. One shared spring keeps the entire composition in sync.
  const travel = useTransform(progress, value => {
    const t = Math.max(0, Math.min(1, (value - delay) / .76));
    return t * t * (3 - 2 * t);
  });
  const x = useTransform(travel, t => `${Math.sin(t * Math.PI) * [7, -9, 5][index]}vw`);
  const y = useTransform(travel, t => `${t * [78, 66, 48][index]}vh`);
  const rotate = useTransform(travel, t => photo.rotation + Math.sin(t * Math.PI * 1.4) * [13, -15, 11][index]);
  const rotateX = useTransform(travel, t => Math.sin(t * Math.PI) * [12, -9, 8][index]);
  const rotateY = useTransform(travel, t => Math.sin(t * Math.PI * 1.5) * [-9, 12, -7][index]);
  const scale = useTransform(travel, [0, .42, 1], [1, [1.16, .94, 1.12][index], .92]);
  const opacity = useTransform(progress, [.58 + delay, .82 + delay], [1, 0]);
  return <motion.figure className={`floating-photo ${photo.className}`} style={{ x, y, rotate, rotateX, rotateY, scale, opacity, transformPerspective: 1000 }}>
    <Image src={photo.image} alt={photo.alt} fill sizes="(max-width: 600px) 28vw, 19vw" priority unoptimized />
    <figcaption>{photo.label}</figcaption>
  </motion.figure>;
}

export function ScrollStory() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: rawProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scrollYProgress = useSpring(rawProgress, { stiffness: 110, damping: 30, mass: .45, restDelta: .0001 });
  const textY = useTransform(scrollYProgress, [0, .47], [0, -180]);
  const textOpacity = useTransform(scrollYProgress, [.1, .4], [1, 0]);
  const familyY = useTransform(scrollYProgress, [.18, .75], ["65vh", "0vh"]);
  const familyScale = useTransform(scrollYProgress, [.18, .75], [.55, 1]);
  const familyOpacity = useTransform(scrollYProgress, [.22, .5], [0, 1]);
  const captionOpacity = useTransform(scrollYProgress, [.62, .86], [0, 1]);
  return <section ref={ref} id="top" className={`scroll-story ${reduced ? "story-reduced" : ""}`}>
    <div className="story-stage">
      <div className="atmosphere" aria-hidden="true" />
      <motion.div className="story-heading" style={reduced ? {} : { y: textY, opacity: textOpacity }}>
        <p className="intro-pill"><span /> A Michigan team. A more personal closing.</p>
        <h1>Good things<br/>start with <em>home.</em></h1>
        <p className="hero-subtitle">The first keys. The next chapter. The place that’s yours.<br/>We handle the title and closing. You make it home.</p>
        <div className="hero-ctas"><a className="button button-primary" href="https://vtclosings.com/order-title/">Let’s make it yours <ArrowUpRight size={18}/></a><a className="quiet-link" href="#difference">Meet Venture <ArrowUpRight size={17}/></a></div>
        <a className="scroll-invitation" href="#difference"><span>EVERY PIECE COMES TOGETHER</span><ArrowDown size={17}/></a>
      </motion.div>
      {!reduced && photos.map(photo => <FloatingPhoto key={photo.className} photo={photo} progress={scrollYProgress}/>)}
      <motion.div className="family-reveal" style={reduced ? {} : { y: familyY, scale: familyScale, opacity: familyOpacity }}>
        <Image src="/images/family-home.webp" alt="A happy family together in front of their home" fill priority sizes="(max-width: 600px) 94vw, 78vw" unoptimized />
        <div className="family-shade"/>
        <motion.div className="family-caption" style={reduced ? {} : { opacity: captionOpacity }}><span className="picture-label"><Check size={14}/> ALL THE DETAILS. ONE BEAUTIFUL BEGINNING.</span><h2>For everything<br/>that comes <em>after.</em></h2><p>This is why we do what we do.</p></motion.div>
      </motion.div>
      {!reduced && <motion.div className="story-endnote" style={{ opacity: captionOpacity }}>YOUR LIFE. YOUR HOME. OUR CARE.</motion.div>}
    </div>
  </section>;
}
