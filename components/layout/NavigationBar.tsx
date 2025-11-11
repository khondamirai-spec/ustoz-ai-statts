"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navigationLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/#regions", label: "Viloyatlar" },
  { href: "/#courses", label: "Kurslar" },
  { href: "/#statistics", label: "Statistikalar" },
];

export function NavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const updateHash = () => {
      setActiveHash(window.location.hash);
    };

    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => {
      window.removeEventListener("hashchange", updateHash);
    };
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      setActiveHash("");
    }
  }, [pathname]);

  return (
    <nav className="app-nav">
      <div className="app-nav__inner">
        <div className="app-nav__brand">
          <Link
            href="/"
            className="app-nav__brand-link"
            aria-label="AF Ustoz AI"
            onClick={() => setActiveHash("")}
          >
            <Image
              src="/icon/icon.png"
              alt="AF Ustoz AI logo"
              width={192}
              height={192}
              className="app-nav__brand-icon"
              quality={100}
              priority
            />
          </Link>
        </div>

        <div className="app-nav__links" role="navigation" aria-label="Primary">
          {navigationLinks.map((link) => {
            const linkHash = link.href.includes("#")
              ? link.href.slice(link.href.indexOf("#"))
              : "";
            const isPageLink = !linkHash;
            const isRootLink = link.href === "/";
            let isActive =
              (isPageLink &&
                (pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href)))) ||
              (!isPageLink && activeHash === linkHash);

            if (isRootLink) {
              isActive = pathname === "/" && activeHash === "";
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className="app-nav__link"
                aria-current={isActive ? "page" : undefined}
                onClick={(event) => {
                  if (!linkHash) {
                    if (pathname === "/") {
                      event.preventDefault();
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                      setActiveHash("");
                      window.history.replaceState(null, "", "/");
                    } else {
                      setActiveHash("");
                    }
                    return;
                  }

                  event.preventDefault();

                  if (pathname !== "/") {
                    router.push(link.href);
                    return;
                  }

                  const target = document.querySelector(linkHash);
                  if (target instanceof HTMLElement) {
                    target.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                    window.history.replaceState(null, "", link.href);
                    setActiveHash(linkHash);
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="app-nav__actions">
          <div className="app-nav__search">
            <svg
              className="app-nav__search-icon"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9.167 2.5a6.667 6.667 0 1 1 0 13.334 6.667 6.667 0 0 1 0-13.334Zm0 1.667a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"
                fill="currentColor"
                opacity="0.65"
              />
              <path
                d="M14.125 13.041 17.084 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.85"
              />
            </svg>
            <input
              type="search"
              placeholder="Search dashboards"
              className="app-nav__search-input"
              aria-label="Search dashboards"
            />
            <kbd className="app-nav__search-kbd">⌘K</kbd>
          </div>

          <button type="button" className="app-nav__avatar" aria-label="Open profile menu">
            <span className="app-nav__avatar-initials">UA</span>
          </button>
        </div>
      </div>
    </nav>
  );
}


