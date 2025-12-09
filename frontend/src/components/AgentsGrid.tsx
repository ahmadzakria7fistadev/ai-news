"use client";

import { AgentCard } from "./AgentCard";
import Link from "next/link";
import { ParallaxElement } from "./ParallaxElement";

const agents = [
  {
    name: "NewsHunter Alpha",
    role: "Global Data Collector",
    description: "Scans 50,000+ sources simultaneously to identify breaking news patterns before they peak.",
    capabilities: ["Multi-language NLP", "Source Verification", "Sentiment Analysis"],
    status: "active" as const,
  },
  {
    name: "FactCheck Prime",
    role: "Verification Engine",
    description: "Cross-references claims against a database of trusted independent sources to flag misinformation.",
    capabilities: ["Deep Fake Detection", "Citation Tracing", "Bias Analysis"],
    status: "active" as const,
  },
  {
    name: "MarketPulse Bot",
    role: "Financial Analyst",
    description: "Correlates global events with market movements to predict volatility in real-time.",
    capabilities: ["Trend Prediction", "Entity Recognition", "Impact Assessment"],
    status: "standby" as const,
  },
];

export const AgentsGrid = () => {
  return (
    <section id="agents" className="py-24 bg-[#030014] relative z-10">
      <div className="max-w-7xl mx-auto px-6">
         <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
           <div>
             <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-outfit)] text-white mb-4">
               Deployable <span className="text-gradient">Agents</span>
             </h2>
             <p className="text-gray-400 max-w-xl text-base">
               Select from our roster of specialized AI agents to build your perfect autonomous newsroom.
             </p>
           </div>
           <Link href="/agents">
             <button className="px-6 py-2.5 rounded-lg border border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all duration-300 text-sm font-medium">
               View All Agents
             </button>
           </Link>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, i) => (
            <ParallaxElement key={i} speed={0.2 + (i * 0.05)} direction="both">
              <AgentCard
                {...agent}
                delay={i * 0.1}
              />
            </ParallaxElement>
          ))}
        </div>
      </div>
    </section>
  );
};
