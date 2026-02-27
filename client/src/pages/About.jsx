import React from 'react';
import profileImg from '../assets/profile.jpg';

const About = () => {
    const techStack = [
        {
            name: 'MongoDB',
            desc: 'Scalable NoSQL Database',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.1932 9.53509C15.6321 4.2981 12.569 0.40356 12.317 0.0872205C12.148 -0.121115 11.852 -0.121115 11.683 0.0872205C11.431 0.40356 8.36785 4.2981 6.80677 9.53509C5.2457 14.7721 9.07993 19.3894 11.4552 20.6514C11.6422 20.7512 11.8542 20.8033 12.0692 20.8033C12.2842 20.8033 12.4962 20.7512 12.6832 20.6514C15.0584 19.3894 18.7543 14.7721 17.1932 9.53509Z" fill="#47A248" />
                    <path d="M12.0001 23.9999C11.8901 23.9999 11.7851 23.9749 11.6881 23.9269C11.4421 23.8059 1.1571 18.6659 1.1571 10.3999C1.1571 10.1239 1.3811 9.8999 1.6571 9.8999C1.9331 9.8999 2.1571 10.1239 2.1571 10.3999C2.1571 17.8469 11.4011 22.5139 12.0011 22.8059C12.6011 22.5139 21.8451 17.8459 21.8451 10.3999C21.8451 10.1239 22.0691 9.8999 22.3451 9.8999C22.6211 9.8999 22.8451 10.1239 22.8451 10.3999C22.8451 18.6649 12.5581 23.8059 12.3121 23.9269C12.2151 23.9749 12.1101 23.9999 12.0001 23.9999Z" fill="#47A248" />
                </svg>
            )
        },
        {
            name: 'Express.js',
            desc: 'Secure Backend Runtime',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0V0zm1.3 6.9h2.3l1.8 4.3 1.8-4.3h2.3l-2.8 6.4v4.3H4.4v-4.3L1.3 6.9zm13.6 0v10.7h-2.3v-4.2h-3.4v4.2H6.9V6.9h2.3V11h3.4V6.9h2.4zm5.8 1.9c-.8 0-1.4.3-1.9.8V6.9h-2.3v10.7h2.3v-4.4c.5.5 1.1.8 1.9.8 1.6 0 2.9-1.3 2.9-4 0-2.6-1.3-4-2.9-4zm-1.1 5.3c-.6 0-1-.3-1-.9 0-.5.4-.9 1-.9.5 0 .9.4.9.9s-.4.9-.9.9z" />
                </svg>
            )
        },
        {
            name: 'React.js',
            desc: 'Dynamic User Interfaces',
            icon: (
                <svg className="w-8 h-8" viewBox="-11.5 -10.23174 23 20.46348" fill="#61DAFB">
                    <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
                    <g stroke="#61DAFB" strokeWidth="1" fill="none">
                        <ellipse rx="11" ry="4.2" />
                        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                    </g>
                </svg>
            )
        },
        {
            name: 'Node.js',
            desc: 'Blazing Fast Server Engine',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#339933" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0l10.4 6v12L12 24l-10.4-6V6L12 0zm8.6 7.1L12 2.3 3.4 7.1v9.8l8.6 4.8 8.6-4.8V7.1zM6.6 9.6v4.8l2.9 1.7V11l2.4 1.4v4.9l2.9 1.6V9l-2.9-1.7v4.9l-2.4-1.4V9.6l-2.9 0z" />
                </svg>
            )
        },
        {
            name: 'Tailwind CSS',
            desc: 'Premium Visual Styling',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#06B6D4" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19 12.001 19c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
                </svg>
            )
        },
        {
            name: 'JWT Auth',
            desc: 'Advanced Session Security',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#FB015B" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 11v2h10v-2H7zm5-11L3.5 4.5V11c0 5.25 3.62 10.16 8.5 11.5 4.88-1.34 8.5-6.25 8.5-11.5V4.5L12 0zm6.5 11c0 4.15-2.6 8.04-6.5 9.25-3.9-1.21-6.5-5.1-6.5-9.25V5.64L12 2.64l12 3v5.36z" />
                </svg>
            )
        },
    ];

    const socials = [
        {
            name: 'GitHub',
            url: 'https://github.com/its-sriram-here',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.11.81 2.235V23.43c0 .315.225.69.825.57C20.565 22.792 24 18.315 24 12c0-6.63-5.37-12-12-12z" /></svg>
            )
        },
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/its-sriram-here/',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5V10h3v9zM6.5 8.25c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zM19 19h-3v-4.74c0-1.42-.6-2.14-1.72-2.14-1.11 0-1.74.72-1.74 2.14V19h-3V10h3v1.45h.05c.42-.79 1.43-1.45 2.64-1.45 2.1 0 3.77 1.33 3.77 4.3V19z" /></svg>
            )
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/its_sriram_here',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            )
        },
        {
            name: 'Portfolio',
            url: 'https://its-sriram-here.vercel.app/',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            )
        },
        {
            name: 'Email',
            url: 'mailto:srirammurugesan1807@gmail.com',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            )
        },
    ];

    return (
        <div className="space-y-24 animate-fade-in pb-20">

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-12">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto px-4">
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                            Meet the Creator
                        </div>
                        <h1 className="text-6xl font-black tracking-tight text-slate-900 font-display leading-[1.1]">
                            Building Wealth <br />
                            <span className="premium-gradient-text italic">One Bit at a Time</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                            I'm <span className="text-slate-900 font-bold">Sriram</span>, a MERN Stack developer passionate about crafting pixel-perfect, highly scalable financial solutions.
                        </p>

                        {/* Social Connectivity Bar */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                            {socials.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group"
                                    title={social.name}
                                >
                                    <span className="group-hover:scale-110 transition-transform">{social.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="relative mx-auto lg:ml-auto">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-secondary opacity-30 blur-2xl"></div>
                        <div className="relative w-80 h-96 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
                            <img
                                src={profileImg}
                                alt="Sriram"
                                className="w-full h-full object-cover grayscale transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <div className="text-3xl font-bold font-display">Sriram</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* App Mission Section */}
            <section className="max-w-6xl mx-auto px-4">
                <div className="glass-card p-12 md:p-16 rounded-[4rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl opacity-50"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        <div className="md:col-span-2 space-y-6">
                            <h2 className="text-3xl font-extrabold text-slate-800 font-display">The FinManage Mission</h2>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                In a world of complex transactions, we strive for simplicity. FinManage was born from the need to provide a professional-grade tracking tool that doesn't compromise on aesthetics or speed.
                            </p>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Our architecture focuses on <span className="text-slate-900 font-bold">real-time insights</span>, <span className="text-slate-900 font-bold">secure data isolation</span>, and <span className="text-slate-900 font-bold">automated financial discipline</span> through intelligent budgeting.
                            </p>
                        </div>
                        <div className="bg-slate-900 rounded-[3rem] p-8 text-white flex flex-col justify-center items-center text-center space-y-4 shadow-2xl shadow-slate-200">
                            <div className="text-5xl font-black text-primary-light font-display">100%</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Open Architecture</div>
                            <div className="w-12 h-1 bg-primary rounded-full"></div>
                            <p className="text-[10px] text-slate-500 font-bold leading-relaxed px-4">Securely encrypted & highly optimized performance.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Engineering Section */}
            <section className="max-w-6xl mx-auto px-4 space-y-12">
                <div className="text-center space-y-2">
                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">Under the Hood</h2>
                    <p className="text-4xl font-extrabold text-slate-900 font-display italic">Modern Stack. Robust Logic.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {techStack.map((tech) => (
                        <div key={tech.name} className="glass-card p-10 rounded-[2.5rem] bg-white shadow-sm border-slate-100">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                                {tech.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">{tech.name}</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{tech.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="max-w-4xl mx-auto px-4 text-center">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <h2 className="text-3xl font-extrabold font-display mb-6 relative z-10">Interested in Collaboration?</h2>
                    <p className="text-slate-400 font-medium mb-10 max-w-lg mx-auto relative z-10">
                        I'm always open to discussing technical architecture or new project opportunities.
                    </p>
                    <a
                        href="mailto:srirammurugesan1807@gmail.com"
                        className="inline-block px-12 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-primary-dark hover:text-white transition-all duration-300 shadow-xl shadow-slate-950/20 active:scale-95 relative z-10"
                    >
                        Get in Touch
                    </a>
                </div>
            </section>

        </div>
    );
};

export default About;
