"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function FloatingOrb({ className, color, delay = 0 }: { className?: string; color: string; delay?: number }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-30 animate-float ${className}`}
      style={{
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

function GridPattern() {
  return (
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `
        linear-gradient(to right, #1A1A2E 1px, transparent 1px),
        linear-gradient(to bottom, #1A1A2E 1px, transparent 1px)
      `,
      backgroundSize: '48px 48px',
    }} />
  );
}

function HeroTitle() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative">
      {/* 背景文字阴影层 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 
          className="font-display text-[12rem] sm:text-[16rem] md:text-[20rem] lg:text-[24rem] font-bold tracking-tight opacity-5 select-none pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #FF6B6B, #FFB347)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          SBTI
        </h1>
      </div>
      
      {/* 主标题 */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="mb-4">
          <span 
            className="inline-block px-6 py-2 rounded-full text-sm font-medium transform -rotate-2"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 179, 71, 0.1))',
              border: '1px solid rgba(255, 107, 107, 0.2)',
              color: '#FF6B6B',
            }}
          >
            灵感来自 B站 @蛆肉儿串儿
          </span>
        </div>
        
        <h1 
          className="font-display text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-bold tracking-tighter leading-[0.85] mb-4"
          style={{
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 50%, #FF8E72 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 4px 8px rgba(255, 107, 107, 0.3))',
          }}
        >
          SBTI
        </h1>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <div 
            className="h-1 w-16 rounded-full"
            style={{ background: 'linear-gradient(90deg, #FF6B6B, #FFB347)' }}
          />
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A2E] tracking-tight">
            人格测试
          </h2>
          <div 
            className="h-1 w-16 rounded-full"
            style={{ background: 'linear-gradient(90deg, #FFB347, #FF6B6B)' }}
          />
        </div>
        
        <p 
          className="text-xl sm:text-2xl md:text-3xl font-medium"
          style={{ color: '#6B7280' }}
        >
          <span 
            className="font-semibold"
            style={{ color: '#FF6B6B' }}
          >
            AI
          </span>
          {' '}重制版
        </p>
      </div>
    </div>
  );
}

function Stats() {
  const stats = [
    { number: "31", label: "道题目", color: "#FF6B6B" },
    { number: "15", label: "个维度", color: "#4ECDC4" },
    { number: "27", label: "种人格", color: "#A78BFA" },
  ];
  
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex items-center justify-center gap-6 sm:gap-10 mb-12 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {stats.map((stat, index) => (
        <div key={index} className="relative group">
          <div 
            className="absolute inset-0 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"
            style={{ background: stat.color }}
          />
          <div className="relative px-5 py-3 sm:px-6 sm:py-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-[#E8E5E0] shadow-sm">
            <div className="flex items-baseline gap-2">
              <span 
                className="text-3xl sm:text-4xl font-display font-bold"
                style={{ color: stat.color }}
              >
                {stat.number}
              </span>
              <span className="text-sm sm:text-base text-[#6B7280]">
                {stat.label}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`group p-6 rounded-3xl bg-white border border-[#E8E5E0] shadow-sm hover:shadow-xl hover:border-transparent transition-all duration-500 cursor-pointer ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div 
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 179, 71, 0.1))' }}
      >
        {icon}
      </div>
      <h3 className="font-display font-bold text-lg text-[#1A1A2E] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#6B7280] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function CTAButton({ href, primary, children, delay = 0 }: { href: string; primary?: boolean; children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (primary) {
    return (
      <div className={`transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Link
          href={href}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-display font-semibold text-lg text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #FF6B6B, #FFB347, #FF8E72)',
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 3s ease infinite',
            boxShadow: '0 8px 32px rgba(255, 107, 107, 0.35)',
          }}
        >
          <span className="relative z-10 flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {children}
          </span>
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)',
            }}
          />
        </Link>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <Link
        href={href}
        className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-display font-semibold text-lg text-[#1A1A2E] bg-white border-2 border-[#E8E5E0] hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-all duration-300"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        {children}
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: '#FDFBF7' }}>
      {/* 背景装饰层 */}
      <div className="fixed inset-0 pointer-events-none">
        <GridPattern />
        
        {/* 光晕装饰 */}
        <div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(255, 107, 107, 0.4), transparent 70%)' }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(78, 205, 196, 0.4), transparent 70%)' }}
        />
        
        {/* 漂浮光球 */}
        <FloatingOrb className="w-40 h-40 top-20 left-10" color="rgba(255, 107, 107, 0.5)" delay={0} />
        <FloatingOrb className="w-32 h-32 top-40 right-20" color="rgba(255, 179, 71, 0.5)" delay={200} />
        <FloatingOrb className="w-24 h-24 bottom-40 left-1/3" color="rgba(78, 205, 196, 0.5)" delay={400} />
        <FloatingOrb className="w-20 h-20 bottom-20 right-1/3" color="rgba(167, 139, 250, 0.5)" delay={600} />
        
        {/* 装饰线条 */}
        <div 
          className="absolute top-1/3 left-0 w-32 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.3), transparent)' }}
        />
        <div 
          className="absolute bottom-1/3 right-0 w-40 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(78, 205, 196, 0.3), transparent)' }}
        />
      </div>

      {/* 主内容区域 */}
      <div className="relative z-10">
        {/* 顶部导航留白 */}
        <div className="h-8" />

        {/* Hero区域 */}
        <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 pt-12 pb-8">
          <HeroTitle />
          <Stats />
          
          {/* CTA按钮 */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <CTAButton href="/test" primary>
              开始测试
            </CTAButton>
            <CTAButton href="/types">
              浏览人格图鉴
            </CTAButton>
          </div>
        </section>

        {/* 特色介绍区域 */}
        <section className="relative px-4 py-16 max-w-5xl mx-auto">
          {/* 装饰 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full" 
            style={{ background: 'linear-gradient(90deg, #FF6B6B, #FFB347)' }} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              delay={0}
              icon={
                <svg className="w-7 h-7 text-[#FF6B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.121 2.121L5.636 5.636m12.728 12.728L13.95 13.95M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              }
              title="趣味测试题"
              description="31道精选题目，贴近年轻人生活场景，答题就像在和朋友聊天"
            />
            <FeatureCard
              delay={100}
              icon={
                <svg className="w-7 h-7 text-[#4ECDC4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="15维雷达图"
              description="完整的人格分析，多维度雷达图可视化，深入了解自己的性格特征"
            />
            <FeatureCard
              delay={200}
              icon={
                <svg className="w-7 h-7 text-[#A78BFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="27种人格"
              description="涵盖各种性格类型，总有一款最像你，还有隐藏人格等待解锁"
            />
          </div>
        </section>

        {/* 底部提示区域 */}
        <section className="px-4 py-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-[#E8E5E0]">
            <svg className="w-5 h-5 text-[#4ECDC4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm text-[#6B7280]">
              纯前端应用 · 数据本地计算 · 无需登录
            </span>
          </div>
        </section>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F7F5F0] to-transparent pointer-events-none" />
    </main>
  );
}
