"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wind, Droplets } from 'lucide-react';
import Image from 'next/image';
import bg from '../assets/images/bg.jpg';
import robot from "../assets/images/robot.png";

const Hero = () => {
  // State management
  const [city, setCity] = useState('');
  type WeatherData = {
    city: string;
    temperature: number;
    windSpeed: number;
    humidity: number;
    conditions: string;
    icon: string;
  };
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedCity, setSearchedCity] = useState('Faisalabad');
  const [aiTextIndex, setAiTextIndex] = useState(0);

  const aiTexts = [
    "Chat with AI...",
    "Ask about weather...",
    "Get forecasts...",
    "Need help?..."
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const weatherCardVariants = {
    hidden: { x: 100, opacity: 0, scale: 0.8 },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Robot animation variants
  const robotVariants = {
    hover: {
      y: [0, -5, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95,
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 0.5
      }
    }
  };

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.3,
        duration: 0.5
      }
    })
  };

  // Fetch weather data
  const fetchWeatherData = async (location: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&contentType=json`
      );
      
      if (!response.ok) {
        throw new Error(`Weather data not found for ${location}`);
      }
      
      const data = await response.json();
      
      setWeatherData({
        city: data.resolvedAddress,
        temperature: Math.round(data.currentConditions.temp),
        windSpeed: Math.round(data.currentConditions.windspeed),
        humidity: Math.round(data.currentConditions.humidity * 100),
        conditions: data.currentConditions.conditions,
        icon: data.currentConditions.icon
      });
      
      setSearchedCity(location);
      setCity('');
    } catch (err) {
      console.error("Error fetching weather:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchWeatherData(searchedCity);
  }, []);

  // AI text animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAiTextIndex((prev) => (prev + 1) % aiTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle search
  const handleSearch = () => {
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  // Get weather icon based on conditions
  const getWeatherIcon = (conditions: string) => {
    const condition = conditions.toLowerCase();
    if (condition.includes('rain')) return '🌧️';
    if (condition.includes('cloud')) return '☁️';
    if (condition.includes('sun') || condition.includes('clear')) return '☀️';
    if (condition.includes('snow')) return '❄️';
    if (condition.includes('thunder') || condition.includes('storm')) return '⚡';
    return '🌈';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={bg}
          alt='background'
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-7 w-full">
          {/* Search Section */}
          <motion.div
            className="flex-1 max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 className="text-4xl sm:text-5xl font-bold text-white mb-8" variants={itemVariants}>
              Enter your City Name
            </motion.h2>

            <motion.div className="relative max-w-lg" variants={itemVariants}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Weather"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-6 py-4 bg-gradient-to-t from-[#f08d1b]/30 to-[#1f2627]/50 backdrop-blur-md rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
              {error && (
                <motion.p 
                  className="text-red-400 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.p>
              )}
            </motion.div>
          </motion.div>

          {/* Weather Card */}
          {weatherData ? (
            <motion.div
              className="w-full max-w-sm bg-gradient-to-t from-[#fc8600]/30 to-[#1f2627]/30 backdrop-blur-md rounded-3xl p-8 border-white/20"
              variants={weatherCardVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {searchedCity}
              </h3>

              <div className="flex items-center justify-center mb-8">
                <div className="text-6xl mr-4">
                  {getWeatherIcon(weatherData.conditions)}
                </div>
                <div className="text-5xl font-bold text-white">
                  {weatherData.temperature}°
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Wind className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">
                    {weatherData.windSpeed} km/h
                  </div>
                  <div className="text-gray-300 text-xs">Wind</div>
                </div>

                <div className="text-center">
                  <div className="text-4xl mb-1">
                    {getWeatherIcon(weatherData.conditions)}
                  </div>
                  <div className="text-sm font-bold text-white capitalize">
                    {weatherData.conditions}
                  </div>
                </div>

                <div className="text-center">
                  <Droplets className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">
                    {weatherData.humidity}%
                  </div>
                  <div className="text-gray-300 text-xs">Humidity</div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="w-full max-w-sm bg-gradient-to-t from-[#fc8600]/30 to-[#1f2627]/30 backdrop-blur-md rounded-3xl p-8 border-white/20 h-64 flex items-center justify-center">
              {loading ? (
                <div className="text-white">Loading weather data...</div>
              ) : (
                <div className="text-white">No weather data available</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat with AI Button */}
      <motion.div
        className="fixed bottom-8 right-8"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button 
          className="bg-gradient-to-t from-[#a0f8d7]/30 to-[#79612d]/30 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center space-x-3 shadow-lg overflow-hidden"
          whileHover="hover"
          whileTap="tap"
        >
          <motion.div
            variants={robotVariants}
          >
            <Image 
              src={robot} 
              alt='AI' 
              width={40} 
              height={40} 
              className="object-contain"
            />
          </motion.div>
          
          <motion.span 
            className="font-medium min-w-[120px] text-left"
            key={aiTextIndex}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            custom={1}
          >
            {aiTexts[aiTextIndex]}
          </motion.span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Hero;