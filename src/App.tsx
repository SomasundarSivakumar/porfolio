import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { PORTFOLIO_DATA as data } from './data';
import {
  ExternalLink,
  Code,
  Mail,
  Rocket,
  ChevronDown,
  Layout,
  Database,
  Zap,
  Download,
  X,
  Phone
} from 'lucide-react';
import ParticleBackground from './components/ParticleBackground';
import { CoreIocn, GitHubIcon, LinkedinIcon } from './icon/icon';

const IconMap: Record<string, React.ReactNode> = {
  core: <CoreIocn className="text-primary w-6 h-6 animate-[spin_8s_linear_infinite]" />,
  ui: <Layout className="text-primary w-6 h-6 animate-pulse-glow" />,
  backend: <Database className="text-primary w-6 h-6 animate-float-small" />,
  performance: <Zap className="text-primary w-6 h-6 animate-wiggle" />,
};

const BrandLogo = () => (
  <a href="#" aria-label="Home" className="flex items-center space-x-3 group cursor-pointer z-50">
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(157,80,187,0.4)] overflow-visible">
        {/* Outer Hexagon Frame */}
        <polygon
          points="50 5, 89 27.5, 89 72.5, 50 95, 11 72.5, 11 27.5"
          fill="none"
          stroke="url(#logo-grad1)"
          strokeWidth="4"
          className="group-hover:stroke-white transition-colors duration-700"
        />
        {/* Inner Glow Background */}
        <polygon
          points="50 5, 89 27.5, 89 72.5, 50 95, 11 72.5, 11 27.5"
          fill="url(#logo-grad1)"
          className="opacity-10 group-hover:opacity-30 transition-opacity duration-700"
        />
        {/* S Layer 1 */}
        <path
          d="M 65 35 C 65 25, 35 25, 35 35 C 35 45, 65 52, 65 65 C 65 75, 35 75, 35 65"
          fill="none"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          className="origin-center group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-500 ease-out"
        />
        {/* S Layer 2 (Neon Accent) */}
        <path
          d="M 65 35 C 65 25, 35 25, 35 35 C 35 45, 65 52, 65 65 C 65 75, 35 75, 35 65"
          fill="none"
          stroke="url(#logo-grad2)"
          strokeWidth="8"
          strokeLinecap="round"
          className="origin-center opacity-60 group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-transform duration-500 ease-out mix-blend-screen"
        />
        <defs>
          <linearGradient id="logo-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="logo-grad2" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#e8b0ff" />
            <stop offset="100%" stopColor="#9d50bb" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <span className="font-bold text-xl hidden sm:block tracking-tight text-white/90 group-hover:text-white transition-colors duration-500 uppercase">
      Somasundar<span className="text-primary text-3xl leading-[0]">.</span>
    </span>
  </a>
);

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  useLayoutEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // Hero Sequence Logic
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        }
      });

      // Intro Name Scale
      heroTl.fromTo('.hero-name-intro',
        { scale: 4, opacity: 0, filter: 'blur(40px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 2, ease: 'power4.out' }
      )
        .to('.hero-name-intro', {
          y: -100,
          scale: 0.6,
          opacity: 0,
          duration: 1.5,
          ease: 'power2.inOut'
        }, '+=1')
        .fromTo('.hero-details > *',
          { y: 60, opacity: 0, filter: 'blur(20px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            stagger: 0.2,
            duration: 2,
            ease: 'expo.out'
          },
          '-=0.5'
        );

      // Section-level reveals (Containers)
      const sections = gsap.utils.toArray<HTMLElement>('.reveal');
      sections.forEach((section) => {
        gsap.fromTo(section,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 92%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      });

      // Child reveals (Headings & Paragraphs)
      const childReveals = gsap.utils.toArray<HTMLElement>('.reveal-child');
      childReveals.forEach((child) => {
        gsap.fromTo(child,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
              trigger: child,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      });

      // Skills grid - Centered spread one by one on scroll
      const cards = gsap.utils.toArray<HTMLElement>('.skill-card');
      if (cards.length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1.5,
          }
        });

        cards.forEach((card, i) => {
          // Calculate displacement from center for a 'spread' effect
          // Since it's 4 columns, we displace based on index
          const xOffset = (i - 1.5) * 100; // This spreads them horizontally from center

          tl.fromTo(card,
            {
              x: xOffset,
              y: 50,
              opacity: 0,
              scale: 0.8,
              filter: 'blur(10px)'
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              duration: 1,
              ease: 'power3.out'
            },
            i * 0.2 // Stagger
          );
        });
      }

      // Experience staggered reveal
      const expItems = gsap.utils.toArray<HTMLElement>('.exp-item');
      if (expItems.length > 0) {
        gsap.fromTo(expItems,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '#experience',
              start: 'top 80%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }

      // Projects staggered reveal
      const projectCards = gsap.utils.toArray<HTMLElement>('.project-card');
      if (projectCards.length > 0) {
        gsap.fromTo(projectCards,
          { y: 80, opacity: 0, scale: 0.95, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            stagger: 0.1,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: '#projects .grid',
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }

      // Typing animation for section headers (Safe staggered span approach)
      const typingTexts = gsap.utils.toArray<HTMLElement>('.type-text');
      typingTexts.forEach((el) => {
        // Only parse once to prevent React hydration conflicts
        if (!el.querySelector('.char')) {
          const text = el.innerText;
          el.innerHTML = '';
          text.split('').forEach(char => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            span.className = 'char inline-block';
            el.appendChild(span);
          });
        }

        gsap.fromTo(el.querySelectorAll('.char'),
          { opacity: 0 },
          {
            opacity: 1,
            stagger: 0.03,
            duration: 0.1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      });

      // Magnetic effect for all buttons
      const magneticBtns = containerRef.current?.querySelectorAll('.magnetic-btn');
      magneticBtns?.forEach((btn) => {
        const moveBtn = (e: any) => {
          const boundRect = (btn as HTMLElement).getBoundingClientRect();
          const x = e.clientX - boundRect.left - boundRect.width / 2;
          const y = e.clientY - boundRect.top - boundRect.height / 2;
          gsap.to(btn, { x: x * 0.45, y: y * 0.45, duration: 0.35 });
        };
        const resetBtn = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
        };
        btn.addEventListener('mousemove', moveBtn);
        btn.addEventListener('mouseleave', resetBtn);
      });
    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(() => { });
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-background text-white selection:bg-primary selection:text-white">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-gradient-x" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-dark/20 rounded-full blur-[120px] animate-gradient-x" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20"
          style={{ backgroundImage: 'radial-gradient(var(--primary-dark) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Global Particles */}
        <ParticleBackground count={250} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-lg ">
        <BrandLogo />
        <div className="hidden md:flex space-x-8 text-sm font-medium uppercase tracking-widest text-slate-400">
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a href="#skills" className="hover:text-primary transition-colors">Skills</a>
          <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#contact" className="px-5 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 transform active:scale-95">Hire Me</a>
        </div>
      </nav>

      {/* Hero Section Container for Pinning */}
      <section className="hero-section relative  overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover  pointer-events-none "
        >
          <source src="/assets/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-primary-dark/20 to-black/90 pointer-events-none" />

        <div className="min-h-screen flex flex-col justify-center items-center px-6 relative text-center overflow-hidden z-10">
          {/* Initial Name Intro */}
          <div className="hero-name-intro absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <h2 className="text-4xl md:text-8xl  tracking-wide italic text-white">
              Hi, I'm {data.profile.name}
            </h2>
          </div>

          {/* Hero Content Details */}
          <div className="hero-details max-w-4xl space-y-8 z-10">
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-200">
              {data.hero.headline}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {data.hero.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <a href="#projects" className="magnetic-btn px-8 py-4 bg-primary rounded-full hover:scale-105 transition-transform font-bold shadow-lg shadow-primary/20">
                {data.hero.cta}
              </a>
              <a href="#contact" className="magnetic-btn px-8 py-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10 font-bold backdrop-blur">
                {data.hero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="absolute bottom-10 animate-bounce cursor-pointer flex flex-col items-center opacity-50">
            <span className="text-xs uppercase tracking-widest mb-2 font-mono">Scroll to explore</span>
            <ChevronDown className="text-primary" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 max-w-6xl mx-auto reveal">
        <div className="grid md:grid-row gap-12 text-center md:text-left">
          <h2 className="text-4xl text-center md:text-6xl font-black mb-8 reveal-child type-text">{data.about.title}</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 text-lg reveal-child">
              {data.about.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="relative group overflow-hidden rounded-2xl border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              {/* Profile/Experience Info Card */}
              <div className="p-8 space-y-6">
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-slate-500 uppercase tracking-widest text-xs">Role</span>
                  <span>{data.profile.role}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-slate-500 uppercase tracking-widest text-xs">Experience</span>
                  <span>{data.profile.experience}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-slate-500 uppercase tracking-widest text-xs">Location</span>
                  <span>{data.profile.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="py-32 px-6 relative overflow-hidden">

        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-float" />
        <div className="absolute bottom-[-10%] left-1/4 w-[500px] h-[500px] bg-primary-dark/20 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto reveal relative z-10">
          <div className="text-center mb-16 reveal-child">
            <h2 className="text-4xl md:text-6xl font-black mb-4 type-text">Mastering the Web</h2>
            <p className="text-slate-500">My technical arsenal for building high-performance applications.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 skills-grid">
            {data.skills.categories.map((cat, i) => (
              <div
                key={i}
                className="skill-card p-8 rounded-3xl group relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 border-t-white/20 border-l-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.06] hover:shadow-[0_15px_40px_rgba(157,80,187,0.2)] hover:border-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg relative z-10">
                  {IconMap[cat.icon as string] || <Code className="text-primary w-6 h-6" />}
                </div>
                <h3 className="text-xl font-bold mb-6 text-white group-hover:text-primary-light transition-colors relative z-10">{cat.title}</h3>
                <ul className="space-y-3 relative z-10">
                  {cat.items.map((skill, j) => (
                    <li key={j} className="text-slate-400 flex items-center group/item hover:text-white transition-colors">
                      <div className="w-1.5 h-1.5 bg-primary/50 group-hover/item:bg-primary rounded-full mr-3 transition-colors shadow-[0_0_5px_rgba(157,80,187,0)] group-hover/item:shadow-[0_0_8px_rgba(157,80,187,0.8)]" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="experience" className="py-32 px-6 reveal max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black mb-16 reveal-child type-text">Professional Journey</h2>
        <div className="space-y-12">
          {data.experience.map((exp, i) => (
            <div key={i} className="relative pl-8 md:pl-12 border-l border-white/10 group exp-item">
              <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-primary rounded-full ring-4 ring-primary/20 group-hover:scale-150 transition-transform" />
              <div className="flex flex-col md:flex-row md:justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{exp.role}</h3>
                  <p className="text-primary font-medium">{exp.company}</p>
                </div>
                <span className="text-slate-500 font-mono mt-1 md:mt-0">{exp.duration}</span>
              </div>
              <ul className="space-y-4 text-slate-400 max-w-4xl">
                {exp.impact.map((point, j) => (
                  <li key={j} className="flex items-start">
                    <span className="mr-2 text-primary">→</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="py-32 px-6 reveal">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-4 type-text">Featured Work</h2>
              <p className="text-slate-500">Selected projects that showcase UI engineering and performance optimization.</p>
            </div>
            {/* <a href="https://github.com/yourusername" className="text-primary flex items-center group font-medium border-b border-primary/20 pb-1">
              View all projects <Rocket className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {data.projects.featured.map((project, i) => (
              <div key={i} className="project-card group relative bg-glass rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90 z-10 pointer-events-none" />
                <div className="h-[300px] md:h-[400px] bg-slate-900 group-hover:scale-105 transition-transform duration-700 relative flex items-center justify-center">
                  {/* Automated Screenshot */}
                  <img
                    src={(project as any).image}
                    alt={project.name}
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-50 group-hover:opacity-100 transition-opacity duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black">{project.name}</h3>
                      <p className="text-slate-300 max-w-md line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.tech.map((t, j) => (
                          <span key={j} className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono">{t}</span>
                        ))}
                      </div>
                    </div>
                    <a href={project.link} target="_blank" rel="noreferrer" className="p-4 bg-white rounded-full text-zinc-900 hover:scale-110 transition-transform">
                      <ExternalLink className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center reveal">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary-dark rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-primary/20">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight type-text">{data.contact.title}</h2>
          <p className="text-lg md:text-xl text-white/80 mb-12">{data.contact.subtext}</p>
          <button onClick={() => setIsModalOpen(true)} className="magnetic-btn cursor-pointer px-10 py-5 bg-white text-zinc-900 rounded-full font-black text-xl hover:scale-110 transition-transform inline-flex items-center">
            Say Hello <Mail className="ml-3" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left space-y-4">
            <div className="flex justify-center md:justify-start">
              <BrandLogo />
            </div>
            <p className="text-slate-500">Creating high-impact digital experiences based in Ramanathapuram, India.</p>
            <div className="flex justify-center md:justify-start space-x-3">
              <a href={data.contact.links.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors"><GitHubIcon width='30' /></a>
              <a href={data.contact.links.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors"><LinkedinIcon width='30' /></a>
            </div>
          </div>

          <div className="text-center md:text-right space-y-4">
            <p className="text-sm uppercase tracking-widest text-slate-500">Contact</p>
            <div className="flex flex-col md:items-end space-y-3">
              <a href={`mailto:${data.contact.email}`} className="flex items-center justify-center md:justify-end space-x-3 text-2xl font-bold hover:text-primary transition-colors group">
                <Mail className="w-6 h-6 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                <span>{data.contact.email}</span>
              </a>
              {data.contact.phone && (
                <a href={`tel:${data.contact.phone.replace(/\s+/g, '')}`} className="flex items-center justify-center md:justify-end space-x-3 text-xl font-bold text-slate-400 hover:text-primary transition-colors group">
                  <Phone className="w-5 h-5 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>{data.contact.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 text-center text-slate-600 text-xs">
          © {new Date().getFullYear()} Somasundar S. All rights reserved. Built with React & GSAP.
        </div>
      </footer>

      {/* Contact Modal */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 bg-black/60 backdrop-blur-md ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => {
          setIsModalOpen(false);
          setTimeout(() => setShowThanks(false), 500);
        }}
      >
        <div
          className={`relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-primary/20 transition-all duration-500 transform ${isModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => {
              setIsModalOpen(false);
              setTimeout(() => setShowThanks(false), 500);
            }}
            className="absolute top-6 cursor-pointer right-6 text-slate-400 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>

          <h3 className="text-3xl font-black mb-2">Get in touch</h3>
          <p className="text-slate-400 mb-8">Feel free to reach out via email or download my resume.</p>

          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-500 mb-2">Email Address</p>
              <a href={`mailto:${data.contact.email}`} className="flex items-center space-x-3 text-xl font-bold hover:text-primary transition-colors group break-all">
                <Mail className="w-6 h-6 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                <span>{data.contact.email}</span>
              </a>
            </div>

            {data.contact.phone && (
              <div>
                <p className="text-sm uppercase tracking-widest text-slate-500 mb-2">Phone</p>
                <a href={`tel:${data.contact.phone.replace(/\s+/g, '')}`} className="flex items-center space-x-3 text-xl font-bold hover:text-primary transition-colors group">
                  <Phone className="w-6 h-6 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>{data.contact.phone}</span>
                </a>
              </div>
            )}

            <div className="pt-6 border-t border-white/10">
              {showThanks ? (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-center font-medium animate-fade-in relative overflow-hidden group">
                  <div className="absolute inset-0 bg-green-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  Thanks for downloading! Looking forward to connecting.
                </div>
              ) : (
                <a
                  href="/assets/somasundar.pdf"
                  download="somasundar.pdf"
                  onClick={() => setShowThanks(true)}
                  className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform relative z-10" />
                  <span className="relative z-10">Download Resume</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
