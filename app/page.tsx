"use client";

import type React from "react";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Play,
  ArrowRight,
  Code2,
  Zap,
  Eye,
  Terminal,
  Cpu,
  Network,
} from "lucide-react";

const wrapWordsForAnimation = (text: string, className = "word") => {
  return text.split(" ").map((word, index) => (
    <span key={index} className={className}>
      {word}
      {index < text.split(" ").length - 1 ? "\u00A0" : ""}
    </span>
  ));
};

const AnimatedButton = ({
  children,
  leftIcon,
  rightIcon,
  className = "",
  animationType = "bounce" | "fall",
  ...props
}: {
  children: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  animationType?: "bounce" | "fall";
  [key: string]: any;
}) => {
  const animationClass =
    animationType === "bounce" ? "word-bounce" : "word-fall";

  return (
    <Button
      className={`animated-button ${animationClass} ${className}`}
      {...props}
    >
      {leftIcon && <span className="icon-left">{leftIcon}</span>}
      <span className="text-content">{wrapWordsForAnimation(children)}</span>
      {rightIcon && <span className="icon-right">{rightIcon}</span>}
    </Button>
  );
};

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BlenderMCPLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.set(".hero-title", { y: 100, opacity: 0 });
    gsap.set(".hero-subtitle", { y: 50, opacity: 0 });
    gsap.set(".hero-cta", { y: 30, opacity: 0, scale: 0.9 });
    gsap.set(".nav-item", { y: -20, opacity: 0 });

    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ delay: 0.3 });

      heroTl
        .to(".hero-title", {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
        })
        .to(
          ".hero-subtitle",
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .to(
          ".hero-cta",
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.6"
        );

      gsap.to(".nav-item", {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        delay: 1,
      });

      if (
        videoSectionRef.current &&
        videoRef.current &&
        videoContainerRef.current
      ) {
        const videoSection = videoSectionRef.current;
        const video = videoRef.current;
        const videoContainer = videoContainerRef.current;

        gsap.set(videoContainer, {
          width: "60%",
          height: "60vh",
          borderRadius: "16px",
          transformOrigin: "center center",
        });

        // Set initial states for overlay elements
        gsap.set(".video-overlay-content", { opacity: 1, y: 0, scale: 1 });
        gsap.set(".video-controls-overlay", { opacity: 0 });
        gsap.set(".continue-scroll-indicator", { opacity: 0, y: 20 });

        // Auto-play video when it comes into view
        ScrollTrigger.create({
          trigger: videoSection,
          start: "top 80%",
          onEnter: () => {
            video.play().catch(console.log);
          },
          onLeave: () => {
            video.pause();
          },
          onEnterBack: () => {
            video.play().catch(console.log);
          },
          onLeaveBack: () => {
            video.pause();
          },
        });

        // Single smooth scroll trigger for video expansion and viewing
        ScrollTrigger.create({
          trigger: videoSection,
          start: "top top",
          end: "+=400vh",
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          ease: "power2.out",
          onUpdate: (self) => {
            const progress = self.progress;

            // Phase 1: Expansion (0 to 0.7 progress)
            if (progress <= 0.7) {
              const expansionProgress = progress / 0.7;

              // Smooth video container expansion
              const width = gsap.utils.interpolate(60, 100, expansionProgress);
              const height = gsap.utils.interpolate(60, 100, expansionProgress);
              const borderRadius = gsap.utils.interpolate(
                16,
                0,
                expansionProgress
              );

              gsap.set(videoContainer, {
                width: `${width}%`,
                height: `${height}vh`,
                borderRadius: `${borderRadius}px`,
              });

              // Smooth overlay fade
              gsap.set(".video-overlay-content", {
                opacity: gsap.utils.interpolate(1, 0, expansionProgress),
                y: gsap.utils.interpolate(0, -30, expansionProgress),
                scale: gsap.utils.interpolate(1, 0.95, expansionProgress),
              });

              // Video scale effect
              gsap.set(video, {
                scale: gsap.utils.interpolate(1, 1.02, expansionProgress),
              });

              // Scroll indicator
              gsap.set(".video-scroll-indicator", {
                opacity: gsap.utils.interpolate(1, 0, expansionProgress),
              });

              // Hide controls during expansion
              gsap.set(".video-controls-overlay", { opacity: 0 });
              gsap.set(".continue-scroll-indicator", { opacity: 0 });
            }

            // Phase 2: Viewing (0.7 to 1.0 progress)
            else {
              const viewingProgress = (progress - 0.7) / 0.3;

              // Keep video at full size
              gsap.set(videoContainer, {
                width: "100%",
                height: "100vh",
                borderRadius: "0px",
              });

              // Show controls
              gsap.set(".video-controls-overlay", {
                opacity: gsap.utils.interpolate(
                  0,
                  0.8,
                  Math.min(viewingProgress * 3, 1)
                ),
              });

              // Show continue indicator towards the end
              if (viewingProgress > 0.5) {
                gsap.set(".continue-scroll-indicator", {
                  opacity: gsap.utils.interpolate(
                    0,
                    1,
                    (viewingProgress - 0.5) * 2
                  ),
                  y: gsap.utils.interpolate(20, 0, (viewingProgress - 0.5) * 2),
                });
              }

              // Subtle breathing effect
              gsap.set(video, {
                scale: 1.02 + Math.sin(viewingProgress * Math.PI * 2) * 0.005,
              });

              // Hide scroll indicator
              gsap.set(".video-scroll-indicator", { opacity: 0 });
              gsap.set(".video-overlay-content", { opacity: 0 });
            }
          },
        });
      }

      // Enhanced card animations
      gsap.utils
        .toArray(".feature-card")
        .forEach((card: any, index: number) => {
          // Initial state
          gsap.set(card, {
            y: 100,
            opacity: 0,
            rotationX: 15,
            scale: 0.9,
          });

          // Entrance animation
          gsap.to(card, {
            y: 0,
            opacity: 1,
            rotationX: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            delay: index * 0.2,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });

          // Hover animations
          card.addEventListener("mouseenter", () => {
            gsap.to(card, {
              y: -20,
              scale: 1.05,
              rotationY: 5,
              boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
              duration: 0.6,
              ease: "power3.out",
            });

            // Animate icon
            const icon = card.querySelector(".feature-icon");
            if (icon) {
              gsap.to(icon, {
                scale: 1.2,
                rotation: 10,
                duration: 0.4,
                ease: "back.out(1.7)",
              });
            }

            // Animate background gradient
            const bg = card.querySelector(".feature-bg");
            if (bg) {
              gsap.to(bg, {
                scale: 1.1,
                opacity: 0.8,
                duration: 0.6,
                ease: "power2.out",
              });
            }
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              rotationY: 0,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              duration: 0.6,
              ease: "power3.out",
            });

            // Reset icon
            const icon = card.querySelector(".feature-icon");
            if (icon) {
              gsap.to(icon, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: "power2.out",
              });
            }

            // Reset background
            const bg = card.querySelector(".feature-bg");
            if (bg) {
              gsap.to(bg, {
                scale: 1,
                opacity: 0.6,
                duration: 0.6,
                ease: "power2.out",
              });
            }
          });
        });

      // Section reveals
      gsap.utils.toArray(".fade-up").forEach((element: any) => {
        gsap.fromTo(
          element,
          {
            y: 60,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Text reveals
      gsap.utils.toArray(".text-reveal").forEach((text: any) => {
        gsap.fromTo(
          text,
          {
            y: 40,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: text,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Parallax effect
      gsap.to(".parallax-bg", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Floating elements
      gsap.to(".float-1", {
        y: -20,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(".float-2", {
        y: 15,
        x: 10,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(".float-3", {
        y: -25,
        x: -5,
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Button hover effects
      gsap.utils.toArray(".btn-hover").forEach((btn: any) => {
        btn.addEventListener("mouseenter", () => {
          gsap.to(btn, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        btn.addEventListener("mouseleave", () => {
          gsap.to(btn, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Card hover effects
      gsap.utils.toArray(".card-hover").forEach((card: any) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -10,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            duration: 0.4,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            duration: 0.4,
            ease: "power2.out",
          });
        });
      });

      // Scroll progress
      gsap.to(".progress-bar", {
        scaleX: 1,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });

      // Beautiful letter-by-letter text animations
      gsap.utils.toArray(".letter-animate").forEach((element: any) => {
        const text = element.textContent;
        element.innerHTML = text
          .split("")
          .map((char: string) =>
            char === " " ? " " : `<span class="letter">${char}</span>`
          )
          .join("");

        gsap.fromTo(
          element.querySelectorAll(".letter"),
          {
            y: 100,
            opacity: 0,
            rotationX: -90,
            transformOrigin: "50% 50% -50px",
          },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            stagger: 0.02,
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Word-by-word animations for highlighted text
      gsap.utils.toArray(".word-animate").forEach((element: any) => {
        const text = element.textContent;
        element.innerHTML = text
          .split(" ")
          .map((word: string) => `<span class="word">${word}</span>`)
          .join(" ");

        gsap.fromTo(
          element.querySelectorAll(".word"),
          {
            y: 50,
            opacity: 0,
            scale: 0.8,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-white text-gray-900 overflow-x-hidden"
    >
      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div className="progress-bar h-full bg-gradient-to-r from-blue-500 to-purple-500 origin-left scale-x-0"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="nav-item text-xl font-semibold word-fall">
            {wrapWordsForAnimation("Blender MCP")}
          </div>
          <div className="flex items-center space-x-8">
            <a
              href="#about"
              className="nav-item text-sm text-gray-600 hover:text-gray-900 transition-colors word-fall"
            >
              {wrapWordsForAnimation("About")}
            </a>
            <a
              href="#demo"
              className="nav-item text-sm text-gray-600 hover:text-gray-900 transition-colors word-fall"
            >
              {wrapWordsForAnimation("Demo")}
            </a>
            <a
              href="#setup"
              className="nav-item text-sm text-gray-600 hover:text-gray-900 transition-colors word-fall"
            >
              {wrapWordsForAnimation("Setup")}
            </a>
            <AnimatedButton
              size="sm"
              className="nav-item btn-hover bg-gray-900 hover:bg-gray-800"
              leftIcon={<Github className="w-4 h-4" />}
              animationType="bounce"
              onClick={() =>
                window.open(
                  "https://github.com/pranav-deshmukh/blender-mcp-demo",
                  "_blank"
                )
              }
            >
              GitHub
            </AnimatedButton>
          </div>
        </div>
      </nav>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="float-1 absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-40"></div>
        <div className="float-2 absolute top-40 right-20 w-24 h-24 bg-purple-100 rounded-full opacity-50"></div>
        <div className="float-3 absolute bottom-40 left-1/3 w-20 h-20 bg-green-100 rounded-full opacity-45"></div>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="hero-title text-6xl md:text-8xl font-light mb-8 tracking-tight">
            Blender <span className="font-semibold">MCP</span>
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Turning AI into your creative Blender co-pilot.
          </p>
          <p className="hero-subtitle text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Realtime 3D Control via Model Context Protocol
          </p>
          <div className="hero-cta">
            <AnimatedButton
              size="lg"
              className="btn-hover bg-gray-900 hover:bg-gray-800 px-8 py-4 text-base rounded-full"
              leftIcon={<Play className="w-5 h-5" />}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              animationType="bounce"
            >
              Watch Demo
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Enhanced Feature Cards Section */}
      <section id="about" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="fade-up text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-tight">
              What is <span className="font-semibold">Blender MCP</span>?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Blender MCP (Model Context Protocol) is a seamless integration
              layer that empowers Large Language Models (LLMs) to take control
              of Blender using simple JSON instructions. It turns AI into a
              real-time 3D collaborator—through a fast and open TCP-based
              connection.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Real-time Control Card */}
            <div className="feature-card relative group cursor-pointer">
              <div className="feature-bg absolute inset-0 bg-gradient-to-br from-yellow-400/40 via-orange-500/40 to-red-500/40 rounded-3xl opacity-60 blur-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="feature-icon w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  Instant AI-to-3D Pipeline
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-base">
                  Generate, modify, and animate Blender scenes in real time by
                  connecting any LLM to the MCP server. No plugins, no manual
                  clicks—just pure AI-driven creativity.
                </p>
              </div>
            </div>

            {/* JSON Protocol Card */}
            <div className="feature-card relative group cursor-pointer">
              <div className="feature-bg absolute inset-0 bg-gradient-to-br from-blue-400/40 via-cyan-500/40 to-teal-500/40 rounded-3xl opacity-60 blur-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="feature-icon w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Code2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  Lightweight JSON Protocol
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-base">
                  Communicate using clean and structured JSON commands over TCP.
                  Designed for reliability, simplicity, and
                  extensibility—perfect for research and rapid prototyping.
                </p>
              </div>
            </div>

            {/* Plug & Play with Any LLM Card */}
            <div className="feature-card relative group cursor-pointer">
              <div className="feature-bg absolute inset-0 bg-gradient-to-br from-green-400/40 via-emerald-500/40 to-teal-500/40 rounded-3xl opacity-60 blur-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="feature-icon w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Network className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  Plug & Play with Any LLM
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-base">
                  Easily hook up models like Claude, ChatGPT, or open-source
                  LLMs to your Blender environment. Claude Desktop already
                  supports direct MCP server input—just add your server and
                  start building.
                </p>
              </div>
            </div>

            {/* Scene Manipulation Card */}
            <div className="feature-card relative group cursor-pointer">
              <div className="feature-bg absolute inset-0 bg-gradient-to-br from-purple-400/40 via-pink-500/40 to-rose-500/40 rounded-3xl opacity-60 blur-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="feature-icon w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  Scene Manipulation
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-base">
                  Complete control over 3D scenes, objects, materials, and
                  animations with precise command execution.
                </p>
              </div>
            </div>

            {/* Total Scene Control Card */}
            <div className="feature-card relative group cursor-pointer md:col-span-2 lg:col-span-1">
              <div className="feature-bg absolute inset-0 bg-gradient-to-br from-indigo-400/40 via-purple-500/40 to-pink-500/40 rounded-3xl opacity-60 blur-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="feature-icon w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Terminal className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  Total Scene Control
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-base">
                  Create meshes, move objects, apply materials, trigger
                  animations—Blender MCP gives the AI full access to manipulate
                  your 3D world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why it was made */}
      <section className="py-32 px-6 bg-gray-50 relative overflow-hidden parallax-section">
        <div className="parallax-bg absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="fade-up">
            <h2 className="letter-animate text-5xl md:text-7xl font-light mb-16 tracking-tight">
              Why We Built Blender MCP
            </h2>

            <div className="space-y-12 mb-16">
              <p className="word-animate text-2xl md:text-3xl font-light leading-relaxed text-gray-700 max-w-5xl mx-auto">
                Blender MCP was created to establish a standardized, universal
                interface between Large Language Models and 3D software like
                Blender—making AI-powered 3D creation accessible, fast, and
                intuitive.
              </p>

              <div className="relative">
                <p className="word-animate text-2xl md:text-3xl font-light leading-relaxed text-gray-700 max-w-5xl mx-auto">
                  Whether you're a Blender pro looking to speed up complex
                  workflows or a curious beginner
                  <span className="inline-block mx-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 font-medium">
                    (like us when we started!)
                  </span>
                  trying to bring your ideas to life without wrestling with UI
                  or scripting—
                  <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Blender MCP bridges that gap
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-12 border border-white/30">
                <p className="letter-animate text-3xl md:text-4xl font-light leading-relaxed text-gray-800">
                  We believe the future of 3D content lies in
                  <span className="font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mx-2">
                    natural language + real-time control
                  </span>
                  . This project makes that future usable today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="fade-up text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-tight">
              Project <span className="font-semibold">Details</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="fade-up">
              <h3 className="text-3xl font-light mb-12">Code Architecture</h3>
              <div className="card-container space-y-6">
                <div className="card-item flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Network className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">TCP Server</h4>
                    <p className="text-gray-600">
                      Handles incoming connections and JSON command parsing
                    </p>
                  </div>
                </div>

                <div className="card-item flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Cpu className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      Command Processor
                    </h4>
                    <p className="text-gray-600">
                      Translates JSON commands to Blender Python API calls
                    </p>
                  </div>
                </div>

                <div className="card-item flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Terminal className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      Scene Controller
                    </h4>
                    <p className="text-gray-600">
                      Manages 3D scene state and object manipulation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="fade-up">
              <div className="bg-gray-900 rounded-lg p-8 text-white">
                <h4 className="text-lg font-semibold mb-6 text-gray-300">
                  Example JSON Payload
                </h4>
                <pre className="text-sm text-green-400 overflow-x-auto leading-relaxed font-mono">
                  {`{
  "command": "create_object",
  "type": "cube",
  "name": "my_cube",
  "location": [0, 0, 0],
  "scale": [1, 1, 1],
  "material": {
    "name": "blue_material",
    "color": [0, 0, 1, 1]
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expanding Video Demo Section */}
      <section
        id="demo"
        ref={videoSectionRef}
        className="relative h-screen bg-gray-100 flex items-center justify-center"
      >
        {/* Video Container that expands */}
        <div
          ref={videoContainerRef}
          className="relative overflow-hidden bg-black"
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover cursor-pointer"
            src="/demo.mp4"
            muted
            loop
            playsInline
            onClick={handleVideoClick}
          />

          {/* Video Overlay Content - fades during expansion */}
          <div className="video-overlay-content absolute inset-0 bg-black/20 flex items-center justify-center z-10 pointer-events-none">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-5xl font-light mb-4 tracking-tight">
                Live <span className="font-semibold">Demo</span>
              </h2>
              <p className="text-lg md:text-xl mb-6 opacity-90">
                Real-time LLM commanding Blender
              </p>
            </div>
          </div>

          {/* Video Controls Overlay - appears when fully expanded */}
          <div className="video-controls-overlay absolute bottom-8 left-8 right-8 z-20 opacity-0">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleVideoClick}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Play className="w-5 h-5" />
                </button>
                <div className="text-sm">
                  <p className="font-medium">Blender MCP Demo</p>
                  <p className="opacity-70">Real-time 3D control</p>
                </div>
              </div>
              <div className="text-sm opacity-70">
                Click to pause • Scroll to continue
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - shows during expansion */}
        <div className="video-scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-600 text-sm">
          <div className="flex flex-col items-center">
            <span className="mb-2">Scroll to expand</span>
            <div className="w-px h-8 bg-gray-400 animate-pulse"></div>
          </div>
        </div>

        {/* Continue scroll indicator - shows when expansion complete */}
        <div className="continue-scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-0 translate-y-5">
          <div className="flex flex-col items-center bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="mb-1">Continue scrolling</span>
            <div className="w-px h-6 bg-white/60"></div>
          </div>
        </div>
      </section>

      {/* Setup */}
      <section id="setup" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="fade-up text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-tight">
              How to <span className="font-semibold">Setup</span>
            </h2>
          </div>

          <div className="space-y-12">
            {/* Step 1: Clone Repository */}
            <div className="card-item card-hover bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-semibold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-4">
                    Clone the Repository
                  </h3>
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <code className="text-sm text-gray-800 font-mono block">
                      git clone
                      https://github.com/pranav-deshmukh/blender-mcp-demo
                    </code>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <code className="text-sm text-gray-800 font-mono block">
                      cd blender-mcp-demo
                    </code>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <code className="text-sm text-gray-800 font-mono block">
                      pnpm i && node index.js
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Claude Desktop Integration */}
            <div className="card-item card-hover bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-semibold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-4">
                    Claude Desktop Integration
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Go to{" "}
                    <strong>
                      Claude → Settings → Developer → Edit Config →
                      claude_desktop_config.json
                    </strong>{" "}
                    and add:
                  </p>
                  <div className="bg-gray-900 rounded-lg p-6 text-white mb-4">
                    <pre className="text-sm text-green-400 overflow-x-auto leading-relaxed font-mono">
                      {`{
  "mcpServers": {
    "DemoServer": {
      "command": "node",
      "args": ["path to index.js file of cloned repo"]
    }
  }
}`}
                    </pre>
                  </div>
                  {/* <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <img
                      src="/images/github-config-screenshot.jpg"
                      alt="Claude Desktop Configuration Screenshot"
                      className="w-full rounded-lg shadow-sm"
                    />
                  </div> */}
                </div>
              </div>
            </div>

            {/* Step 3: Blender Addon Installation */}
            <div className="card-item card-hover bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-semibold flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-4">
                    Install Blender Addon
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Open Blender →{" "}
                      <strong>
                        Edit → Preferences → Add-ons → Install from Disk
                      </strong>
                    </p>
                    <p className="text-gray-600">
                      Navigate to cloned repo → <strong>addon</strong> folder →
                      Select <strong>simple_mcp_addon.py</strong> → Click{" "}
                      <strong>Install from Disk</strong>
                    </p>
                    {/* <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <video
                        src="/add_addon.mp4"
                        controls
                        className="w-full rounded-lg shadow-sm"
                        poster="/placeholder.svg?height=300&width=500&text=Installation+Tutorial"
                      >
                        
                      </video>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Start MCP Server */}
            <div className="card-item card-hover bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-semibold flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-4">
                    Start MCP Server in Blender
                  </h3>
                  <p className="text-gray-600 mb-4">
                    In Blender, go to the <strong>right sidebar</strong> → Click
                    on <strong>MCP</strong> → Click{" "}
                    <strong>Start MCP Server</strong>
                  </p>
                  {/* <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <img
                      src="/images/github-config-screenshot.jpg"
                      alt="Blender Interface Screenshot"
                      className="w-full rounded-lg shadow-sm"
                    />
                  </div> */}
                </div>
              </div>
            </div>

            {/* Step 5: Usage */}
            <div className="card-item card-hover bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-semibold flex-shrink-0">
                  ✓
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-4">Ready to Use!</h3>
                  <p className="text-gray-600 mb-6">
                    Your Blender MCP setup is complete. You can now control
                    Blender through Claude Desktop using natural language
                    commands.
                  </p>
                  {/* <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200 mb-6">
                    <video
                      src=""
                      controls
                      className="w-full rounded-lg shadow-sm"
                      poster="/placeholder.svg?height=300&width=500&text=Usage+Demo"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div> */}
                  <div className="flex items-center space-x-4">
                    <AnimatedButton
                      className="btn-hover bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full"
                      leftIcon={<Play className="w-4 h-4" />}
                      animationType="bounce"
                    >
                      Watch Detailed Demo(soon)
                    </AnimatedButton>
                    <span className="text-gray-500 text-sm">
                      Complete YouTube Tutorial
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Creator - Enhanced */}
      <section className="py-32 px-6 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="creator-float-1 absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
          <div className="creator-float-2 absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
          <div className="creator-float-3 absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="fade-up">
            <h2 className="creator-title text-4xl md:text-6xl font-light mb-8 tracking-tight">
              Meet the{" "}
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Creator
              </span>
            </h2>
            <p className="creator-subtitle text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
              Passionate about bridging the gap between AI and creative tools
            </p>

            {/* Enhanced Creator Card */}
            <div className="creator-card relative group">
              {/* Card Background with Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-700"></div>

              {/* Animated Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              <div className="absolute inset-[2px] bg-white rounded-3xl"></div>

              <div className="relative p-12 lg:p-16">
                {/* Profile Image with Animation */}
                <div className="creator-avatar relative mx-auto mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    PD
                  </div>
                  {/* Animated Ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow"></div>
                </div>

                <h3 className="creator-name text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Pranav Deshmukh
                </h3>

                <p className="creator-role text-xl text-blue-600 font-medium mb-6">
                  AI × 3D Innovation Engineer
                </p>

                <p className="creator-bio text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Building the future where artificial intelligence seamlessly
                  collaborates with human creativity. Specializing in real-time
                  3D systems, protocol design, and making complex technology
                  accessible to creators worldwide.
                </p>

                {/* Enhanced Social Links */}
                <div className="creator-social flex justify-center space-x-6">
                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    className="social-btn bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-800 hover:bg-gray-900 hover:text-white rounded-2xl px-8 py-4 transition-all duration-300"
                    leftIcon={<Github className="w-6 h-6" />}
                    animationType="bounce"
                    onClick={() =>
                      window.open(
                        "https://github.com/pranav-deshmukh",
                        "_blank"
                      )
                    }
                  >
                    GitHub
                  </AnimatedButton>

                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    className="social-btn bg-white/80 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl px-8 py-4 transition-all duration-300"
                    leftIcon={<Linkedin className="w-6 h-6" />}
                    animationType="bounce"
                    onClick={() =>
                      window.open(
                        "https://www.linkedin.com/in/pranavdeshmukh910/",
                        "_blank"
                      )
                    }
                  >
                    LinkedIn
                  </AnimatedButton>

                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    className="social-btn bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-black hover:bg-black hover:text-white rounded-2xl px-8 py-4 transition-all duration-300"
                    leftIcon={
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    }
                    animationType="bounce"
                    onClick={() =>
                      window.open("https://x.com/res_send_pranav", "_blank")
                    }
                  >
                    Twitter
                  </AnimatedButton>
                </div>

                {/* Stats or Highlights */}
                <div className="creator-stats grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-200">
                  <div className="stat-item text-center group">
                    <div className="text-3xl font-bold text-gray-800 mb-2 group-hover:scale-110 transition-transform duration-300">
                      Web
                    </div>
                    <div className="text-gray-600">
                      Years in Full Stack Web Development
                    </div>
                  </div>
                  <div className="stat-item text-center group">
                    <div className="text-3xl font-bold text-gray-800 mb-2 group-hover:scale-110 transition-transform duration-300">
                      AI
                    </div>
                    <div className="text-gray-600">LLM, agents, mcp Focus</div>
                  </div>
                  <div className="stat-item text-center group">
                    <div className="text-3xl font-bold text-gray-800 mb-2 group-hover:scale-110 transition-transform duration-300">
                      ∞
                    </div>
                    <div className="text-gray-600">Creative Possibilities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">Blender MCP</h3>
              <p className="text-gray-600">
                Realtime 3D Control via Model Context Protocol
              </p>
            </div>

            <div className="flex space-x-8">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Documentation
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Examples
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Support
              </a>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 text-center">
            <p className="text-gray-500">
              © 2025 Pranav Deshmukh. Built with Next.js, TypeScript, and GSAP.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
