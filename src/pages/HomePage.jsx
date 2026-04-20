import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  controlLoopSteps,
  heroStats,
  implementationPlan,
  problemVsSolution,
  roadmap,
  siteMeta,
  stackGroups,
  teamMembers,
  whyUsCards,
} from '../content.js';

function SpotlightCard({ children, className = '' }) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <article 
      className={`spotlight-card ${className}`} 
      onMouseMove={handleMouseMove}
    >
      {children}
    </article>
  );
}

function CyberParticles() {
  return (
    <div className="cyber-particles">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="particle" 
          style={{
            '--left': `${Math.random() * 100}%`,
            '--delay': `${Math.random() * 5}s`,
            '--duration': `${Math.random() * 10 + 5}s`,
            '--opacity': Math.random() * 0.5 + 0.1
          }} 
        />
      ))}
    </div>
  );
}

function SectionHeading({ eyebrow, title, text, centered = false }) {
  return (
    <div className={`section__heading ${centered ? 'section__heading--center' : ''}`.trim()}>
      <p className="section__eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text && (
        <div className="section__copy">
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

function ProblemCard({ eyebrow, title, points, tone }) {
  return (
    <SpotlightCard className={`panel problem-card problem-card--${tone} holo-card`}>
      <div className={`holo-scanner holo-scanner--${tone}`} />
      <span className={`eyebrow eyebrow--${tone}`}>{eyebrow}</span>
      <h3>{title}</h3>
      <ul className="list">
        {points.map((point) => (
          <li key={point}>
            <span className={`list__bullet list__bullet--${tone}`} />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </SpotlightCard>
  );
}

export default function HomePage() {
  useEffect(() => {
    document.title = `${siteMeta.name} | SafeChain Platform`;

    // Scroll Reveal Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--active');
          // Optional: observer.unobserve(entry.target) if we only want it to reveal once
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="home-page">
      {/* ===== HERO ===== */}
      <section className="hero">
        <CyberParticles />
        <div className="hero__orb hero__orb--left" />
        <div className="hero__orb hero__orb--right" />
        <div className="hero__mesh" />

        <div className="shell hero__content">
          <div className="hero__intro reveal">
            <span className="status-pill">
              <span className="status-pill__pulse" />
              SafeChain nazorat platformasi
            </span>
            <p className="hero__kicker">BUG SLAYERS / RETAIL CONTROL / AI SIGNALS</p>
            <h1>
              Xavfni kech emas,
              <span> sotuv nuqtasida to&apos;xtatamiz</span>
            </h1>
            <p className="hero__copy">
              {siteMeta.tagline}
            </p>

            <div className="hero__actions">
              <Link className="button" to="/demo">
                Demo markaziga o&apos;tish
              </Link>
              <Link className="button button--secondary" to="/demo#demo-materials">
                Videoni ko&apos;rish
              </Link>
              <a className="button button--secondary" href="#amalga-oshirish">
                Rejani ko&apos;rish
              </a>
            </div>

            <div className="hero__microcopy">
              <span className="chip chip--outline">Retail compliance</span>
              <span className="chip chip--outline">Realtime control</span>
              <span className="chip chip--outline">AI anomaly review</span>
            </div>
          </div>

          <div className="hero__stack">
            {/* Stats row — compact */}
            <div className="stats-row">
              {heroStats.map((item) => (
                <SpotlightCard className="stat-card panel" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </SpotlightCard>
              ))}
            </div>

            {/* 3-Step control loop */}
            <SpotlightCard className="panel hero-card hero-card--secondary">
              <div className="hero-card__header">
                <div>
                  <p className="hero__panel-label">Realtime loop</p>
                  <h2>3 qadamli nazorat</h2>
                </div>
                <span className="hero-card__badge">Live</span>
              </div>

              <div className="hero-loop">
                {controlLoopSteps.map((item) => (
                  <article className="hero-loop__item" key={item.index}>
                    <span className="hero-loop__index">{item.index}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* ===== MUAMMO VA YECHIM ===== */}
      <section className="section section--muted" id="muammo">
        <div className="shell">
          <div className="reveal">
            <SectionHeading
              eyebrow="01 / Muammo va yechim"
              title="Muammo aniq, yechim operatsion"
              centered
            />
          </div>

          <div className="problem-grid reveal" style={{ transitionDelay: '100ms' }}>
            <ProblemCard {...problemVsSolution.problem} tone="problem" />
            <ProblemCard {...problemVsSolution.solution} tone="solution" />
          </div>
        </div>
      </section>

      {/* ===== JAMOA ===== */}
      <section className="section" id="jamoa">
        <div className="shell">
          <div className="reveal">
            <SectionHeading
              eyebrow="02 / Jamoa"
              title="Jamoa, rollar va texnologiya staki"
            />
          </div>

          <div className="team-grid reveal" style={{ transitionDelay: '100ms' }}>
            {teamMembers.map((member) => (
              <article className="team-card panel" key={member.name}>
                <div className="team-card__avatar">
                  <img src={member.image} alt={member.name} loading="lazy" />
                </div>
                <div className="team-card__info">
                  <div className="team-card__head">
                    <h3>{member.name}</h3>
                    <span className="team-card__badge">{member.badge}</span>
                  </div>
                  <p className="team-card__role">{member.role}</p>
                  <p className="team-card__bio">{member.bio}</p>
                  <div className="team-card__stack">
                    <span>Tech stack</span>
                    <strong>{member.stack}</strong>
                  </div>
                  <div className="team-card__skills">
                    {member.skills.map((skill) => (
                      <span key={skill} className="team-card__skill">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="team-card__links">
                    {member.links.map((item) => (
                      <a href={item.href} key={item.label} className="team-card__link">
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEGA BIZ ===== */}
      <section className="section section--muted" id="nega-biz">
        <div className="shell">
          <div className="reveal">
            <SectionHeading
              eyebrow="03 / Nega biz"
              title="G&apos;oya emas, product konturi"
              centered
            />
          </div>

          <div className="bento-grid">
            {whyUsCards.map((card, index) => (
              <SpotlightCard
                className={`panel bento-card reveal ${
                  card.tone ? `bento-card--${card.tone}` : ''
                }`.trim()}
                key={card.title}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span className="bento-card__number">0{index + 1}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===== YO'L XARITASI ===== */}
      <section className="section" id="yol-xaritasi">
        <div className="shell">
          <div className="reveal">
            <SectionHeading
              eyebrow="04 / Yo'l xaritasi"
              title="Idea / Prototype / MVP / Launched"
            />
          </div>

          <div className="roadmap-modern">
            {roadmap.map((item, index) => (
              <article 
                className={`roadmap-modern__card reveal roadmap-modern__card--${item.progressTone} ${item.isCurrent ? 'roadmap-modern__card--current' : ''}`} 
                key={item.stage}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="roadmap-modern__indicator">
                  <div className={`roadmap-modern__dot roadmap-modern__dot--${item.progressTone}`}>
                    {item.isCurrent && <div className="roadmap-modern__ping" />}
                  </div>
                  {index !== roadmap.length - 1 && <div className={`roadmap-modern__line roadmap-modern__line--${item.progressTone}`} />}
                </div>
                <div className="roadmap-modern__content">
                  <div className="roadmap-modern__header">
                    <span className="roadmap-modern__step">
                      0{index + 1} / {item.stage}
                      {item.isCurrent && <span className="roadmap-modern__current-label">Biz shu yerdamiz</span>}
                    </span>
                    <span className={`status-pill ${item.isCurrent ? '' : 'status-pill--outline'}`}>
                      {item.isCurrent && <span className="status-pill__pulse" />}
                      {item.status}
                    </span>
                  </div>
                  <h3>{item.stage}</h3>
                  <p>{item.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AMALGA OSHIRISH ===== */}
      <section className="section section--muted" id="amalga-oshirish">
        <div className="shell implementation">
          <div>
            <SectionHeading
              eyebrow="05 / Amalga oshirish"
              title="Bosqich va stack"
            />

            <div className="steps">
              {implementationPlan.map((item) => (
                <article className="step" key={item.index}>
                  <div className="step__index">{item.index}</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="panel stack-card">
            <p className="stack-card__eyebrow">Stack &amp; AI tools</p>
            <div className="stack-card__grid">
              {stackGroups.map((item) => (
                <article className="stack-card__item" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
