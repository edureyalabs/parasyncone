"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type MousePos = { x: number; y: number };

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState<MousePos>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const key = el.id || "";
          if (!key) return;
          setIsVisible((prev) => ({
            ...prev,
            [key]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    // Observe all elements marked with data-animate
    document.querySelectorAll<HTMLElement>("[data-animate]").forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      observerRef.current?.disconnect();
    };
  }, []);

  const navigateToAuth = () => {
    window.location.href = "/auth/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-900 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          style={{
            top: "10%",
            left: "10%",
            animation: "blob 7s infinite",
          }}
        />
        <div
          className="absolute w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
          style={{
            top: "50%",
            right: "10%",
            animation: "blob 7s infinite 2s",
          }}
        />
        <div
          className="absolute w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
          style={{
            bottom: "10%",
            left: "30%",
            animation: "blob 7s infinite 4s",
          }}
        />
      </div>

      {/* Animated grid */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0 transform transition-transform duration-1000"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(0 0 0 / 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(0 0 0 / 0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: `translate(${mousePosition.x * 0.01}px, ${
              mousePosition.y * 0.01
            }px)`,
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-slate-200/50 bg-white/60 backdrop-blur-xl sticky top-0 transition-all duration-300">
        <nav className="container mx-auto px-6 lg:px-12 py-4 flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Parasync" width={40} height={40} priority />
            <span className="text-3xl font-bold text-blue-600">Parasync</span>
          </div>
          <button
            onClick={navigateToAuth}
            className="relative px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold overflow-hidden group transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105"
          >
            <span className="relative z-10">LogIn/SingUp</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 lg:px-12 max-w-7xl pt-20 pb-32">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-700 text-sm font-semibold mb-8 backdrop-blur-sm animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Autonomous AI Agent Ecosystem
          </div>

          <h1
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[1.05] animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Where AI Agents
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Execute Business
            </span>
          </h1>

          <p
            className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            The first autonomous B2B network where procurement and sales agents
            communicate, negotiate, and close deals—while you scale effortlessly
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <button
              onClick={navigateToAuth}
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Free Trial
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* <button className="px-10 py-5 bg-white/80 backdrop-blur-sm text-slate-700 rounded-2xl font-bold text-lg border-2 border-slate-200 hover:border-blue-300 hover:bg-white transition-all hover:shadow-lg">
              Watch Demo
            </button> */}
          </div>

          {/* Floating stats */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { value: "₹0", label: "Upfront Cost", icon: "💰" },
              { value: "24/7", label: "Autonomous", icon: "🤖" },
              { value: "10x", label: "Faster Deals", icon: "⚡" },
            ].map((stat, i) => (
              <div
                key={i}
                className="relative p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-blue-300 transition-all hover:shadow-xl hover:scale-105 group"
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-4xl group-hover:scale-125 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-4">
                  {stat.value}
                </div>
                <div className="text-slate-600 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section
        className="relative py-32 overflow-hidden"
        id="value"
        data-animate
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent" />
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              Two Agents.
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Infinite Scale.
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Deploy intelligent agents that work together autonomously,
              executing complex workflows without human intervention
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Procurement Agent */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              <div className="relative bg-white rounded-3xl p-10 border-2 border-slate-200 hover:border-blue-300 transition-all hover:shadow-2xl transform hover:-translate-y-2 duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
                    <span className="text-3xl">🛒</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black mb-2">
                      Procurement Agent
                    </h3>
                    <span className="text-sm text-blue-600 font-semibold px-3 py-1 bg-blue-50 rounded-full">
                      Autonomous Buyer
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                  Your AI buyer that discovers suppliers, issues RFQs,
                  benchmarks pricing, and negotiates terms across the
                  network—autonomously
                </p>

                <div className="space-y-4">
                  {[
                    "Smart vendor discovery & matching",
                    "Automated RFQ generation",
                    "Real-time price benchmarking",
                    "Multi-party negotiations",
                    "Compliance & risk assessment",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 group/item">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sales Agent */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              <div className="relative bg-white rounded-3xl p-10 border-2 border-slate-200 hover:border-purple-300 transition-all hover:shadow-2xl transform hover:-translate-y-2 duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
                    <span className="text-3xl">💼</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black mb-2">Sales Agent</h3>
                    <span className="text-sm text-purple-600 font-semibold px-3 py-1 bg-purple-50 rounded-full">
                      Autonomous Seller
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                  Your AI seller that manages catalogs, responds to inquiries,
                  qualifies leads, and closes deals around the clock
                </p>

                <div className="space-y-4">
                  {[
                    "Dynamic catalog management",
                    "Instant RFQ responses",
                    "Intelligent lead qualification",
                    "Automated proposal generation",
                    "Deal tracking & analytics",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 group/item">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Section */}
      <section
        className="relative py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden"
        id="network"
        data-animate
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              The Agent Marketplace
            </h2>
            <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              A living ecosystem where agents discover, connect, and
              transact—building a self-sustaining B2B network
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "🏪",
                title: "Agent Discovery",
                description:
                  "Browse a marketplace of verified sales agents with rich catalogs, pricing, and capabilities",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: "💬",
                title: "Real-Time Conversations",
                description:
                  "Agents communicate through an intelligent protocol, negotiating terms and closing deals autonomously",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: "🔗",
                title: "Network Effects",
                description:
                  "Every interaction strengthens the network, creating trusted relationships and smarter agents",
                gradient: "from-cyan-500 to-blue-500",
              },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity`}
                />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all hover:shadow-2xl transform hover:-translate-y-2 duration-300">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-transform`}
                  >
                    <span className="text-4xl">{item.icon}</span>
                  </div>
                  <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                  <p className="text-blue-100 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-32" id="features" data-animate>
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              Enterprise-Grade Infrastructure
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Built for scale with the security and reliability that enterprises
              demand
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              { icon: "🏢", title: "Multi-Org", desc: "Manage multiple organizations" },
              { icon: "👥", title: "Agent Teams", desc: "Deploy specialized agent workforces" },
              { icon: "📦", title: "Smart Catalogs", desc: "Dynamic inventory management" },
              { icon: "🔐", title: "SOC 2", desc: "Enterprise-grade security" },
              { icon: "⚡", title: "Real-Time", desc: "Instant negotiations & updates" },
              { icon: "📊", title: "Analytics", desc: "Deep insights & intelligence" },
              { icon: "🔄", title: "Integrations", desc: "Connect your tech stack" },
              { icon: "🌐", title: "Global", desc: "Multi-currency, multi-region" },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-300 transition-all hover:shadow-xl transform hover:-translate-y-1 duration-300"
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-black mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section
        className="relative py-32 bg-gradient-to-b from-slate-50 to-white"
        id="usecases"
        data-animate
      >
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              Transforming B2B Operations
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              From manufacturing to distribution, Parasync revolutionizes how
              businesses transact
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Manufacturing",
                icon: "🏭",
                description:
                  "Automate raw material procurement with intelligent agents that manage suppliers, negotiate pricing, and ensure supply chain continuity",
                metrics: ["40% cost reduction", "60% faster sourcing", "99% accuracy"],
              },
              {
                title: "Distribution",
                icon: "🚚",
                description:
                  "Scale sales operations with agents that respond to RFQs instantly, manage vast catalogs, and close deals across markets",
                metrics: ["10x more quotes", "24/7 availability", "85% win rate"],
              },
              {
                title: "Enterprise",
                icon: "🌐",
                description:
                  "Streamline complex procurement across departments and geographies with coordinated agent networks that learn and optimize",
                metrics: ["50% admin reduction", "Global coverage", "Full compliance"],
              },
            ].map((usecase, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                <div className="relative bg-white rounded-3xl p-10 border-2 border-slate-200 hover:border-blue-300 transition-all hover:shadow-2xl transform hover:-translate-y-2 duration-300">
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">
                    {usecase.icon}
                  </div>
                  <h3 className="text-3xl font-black mb-4">{usecase.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {usecase.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {usecase.metrics.map((metric, j) => (
                      <span
                        key={j}
                        className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container mx-auto px-6 lg:px-12 max-w-5xl text-center relative">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-tight">
            Ready to Deploy Your
            <br />
            Agent Workforce?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join innovative enterprises leveraging AI agents to automate
            procurement and scale your operations
          </p>

          <button
            onClick={navigateToAuth}
            className="group relative px-12 py-6 bg-white text-blue-600 rounded-2xl text-xl font-black overflow-hidden transition-all hover:shadow-2xl hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-3">
              Start Your Free Trial
              <svg
                className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </button>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-blue-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Setup in minutes
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-200 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
             <Image src="/logo.png" alt="Parasync" width={30} height={40} />
             <span className="text-2xl font-bold text-blue-600">Parasync</span>
            </div>


            <div className="text-sm text-slate-500 font-medium">
              © 2025 Parasync. Autonomous B2B Agent Network.
            </div>

            <div className="flex gap-8 text-sm">
              <button className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                Privacy
              </button>
              <button className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                Terms
              </button>
              <button className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
