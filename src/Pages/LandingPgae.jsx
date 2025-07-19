"use client"

import React, { useState, useEffect, useRef, createContext, useContext } from "react"
import heroImage from '../assets/lgu-background.png'
import {
    Check,
    ChevronRight,
    Menu,
    X,
    Moon,
    Sun,
    Search,
    Download,
    Users,
    BookOpen,
    Filter,
    Clock,
    Star,
    ChevronDown,
} from "lucide-react"

// Animation Hook for Intersection Observer
const useInView = (options = {}) => {
    const [isInView, setIsInView] = useState(false)
    const ref = useRef()

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                }
            },
            { threshold: 0.1, ...options },
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    return [ref, isInView]
}

// Motion Component for Animations
const Motion = ({ children, className = "", initial = {}, animate = {}, transition = {}, delay = 0, ...props }) => {
    const [ref, isInView] = useInView()
    const [hasAnimated, setHasAnimated] = useState(false)

    useEffect(() => {
        if (isInView && !hasAnimated) {
            setHasAnimated(true)
        }
    }, [isInView, hasAnimated])

    const style = {
        opacity: hasAnimated ? (animate.opacity ?? 1) : (initial.opacity ?? 0),
        transform: `translateY(${hasAnimated ? (animate.y ?? 0) : (initial.y ?? 20)}px) scale(${hasAnimated ? (animate.scale ?? 1) : (initial.scale ?? 1)})`,
        transition: `all ${transition.duration ?? 0.6}s ease-out ${delay}s`,
        ...props.style,
    }

    return (
        <div ref={ref} className={className} style={style} {...props}>
            {children}
        </div>
    )
}

// Stagger Container for Sequential Animations
const StaggerContainer = ({ children, className = "", staggerDelay = 0.1 }) => {
    return (
        <div className={className}>
            {React.Children.map(children, (child, index) =>
                React.cloneElement(child, {
                    delay: index * staggerDelay,
                }),
            )}
        </div>
    )
}

// Button Component
const Button = React.forwardRef(
    ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
        const baseStyles = `
      inline-flex items-center justify-center rounded-md text-sm font-medium 
      transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 
      focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 
      disabled:pointer-events-none ring-offset-background cursor-pointer border-none
      transform hover:scale-105 active:scale-95
    `

        const variants = {
            default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg hover:shadow-xl",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input hover:bg-accent hover:text-accent-foreground hover:border-primary",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "underline-offset-4 hover:underline text-primary",
        }

        const sizes = {
            default: "h-10 py-2 px-4",
            sm: "h-9 px-3 rounded-md",
            lg: "h-11 px-8 rounded-md text-base",
            icon: "h-10 w-10",
        }

        return (
            <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} ref={ref} {...props}>
                {children}
            </button>
        )
    },
)

// Badge Component
const Badge = React.forwardRef(({ className = "", variant = "default", children, ...props }, ref) => {
    const baseStyles = `
    inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold 
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
  `

    const variants = {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
    }

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`} ref={ref} {...props}>
            {children}
        </div>
    )
})

// Card Components
const Card = React.forwardRef(({ className = "", children, ...props }, ref) => (
    <div
        ref={ref}
        className={`rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${className}`}
        {...props}
    >
        {children}
    </div>
))

const CardContent = React.forwardRef(({ className = "", children, ...props }, ref) => (
    <div ref={ref} className={`p-6 ${className}`} {...props}>
        {children}
    </div>
))

// Input Component
const Input = React.forwardRef(({ className = "", type = "text", ...props }, ref) => {
    return (
        <input
            type={type}
            className={`
        flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm 
        ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium 
        placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed 
        disabled:opacity-50 transition-all duration-200 focus:border-primary hover:border-primary/50
        ${className}
      `}
            ref={ref}
            {...props}
        />
    )
})

// Tabs Components
const TabsContext = createContext()

const Tabs = ({ defaultValue, className = "", children, ...props }) => {
    const [value, setValue] = useState(defaultValue)

    return (
        <TabsContext.Provider value={{ value, setValue }}>
            <div className={className} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    )
}

const TabsList = ({ className = "", children, ...props }) => (
    <div
        className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
        {...props}
    >
        {children}
    </div>
)

const TabsTrigger = ({ value, className = "", children, ...props }) => {
    const { value: selectedValue, setValue } = useContext(TabsContext)
    const isSelected = selectedValue === value

    return (
        <button
            className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium 
        ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
        transform hover:scale-105 active:scale-95
        ${isSelected ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50"} ${className}
      `}
            onClick={() => setValue(value)}
            {...props}
        >
            {children}
        </button>
    )
}

const TabsContent = ({ value, className = "", children, ...props }) => {
    const { value: selectedValue } = useContext(TabsContext)

    if (selectedValue !== value) return null

    return (
        <Motion
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
            {...props}
        >
            {children}
        </Motion>
    )
}

// Accordion Components
const Accordion = ({ type = "single", collapsible = false, className = "", children, ...props }) => {
    const [openItems, setOpenItems] = useState(new Set())

    const toggleItem = (value) => {
        const newOpenItems = new Set(openItems)
        if (newOpenItems.has(value)) {
            newOpenItems.delete(value)
        } else {
            if (type === "single") {
                newOpenItems.clear()
            }
            newOpenItems.add(value)
        }
        setOpenItems(newOpenItems)
    }

    return (
        <div className={className} {...props}>
            {React.Children.map(children, (child, index) =>
                React.cloneElement(child, {
                    isOpen: openItems.has(child.props.value),
                    onToggle: () => toggleItem(child.props.value),
                }),
            )}
        </div>
    )
}

const AccordionItem = ({ value, isOpen, onToggle, className = "", children, ...props }) => (
    <div className={`border-b border-border/40 ${className}`} {...props}>
        {React.Children.map(children, (child) => React.cloneElement(child, { isOpen, onToggle }))}
    </div>
)

const AccordionTrigger = ({ isOpen, onToggle, className = "", children, ...props }) => (
    <button
        className={`
      flex flex-1 items-center justify-between py-4 font-medium transition-all duration-200 
      hover:underline text-left w-full hover:text-primary
      ${className}
    `}
        onClick={onToggle}
        {...props}
    >
        {children}
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
    </button>
)

const AccordionContent = ({ isOpen, className = "", children, ...props }) => (
    <div
        className={`
      overflow-hidden text-sm transition-all duration-300 ease-in-out
      ${isOpen ? "max-h-96 pb-4 opacity-100" : "max-h-0 opacity-0"}
    `}
        {...props}
    >
        <div className={`pt-0 ${className}`}>{children}</div>
    </div>
)

