import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { regionCampaigns, servicePackages } from "../base/campaign";
import LeadCapture from "../sections/LeadCapture";
import ProofDemos from "../sections/ProofDemos";
import { trackEvent } from "../hooks/useCampaignTracking";

function findRegion(slug) {
  return Object.values(regionCampaigns).find((region) => region.path === `/${slug}`);
}

const RegionalCampaignPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const region = findRegion(slug);
  const [locale, setLocale] = useState("en");
  const localeOptions = useMemo(() => Object.entries(region?.locales || {}), [region]);
  const copy = region?.locales?.[locale] || region?.locales?.[region?.defaultLocale] || region?.locales?.en;

  useEffect(() => {
    if (!region) return undefined;

    const requestedLocale = searchParams.get("lang");
    const nextLocale = region.locales?.[requestedLocale] ? requestedLocale : region.defaultLocale || "en";
    setLocale(nextLocale);

    return undefined;
  }, [region, searchParams]);

  useEffect(() => {
    if (!region || !copy) return undefined;

    const previousTitle = document.title;
    const canonical = document.querySelector('link[rel="canonical"]');
    const previousCanonical = canonical?.getAttribute("href") || "";

    document.title = `${copy.title} | SystemPro Tech`;
    canonical?.setAttribute("href", `https://www.system-pro.tech${region.path}`);

    return () => {
      document.title = previousTitle;
      canonical?.setAttribute("href", previousCanonical);
    };
  }, [region, copy]);

  if (!region || !copy) {
    return <Navigate to="/" replace />;
  }

  function changeLocale(nextLocale) {
    setLocale(nextLocale);
    const nextParams = new URLSearchParams(searchParams);

    if (nextLocale === region.defaultLocale) {
      nextParams.delete("lang");
    } else {
      nextParams.set("lang", nextLocale);
    }

    setSearchParams(nextParams, { replace: true });
    trackEvent("language_switch", {
      region: region.label,
      locale: nextLocale,
    });
  }

  return (
    <main className="regional-page" lang={locale} dir={copy.dir || "ltr"}>
      <section className={`regional-hero ${copy.dir === "rtl" ? "rtl" : ""}`}>
        <div className="regional-hero-top">
          <p className="hero-kicker">{copy.kicker}</p>
          {localeOptions.length > 1 && (
            <div className="language-switcher" aria-label="Language switcher">
              {localeOptions.map(([key, option]) => (
                <button
                  type="button"
                  className={key === locale ? "active" : ""}
                  onClick={() => changeLocale(key)}
                  key={key}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <h1>{copy.headline}</h1>
        <p>{copy.description}</p>
        <div className="hero-actions">
          <a
            className="hero-cta primary"
            href="#lead-capture"
            onClick={() => trackEvent("cta_click", { region: region.label, locale, target: "regional-lead" })}
          >
            {copy.primaryCta}
          </a>
          <Link className="hero-cta secondary" to="/">
            {copy.secondaryCta}
          </Link>
        </div>
      </section>

      <section className="regional-proof">
        <div className="section-head">
          <p className="section-kicker">{copy.regionalKicker}</p>
          <h2>{copy.angle}</h2>
        </div>
        <div className="regional-proof-grid">
          {copy.proof.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="campaign-section">
        <div className="section-head">
          <p className="section-kicker">{copy.packagesKicker}</p>
          <h2>{copy.packagesTitle}</h2>
        </div>
        <div className="package-grid">
          {servicePackages.map((service) => (
            <article className="package-card" key={service.id}>
              <div className="package-card-head">
                <h3>{service.title}</h3>
                <span>{service.timeframe}</span>
              </div>
              <p>{service.description}</p>
              <small>{service.bestFor}</small>
            </article>
          ))}
        </div>
      </section>

      <ProofDemos />
      <LeadCapture />
    </main>
  );
};

export default RegionalCampaignPage;
