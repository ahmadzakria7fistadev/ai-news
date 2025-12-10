"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Radio, RefreshCw, Clock, TrendingUp, ExternalLink } from "lucide-react";
import { getLiveNews, LiveNewsResponse } from "@/lib/api";
import { ParallaxElement } from "./ParallaxElement";
import Image from "next/image";

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
      const breaking: NewsItem[] = [];
      const updates: NewsItem[] = [];
      const highlights: NewsItem[] = [];

      // Parse Breaking News section
      const breakingMatch = response.match(/🔥\s*BREAKING NEWS[\s\S]*?(?=━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━|📊|💡|$)/i);
      if (breakingMatch) {
        const breakingText = breakingMatch[0];
        // Extract each breaking news item (starts with 🚨)
        const breakingItems = breakingText.split(/(?=🚨)/).filter(item => item.trim().startsWith('🚨'));
        
        breakingItems.forEach((item) => {
          const lines = item.split('\n').map(l => l.trim()).filter(l => l);
          
          let title = '';
          let summary = '';
          let source = 'AI News Desk';
          let url = '#';
          let time = 'Just now';
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Extract title (line after 🚨)
            if (line.startsWith('🚨')) {
              title = line.replace(/🚨\s*/, '').trim();
            }
            // Extract location (optional)
            else if (line.startsWith('📍')) {
              // Skip location
            }
            // Extract time
            else if (line.startsWith('⏰')) {
              time = line.replace(/⏰\s*Time:\s*/i, '').trim() || 'Just now';
            }
            // Extract source
            else if (line.startsWith('📰')) {
              source = line.replace(/📰\s*Source:\s*/i, '').trim() || 'AI News Desk';
            }
            // Extract URL
            else if (line.startsWith('🔗')) {
              url = line.replace(/🔗\s*Read more:\s*/i, '').trim() || '#';
            }
            // Extract summary (text between metadata and URL)
            else if (line && !line.includes('━━') && line.length > 10) {
              if (!summary) {
                summary = line;
              } else if (summary.length < 250) {
                summary += ' ' + line;
              }
            }
          }
          
          if (title && title.length > 5) {
            breaking.push({
              title: title.substring(0, 150),
              summary: summary || 'Breaking AI news update',
              source: source,
              url: url,
              image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
              time: time
            });
          }
        });
      }

      // Parse Latest Updates section
      const updatesMatch = response.match(/📊\s*LATEST UPDATES[\s\S]*?(?=━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━|💡|📈|$)/i);
      if (updatesMatch) {
        const updatesText = updatesMatch[0];
        // Extract each update item (starts with •)
        const updateItems = updatesText.split(/(?=•)/).filter(item => item.trim().startsWith('•'));
        
        updateItems.forEach((item) => {
          const lines = item.split('\n').map(l => l.trim()).filter(l => l);
          
          let title = '';
          let summary = '';
          let source = 'AI News Desk';
          let url = '#';
          let time = 'Just now';
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Extract title (line with •)
            if (line.startsWith('•')) {
              title = line.replace(/•\s*/, '').trim();
            }
            // Extract metadata (Location | Time | Source)
            else if (line.includes('|')) {
              const parts = line.split('|').map(p => p.trim());
              parts.forEach(part => {
                if (part.startsWith('📍')) {
                  // Skip location
                } else if (part.startsWith('⏰')) {
                  time = part.replace(/⏰\s*/i, '').trim() || 'Just now';
                } else if (part.startsWith('📰')) {
                  source = part.replace(/📰\s*/i, '').trim() || 'AI News Desk';
                }
              });
            }
            // Extract URL
            else if (line.startsWith('🔗')) {
              url = line.replace(/🔗\s*/i, '').trim() || '#';
            }
            // Extract summary
            else if (line && !line.includes('━━') && line.length > 10 && !line.match(/^[📍⏰📰🔗]/)) {
              if (!summary) {
                summary = line;
              } else if (summary.length < 200) {
                summary += ' ' + line;
              }
            }
          }
          
          if (title && title.length > 5) {
            updates.push({
              title: title.substring(0, 120),
              summary: summary || 'Latest AI news update',
              source: source,
              url: url,
              image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
              time: time
            });
          }
        });
      }

      // Parse Key Highlights section
      const highlightsMatch = response.match(/💡\s*KEY HIGHLIGHTS[\s\S]*?(?=━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━|📈|$)/i);
      if (highlightsMatch) {
        const highlightsText = highlightsMatch[0];
        // Extract each highlight item (starts with •)
        const highlightItems = highlightsText.split(/(?=•)/).filter(item => item.trim().startsWith('•'));
        
        highlightItems.forEach((item) => {
          // Format: • [Title] - [Summary] | 📰 [Source] | 🔗 [URL]
          const match = item.match(/•\s*([^-|]+?)\s*-\s*([^|]+?)\s*\|\s*📰\s*([^|]+?)\s*\|\s*🔗\s*(.+)/);
          
          if (match) {
            highlights.push({
              title: match[1].trim().substring(0, 100),
              summary: match[2].trim().substring(0, 150),
              source: match[3].trim() || 'AI News Desk',
              url: match[4].trim() || '#',
              image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop",
              time: 'Today'
            });
          } else {
            // Fallback parsing
            const lines = item.split('\n').map(l => l.trim()).filter(l => l);
            const firstLine = lines[0] || '';
            if (firstLine.startsWith('•')) {
              const cleanLine = firstLine.replace(/•\s*/, '').trim();
              if (cleanLine.length > 10) {
                highlights.push({
                  title: cleanLine.substring(0, 100),
                  summary: 'Latest AI development',
                  source: 'AI News Desk',
                  url: '#',
                  image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop",
                  time: 'Today'
                });
              }
            }
          }
        });
      }

      // Fallback: If no items found, try to extract from raw text
      if (breaking.length === 0 && updates.length === 0 && highlights.length === 0) {
        // Look for any lines that look like headlines
        const allLines = response.split('\n').map(l => l.trim()).filter(l => {
          return l.length > 15 && 
                 l.length < 200 && 
                 !l.includes('━━') && 
                 !l.match(/^[📍⏰📰🔗🚨🔥📊💡📈]/) &&
                 !l.match(/^(Location|Time|Source|Read more|Last Updated|Coverage):/i) &&
                 !l.match(/^(BREAKING NEWS|LATEST UPDATES|KEY HIGHLIGHTS|TODAY'S AI NEWS SUMMARY)/i);
        });
        
        allLines.slice(0, 8).forEach((line) => {
          if (line.length > 15) {
            updates.push({
              title: line.substring(0, 100),
              summary: line.length > 100 ? line.substring(100, 250) : 'Latest AI development',
              source: 'AI News Desk',
              url: '#',
              image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
              time: 'Just now'
            });
          }
        });
      }

      return { breaking, updates, highlights };
    } catch (e) {
      console.error("Failed to parse news:", e);
      return { breaking: [], updates: [], highlights: [] };
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await getLiveNews(["ai"]); // Always AI only
      setNews(response);
      const parsed = parseNewsResponse(response.result);
      setParsedNews(parsed);
      setLastUpdate(new Date());
    } catch (error: any) {
      console.error("Error fetching live news:", error);
      // Show user-friendly error message
      let errorMessage = error?.message || "Failed to fetch news. Please check if backend is running.";
      
      // Handle specific error cases
      if (errorMessage.includes("quota") || errorMessage.includes("429")) {
        errorMessage = "OpenAI API quota exceeded. Please add credits to your OpenAI account at https://platform.openai.com/account/billing";
      } else if (errorMessage.includes("Invalid") && errorMessage.includes("API")) {
        errorMessage = "Invalid OpenAI API key. Please check your backend configuration.";
      }
      
      // Show error in UI instead of alert
      setParsedNews({
        breaking: [],
        updates: [{
          title: "Error Loading News",
          summary: errorMessage,
          source: "System",
          url: "#",
          image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
          time: "Now"
        }],
        highlights: []
      });
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
    <section id="live-news" className="py-12 bg-gray-50 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <ParallaxElement speed={0.1} direction="vertical">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-xs font-bold mb-3">
                <Radio className="w-3 h-3 animate-pulse" />
                LIVE
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                AI News
              </h2>
              <p className="text-gray-600 text-base max-w-2xl">
                Latest artificial intelligence news, research, and developments from around the world.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {lastUpdate ? `Last updated: ${formatTime(lastUpdate)}` : "Not updated yet"}
              </div>
              <button
                onClick={fetchNews}
                disabled={loading}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        </ParallaxElement>


        {/* News Content - BBC Style Layout */}
        <ParallaxElement speed={0.2} direction="both">
          {loading && !parsedNews ? (
            <div className="bg-white rounded-lg p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Fetching latest AI news...</p>
              </div>
            </div>
          ) : parsedNews ? (
            <div className="bg-white rounded-lg overflow-hidden">
              {/* Main Featured Story - Top */}
              {parsedNews.breaking.length > 0 && (
                <div className="border-b border-gray-200">
                  <div className="bg-red-600 text-white px-4 py-2 text-sm font-semibold">
                    BREAKING NEWS
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                    {parsedNews.breaking.slice(0, 1).map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-2"
                      >
                        <div className="relative w-full h-64 md:h-80 mb-4 rounded overflow-hidden bg-gray-200">
                          <img
                            src={item.image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop"}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop";
                            }}
                          />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">
                            {item.title}
                          </a>
                        </h2>
                        <p className="text-gray-700 text-base leading-relaxed mb-3">
                          {item.summary}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{item.source}</span>
                          <span>•</span>
                          <span>{item.time}</span>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Side Stories */}
                    <div className="space-y-4">
                      {parsedNews.breaking.slice(1, 3).map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="border-b border-gray-200 pb-4 last:border-0"
                        >
                          <div className="flex gap-3">
                            <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                              <img
                                src={item.image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=300&fit=crop"}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=300&fit=crop";
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 leading-snug">
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">
                                  {item.title}
                                </a>
                              </h3>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {item.summary}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Latest News Grid */}
              {parsedNews.updates.length > 0 && (
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-900">
                    Latest AI News
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {parsedNews.updates.map((item, i) => (
                      <motion.article
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group"
                      >
                        <div className="relative w-full h-48 mb-3 rounded overflow-hidden bg-gray-200">
                          <img
                            src={item.image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop"}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop";
                            }}
                          />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            {item.title}
                          </a>
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-3 leading-relaxed">
                          {item.summary}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{item.source}</span>
                          <span>{item.time}</span>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}

              {/* More Stories - Horizontal Layout */}
              {parsedNews.highlights.length > 0 && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-900">
                    More Stories
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parsedNews.highlights.map((item, i) => (
                      <motion.article
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-4 group"
                      >
                        <div className="relative w-32 h-32 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                          <img
                            src={item.image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop"}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              {item.title}
                            </a>
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-2">
                            {item.summary}
                          </p>
                          <div className="text-xs text-gray-500">
                            {item.source} • {item.time}
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}

              {parsedNews.breaking.length === 0 && parsedNews.updates.length === 0 && parsedNews.highlights.length === 0 && (
                <div className="p-8 text-center text-gray-600">
                  <p>No AI news available. Click refresh to fetch latest updates.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center text-gray-600">
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

