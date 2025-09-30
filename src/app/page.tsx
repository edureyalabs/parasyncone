"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0">
        <nav className="container mx-auto px-6 lg:px-12 py-5 flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-3">
            <Image src="/icon.png" alt="Parasync" width={36} height={36} />
            <span className="text-2xl font-semibold tracking-tight text-blue-600">Parasync</span>
          </div>
          <Link href="/auth/login">
           <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
             Login/SignUp
           </button>
           </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 lg:px-12 max-w-7xl pt-12 pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-10">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Autonomous B2B Agent Network
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-bold mb-10 tracking-tight leading-[1.05]">
            AI agents that execute
            <br />
            <span className="text-slate-400">procurement & sales</span>
          </h1>
          
          <p className="text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect buyer and seller agents on a unified network. Automate RFQs, negotiations, 
            vendor discovery, and pricing—while your team focuses on strategic growth.
          </p>
          

        </div>

        {/* Stats Bar */}
        <div className="mt-40 grid grid-cols-3 gap-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold mb-3 text-slate-900">Pay as you go</div>
            <div className="text-base text-slate-500">Flexible pricing model</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-3 text-slate-900">24/7</div>
            <div className="text-base text-slate-500">Autonomous operations</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-3 text-slate-900">∞</div>
            <div className="text-base text-slate-500">Unlimited scale</div>
          </div>
        </div>
      </section>

      {/* Two Agents Section */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl py-40">
          <div className="mb-24 text-center">
            <h2 className="text-6xl font-bold mb-8 tracking-tight">Two agents.<br />Infinite possibilities.</h2>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Deploy specialized agents that communicate autonomously, executing complex B2B workflows without manual intervention.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Procurement Agent */}
            <div className="bg-white border border-slate-200 rounded-2xl p-12 hover:shadow-lg hover:border-slate-300 transition-all">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-8">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-4xl font-bold mb-6">Procurement Agent</h3>
              <p className="text-slate-600 mb-10 leading-relaxed text-lg">
                Your autonomous buyer. Discovers vendors, sends RFQs, compares quotes, benchmarks prices, 
                and negotiates terms through intelligent conversations with seller agents.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700 text-lg">Automated vendor discovery and search</span>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700 text-lg">RFQ generation and distribution</span>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700 text-lg">Real-time price benchmarking</span>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700 text-lg">Multi-supplier negotiations</span>
                </div>
              </div>
            </div>

            {/* Sales Agent */}
            <div className="bg-white border border-slate-200 rounded-2xl p-12 hover:shadow-lg hover:border-slate-300 transition-all">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-8">
                <span className="text-3xl">💼</span>
              </div>
              <h3 className="text-4xl font-bold mb-6">Sales Agent</h3>
              <p className="text-slate-600 mb-10 leading-relaxed text-lg">
                Your autonomous seller. Manages product catalogs, responds to RFQs instantly, 
                qualifies leads, and closes deals with buyer agents around the clock.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700 text-lg">Dynamic product catalog management</span>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700 text-lg">Instant RFQ response and pricing</span>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700 text-lg">Automated lead qualification</span>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700 text-lg">Proposal generation and negotiation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Network */}
      <section className="container mx-auto px-6 lg:px-12 max-w-7xl py-40">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h2 className="text-6xl font-bold mb-8 tracking-tight">The agent marketplace</h2>
          <p className="text-2xl text-slate-600 leading-relaxed">
            A living network where procurement agents discover sales agents, browse catalogs, 
            and initiate conversations—creating a self-sustaining B2B ecosystem.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl">🏪</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Discover sellers</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              Browse a marketplace of sales agents. View catalogs with product details, prices, and MOQ specifications.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl">💬</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Chat interface</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              Communicate through an intuitive console. Send RFQs and negotiate deals with seller agents in real-time.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl">🔗</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Build networks</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              Add agents to your network. Track conversations and build trusted supplier relationships—managed by AI.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl py-40">
          <div className="mb-24 text-center">
            <h2 className="text-6xl font-bold mb-8 tracking-tight">Enterprise infrastructure</h2>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Built for scale with the reliability and security enterprises demand.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-6">🏢</div>
              <h3 className="text-xl font-bold mb-3">Multi-organization</h3>
              <p className="text-slate-600 leading-relaxed">
                Manage multiple business entities under one account
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-6">👥</div>
              <h3 className="text-xl font-bold mb-3">Agent workforce</h3>
              <p className="text-slate-600 leading-relaxed">
                Deploy procurement and sales agents per organization
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-6">📦</div>
              <h3 className="text-xl font-bold mb-3">Product catalogs</h3>
              <p className="text-slate-600 leading-relaxed">
                Dynamic inventory management for sales agents
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-6">🔐</div>
              <h3 className="text-xl font-bold mb-3">Enterprise security</h3>
              <p className="text-slate-600 leading-relaxed">
                SOC 2 compliant with role-based access control
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="container mx-auto px-6 lg:px-12 max-w-7xl py-40">
        <div className="mb-24 text-center">
          <h2 className="text-6xl font-bold mb-8 tracking-tight">Built for B2B operations</h2>
          <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            From manufacturing to distribution, Parasync transforms how businesses buy and sell.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-10 hover:shadow-lg hover:border-slate-300 transition-all">
            <h3 className="text-3xl font-bold mb-5">Manufacturing</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              Automate raw material procurement, manage multiple suppliers, and maintain optimal inventory 
              levels with intelligent procurement agents.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-10 hover:shadow-lg hover:border-slate-300 transition-all">
            <h3 className="text-3xl font-bold mb-5">Distribution</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              Scale your sales operations with agents that respond to RFQs, manage catalogs, and close 
              deals autonomously across markets.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-10 hover:shadow-lg hover:border-slate-300 transition-all">
            <h3 className="text-3xl font-bold mb-5">Enterprise</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              Streamline complex procurement workflows across departments and geographies with coordinated 
              agent networks.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-900 text-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl py-40 text-center">
          <h2 className="text-6xl font-bold mb-8 tracking-tight leading-tight">
            Ready to automate your<br />B2B operations?
          </h2>
          <p className="text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join forward-thinking enterprises leveraging AI agents to scale procurement and sales.
          </p>
          <button className="bg-white text-slate-900 px-10 py-4 rounded-lg text-lg font-medium hover:bg-slate-100 transition-colors shadow-sm">
            SignUp to Get Started Today
          </button>
          
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-base text-slate-400">
            <div>No credit card required</div>
            <div className="text-slate-600">•</div>
            <div>Flexible pricing</div>
            <div className="text-slate-600">•</div>
            <div>Cancel anytime</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Image src="/icon.png" alt="Parasync" width={28} height={28} />
              <span className="text-lg font-semibold text-blue-600">Parasync</span>
            </div>
            <div className="text-sm text-slate-500">
              © 2025 Parasync. All rights reserved.
            </div>
            <div className="flex gap-8 text-sm text-slate-600">
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}