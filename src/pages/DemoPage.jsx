import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chatbotSamples, demoHighlights, siteMeta } from '../content.js';

function CopyStack({ paragraphs, className = '' }) {
  return (
    <div className={`copy-stack ${className}`.trim()}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function SectionHeading({ eyebrow, title, paragraphs }) {
  return (
    <div className="section__heading">
      <p className="section__eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <CopyStack paragraphs={paragraphs} className="section__copy" />
    </div>
  );
}

export default function DemoPage() {
  useEffect(() => {
    document.title = `${siteMeta.name} | Demo Center`;
  }, []);

  return (
    <main className="demo-page">
      <section className="section demo-hero">
        <div className="demo-hero__backdrop demo-hero__backdrop--left" />
        <div className="demo-hero__backdrop demo-hero__backdrop--right" />
        <div className="demo-hero__mesh" />

        <div className="shell demo-hero__grid">
          <div className="demo-hero__intro">
            <span className="status-pill">
              <span className="status-pill__pulse" />
              Demo center
            </span>
            <p className="section__eyebrow">06 / Product showcase</p>
            <h1>Investor, mentor yoki mijoz uchun tez ochiladigan premium demo markaz</h1>
            <CopyStack
              className="demo-hero__copy"
              paragraphs={[
                "Bu sahifa video, prototip, AI preview va texnik ko'rinishni bitta joyda jamlaydi.",
                "Asosiy maqsad product haqiqatan yashayapti degan hissini darhol berish.",
              ]}
            />

            <div className="demo-hero__actions">
              <a className="button" href={siteMeta.prototypeUrl}>
                Prototipni ochish
              </a>
              <a className="button button--secondary" href="#demo-video">
                Video blokiga o&apos;tish
              </a>
            </div>
          </div>

          <article className="panel demo-sidecard">
            <p className="demo-sidecard__eyebrow">Snapshot</p>
            <h2>Bir sahifada productning fikri, tajribasi va texnik darajasi ko&apos;rinadi</h2>
            <ul className="list list--compact">
              <li>
                <span className="list__bullet list__bullet--solution" />
                <span>Qisqa demo video va kontekst</span>
              </li>
              <li>
                <span className="list__bullet list__bullet--solution" />
                <span>Interaktiv prototipga tez o&apos;tish</span>
              </li>
              <li>
                <span className="list__bullet list__bullet--solution" />
                <span>API va AI preview orqali texnik tayyorgarlik</span>
              </li>
            </ul>
            <a className="button demo-sidecard__button" href={siteMeta.prototypeUrl}>
              Prototipni ochish
            </a>
          </article>
        </div>
      </section>

      <section className="section" id="demo-video">
        <div className="shell">
          <div className="video-frame panel">
            <div className="video-frame__meta">
              <div>
                <p>Demo video</p>
                <strong>SafeChain overview</strong>
              </div>
              <span>Pitch, use-case va nazorat oqimini qisqa vaqt ichida ko&apos;rsatadi</span>
            </div>
            <div className="video-frame__embed">
              <iframe
                src={siteMeta.videoEmbedUrl}
                title="Bug Slayers demo video"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="shell demo-grid">
          <div className="demo-grid__main">
            <article className="panel detail-card">
              <SectionHeading
                eyebrow="6.2 / Demo narrative"
                title="Demo nimani ko&apos;rsatadi"
                paragraphs={[
                  "Foydalanuvchi muammoni ko'radi, product signalni qanday ushlashini tushunadi va AI qatlami qayerda ishga tushishini anglaydi.",
                  "Narrative blok shu oqimni juda qisqa vaqt ichida aniq qiladi.",
                ]}
              />
              <div className="detail-card__grid">
                {demoHighlights.map((item) => (
                  <article className="detail-card__item" key={item}>
                    <span className="detail-card__dot" />
                    <p>{item}</p>
                  </article>
                ))}
              </div>
            </article>

            <article className="panel detail-card">
              <SectionHeading
                eyebrow="API access"
                title="Texnik tayyorgarlikni ko&apos;rsatadigan namunaviy endpoint"
                paragraphs={[
                  "API bloki landingni chuqurroq qiladi: bu faqat g'oya emas, keyingi integratsiya nuqtalari ham o'ylanganini ko'rsatadi.",
                ]}
              />
              <div className="code-card">
                <span className="code-card__label">POST /api/v1/analyze</span>
                <pre>{`curl -X POST https://api.bugslayers.uz/api/v1/analyze \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"message":"Nazorat oqimidagi xavfni tahlil qil"}'`}</pre>
              </div>
            </article>
          </div>

          <aside className="demo-grid__side">
            <a className="panel prototype-card" href={siteMeta.prototypeUrl}>
              <p className="prototype-card__eyebrow">6.3 / Interactive concept</p>
              <h2>Interaktiv prototipni ochib, flow hissini ko&apos;rish</h2>
              <CopyStack
                className="prototype-card__copy"
                paragraphs={[
                  "Dizayn, ekran oqimi va product ritmini tez ko'rish uchun alohida prototip havolasi qoldirildi.",
                  "U demo sahifani realroq qiladi va pitch paytida keraksiz gapni kamaytiradi.",
                ]}
              />
              <span>Prototype link</span>
            </a>

            <article className="panel chatbot-card">
              <div className="chatbot-card__header">
                <div>
                  <p>AI preview</p>
                  <strong>Conversation layer</strong>
                </div>
                <span className="chatbot-card__status" />
              </div>

              <div className="chatbot-card__messages">
                {chatbotSamples.map((item, index) => (
                  <div
                    className={`chatbot-card__message chatbot-card__message--${item.side}`}
                    key={`${item.side}-${index}`}
                  >
                    {item.text}
                  </div>
                ))}
              </div>

              <div className="chatbot-card__input">
                <span>Savol yozing...</span>
                <button type="button">Yuborish</button>
              </div>
            </article>

            <Link className="panel demo-linkback" to="/">
              <p className="prototype-card__eyebrow">Back to overview</p>
              <h2>Asosiy sahifadagi jamoa va roadmap bloklariga qaytish</h2>
              <span>Bosh sahifaga o&apos;tish</span>
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
