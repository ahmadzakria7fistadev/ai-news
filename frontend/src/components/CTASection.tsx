"use client";

import { motion } from "motion/react";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export const CTASection = () => {
  return (
    <section className="py-24 bg-[#030014] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-cyan-600/10 to-purple-600/10" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400">Ready to Get Started?</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-outfit)] text-white mb-6">
            Deploy Your First <span className="text-gradient">AI Agent</span> Today
          </h2>

          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of teams already using AI News Desk to automate their news operations and stay ahead of the curve.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/agents">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(112,66,248,0.5)] transition-all duration-300 flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            
            <Link href="/agents">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full bg-white/5 text-white font-bold text-lg border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                Schedule Demo
              </motion.button>
            </Link>
          </div>

          <p className="text-gray-500 text-sm mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};

