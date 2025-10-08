/**
 * Pricing Page - Subscription Plans
 *
 * Purpose: Display pricing tiers and features
 * Plans: Basic, Pro, Enterprise
 *
 * Elements: Hero, Pricing grid (3 cards), Feature lists, CTA buttons
 * Button Classes: `.plan-cta` with variants (`.primary`, `.secondary`)
 *
 * Architecture: PageHeader + Hero + Pricing grid + Footer
 * Dark Mode: NO (public page, always light)
 * Brand Colors: Gradient buttons, price in gradient text
 *
 * @module PricingPage
 */

import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import "../components/Footer.css";
import "../components/PageHeader.css";
import "./PricingPage.css";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "5 practice sessions per month",
        "Basic AI feedback",
        "Text-based interviews",
        "Standard question library",
        "Email support",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For serious job seekers",
      features: [
        "Unlimited practice sessions",
        "Advanced AI feedback",
        "Voice & video interviews",
        "Full question library + courses",
        "CV similarity analysis",
        "Priority support",
        "Progress tracking & analytics",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Custom question libraries",
        "Team management dashboard",
        "Advanced analytics & reporting",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <div className="pricing-page">
      <PageHeader />
      <div className="pricing-hero">
        <div className="pricing-hero-content">
          <h1>Simple, Transparent Pricing</h1>
          <p className="pricing-hero-subtitle">
            Choose the plan that fits your needs. All plans include a 14-day
            free trial.
          </p>
        </div>
      </div>

      <div className="pricing-content">
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card ${
                plan.highlighted ? "highlighted" : ""
              }`}
            >
              {plan.highlighted && (
                <div className="popular-badge">Most Popular</div>
              )}
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">/{plan.period}</span>
                </div>
                <p className="plan-description">{plan.description}</p>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="feature-check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`plan-cta ${
                  plan.highlighted ? "primary" : "secondary"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

