"use client";

import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Navbar } from "@/components/Navbar";
import { ChatBot } from "@/components/ChatBot";
import { ParallaxElement } from "@/components/ParallaxElement";
import { ArrowLeft, Bot, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

const agents = {
  seo: {
    name: "SEO Agent",
    description: "Generate SEO-optimized meta titles, descriptions, and content strategies",
    gradient: "from-blue-500 to-cyan-500",
    features: ["Meta Title Generation", "Description Optimization", "Keyword Research", "Content Strategy"]
  },
  youtube: {
    name: "YouTube Agent",
    description: "Search and analyze YouTube videos with advanced AI insights",
    gradient: "from-red-500 to-pink-500",
    features: ["Video Search", "Content Analysis", "Trend Detection", "Engagement Metrics"]
  },
  forbes: {
    name: "Forbes Agent",
    description: "Search and analyze Forbes articles with deep content analysis",
    gradient: "from-purple-500 to-indigo-500",
    features: ["Article Search", "Market Analysis", "Expert Insights", "Industry Trends"]
  },
  web_search: {
    name: "Web Search Agent",
    description: "Search the web for latest AI news and comprehensive information",
    gradient: "from-green-500 to-emerald-500",
    features: ["Web Scraping", "News Aggregation", "Real-time Updates", "Source Verification"]
  },
  daily_news_collector: {
    name: "Daily News Collector Agent",
    description: "Monitor and collect daily news across multiple topics automatically",
    gradient: "from-orange-500 to-yellow-500",
    features: ["Multi-topic Monitoring", "Automated Collection", "Smart Filtering", "Daily Reports"]
  },
  breaking_news_alert: {
    name: "Breaking News Alert Agent",
    description: "Real-time alerts for breaking and high-impact news events",
    gradient: "from-red-600 to-rose-600",
    features: ["Real-time Monitoring", "Instant Alerts", "Impact Analysis", "Priority Sorting"]
  },
  news_research: {
    name: "News Research Agent",
    description: "Deep research on topics with multi-source comprehensive analysis",
    gradient: "from-indigo-500 to-purple-500",
    features: ["Deep Research", "Multi-source Analysis", "Report Generation", "Fact Checking"]
  },
  news_summarizer: {
    name: "News Summarizer Agent",
    description: "Create concise TLDR summaries of news content instantly",
    gradient: "from-pink-500 to-rose-500",
    features: ["Quick Summaries", "Key Points Extraction", "Multiple Formats", "Tone Adjustment"]
  },
  multi_agent_newsroom: {
    name: "Multi-Agent Newsroom System",
    description: "Coordinate multiple agents for complete news processing workflow",
    gradient: "from-purple-600 to-indigo-600",
    features: ["Agent Coordination", "Workflow Automation", "Quality Control", "Team Management"]
  },
  ultimate_ai_news: {
    name: "Ultimate AI News Agent",
    description: "All-in-one comprehensive news agent with all premium features",
    gradient: "from-blue-600 to-purple-600",
    features: ["Complete Solution", "All Features", "Priority Support", "Custom Workflows"]
  },
};

export default function AgentPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const agent = agents[agentId as keyof typeof agents];

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#0f0f1e] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl text-white font-bold mb-4">Agent Not Found</h1>
          <Link href="/agents" className="text-[#6366f1] hover:text-[#8b5cf6] font-medium">
            ← Back to All Agents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] relative overflow-hidden">
      <Navbar />
      {/* Background with Parallax */}
      <div className="fixed inset-0 bg-pattern opacity-30" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <ParallaxElement speed={0.3} direction="both">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl bg-purple-600/10" />
        </ParallaxElement>
        <ParallaxElement speed={0.4} direction="both">
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl bg-cyan-600/10" />
        </ParallaxElement>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <ParallaxElement speed={0.1} direction="vertical">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-5 transition-colors group font-medium text-sm"
            >
              <motion.div whileHover={{ x: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                <ArrowLeft className="w-4 h-4" />
              </motion.div>
              Back to All Agents
            </Link>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
              {/* Agent Info Card */}
              <ParallaxElement speed={0.15} direction="both">
                <div className="lg:col-span-2">
                  <div className="glass-strong border border-white/10 rounded-xl p-6">
                    <div className="flex items-start gap-5 mb-5">
                      <motion.div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center glow-primary`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      >
                        <Bot className="w-8 h-8 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2.5 leading-tight">
                          <span className="gradient-text">{agent.name}</span>
                        </h1>
                        <p className="text-white/70 text-base leading-relaxed flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#6366f1]" />
                          {agent.description}
                        </p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {agent.features.map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-center gap-2 glass-premium rounded-lg p-2.5 border border-white/5"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                          <span className="text-xs text-white/80 font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </ParallaxElement>

              {/* Stats Card */}
              <ParallaxElement speed={0.2} direction="both">
                <div className="glass-strong border border-white/10 rounded-xl p-6">
                  <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#6366f1]" />
                    Performance
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/60 text-sm">Accuracy</span>
                        <span className="text-white font-bold">99%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "99%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full gradient-primary rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/60 text-sm">Response Speed</span>
                        <span className="text-white font-bold">{"< 2s"}</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "95%" }}
                          transition={{ duration: 1, delay: 0.7 }}
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/60 text-sm">Reliability</span>
                        <span className="text-white font-bold">99.9%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "99.9%" }}
                          transition={{ duration: 1, delay: 0.9 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-white/60 text-xs">Status</span>
                    </div>
                    <span className="text-white font-bold text-base">Active 24/7</span>
                  </div>
                </div>
              </ParallaxElement>
            </div>
          </motion.div>
        </ParallaxElement>

        {/* Chat Interface */}
        <ParallaxElement speed={0.1} direction="vertical">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="h-[550px]"
          >
          <ChatBot
            agentType={agentId}
            agentName={agent.name}
            agentDescription={agent.description}
          />
          </motion.div>
        </ParallaxElement>
      </div>
    </div>
  );
}
