"use client";

import { motion } from "motion/react";
import { Brain, Shield, Zap, RefreshCw, BarChart, Globe } from "lucide-react";
import { ParallaxElement } from "./ParallaxElement";

const features = [
  {
    title: "Neural Analysis",
    description: "Advanced NLP models understand context, sentiment, and nuance better than humans.",
    icon: Brain,
    colSpan: "md:col-span-2",
    bg: "bg-gradient-to-br from-purple-500/10 to-blue-500/10"
  },
  {
    title: "Real-time Sync",
    description: "Updates delivered instantly via WebSocket connections.",
    icon: Zap,
    colSpan: "md:col-span-1",
    bg: "bg-white/5"
  },
  {
    title: "GINI Coverage",
    description: "2M+ sources across 150+ countries and languages.",
    icon: Globe,
    colSpan: "md:col-span-1",
    bg: "bg-white/5"
  },
  {
    title: "Enterprise Security",
    description: "SOC2 Type II certified with end-to-end encryption.",
    icon: Shield,
    colSpan: "md:col-span-2",
    bg: "bg-gradient-to-br from-cyan-500/10 to-teal-500/10"
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-[#030014] relative">
      <div className="max-w-7xl mx-auto px-6">
         <div className="text-center mb-16">
           <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-outfit)] text-white mb-6">
             Engineered for <span className="text-gradient">Performance</span>
           </h2>
           <p className="text-gray-400 max-w-2xl mx-auto text-base">
             Our infrastructure handles millions of data points per second to ensure you never miss a beat.
           </p>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <ParallaxElement key={i} speed={0.15 + (i * 0.05)} direction="both">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-8 rounded-3xl relative overflow-hidden group ${feature.colSpan}`}
              >
                <div className={`absolute inset-0 ${feature.bg} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            </ParallaxElement>
          ))}
        </div>
      </div>
    </section>
  );
};
