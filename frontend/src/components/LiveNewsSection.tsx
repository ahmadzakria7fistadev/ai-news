"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Radio, RefreshCw, Clock, TrendingUp, ExternalLink, Image as ImageIcon } from "lucide-react";
import { getLiveNews, LiveNewsResponse } from "@/lib/api";
import { ParallaxElement } from "./ParallaxElement";

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  url: string;
  image_url?: string;
  time: string;
}

export const LiveNewsSection = () => {
  const [news, setNews] = useState<LiveNewsResponse | null>(null);
  const [parsedNews, setParsedNews] = useState<{
    breaking: NewsItem[];
    updates: NewsItem[];
    highlights: NewsItem[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const parseNewsResponse = (response: string) => {
    try {
      // Try to parse as JSON first
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          breaking: Array.isArray(parsed.breaking_news) ? parsed.breaking_news : [],
          updates: Array.isArray(parsed.latest_updates) ? parsed.latest_updates : [],
          highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
        };
      }
      
      // Fallback: Try to extract news items from text format
      const breakingMatches = response.match(/🔥\s*BREAKING NEWS:?[\s\S]*?(?=📊|💡|$)/i);
      const updatesMatches = response.match(/📊\s*CATEGORY UPDATES:?[\s\S]*?(?=💡|$)/i);
      const highlightsMatches = response.match(/💡\s*KEY HIGHLIGHTS:?[\s\S]*?$/i);
      
      const extractItems = (text: string) => {
        if (!text) return [];
        // Try to extract structured items or create placeholder
        const lines = text.split('\n').filter(l => l.trim() && !l.trim().startsWith('🔥') && !l.trim().startsWith('📊') && !l.trim().startsWith('💡') && !l.trim().startsWith('━'));
        return lines.slice(0, 3).map((line, i) => ({
          title: line.substring(0, 100) || `AI News Update ${i + 1}`,
          summary: line.substring(100, 200) || "Latest AI development",
          source: "AI News Desk",
          url: "#",
          image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
          time: "Just now"
        }));
      };
      
      return {
        breaking: extractItems(breakingMatches?.[0] || ""),
        updates: extractItems(updatesMatches?.[0] || ""),
        highlights: extractItems(highlightsMatches?.[0] || ""),
      };
    } catch (e) {
      console.error("Failed to parse news:", e);
    }
    return { breaking: [], updates: [], highlights: [] };
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await getLiveNews(["ai"]); // Always AI only
      setNews(response);
      const parsed = parseNewsResponse(response.result);
      setParsedNews(parsed);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching live news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchNews();
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <section id="live-news" className="py-24 bg-[#030014] relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <ParallaxElement speed={0.1} direction="vertical">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-sm text-red-400 mb-4">
                <Radio className="w-4 h-4 animate-pulse" />
                <span className="font-medium">LIVE</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-outfit)] text-white mb-4">
                <span className="text-gradient">Live AI News</span> Updates
              </h2>
              <p className="text-gray-400 max-w-xl text-base">
                Real-time AI news updates powered by AI agents. Stay informed with the latest AI breakthroughs, research, and developments.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                {lastUpdate ? `Updated: ${formatTime(lastUpdate)}` : "Not updated yet"}
              </div>
              <button
                onClick={fetchNews}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        </ParallaxElement>

        {/* AI News Badge */}
        <ParallaxElement speed={0.15} direction="both">
          <div className="flex items-center justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 text-purple-300">
              <span className="text-2xl">🤖</span>
              <span className="font-semibold">AI News Only</span>
            </div>
          </div>
        </ParallaxElement>

        {/* News Content */}
        <ParallaxElement speed={0.2} direction="both">
          {loading && !parsedNews ? (
            <div className="glass-card rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Fetching latest AI news...</p>
              </div>
            </div>
          ) : parsedNews ? (
            <div className="space-y-8">
              {/* Breaking News */}
              {parsedNews.breaking.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl">🔥</span>
                    <h3 className="text-2xl font-bold text-red-400">Breaking News</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {parsedNews.breaking.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card rounded-xl overflow-hidden group hover:border-cyan-500/50 transition-all duration-300"
                      >
                        <div className="relative h-48 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 overflow-hidden">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600/30 to-cyan-600/30">
                              <ImageIcon className="w-16 h-16 text-white/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <span className="text-xs text-red-400 font-semibold bg-red-500/20 px-2 py-1 rounded">BREAKING</span>
                          </div>
                        </div>
                        <div className="p-5">
                          <h4 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                            {item.summary}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{item.source}</span>
                              <span>•</span>
                              <span>{item.time}</span>
                            </div>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 text-sm"
                            >
                              Read More
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Latest Updates */}
              {parsedNews.updates.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-2xl font-bold text-white">Latest Updates</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parsedNews.updates.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card rounded-xl overflow-hidden group hover:border-purple-500/50 transition-all duration-300"
                      >
                        <div className="relative h-40 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 overflow-hidden">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600/30 to-cyan-600/30">
                              <ImageIcon className="w-12 h-12 text-white/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        </div>
                        <div className="p-4">
                          <h4 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                            {item.summary}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">{item.source}</span>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {parsedNews.highlights.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl">💡</span>
                    <h3 className="text-2xl font-bold text-purple-400">Key Highlights</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {parsedNews.highlights.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card rounded-lg p-4 flex gap-4 group hover:border-purple-500/50 transition-all duration-300"
                      >
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-purple-600/20 to-cyan-600/20">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-white/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white mb-1 line-clamp-2 group-hover:text-purple-400 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                            {item.summary}
                          </p>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 transition-colors text-xs flex items-center gap-1"
                          >
                            Read
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {parsedNews.breaking.length === 0 && parsedNews.updates.length === 0 && parsedNews.highlights.length === 0 && (
                <div className="glass-card rounded-2xl p-8 text-center text-gray-400">
                  <p>No AI news available. Click refresh to fetch latest updates.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p>No news available. Click refresh to fetch latest AI news updates.</p>
              </div>
            </div>
          )}
        </ParallaxElement>

        {/* Auto-refresh Toggle */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 rounded bg-white/5 border-white/10 text-cyan-500 focus:ring-cyan-500"
            />
            <span>Auto-refresh every 60 seconds</span>
          </label>
        </div>
      </div>
    </section>
  );
};

