"use client";

import { motion } from "motion/react";
import { ArrowRight, Bot, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { ParallaxElement } from "./ParallaxElement";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Elements with Parallax */}
      <div className="absolute inset-0 bg-[#030014]">
        <ParallaxElement speed={0.3} direction="both">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
        </ParallaxElement>
        <ParallaxElement speed={0.4} direction="both">
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px]" />
        </ParallaxElement>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <ParallaxElement speed={0.1} direction="vertical">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-cyan-400 mb-8 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            V2.0 Now Live: Enhanced Neural Networks
          </motion.div>
        </ParallaxElement>

        <ParallaxElement speed={0.15} direction="vertical">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-bold font-[family-name:var(--font-outfit)] tracking-tight text-white mb-6 leading-tight"
          >
            News at the speed of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 animate-gradient bg-300%">
              Artificial Intelligence
            </span>
          </motion.h1>
        </ParallaxElement>

        <ParallaxElement speed={0.12} direction="vertical">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Deploy autonomous agents to curate, analyze, and deliver personalized news streams.
            Stop searching. Start knowing.
          </motion.p>
        </ParallaxElement>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/agents">
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(112,66,248,0.5)] transition-all duration-300 flex items-center gap-2 group">
              Deploy Agents
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/agents">
            <button className="px-8 py-4 rounded-full bg-white/5 text-white font-bold text-lg border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              View Demo
            </button>
          </Link>
        </motion.div>

        {/* Stats / Floating Cards with Parallax */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Bot, label: "Active Agents", value: "10,000+", speed: 0.2 },
            { icon: Zap, label: "Processing Speed", value: "< 50ms", speed: 0.3 },
            { icon: Globe, label: "Sources Scanned", value: "2M/day", speed: 0.25 },
          ].map((stat, i) => (
            <ParallaxElement key={i} speed={stat.speed} direction="both">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + (i * 0.1) }}
                className="glass-card p-6 rounded-2xl flex items-center gap-4 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105"
              >
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            </ParallaxElement>
          ))}
        </div>
      </div>
    </section>
  );
};
