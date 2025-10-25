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
import FeatureIcon from "../components/FeatureIcon";
import "../components/Footer.css";
import "../components/PageHeader.css";
import "./PricingPage.css";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  limitations?: string[];
  badge?: string;
  savings?: string;
  cta: string;
  highlighted: boolean;
}

export default function PricingPage() {
  const plans: PricingPlan[] = [
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
      limitations: [
        "No video interviews",
        "Limited analytics",
        "Basic CV analysis",
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
        "Advanced AI feedback with GPT-4",
        "Voice & video interviews",
        "Full question library + courses",
        "CV similarity analysis",
        "Priority support",
        "Progress tracking & analytics",
        "Mock interviews with AI",
        "Interview recordings",
      ],
      badge: "MOST POPULAR",
      savings: "Save 20% annually",
      cta: "Start 14-Day Free Trial",
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
        "SSO & advanced security",
        "White-label options",
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
                <div className="popular-badge">
                  {plan.badge || "Most Popular"}
                </div>
              )}
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">/{plan.period}</span>
                </div>
                <p className="plan-description">{plan.description}</p>
                {plan.savings && (
                  <div className="plan-savings">{plan.savings}</div>
                )}
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="feature-check">
                      <FeatureIcon type="check" size={16} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.limitations && (
                <ul className="plan-limitations">
                  {plan.limitations.map((limitation, idx) => (
                    <li key={idx}>
                      <span className="limitation-x">×</span>
                      {limitation}
                    </li>
                  ))}
                </ul>
              )}
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

        {/* FAQ Section */}
        <div className="pricing-faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Can I change plans anytime?</h3>
              <p>
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </div>
            <div className="faq-item">
              <h3>Is there a free trial?</h3>
              <p>
                Yes! All paid plans include a 14-day free trial. No credit card
                required to start.
              </p>
            </div>
            <div className="faq-item">
              <h3>What payment methods do you accept?</h3>
              <p>
                We accept all major credit cards, PayPal, and wire transfers for
                Enterprise plans.
              </p>
            </div>
            <div className="faq-item">
              <h3>Can I cancel my subscription?</h3>
              <p>
                Yes, you can cancel anytime. You'll continue to have access
                until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
