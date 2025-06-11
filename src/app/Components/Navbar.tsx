'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, px } from 'framer-motion'
import { Sun, Moon, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import logo from '../assets/images/logo.png'

interface NavbarProps {
  className?: string
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [userName, setUserName] = useState('John Doe')

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleSignIn = () => {
    setIsSignedIn(true)
  }

  const handleSignOut = () => {
    setIsSignedIn(false)
    setShowProfileMenu(false)
  }

  const navItems = [
    { name: 'home', href: '/' },
    { name: 'weather', href: '/weather' },
    { name: 'blogs', href: '/blogs' },
    { name: 'contact', href: '/contact' }
  ]

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 ${className}`}
    >
      <div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-white/20 dark:border-gray-700/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              
              <Image   src={logo} alt='logo ' width={110}
                height={110} />
            </motion.div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  whileHover={{ scale: 1.05, color: '#3B82F6' }}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300 capitalize font-medium"
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300"
              >
                <AnimatePresence mode="wait">
                  {isDarkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="w-5 h-5 text-yellow-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="w-5 h-5 text-gray-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Sign In / Profile */}
              <div className="relative">
                {!isSignedIn ? (
                  <motion.button
                    onClick={handleSignIn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Sign In
                  </motion.button>
                ) : (
                  <div>
                    <motion.button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 p-2 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium hidden sm:block">
                        {userName}
                      </span>
                      <motion.div
                        animate={{ rotate: showProfileMenu ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {showProfileMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-56 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg shadow-xl border border-white/20 dark:border-gray-700/20 py-2"
                        >
                          <div className="px-4 py-3 border-b border-gray-200/20 dark:border-gray-700/20">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {userName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              john.doe@example.com
                            </p>
                          </div>

                          <motion.button
                            whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            Settings
                          </motion.button>

                          <motion.button
                            onClick={handleSignOut}
                            whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-2 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className="block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1"></span>
                  <span className="block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1"></span>
                  <span className="block w-5 h-0.5 bg-gray-600 dark:bg-gray-300"></span>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar