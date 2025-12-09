"use client";

import { motion } from "motion/react";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

interface AgentProps {
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  status: "active" | "standby";
  delay: number;
}

export const AgentCard = ({ name, role, description, capabilities, status, delay }: AgentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="glass-card rounded-2xl p-6 group hover:border-purple-500/50 transition-all duration-300 relative"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-cyan-400 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
              {status === 'active' ? 'ONLINE' : 'STANDBY'}
            </div>
            <h3 className="text-xl font-bold text-white mt-1">{name}</h3>
            <p className="text-sm text-purple-400 font-medium">{role}</p>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-6 flex-grow">
          {description}
        </p>

        <div className="space-y-3 mb-6">
          {capabilities.map((cap, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
              <Check className="w-4 h-4 text-cyan-500" />
              {cap}
            </div>
          ))}
        </div>

        <Link href="/agents">
          <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 group-hover:border-purple-500/30">
            Deploy Agent
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </motion.div>
  );
};
