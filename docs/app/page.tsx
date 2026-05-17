"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

// parsed through a react formatter :D

export default function Home() {
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const parallax = useRef({ x: 0, y: 0 });
  const zooming = useRef(false);
  const cooldown = useRef(false);

  const applyTransform = useCallback(() => {
    const { x, y } = parallax.current;
    const scale = zooming.current ? 1.25 : 1;
    if (contentRef.current) {
      contentRef.current.style.transform = `translate(${x * 20}px, ${
        y * 20
      }px) scale(${scale})`;
    }
    if (bgRef.current) {
      const bgScale = zooming.current ? 1.25 : 1;
      bgRef.current.style.transform = `translate(${x * 30}px, ${
        y * 30
      }px) scale(${bgScale})`;
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      parallax.current.x = e.clientX / window.innerWidth - 0.5;
      parallax.current.y = e.clientY / window.innerHeight - 0.5;
      applyTransform();
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [applyTransform]);

  const handleBtnEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!contentRef.current || cooldown.current) return;
      const btn = e.currentTarget;
      const originX = btn.offsetLeft + btn.offsetWidth / 2;
      const originY = btn.offsetTop + btn.offsetHeight / 2;
      contentRef.current.style.transformOrigin = `${originX}px ${originY}px`;
      zooming.current = true;
      applyTransform();
    },
    [applyTransform]
  );

  const handleBtnLeave = useCallback(() => {
    zooming.current = false;
    cooldown.current = true;
    applyTransform();
    setTimeout(() => {
      cooldown.current = false;
    }, 100);
  }, [applyTransform]);

  return (
    <div className="h-dvh overflow-hidden relative flex items-center justify-center">
      <div ref={bgRef} className="parallax-bg" />
      <div
        ref={contentRef}
        className="relative z-10 flex flex-row gap-4 items-center"
        style={{
          transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
          willChange: "transform",
        }}
      >
        <Image
          src="/icon-128.png"
          alt="Macondo+ Logo"
          width={128}
          height={128}
        />
        <a
          href="https://chromewebstore.google.com/detail/macondo+/ldhbamehlholbmcfmihlhagjpdkmjlgo"
          target="_blank"
          className="btn"
          onMouseEnter={handleBtnEnter}
          onMouseLeave={handleBtnLeave}
        >
          Chrome Web Store
        </a>
        <a
          href="https://addons.mozilla.org/en-US/firefox/addon/macondo/"
          target="_blank"
          className="btn"
          onMouseEnter={handleBtnEnter}
          onMouseLeave={handleBtnLeave}
        >
          Firefox Add-ons
        </a>
        <a
          href="https://github.com/SabioOfficial/MacondoPlus/"
          target="_blank"
          className="btn"
          onMouseEnter={handleBtnEnter}
          onMouseLeave={handleBtnLeave}
        >
          GitHub
        </a>
        <p className="flex flex-row gap-2">
          by{" "}
          <a
            href="https://hackclub.enterprise.slack.com/team/U088Z65TDRN"
            target="_blank"
            className="flex flex-row gap-1.25 underline"
          >
            <Image src="/sabio.png" alt="Sabio PFP" width={24} height={24} />
            Sabio
          </a>
        </p>
      </div>
    </div>
  );
}