// Floating Elements Component
const FloatingElements = () => (
    <>
        <div className="floating-circle floating-circle-1"></div>
        <div className="floating-circle floating-circle-2"></div>
        <div className="floating-circle floating-circle-3"></div>
        <div className="floating-square floating-square-1"></div>
        <div className="floating-square floating-square-2"></div>
    </>
)

// Main Landing Page Component
const LandingPage = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [theme, setTheme] = useState("light")
    const [mounted, setMounted] = useState(true)
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize(); // run once on mount

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)
        document.documentElement.setAttribute("data-theme", newTheme)
    }

    const handleWaitlistSubmit = (e) => {
        e.preventDefault()
        if (email) {
            setIsSubmitted(true)
            setEmail("")
            setTimeout(() => setIsSubmitted(false), 3000)
        }
    }

    const features = [
        {
            title: "Smart Search",
            description: "Find past papers instantly with our intelligent search system by subject, semester, or year.",
            icon: <Search className="w-5 h-5" />,
        },
        {
            title: "Easy Downloads",
            description: "Download papers in high-quality PDF format with just one click. No registration hassles.",
            icon: <Download className="w-5 h-5" />,
        },
        {
            title: "Subject Organization",
            description: "Browse papers organized by departments, subjects, and academic years for easy navigation.",
            icon: <BookOpen className="w-5 h-5" />,
        },
        {
            title: "Advanced Filters",
            description: "Filter papers by semester, exam type, difficulty level, and more to find exactly what you need.",
            icon: <Filter className="w-5 h-5" />,
        },
        {
            title: "Latest Updates",
            description: "Get notified when new papers are added. Never miss the latest exam papers again.",
            icon: <Clock className="w-5 h-5" />,
        },
        {
            title: "Student Community",
            description: "Connect with fellow LGU students, share study tips, and collaborate on exam preparation.",
            icon: <Users className="w-5 h-5" />,
        },
    ]

    const testimonials = [
        {
            quote:
                "PaperVault saved me so much time during finals. I found all the past papers I needed for Computer Science in minutes!",
            author: "Ahmad Hassan",
            role: "CS Final Year, LGU",
            rating: 5,
        },
        {
            quote:
                "The search feature is incredible. I can filter by semester and exam type to find exactly what I need for my Business courses.",
            author: "Fatima Khan",
            role: "BBA 3rd Year, LGU",
            rating: 5,
        },
        {
            quote:
                "As a faculty member, I appreciate how organized and comprehensive the paper collection is. Great resource for students.",
            author: "Dr. Muhammad Ali",
            role: "Assistant Professor, LGU",
            rating: 5,
        },
        {
            title:
                "Finally, a platform that has papers from all departments! The Engineering section helped me ace my midterms.",
            author: "Sara Ahmed",
            role: "Electrical Engineering, LGU",
            rating: 5,
        },
        {
            quote:
                "The download quality is excellent and the papers are well-organized by year. This is exactly what LGU students needed.",
            author: "Hassan Malik",
            role: "MBA Student, LGU",
            rating: 5,
        },
        {
            quote:
                "I love how I can access papers from previous years to understand exam patterns. It's been a game-changer for my studies.",
            author: "Ayesha Tariq",
            role: "Psychology Major, LGU",
            rating: 5,
        },
    ]

    const faqs = [
        {
            question: "How many past papers are available on PaperVault?",
            answer:
                "We currently have over 2000 past papers from 15+ departments at Lahore Garrison University, covering the last 5 years of examinations. We continuously add new papers as they become available.",
        },
        {
            question: "Are the papers authentic and verified?",
            answer:
                "Yes, all papers on our platform are authentic and have been verified. We source them directly from official university channels and student contributions that have been cross-verified for accuracy.",
        },
        {
            question: "Can I access papers from all departments?",
            answer:
                "We have papers from all major departments including Computer Science, Business Administration, Engineering, Psychology, and many more. Our collection spans across undergraduate and graduate programs.",
        },
        {
            question: "Is there a mobile app available?",
            answer:
                "We're currently developing mobile apps for both iOS and Android. For now, our web platform is fully responsive and works great on mobile devices. App users will be notified first when the mobile apps launch.",
        },
        {
            question: "How often are new papers added?",
            answer:
                "We add new papers regularly, especially after each examination period. Premium users get early access to newly added papers, while free users can access them after a short delay.",
        },
        {
            question: "Can I contribute papers to the platform?",
            answer:
                "Yes! We encourage students to contribute papers to help build our comprehensive database. Contributors receive special recognition and may be eligible for premium features at no cost.",
        },
    ]

    return (
        <div className="flex min-h-screen flex-col">
            {/* Complete CSS Styles */}
            <style>{`
                @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap");

                :root {
                    --background: 0 0% 100%;
                    --foreground: 240 10% 3.9%;
                    --card: 0 0% 100%;
                    --card-foreground: 240 10% 3.9%;
                    --popover: 0 0% 100%;
                    --popover-foreground: 240 10% 3.9%;
                    --primary: 221 83% 53%;
                    --primary-hover: 221 83% 45%;
                    --primary-foreground: 0 0% 98%;
                    --secondary: 240 4.8% 95.9%;
                    --secondary-foreground: 240 5.9% 10%;
                    --muted: 240 4.8% 95.9%;
                    --muted-foreground: 240 3.8% 46.1%;
                    --accent: 240 4.8% 95.9%;
                    --accent-foreground: 240 5.9% 10%;
                    --destructive: 0 84.2% 60.2%;
                    --destructive-foreground: 0 0% 98%;
                    --border: 240 5.9% 90%;
                    --input: 240 5.9% 90%;
                    --ring: 221 83% 53%;
                    --radius: 1rem;
                }

                [data-theme="dark"] {
                    --background: 240 10% 3.9%;
                    --foreground: 0 0% 98%;
                    --card: 240 10% 3.9%;
                    --card-foreground: 0 0% 98%;
                    --popover: 240 10% 3.9%;
                    --popover-foreground: 0 0% 98%;
                    --primary: 217 91% 60%;
                    --primary-hover: 217 91% 55%;
                    --primary-foreground: 240 5.9% 10%;
                    --secondary: 240 3.7% 15.9%;
                    --secondary-foreground: 0 0% 98%;
                    --muted: 240 3.7% 15.9%;
                    --muted-foreground: 240 5% 64.9%;
                    --accent: 240 3.7% 15.9%;
                    --accent-foreground: 0 0% 98%;
                    --destructive: 0 62.8% 30.6%;
                    --destructive-foreground: 0 0% 98%;
                    --border: 240 3.7% 15.9%;
                    --input: 240 3.7% 15.9%;
                    --ring: 217 91% 60%;
                }

                * {
                    border-color: hsl(var(--border));
                    box-sizing: border-box;
                }

                body {
                    background-color: hsl(var(--background));
                    color: hsl(var(--foreground));
                    font-family: "Inter", system-ui, sans-serif;
                    font-feature-settings: "rlig" 1, "calt" 1;
                    line-height: 1.5;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                /* Enhanced Glowing Badge Effect */
                .glowing-badge {
                    position: relative;
                    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%);
                    color: hsl(var(--primary-foreground));
                    border: 1px solid hsl(var(--primary) / 0.3);
                    box-shadow:
                            0 0 20px hsl(var(--primary) / 0.4),
                            0 0 40px hsl(var(--primary) / 0.3),
                            0 0 60px hsl(var(--primary) / 0.2),
                            inset 0 1px 0 rgba(255, 255, 255, 0.2);
                    animation: glow-pulse 2s ease-in-out infinite alternate;
                    backdrop-filter: blur(10px);
                    overflow: hidden;
                }

                .glowing-badge::before {
                    content: "";
                    position: absolute;
                    inset: -2px;
                    background: linear-gradient(135deg, hsl(var(--primary)), transparent, hsl(var(--primary)));
                    border-radius: inherit;
                    z-index: -1;
                    opacity: 0.7;
                    animation: glow-rotate 3s linear infinite;
                }

                .glowing-badge::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
                    animation: shimmer 2s ease-in-out infinite;
                }

                @keyframes glow-pulse {
                    0% {
                        box-shadow:
                                0 0 20px hsl(var(--primary) / 0.4),
                                0 0 40px hsl(var(--primary) / 0.3),
                                0 0 60px hsl(var(--primary) / 0.2);
                        transform: scale(1);
                    }
                    100% {
                        box-shadow:
                                0 0 30px hsl(var(--primary) / 0.5),
                                0 0 60px hsl(var(--primary) / 0.4),
                                0 0 90px hsl(var(--primary) / 0.3);
                        transform: scale(1.02);
                    }
                }

                @keyframes glow-rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                /* Enhanced Grid Background Patterns */
                .bg-grid-pattern {
                    background-color: hsl(var(--background));
                    background-image:
                            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
                    background-size: 60px 60px;
                    position: relative;
                }

                .bg-grid-pattern::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.15) 0%, transparent 50%);
                    mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%);
                    -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%);
                }

                .bg-grid-boxes {
                    background-color: hsl(var(--background));
                    background-image:
                            linear-gradient(to right, hsl(var(--border) / 0.8) 1px, transparent 1px),
                            linear-gradient(to bottom, hsl(var(--border) / 0.8) 1px, transparent 1px),
                            linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px),
                            linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px);
                    background-size: 60px 60px, 60px 60px, 20px 20px, 20px 20px;
                    background-position: 0 0, 0 0, 0 0, 0 0;
                    animation: grid-move-boxes 25s ease-in-out infinite;
                    position: relative;
                }

                .bg-grid-boxes::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                            radial-gradient(circle at 30% 20%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 70% 80%, hsl(var(--secondary) / 0.1) 0%, transparent 50%);
                    mask-image: radial-gradient(ellipse 90% 70% at 50% 0%, #000 30%, transparent 100%);
                    -webkit-mask-image: radial-gradient(ellipse 90% 70% at 50% 0%, #000 30%, transparent 100%);
                }

                @keyframes grid-move-boxes {
                    0%, 100% {
                        background-position: 0 0, 0 0, 0 0, 0 0;
                        transform: translateY(0);
                    }
                    25% {
                        background-position: 30px 0, 0 30px, 10px 0, 0 10px;
                        transform: translateY(-5px);
                    }
                    50% {
                        background-position: 30px 30px, 30px 30px, 10px 10px, 10px 10px;
                        transform: translateY(0);
                    }
                    75% {
                        background-position: 0 30px, 30px 0, 0 10px, 10px 0;
                        transform: translateY(-5px);
                    }
                }

                /* Floating Elements */
                .floating-circle {
                    position: absolute;
                    border-radius: 50%;
                    background: linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.05));
                    backdrop-filter: blur(10px);
                    animation: float 6s ease-in-out infinite;
                }

                .floating-circle-1 {
                    width: 100px;
                    height: 100px;
                    top: 10%;
                    left: 10%;
                    animation-delay: 0s;
                }

                .floating-circle-2 {
                    width: 150px;
                    height: 150px;
                    top: 60%;
                    right: 10%;
                    animation-delay: 2s;
                }

                .floating-circle-3 {
                    width: 80px;
                    height: 80px;
                    bottom: 20%;
                    left: 20%;
                    animation-delay: 4s;
                }

                .floating-square {
                    position: absolute;
                    background: linear-gradient(135deg, hsl(var(--secondary) / 0.1), hsl(var(--secondary) / 0.05));
                    backdrop-filter: blur(10px);
                    transform: rotate(45deg);
                    animation: float-rotate 8s ease-in-out infinite;
                }

                .floating-square-1 {
                    width: 60px;
                    height: 60px;
                    top: 30%;
                    right: 20%;
                    animation-delay: 1s;
                }

                .floating-square-2 {
                    width: 40px;
                    height: 40px;
                    bottom: 40%;
                    right: 30%;
                    animation-delay: 3s;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }

                @keyframes float-rotate {
                    0%, 100% { transform: translateY(0px) rotate(45deg); }
                    50% { transform: translateY(-15px) rotate(225deg); }
                }

                /* Enhanced Gradient Backgrounds */
                .gradient-bg-1 {
                    background: linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--secondary) / 0.1) 100%);
                }

                .gradient-bg-2 {
                    background: linear-gradient(135deg, hsl(var(--secondary) / 0.1) 0%, hsl(var(--accent) / 0.1) 100%);
                }

                /* Utility Classes */
                .container {
                    width: 100%;
                    margin-left: auto;
                    margin-right: auto;
                    padding-left: 1rem;
                    padding-right: 1rem;
                }

                @media (min-width: 640px) { .container { max-width: 640px; } }
                @media (min-width: 768px) { .container { max-width: 768px; } }
                @media (min-width: 1024px) { .container { max-width: 1024px; } }
                @media (min-width: 1280px) { .container { max-width: 1280px; } }
                @media (min-width: 1536px) { .container { max-width: 1536px; } }

                /* Color Utilities */
                .text-primary { color: hsl(var(--primary)); }
                .text-primary-foreground { color: hsl(var(--primary-foreground)); }
                .text-muted-foreground { color: hsl(var(--muted-foreground)); }
                .text-foreground { color: hsl(var(--foreground)); }
                .text-card-foreground { color: hsl(var(--card-foreground)); }
                .text-secondary-foreground { color: hsl(var(--secondary-foreground)); }
                .text-accent-foreground { color: hsl(var(--accent-foreground)); }

                .bg-primary { background-color: hsl(var(--primary)); }
                .bg-primary-hover { background-color: hsl(var(--primary-hover)); }
                .bg-background { background-color: hsl(var(--background)); }
                .bg-card { background-color: hsl(var(--card)); }
                .bg-secondary { background-color: hsl(var(--secondary)); }
                .bg-muted { background-color: hsl(var(--muted)); }
                .bg-accent { background-color: hsl(var(--accent)); }

                .border-border { border-color: hsl(var(--border)); }
                .border-input { border-color: hsl(var(--input)); }
                .border-primary { border-color: hsl(var(--primary)); }

                /* Layout Utilities */
                .flex { display: flex; }
                .inline-flex { display: inline-flex; }
                .grid { display: grid; }
                .hidden { display: none; }
                .block { display: block; }

                .flex-col { flex-direction: column; }
                .flex-row { flex-direction: row; }
                .items-center { align-items: center; }
                .items-start { align-items: flex-start; }
                .justify-center { justify-content: center; }
                .justify-between { justify-content: space-between; }
                .justify-start { justify-content: flex-start; }

                .text-center { text-align: center; }
                .text-left { text-align: left; }
                .text-right { text-align: right; }

                /* Spacing */
                .gap-1 { gap: 0.25rem; }
                .gap-2 { gap: 0.5rem; }
                .gap-4 { gap: 1rem; }
                .gap-6 { gap: 1.5rem; }
                .gap-8 { gap: 2rem; }
                .gap-12 { gap: 3rem; }

                .p-1 { padding: 0.25rem; }
                .p-2 { padding: 0.5rem; }
                .p-4 { padding: 1rem; }
                .p-6 { padding: 1.5rem; }
                .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
                .px-4 { padding-left: 1rem; padding-right: 1rem; }
                .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
                .px-8 { padding-left: 2rem; padding-right: 2rem; }
                .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
                .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
                .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
                .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
                .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
                .py-32 { padding-top: 8rem; padding-bottom: 8rem; }

                .m-0 { margin: 0; }
                .mx-auto { margin-left: auto; margin-right: auto; }
                .mb-2 { margin-bottom: 0.5rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .mb-8 { margin-bottom: 2rem; }
                .mb-12 { margin-bottom: 3rem; }
                .mb-16 { margin-bottom: 4rem; }
                .mt-2 { margin-top: 0.5rem; }
                .mt-4 { margin-top: 1rem; }
                .mt-6 { margin-top: 1.5rem; }
                .mt-8 { margin-top: 2rem; }
                .mt-16 { margin-top: 4rem; }
                .mt-20 { margin-top: 5rem; }
                .mt-24 { margin-top: 6rem; }
                .ml-1 { margin-left: 0.25rem; }
                .mr-2 { margin-right: 0.5rem; }

                /* Sizing */
                .w-4 { width: 1rem; }
                .w-5 { width: 1.25rem; }
                .w-8 { width: 2rem; }
                .w-10 { width: 2.5rem; }
                .w-16 { width: 4rem; }
                .w-full { width: 100%; }
                .h-4 { height: 1rem; }
                .h-5 { height: 1.25rem; }
                .h-8 { height: 2rem; }
                .h-10 { height: 2.5rem; }
                .h-11 { height: 2.75rem; }
                .h-16 { height: 4rem; }
                .h-auto { height: auto; }

                .max-w-md { max-width: 28rem; }
                .max-w-2xl { max-width: 42rem; }
                .max-w-3xl { max-width: 48rem; }
                .max-w-5xl { max-width: 64rem; }
                .max-w-7xl { max-width: 80rem; }

                /* Border Radius */
                .rounded { border-radius: 0.25rem; }
                .rounded-md { border-radius: 0.375rem; }
                .rounded-lg { border-radius: 0.5rem; }
                .rounded-xl { border-radius: 0.75rem; }
                .rounded-full { border-radius: 9999px; }

                /* Shadows */
                .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
                .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
                .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
                .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
                .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }

                /* Typography */
                .text-xs { font-size: 0.75rem; line-height: 1rem; }
                .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
                .text-base { font-size: 1rem; line-height: 1.5rem; }
                .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
                .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
                .text-2xl { font-size: 1.5rem; line-height: 2rem; }
                .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
                .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
                .text-5xl { font-size: 3rem; line-height: 1; }
                .text-6xl { font-size: 3.75rem; line-height: 1; }

                .font-medium { font-weight: 500; }
                .font-semibold { font-weight: 600; }
                .font-bold { font-weight: 700; }

                .leading-tight { line-height: 1.25; }
                .tracking-tight { letter-spacing: -0.025em; }

                /* Positioning */
                .relative { position: relative; }
                .absolute { position: absolute; }
                .sticky { position: sticky; }
                .top-0 { top: 0; }
                .top-16 { top: 4rem; }
                .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
                .inset-x-0 { left: 0; right: 0; }
                .-z-10 { z-index: -10; }
                .z-50 { z-index: 50; }

                /* Overflow */
                .overflow-hidden { overflow: hidden; }

                /* Backdrop */
                .backdrop-blur-lg { backdrop-filter: blur(16px); }
                .backdrop-blur-sm { backdrop-filter: blur(4px); }

                /* Transitions */
                .transition-all { transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1); }
                .transition-colors { transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1); }
                .duration-200 { transition-duration: 200ms; }
                .duration-300 { transition-duration: 300ms; }

                /* Transforms */
                .transform { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
                .scale-105 { --tw-scale-x: 1.05; --tw-scale-y: 1.05; }
                .scale-95 { --tw-scale-x: 0.95; --tw-scale-y: 0.95; }
                .-translate-y-1 { --tw-translate-y: -0.25rem; }
                .hover\\:scale-105:hover { --tw-scale-x: 1.05; --tw-scale-y: 1.05; }
                .hover\\:-translate-y-1:hover { --tw-translate-y: -0.25rem; }
                .active\\:scale-95:active { --tw-scale-x: 0.95; --tw-scale-y: 0.95; }

                /* Grid */
                .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

                /* Responsive */
                @media (min-width: 640px) {
                    .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .sm\\:flex-row { flex-direction: row; }
                }

                @media (min-width: 768px) {
                    .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                    .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                    .md\\:flex { display: flex; }
                    .md\\:hidden { display: none; }
                    .md\\:text-lg { font-size: 1.125rem; line-height: 1.75rem; }
                    .md\\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
                    .md\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
                    .md\\:text-5xl { font-size: 3rem; line-height: 1; }
                    .md\\:py-32 { padding-top: 8rem; padding-bottom: 8rem; }
                    .md\\:pb-32 { padding-bottom: 8rem; }
                    .md\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
                    .md\\:mt-20 { margin-top: 5rem; }
                    .md\\:gap-12 { gap: 3rem; }
                }

                @media (min-width: 1024px) {
                    .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                    .lg\\:gap-8 { gap: 2rem; }
                    .lg\\:text-6xl { font-size: 3.75rem; line-height: 1; }
                    .lg\\:pb-40 { padding-bottom: 10rem; }
                    .lg\\:py-16 { padding-top: 4rem; padding-bottom: 4rem; }
                    .lg\\:mt-24 { margin-top: 6rem; }
                    .lg\\:text-5xl { font-size: 3rem; line-height: 1; }
                }

                /* Hover Effects */
                .hover\\:bg-primary\\/90:hover { background-color: hsl(var(--primary) / 0.9); }
                .hover\\:bg-secondary\\/80:hover { background-color: hsl(var(--secondary) / 0.8); }
                .hover\\:bg-accent:hover { background-color: hsl(var(--accent)); }
                .hover\\:bg-background\\/50:hover { background-color: hsl(var(--background) / 0.5); }
                .hover\\:text-foreground:hover { color: hsl(var(--foreground)); }
                .hover\\:text-accent-foreground:hover { color: hsl(var(--accent-foreground)); }
                .hover\\:text-primary:hover { color: hsl(var(--primary)); }
                .hover\\:border-primary:hover { border-color: hsl(var(--primary)); }
                .hover\\:border-primary\\/50:hover { border-color: hsl(var(--primary) / 0.5); }
                .hover\\:shadow-md:hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
                .hover\\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
                .hover\\:shadow-xl:hover { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
                .hover\\:underline:hover { text-decoration: underline; }

                /* Focus */
                .focus-visible\\:outline-none:focus-visible { outline: 2px solid transparent; outline-offset: 2px; }
                .focus-visible\\:ring-2:focus-visible { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
                .focus-visible\\:ring-ring:focus-visible { --tw-ring-color: hsl(var(--ring)); }
                .focus-visible\\:ring-offset-2:focus-visible { --tw-ring-offset-width: 2px; }
                .focus\\:border-primary:focus { border-color: hsl(var(--primary)); }

                /* Disabled */
                .disabled\\:opacity-50:disabled { opacity: 0.5; }
                .disabled\\:pointer-events-none:disabled { pointer-events: none; }
                .disabled\\:cursor-not-allowed:disabled { cursor: not-allowed; }

                /* Misc */
                .cursor-pointer { cursor: pointer; }
                .select-none { user-select: none; }
                .whitespace-nowrap { white-space: nowrap; }
                .shrink-0 { flex-shrink: 0; }
                .flex-1 { flex: 1 1 0%; }
                .flex-grow { flex-grow: 1; }
                .ring-offset-background { --tw-ring-offset-color: hsl(var(--background)); }
                .border { border-width: 1px; }
                .border-b { border-bottom-width: 1px; }
                .border-t { border-top-width: 1px; border-bottom-width: 1px; }
                .border-y { border-top-width: 1px; border-bottom-width: 1px; }

                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }

                /* Custom Gradient Text */
                .bg-clip-text {
                    background-clip: text;
                    -webkit-background-clip: text;
                }

                .text-transparent {
                    color: transparent;
                }

                .bg-gradient-to-r {
                    background-image: linear-gradient(to right, var(--tw-gradient-stops));
                }

                .bg-gradient-to-br {
                    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
                }

                .bg-gradient-to-b {
                    background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
                }

                .from-foreground {
                    --tw-gradient-from: hsl(var(--foreground));
                    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, hsl(var(--foreground) / 0));
                }

                .to-foreground\\/70 {
                    --tw-gradient-to: hsl(var(--foreground) / 0.7);
                }

                .from-primary {
                    --tw-gradient-from: hsl(var(--primary));
                    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, hsl(var(--primary) / 0));
                }

                .to-primary\\/70 {
                    --tw-gradient-to: hsl(var(--primary) / 0.7);
                }

                .from-primary\\/30 {
                    --tw-gradient-from: hsl(var(--primary) / 0.3);
                    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, hsl(var(--primary) / 0));
                }

                .to-secondary\\/30 {
                    --tw-gradient-to: hsl(var(--secondary) / 0.3);
                }

                .from-secondary\\/30 {
                    --tw-gradient-from: hsl(var(--secondary) / 0.3);
                    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, hsl(var(--secondary) / 0));
                }

                .to-primary\\/30 {
                    --tw-gradient-to: hsl(var(--primary) / 0.3);
                }

                .from-background {
                    --tw-gradient-from: hsl(var(--background));
                    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, hsl(var(--background) / 0));
                }

                .to-muted\\/10 {
                    --tw-gradient-to: hsl(var(--muted) / 0.1);
                }

                .to-muted\\/20 {
                    --tw-gradient-to: hsl(var(--muted) / 0.2);
                }

                /* Blur Effects */
                .blur-3xl {
                    filter: blur(64px);
                }

                /* Opacity */
                .opacity-70 {
                    opacity: 0.7;
                }

                /* Ring */
                .ring-1 {
                    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
                    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
                    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
                }

                .ring-inset {
                    --tw-ring-inset: inset;
                }

                .ring-black\\/10 {
                    --tw-ring-color: rgb(0 0 0 / 0.1);
                }

                [data-theme="dark"] .dark\\:ring-white\\/10 {
                    --tw-ring-color: rgb(255 255 255 / 0.1);
                }

                /* Background Opacity */
                .bg-muted\\/30 {
                    background-color: hsl(var(--muted) / 0.3);
                }

                .bg-background\\/80 {
                    background-color: hsl(var(--background) / 0.8);
                }

                .bg-background\\/95 {
                    background-color: hsl(var(--background) / 0.95);
                }

                .bg-primary\\/10 {
                    background-color: hsl(var(--primary) / 0.1);
                }

                [data-theme="dark"] .dark\\:bg-primary\\/20 {
                    background-color: hsl(var(--primary) / 0.2);
                }

                .bg-green-50 {
                    background-color: #f0fdf4;
                }

                [data-theme="dark"] .dark\\:bg-green-900\\/20 {
                    background-color: rgb(20 83 45 / 0.2);
                }

                .border-green-200 {
                    border-color: #bbf7d0;
                }

                [data-theme="dark"] .dark\\:border-green-800 {
                    border-color: #166534;
                }

                .text-green-700 {
                    color: #15803d;
                }

                [data-theme="dark"] .dark\\:text-green-300 {
                    color: #86efac;
                }

                .bg-white\\/20 {
                    background-color: rgb(255 255 255 / 0.2);
                }

                .border-white\\/30 {
                    border-color: rgb(255 255 255 / 0.3);
                }

                .bg-white\\/10 {
                    background-color: rgb(255 255 255 / 0.1);
                }

                .border-white\\/20 {
                    border-color: rgb(255 255 255 / 0.2);
                }

                .text-white {
                    color: rgb(255 255 255);
                }

                .placeholder\\:text-white\\/70::placeholder {
                    color: rgb(255 255 255 / 0.7);
                }

                .text-primary-foreground\\/80 {
                    color: hsl(var(--primary-foreground) / 0.8);
                }

                .fill-yellow-500 {
                    fill: #eab308;
                }

                .text-yellow-500 {
                    color: #eab308;
                }

                /* Enhanced Animations */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out;
                }

                .animate-fade-in-left {
                    animation: fadeInLeft 0.6s ease-out;
                }

                .animate-fade-in-right {
                    animation: fadeInRight 0.6s ease-out;
                }

                .animate-scale-in {
                    animation: scaleIn 0.6s ease-out;
                }

                /* Scroll Animations */
                @keyframes slideInFromBottom {
                    from {
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slide-in {
                    animation: slideInFromBottom 0.8s ease-out;
                }

                /* Particle Animation */
                @keyframes particle-float {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                        opacity: 0.7;
                    }
                    50% {
                        transform: translateY(-100px) rotate(180deg);
                        opacity: 1;
                    }
                }

                .particle {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: hsl(var(--primary) / 0.6);
                    border-radius: 50%;
                    animation: particle-float 8s ease-in-out infinite;
                }

                .particle:nth-child(1) { left: 10%; animation-delay: 0s; }
                .particle:nth-child(2) { left: 20%; animation-delay: 1s; }
                .particle:nth-child(3) { left: 30%; animation-delay: 2s; }
                .particle:nth-child(4) { left: 40%; animation-delay: 3s; }
                .particle:nth-child(5) { left: 50%; animation-delay: 4s; }
                .particle:nth-child(6) { left: 60%; animation-delay: 5s; }
                .particle:nth-child(7) { left: 70%; animation-delay: 6s; }
                .particle:nth-child(8) { left: 80%; animation-delay: 7s; }
                .particle:nth-child(9) { left: 90%; animation-delay: 8s; }

                /* Responsive Utilities */
                @media (max-width: 767px) {
                    .md\\:hidden {
                        display: none !important;
                    }
                }

                @media (max-width: 639px) {
                    .sm\\:grid-cols-2 {
                        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
                    }
                }
            `}</style>

            {/* Floating Background Elements */}
            <FloatingElements />

            {/* Header */}
            <header
                className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${
                    isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"
                }`}
            >
                <div className="container flex h-16 items-center justify-between">
                    <Motion
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2 font-bold"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                            P
                        </div>
                        <span>PaperVault</span>
                    </Motion>

                    <nav className="hidden md:flex gap-8">
                        {["Features", "Reviews", "Pricing", "FAQ"].map((item, index) => (
                            <Motion
                                key={item}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                delay={index * 0.1}
                                transition={{ duration: 0.5 }}
                            >
                                <a
                                    href={`#${item.toLowerCase()}`}
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {item}
                                </a>
                            </Motion>
                        ))}
                    </nav>

                    <div className="hidden md:flex gap-4 items-center">
                        <Motion
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                                {mounted && theme === "dark" ? (
                                    <Sun className="w-[18px] h-[18px]" />
                                ) : (
                                    <Moon className="w-[18px] h-[18px]" />
                                )}
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </Motion>
                        <Motion
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                                Sign In
                            </a>
                        </Motion>
                        <Motion
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Button className="rounded-full">
                                Join Waitlist
                                <ChevronRight className="ml-1 w-4 h-4" />
                            </Button>
                        </Motion>
                    </div>

                    <div className={isMobile ? "flex items-center gap-4" : "flex items-center gap-4 md:hidden"}>
                        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                            {mounted && theme === "dark" ? (
                                <Sun className="w-[18px] h-[18px]" />
                            ) : (
                                <Moon className="w-[18px] h-[18px]" />
                            )}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className={isMobile ? "absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-lg border-b z-50 shadow-lg" : "md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-lg border-b z-50 shadow-lg"}>
                        <div className="container py-4 flex flex-col gap-4">
                            {["Features", "Reviews", "Pricing", "FAQ"].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="py-2 text-sm font-medium transition-colors hover:text-primary"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item}
                                </a>
                            ))}
                            <div className="flex flex-col gap-2 pt-2 border-t">
                                <a
                                    href="#"
                                    className="py-2 text-sm font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign In
                                </a>
                                <Button className="rounded-full">
                                    Join Waitlist
                                    <ChevronRight className="ml-1 w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full pt-0 pb-20 md:pb-32 lg:pb-40 overflow-hidden relative">
                    <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-grid-pattern"></div>

                    {/* Optional: Animated Particles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="particle" />
                        ))}
                    </div>

                    <div className="container px-4 md:px-6 relative">
                        <Motion
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center max-w-3xl mx-auto mb-12 mt-16 md:mt-20 lg:mt-24"
                        >
                            <Badge
                                className="mt-8 mb-4 rounded-full px-4 py-1.5 text-sm font-medium glowing-badge"
                                variant="secondary"
                            >
                                Coming Soon
                            </Badge>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                Your Gateway to LGU Past Papers
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Access thousands of past papers from Lahore Garrison University. Search, filter, and download exam
                                papers from all departments and semesters in one convenient platform.
                            </p>

                            {/* Waitlist Form */}
                            <div className="max-w-md mx-auto mb-8">
                                {isSubmitted ? (
                                    <Motion
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full px-6 py-3 text-green-700 dark:text-green-300"
                                    >
                                        ✓ You're on the waitlist! We'll notify you when we launch.
                                    </Motion>
                                ) : (
                                    <form onSubmit={handleWaitlistSubmit} className="flex gap-2">
                                        <Input
                                            type="email"
                                            placeholder="Enter your LGU email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="rounded-full flex-1"
                                            required
                                        />
                                        <Button type="submit" className="rounded-full px-6">
                                            Join Waitlist
                                        </Button>
                                    </form>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                                <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base bg-transparent">
                                    Browse Sample Papers
                                </Button>
                            </div>
                            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Check className="w-4 h-4 text-primary" />
                                    <span>Free access</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Check className="w-4 h-4 text-primary" />
                                    <span>All departments</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Check className="w-4 h-4 text-primary" />
                                    <span>Latest papers</span>
                                </div>
                            </div>
                        </Motion>

                        <Motion
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative mx-auto max-w-5xl"
                        >
                            <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
                                <img
                                    src={heroImage}
                                    width={1280}
                                    height={720}
                                    alt="PaperVault dashboard showing LGU past papers"
                                    className="w-full h-auto opacity-70"
                                />
                                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
                            <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
                        </Motion>
                    </div>
                </section>


                {/* Stats Section */}
                <section className="w-full py-12 border-y bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" staggerDelay={0.1}>
                            {[
                                { number: "2000+", label: "Past Papers" },
                                { number: "15+", label: "Departments" },
                                { number: "50+", label: "Subjects" },
                                { number: "5", label: "Years Coverage" },
                            ].map((stat, index) => (
                                <Motion
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <div className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </Motion>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full py-20 md:py-32">
                    <div className="container px-4 md:px-6">
                        <Motion
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
                        >
                            <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                                Features
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need for Exam Success</h2>
                            <p className="max-w-[800px] text-muted-foreground md:text-lg">
                                Our platform provides comprehensive access to LGU past papers with powerful search and organization
                                tools to help you excel in your studies.
                            </p>
                        </Motion>

                        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
                            {features.map((feature, i) => (
                                <Motion
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-lg">
                                        <CardContent className="p-6 flex flex-col h-full">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                                                {feature.icon}
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                            <p className="text-muted-foreground">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </Motion>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-grid-pattern"></div>

                    <div className="container px-4 md:px-6 relative">
                        <Motion
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
                        >
                            <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                                How It Works
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Get Your Papers in 3 Simple Steps</h2>
                            <p className="max-w-[800px] text-muted-foreground md:text-lg">
                                Finding and downloading past papers has never been easier. Follow these simple steps to access what you
                                need.
                            </p>
                        </Motion>

                        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
                            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0"></div>

                            {[
                                {
                                    step: "01",
                                    title: "Search & Filter",
                                    description: "Use our smart search to find papers by subject, semester, year, or exam type.",
                                },
                                {
                                    step: "02",
                                    title: "Preview & Select",
                                    description: "Preview papers before downloading to ensure they match your requirements.",
                                },
                                {
                                    step: "03",
                                    title: "Download & Study",
                                    description: "Download high-quality PDFs instantly and start your exam preparation.",
                                },
                            ].map((step, i) => (
                                <Motion
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: i * 0.2 }}
                                    className="relative z-10 flex flex-col items-center text-center space-y-4"
                                >
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold shadow-lg">
                                        {step.step}
                                    </div>
                                    <h3 className="text-xl font-bold">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </Motion>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Review Section */}
                <section id="reviews" className="w-full py-20 md:py-32">
                    <div className="container px-4 md:px-6">
                        <Motion
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
                        >
                            <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                                Student Reviews
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Loved by LGU Students</h2>
                            <p className="max-w-[800px] text-muted-foreground md:text-lg">
                                See what fellow students and faculty members have to say about their experience with PaperVault.
                            </p>
                        </Motion>

                        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
                            {testimonials.map((testimonial, i) => (
                                <Motion
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-lg">
                                        <CardContent className="p-6 flex flex-col h-full">
                                            <div className="flex mb-4">
                                                {Array(testimonial.rating)
                                                    .fill(0)
                                                    .map((_, j) => (
                                                        <Star key={j} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    ))}
                                            </div>
                                            <p className="text-lg mb-6 flex-grow">"{testimonial.quote}"</p>
                                            <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/40">
                                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium">
                                                    {testimonial.author.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{testimonial.author}</p>
                                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Motion>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-grid-pattern"></div>

                    <div className="container px-4 md:px-6 relative">
                        <Motion
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
                        >
                            <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                                Pricing
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Student-Friendly Pricing</h2>
                            <p className="max-w-[800px] text-muted-foreground md:text-lg">
                                Choose the plan that fits your academic needs. All plans include access to our complete paper database.
                            </p>
                        </Motion>

                        <div className="mx-auto max-w-5xl">
                            <Tabs defaultValue="monthly" className="w-full">
                                <div className="flex justify-center mb-8">
                                    <TabsList className="rounded-full p-1">
                                        <TabsTrigger value="monthly" className="rounded-full px-6">
                                            Monthly
                                        </TabsTrigger>
                                        <TabsTrigger value="semester" className="rounded-full px-6">
                                            Per Semester (Save 30%)
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="monthly">
                                    <StaggerContainer className="grid gap-6 lg:grid-cols-3 lg:gap-8" staggerDelay={0.1}>
                                        {[
                                            {
                                                name: "Basic",
                                                price: "Free",
                                                description: "Perfect for casual browsing and basic access.",
                                                features: [
                                                    "5 downloads per month",
                                                    "Basic search",
                                                    "Standard quality PDFs",
                                                    "Community support",
                                                ],
                                                cta: "Get Started",
                                            },
                                            {
                                                name: "Student",
                                                price: "Rs. 99",
                                                description: "Ideal for active students preparing for exams.",
                                                features: [
                                                    "Unlimited downloads",
                                                    "Advanced search & filters",
                                                    "High-quality PDFs",
                                                    "Priority support",
                                                    "Early access to new papers",
                                                ],
                                                cta: "Join Waitlist",
                                                popular: true,
                                            },
                                            {
                                                name: "Premium",
                                                price: "Rs. 199",
                                                description: "For serious students who want everything.",
                                                features: [
                                                    "Everything in Student",
                                                    "Exclusive solved papers",
                                                    "Study guides & notes",
                                                    "Exam pattern analysis",
                                                    "Personal study dashboard",
                                                    "Offline access",
                                                ],
                                                cta: "Join Waitlist",
                                            },
                                        ].map((plan, i) => (
                                            <Motion
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <Card
                                                    className={`relative overflow-hidden h-full ${
                                                        plan.popular ? "border-primary shadow-lg" : "border-border/40 shadow-md"
                                                    } bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                                                >
                                                    {plan.popular && (
                                                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                                                            Most Popular
                                                        </div>
                                                    )}
                                                    <CardContent className="p-6 flex flex-col h-full">
                                                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                                                        <div className="flex items-baseline mt-4">
                                                            <span className="text-4xl font-bold">{plan.price}</span>
                                                            {plan.price !== "Free" && <span className="text-muted-foreground ml-1">/month</span>}
                                                        </div>
                                                        <p className="text-muted-foreground mt-2">{plan.description}</p>
                                                        <ul className="space-y-3 my-6 flex-grow">
                                                            {plan.features.map((feature, j) => (
                                                                <li key={j} className="flex items-center">
                                                                    <Check className="mr-2 w-4 h-4 text-primary" />
                                                                    <span>{feature}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <Button
                                                            className={`w-full mt-auto rounded-full ${
                                                                plan.popular ? "bg-primary hover:bg-primary/90" : "bg-muted hover:bg-muted/80"
                                                            }`}
                                                            variant={plan.popular ? "default" : "outline"}
                                                        >
                                                            {plan.cta}
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Motion>
                                        ))}
                                    </StaggerContainer>
                                </TabsContent>

                                <TabsContent value="semester">
                                    <StaggerContainer className="grid gap-6 lg:grid-cols-3 lg:gap-8" staggerDelay={0.1}>
                                        {[
                                            {
                                                name: "Basic",
                                                price: "Free",
                                                description: "Perfect for casual browsing and basic access.",
                                                features: [
                                                    "5 downloads per month",
                                                    "Basic search",
                                                    "Standard quality PDFs",
                                                    "Community support",
                                                ],
                                                cta: "Get Started",
                                            },
                                            {
                                                name: "Student",
                                                price: "Rs. 249",
                                                description: "Ideal for active students preparing for exams.",
                                                features: [
                                                    "Unlimited downloads",
                                                    "Advanced search & filters",
                                                    "High-quality PDFs",
                                                    "Priority support",
                                                    "Early access to new papers",
                                                ],
                                                cta: "Join Waitlist",
                                                popular: true,
                                            },
                                            {
                                                name: "Premium",
                                                price: "Rs. 499",
                                                description: "For serious students who want everything.",
                                                features: [
                                                    "Everything in Student",
                                                    "Exclusive solved papers",
                                                    "Study guides & notes",
                                                    "Exam pattern analysis",
                                                    "Personal study dashboard",
                                                    "Offline access",
                                                ],
                                                cta: "Join Waitlist",
                                            },
                                        ].map((plan, i) => (
                                            <Motion
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <Card
                                                    className={`relative overflow-hidden h-full ${
                                                        plan.popular ? "border-primary shadow-lg" : "border-border/40 shadow-md"
                                                    } bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                                                >
                                                    {plan.popular && (
                                                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                                                            Most Popular
                                                        </div>
                                                    )}
                                                    <CardContent className="p-6 flex flex-col h-full">
                                                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                                                        <div className="flex items-baseline mt-4">
                                                            <span className="text-4xl font-bold">{plan.price}</span>
                                                            {plan.price !== "Free" && <span className="text-muted-foreground ml-1">/semester</span>}
                                                        </div>
                                                        <p className="text-muted-foreground mt-2">{plan.description}</p>
                                                        <ul className="space-y-3 my-6 flex-grow">
                                                            {plan.features.map((feature, j) => (
                                                                <li key={j} className="flex items-center">
                                                                    <Check className="mr-2 w-4 h-4 text-primary" />
                                                                    <span>{feature}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <Button
                                                            className={`w-full mt-auto rounded-full ${
                                                                plan.popular ? "bg-primary hover:bg-primary/90" : "bg-muted hover:bg-muted/80"
                                                            }`}
                                                            variant={plan.popular ? "default" : "outline"}
                                                        >
                                                            {plan.cta}
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Motion>
                                        ))}
                                    </StaggerContainer>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="w-full py-20 md:py-32">
                    <div className="container px-4 md:px-6">
                        <Motion
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
                        >
                            <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                                FAQ
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
                            <p className="max-w-[800px] text-muted-foreground md:text-lg">
                                Find answers to common questions about PaperVault and accessing LGU past papers.
                            </p>
                        </Motion>

                        <div className="mx-auto max-w-3xl">
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, i) => (
                                    <AccordionItem key={i} value={`item-${i}`} className="border-b border-border/40 py-2">
                                        <AccordionTrigger className="text-left font-medium hover:no-underline">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </section>


                {/* CTA Section */}
                <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-grid-pattern-white"></div>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="container px-4 md:px-6 relative">
                        <Motion
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col items-center justify-center space-y-6 text-center"
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Ready to Ace Your Exams?</h2>
                            <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                                Join thousands of LGU students who are already using PaperVault to access past papers and improve their
                                exam performance.
                            </p>

                            {/* Waitlist Form in CTA */}
                            <div className="max-w-md mx-auto">
                                {isSubmitted ? (
                                    <Motion
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-white/20 border border-white/30 rounded-full px-6 py-3 text-white"
                                    >
                                        ✓ You're on the waitlist! We'll notify you when we launch.
                                    </Motion>
                                ) : (
                                    <form onSubmit={handleWaitlistSubmit} className="flex gap-2">
                                        <Input
                                            type="email"
                                            placeholder="Enter your LGU email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="rounded-full flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                                            required
                                        />
                                        <Button type="submit" variant="secondary" className="rounded-full px-6">
                                            Join Waitlist
                                        </Button>
                                    </form>
                                )}
                            </div>

                            <p className="text-sm text-primary-foreground/80 mt-4">
                                Be the first to know when we launch. No spam, just updates.
                            </p>
                        </Motion>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
                <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
                    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                        <div className="space-y-4">
                            <Motion
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="flex items-center gap-2 font-bold"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                                    P
                                </div>
                                <span>PaperVault</span>
                            </Motion>
                            <p className="text-sm text-muted-foreground">
                                Your gateway to Lahore Garrison University past papers. Access, download, and excel in your studies.
                            </p>
                            <div className="flex gap-4">
                                {[
                                    <svg
                                        key="facebook"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-5 h-5"
                                    >
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                    </svg>,
                                    <svg
                                        key="twitter"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-5 h-5"
                                    >
                                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                                    </svg>,
                                    <svg
                                        key="instagram"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-5 h-5"
                                    >
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                        <rect width="4" height="12" x="2" y="9"></rect>
                                        <circle cx="4" cy="4" r="2"></circle>
                                    </svg>,
                                ].map((icon, index) => (
                                    <Motion
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                    >
                                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                            {icon}
                                            <span className="sr-only">Social Link</span>
                                        </a>
                                    </Motion>
                                ))}
                            </div>
                        </div>
                        {[
                            {
                                title: "Platform",
                                links: ["Features", "Pricing", "Browse Papers", "Mobile App"],
                            },
                            {
                                title: "Resources",
                                links: ["Study Guides", "Exam Tips", "Student Blog", "Help Center"],
                            },
                            {
                                title: "University",
                                links: ["About LGU", "Departments", "Academic Calendar", "Contact Us"],
                            },
                        ].map((section, index) => (
                            <Motion
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="space-y-4"
                            >
                                <h4 className="text-sm font-bold">{section.title}</h4>
                                <ul className="space-y-2 text-sm">
                                    {section.links.map((link) => (
                                        <li key={link}>
                                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </Motion>
                        ))}
                    </div>
                    <Motion
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8"
                    >
                        <p className="text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} PaperVault. Made with ❤️ for LGU students.
                        </p>
                        <div className="flex gap-4">
                            {["Privacy Policy", "Terms of Service", "Academic Integrity"].map((link) => (
                                <a
                                    key={link}
                                    href="#"
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </Motion>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
