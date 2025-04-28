import React, { useState } from 'react';
import { useNavigate } from "react-router";
import { motion } from 'framer-motion';

const HomeNavbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Logo animation variants
    const logoVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.8,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.05,
            textShadow: "0 0 8px rgba(251, 119, 60, 0.6)",
            transition: { duration: 0.3 }
        }
    };

    const navItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5
            }
        }),
        hover: {
            scale: 1.05,
            color: "#FB773C",
            transition: { duration: 0.2 }
        }
    };

    return (
        <nav className="bg-black/80 backdrop-blur-md border-b border-[#EB3678]/20 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Animated Logo */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        variants={logoVariants}
                        className="flex-shrink-0 flex items-center cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <div className="relative">
                            <span className="text-2xl font-bold bg-gradient-to-r from-[#FF9B17] to-[#FCB454] bg-clip-text text-transparent">
                                AssignMate
                            </span>
                            <motion.span 
                                className="absolute -bottom-1 left-0 h-1 bg-[#EB3678]"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        </div>
                        <motion.div 
                            className="ml-2 w-6 h-6 rounded-full border-2 border-[#FB773C] flex items-center justify-center"
                            animate={{
                                rotate: 360,
                                transition: { 
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "linear"
                                }
                            }}
                        >
                            <div className="w-1 h-1 bg-[#EB3678] rounded-full" />
                        </motion.div>
                    </motion.div>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <ul className="ml-10 flex items-center space-x-6">
                            {[
                                { name: 'About', path: '#about' },
                              
                                { name: 'Login', path: '/login', action: () => navigate('/login') },
                            ].map((item, i) => (
                                <motion.li
                                    key={item.name}
                                    custom={i}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    variants={navItemVariants}
                                >
                                    {item.action ? (
                                        <button
                                            onClick={item.action}
                                            className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                                        >
                                            {item.name}
                                        </button>
                                    ) : (
                                        <a 
                                            href={item.path}
                                            className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                                        >
                                            {item.name}
                                        </a>
                                    )}
                                </motion.li>
                            ))}
                            <motion.li
                                custom={3}
                                initial="hidden"
                                animate="visible"
                                whileHover={{ scale: 1.05 }}
                                variants={navItemVariants}
                            >
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="bg-gradient-to-r from-[#EB3678] to-[#FB773C] text-white px-5 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-[#EB3678]/30 transition-all"
                                >
                                    Sign Up
                                </button>
                            </motion.li>
                        </ul>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none"
                            aria-label="Main menu"
                        >
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <motion.div 
                className="md:hidden"
                initial={false}
                animate={isMenuOpen ? "open" : "closed"}
                variants={{
                    open: { 
                        height: "auto",
                        opacity: 1,
                        transition: { 
                            staggerChildren: 0.1,
                            delayChildren: 0.2
                        }
                    },
                    closed: { 
                        height: 0,
                        opacity: 0,
                        transition: { 
                            when: "afterChildren",
                            staggerChildren: 0.05,
                            staggerDirection: -1
                        }
                    }
                }}
            >
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {[
                        { name: 'About', path: '#about' },
                        { name: 'Login', path: '/login', action: () => navigate('/login') },
                        { name: 'Sign Up', path: '/signup', action: () => navigate('/signup') },
                    ].map((item) => (
                        <motion.div
                            key={item.name}
                            variants={{
                                open: { 
                                    opacity: 1,
                                    y: 0,
                                    transition: { 
                                        duration: 0.3
                                    }
                                },
                                closed: { 
                                    opacity: 0,
                                    y: -20,
                                    transition: { 
                                        duration: 0.2
                                    }
                                }
                            }}
                        >
                            {item.action ? (
                                <button
                                    onClick={() => {
                                        item.action();
                                        setIsMenuOpen(false);
                                    }}
                                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${item.name === 'Sign Up' ? 
                                        'bg-gradient-to-r from-[#EB3678] to-[#FB773C] text-white' : 
                                        'text-gray-300 hover:text-white hover:bg-gray-800'}`}
                                >
                                    {item.name}
                                </button>
                            ) : (
                                <a 
                                    href={item.path}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </nav>
    );
};

export default HomeNavbar;