"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { ParallaxElement } from "./ParallaxElement";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO, TechNews Inc.",
    content: "AI News Desk transformed how we consume information. Our team is now 10x more efficient.",
    avatar: "SC"
  },
  {
    name: "Michael Rodriguez",
    role: "News Director, Global Media",
    content: "The autonomous agents are incredibly accurate. We've reduced manual work by 90%.",
    avatar: "MR"
  },
  {
    name: "Emily Watson",
    role: "Product Manager, DataFlow",
    content: "Best investment we've made. The real-time processing and analytics are unmatched.",
    avatar: "EW"
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-[#030014] relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-outfit)] text-white mb-6">
            Trusted by <span className="text-gradient">Industry Leaders</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base">
            See what our customers are saying about AI News Desk
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <ParallaxElement key={i} speed={0.2 + (i * 0.05)} direction="both">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-8 relative"
              >
              <Quote className="w-8 h-8 text-purple-400 mb-4" />
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
              </motion.div>
            </ParallaxElement>
          ))}
        </div>
      </div>
    </section>
  );
};

