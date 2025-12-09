"use client";

import { motion } from "motion/react";
import { Check, Zap } from "lucide-react";
import Link from "next/link";
import { ParallaxElement } from "./ParallaxElement";

const plans = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Perfect for individuals and small teams",
    features: [
      "5 Active Agents",
      "50K Sources Scanned",
      "Basic Analytics",
      "Email Support",
      "API Access"
    ],
    popular: false,
    gradient: "from-gray-600 to-gray-800"
  },
  {
    name: "Professional",
    price: "$299",
    period: "/month",
    description: "For growing businesses and teams",
    features: [
      "20 Active Agents",
      "500K Sources Scanned",
      "Advanced Analytics",
      "Priority Support",
      "Custom Integrations",
      "Real-time Alerts"
    ],
    popular: true,
    gradient: "from-purple-600 to-cyan-600"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: [
      "Unlimited Agents",
      "Unlimited Sources",
      "Dedicated Support",
      "Custom Deployment",
      "SLA Guarantee",
      "White-label Options"
    ],
    popular: false,
    gradient: "from-cyan-600 to-blue-600"
  }
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-[#030014] relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-outfit)] text-white mb-6">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base">
            Choose the plan that fits your needs. All plans include our core AI agent capabilities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <ParallaxElement key={plan.name} speed={0.15 + (i * 0.05)} direction="both">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card rounded-2xl p-8 relative ${
                  plan.popular ? "ring-2 ring-purple-500/50 scale-105" : ""
                }`}
              >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-bold">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/agents">
                <button
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:shadow-[0_0_40px_rgba(112,66,248,0.5)]"
                      : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </button>
              </Link>
              </motion.div>
            </ParallaxElement>
          ))}
        </div>
      </div>
    </section>
  );
};

