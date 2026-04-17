import { useEffect, useState } from 'react';
import { Link, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import DemoPage from './pages/DemoPage.jsx';
import HomePage from './pages/HomePage.jsx';
import { footerLinks, navItems, siteMeta } from './content.js';

function isInternalLink(href) {
  return href.startsWith('/');
}

function isNavItemActive(location, href) {
  if (href === '/demo') {
    return location.pathname === '/demo';
  }

  if (href.startsWith('/#')) {
    return location.pathname === '/' && location.hash === href.slice(1);
  }

  return location.pathname === href;
}

function HashScroller() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0 });
      return;
    }

    const id = location.hash.replace('#', '');
    const timer = window.setTimeout(() => {
      const target = document.getElementById(id);

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);

    return () => window.clearTimeout(timer);
  }, [location]);

  return null;
}

const NAV_ICONS = {
  '/#muammo': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  '/#jamoa': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  '/#nega-biz': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  '/#yol-xaritasi': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/>
      <line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  ),
  '/#amalga-oshirish': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  '/demo': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
};

const NAV_DESCRIPTIONS = {
  '/#muammo': 'Biznes muammolar tahlili',
  '/#jamoa': 'Loyiha jamoasi haqida',
  '/#nega-biz': 'Bizning afzalliklarimiz',
  '/#yol-xaritasi': 'Rivojlanish rejasi',
  '/#amalga-oshirish': 'Amalga oshirish bosqichlari',
  '/demo': 'Interaktiv demo sahifa',
};

function SiteHeader() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.classList.toggle('body--menu-open', isOpen);

    return () => {
      document.body.classList.remove('body--menu-open');
    };
  }, [isOpen]);

  return (
    <>
      <header className="topbar">
        <div className="shell topbar__inner">
          <Link className="brand" to="/">
            <img src="/logo2.png" alt="Bug Slayers Logo" className="brand__logo" />
            <span className="brand__text">
              <strong>{siteMeta.name}</strong>
              <small>SafeChain Platform</small>
            </span>
          </Link>

          <nav className="nav nav--desktop" aria-label="Asosiy navigatsiya">
            {navItems.map((item) => {
              const isActive = isNavItemActive(location, item.href);

              return (
                <Link
                  key={item.href}
                  className={`nav__link ${isActive ? 'nav__link--active' : ''}`}
                  to={item.href}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="topbar__actions">
            <a className="button button--ghost" href={`mailto:${siteMeta.contactEmail}`}>
              Aloqa
            </a>
            <button
              type="button"
              className={`menu-toggle ${isOpen ? 'menu-toggle--active' : ''}`}
              onClick={() => setIsOpen((value) => !value)}
              aria-label={isOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
            >
              <span className="menu-toggle__line" />
              <span className="menu-toggle__line" />
              <span className="menu-toggle__line" />
              <span className="menu-toggle__glow" />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-nav ${isOpen ? 'mobile-nav--open' : ''}`} id="mobile-nav">
        <button
          type="button"
          className="mobile-nav__backdrop"
          onClick={() => setIsOpen(false)}
          aria-label="Menyuni yopish"
          tabIndex={isOpen ? 0 : -1}
        />

        <div className="mobile-nav__panel">
          {/* Close button */}
          <button
            type="button"
            className="mobile-nav__close"
            onClick={() => setIsOpen(false)}
            aria-label="Menyuni yopish"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Header */}
          <div className="mobile-nav__header">
            <div className="mobile-nav__brand-row">
              <img src="/logo2.png" alt="Bug Slayers Logo" className="mobile-nav__brand-logo" />
              <div>
                <p className="mobile-nav__eyebrow">Navigatsiya</p>
                <strong className="mobile-nav__title">{siteMeta.name}</strong>
              </div>
            </div>
            <p className="mobile-nav__subtitle">SafeChain nazorat platformasi</p>
          </div>

          {/* Divider */}
          <div className="mobile-nav__divider" />

          {/* Navigation list */}
          <nav className="mobile-nav__list" aria-label="Mobil navigatsiya">
            {navItems.map((item, index) => {
              const isActive = isNavItemActive(location, item.href);
              const isDemo = item.href === '/demo';

              return (
                <Link
                  className={`mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''} ${isDemo ? 'mobile-nav__link--demo' : ''}`}
                  to={item.href}
                  key={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  style={{ '--item-index': index }}
                >
                  <span className="mobile-nav__link-icon">
                    {NAV_ICONS[item.href]}
                  </span>
                  <span className="mobile-nav__link-content">
                    <span className="mobile-nav__link-label">{item.label}</span>
                    <span className="mobile-nav__link-desc">{NAV_DESCRIPTIONS[item.href]}</span>
                  </span>
                  <span className="mobile-nav__link-arrow">
                    {isActive ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="mobile-nav__divider" />

          {/* CTA section */}
          <div className="mobile-nav__cta">
            <Link className="button mobile-nav__cta-primary" to="/demo" onClick={() => setIsOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Demo markazga o'tish
            </Link>
            <a className="button button--secondary mobile-nav__cta-secondary" href={`mailto:${siteMeta.contactEmail}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              {siteMeta.contactEmail}
            </a>
          </div>

          {/* Bottom accent line */}
          <div className="mobile-nav__accent-line" />
        </div>
      </div>
    </>
  );
}

function MobileQuickBar() {
  const location = useLocation();
  const isDemoPage = location.pathname === '/demo';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const syncVisibility = () => {
      setIsVisible(window.scrollY > 180);
    };

    syncVisibility();
    window.addEventListener('scroll', syncVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', syncVisibility);
    };
  }, [location.pathname]);

  return (
    <div
      className={`mobile-quickbar ${isVisible ? 'mobile-quickbar--visible' : ''}`}
      aria-label="Tezkor amallar"
    >
      <div className="mobile-quickbar__inner">
        {isDemoPage ? (
          <>
            <Link className="button mobile-quickbar__button" to="/">
              Bosh sahifa
            </Link>
            <a className="button button--secondary mobile-quickbar__button" href={siteMeta.prototypeUrl}>
              Prototip
            </a>
          </>
        ) : (
          <>
            <Link className="button mobile-quickbar__button" to="/demo">
              Demo
            </Link>
            <a
              className="button button--secondary mobile-quickbar__button"
              href={`mailto:${siteMeta.contactEmail}`}
            >
              Aloqa
            </a>
          </>
        )}
      </div>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__summary">
          <p className="footer__brand">{siteMeta.name}</p>
          <p className="footer__copy">
            SafeChain uchun product showcase. Nazorat, AI signal va operatsion flow bir sahifada jamlangan.
          </p>
        </div>

        <nav className="footer__links" aria-label="Footer links">
          {footerLinks.map((item) =>
            isInternalLink(item.href) ? (
              <Link className="footer__link" key={item.label} to={item.href}>
                {item.label}
              </Link>
            ) : (
              <a className="footer__link" href={item.href} key={item.label}>
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="footer__meta">
          <span className="footer__caption">Operational UX</span>
          <a className="footer__mail" href={`mailto:${siteMeta.contactEmail}`}>
            {siteMeta.contactEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}

function Layout() {
  return (
    <>
      <HashScroller />
      <SiteHeader />
      <Outlet />
      <MobileQuickBar />
      <SiteFooter />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
      </Route>
    </Routes>
  );
}
