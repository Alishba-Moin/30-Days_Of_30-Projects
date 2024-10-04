"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FaBirthdayCake, FaGift } from 'react-icons/fa';
import { GiBalloons } from 'react-icons/gi';
import Howler from 'react-howler';

type ConfettiProps = {
    width: number;
    height: number;
}

// Dynamically import Confetti component
const DynamicConfetti = dynamic(() => import('react-confetti'), { ssr: false })

// Define color arrays for candles, balloons, and confetti
const candleColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
const balloonColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
const confettiColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE']

export default function BirthdayWish() {
    // State variables
    const [candlesLit, setCandlesLit] = useState<number>(0) // Number of lit candles
    const [balloonsPoppedCount, setBalloonsPoppedCount] = useState<number>(0) // Number of popped balloons
    const [showConfetti, setShowConfetti] = useState<boolean>(false) // Whether to show confetti
    const [windowSize, setWindowSize] = useState<ConfettiProps>({ width: 0, height: 0 }) // Window size for confetti
    const [celebrating, setCelebrating] = useState<boolean>(false) // Whether celebration has started

    // Sound effects
    const [playSound, setPlaySound] = useState<boolean>(false);

    // Constants
    const totalCandles: number = 5 // Total number of candles
    const totalBalloons: number = 5 // Total number of balloons

    // Effect to handle window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Effect to show confetti when all candles are lit and balloons are popped
    useEffect(() => {
        if (candlesLit === totalCandles && balloonsPoppedCount === totalBalloons) {
            setShowConfetti(true)
        }
    }, [candlesLit, balloonsPoppedCount])

    // Function to light a candle
    const lightCandle = (index: number) => {
        if (index === candlesLit) {
            setCandlesLit(prev => prev + 1)
            setPlaySound(true)
            setTimeout(() => setPlaySound(false), 1000); // Stop sound after 1 second
        }
    }

    // Function to pop a balloon
    const popBalloon = (index: number) => {
        if (index === balloonsPoppedCount) {
            setBalloonsPoppedCount(prev => prev + 1)
            setPlaySound(true)
            setTimeout(() => setPlaySound(true), 1000); // Stop sound after 1 second
        }
    }

    // Function to start celebration
    const celebrate = () => {
        setCelebrating(true)
        setShowConfetti(true)
        const interval = setInterval(() => {
            setCandlesLit(prev => {
                if (prev < totalCandles) return prev + 1
                clearInterval(interval)
                return prev
            })
        }, 500)
        setPlaySound(true)
        setTimeout(() => setPlaySound(false), 1000); // Stop sound after 2 second
        playVoiceMessage("Happy Birthday, Alishba Moin! Hope you have a fantastic 18th birthday!")
    }

    // Function to play a voice message
    const playVoiceMessage = (message: string) => {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'en-US'; // You can change this to other languages if needed
        window.speechSynthesis.speak(utterance);
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 flex items-center justify-center p-6">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-md"
            >
        <div className="bg-white rounded-lg shadow-lg border-2 border-black overflow-hidden transform transition-transform duration-500 hover:scale-105">
            <CardHeader className="p-6 text-center bg-gradient-to-r from-yellow-300 to-yellow-500 border-b-2 border-black">
            <CardTitle className="text-4xl font-bold text-yellow-800 mb-2">🎉 Happy Birthday! 🎉</CardTitle>
            <CardDescription className="text-2xl font-semibold text-gray-700 mb-1">Alishba Moin</CardDescription>
                <p className="text-lg text-gray-600">November 18th</p>
            </CardHeader>
            <CardContent className="p-6 text-center space-y-6">
        <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Light the candles:</h3>
              <div className="flex justify-center space-x-3">
                    {[...Array(totalCandles)].map((_, index) => (
                        <AnimatePresence key={index}>
                    {(celebrating && index <= candlesLit) || (!celebrating && index < candlesLit) ? (
                        <motion.div
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           exit={{ scale: 0 }}
                           transition={{ duration: 0.5, delay: celebrating ? index * 0.3 : 0 }} >
                            <FaBirthdayCake
                                  className={`w-10 h-10 transition-transform duration-300 ease-in-out cursor-pointer hover:scale-110`}
                                  style={{ color: candleColors[index % candleColors.length] }}
                                  onClick={() => lightCandle(index)}/>
                        </motion.div>
                            ) : (
                            <FaBirthdayCake
                                 className={`w-10 h-10 text-gray-300 transition-transform duration-300 ease-in-out cursor-pointer hover:scale-110`}
                                 onClick={() => lightCandle(index)}/>
                            )}
                        </AnimatePresence>
                ))}
            </div>
               </div>
                   <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Pop the balloons:</h3>
                   <div className="flex justify-center space-x-3">
                         {[...Array(totalBalloons)].map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 1 }}
                                animate={{ scale: index < balloonsPoppedCount ? 0 : 1 }}
                                transition={{ duration: 0.4 }}>
                               <GiBalloons
                                    className={`w-10 h-10 cursor-pointer hover:scale-110`}
                                    style={{ color: index < balloonsPoppedCount ? '#D1D5DB' : balloonColors[index % balloonColors.length] }}
                                        onClick={() => popBalloon(index)} />
                    </motion.div>
          ))}
            </div>
               </div>
                </CardContent>
                <CardFooter className="p-4 flex justify-center bg-gradient-to-r from-yellow-300 to-yellow-500 border-t-2 border-black">
                    <Button
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 flex items-center"
                        onClick={celebrate}
                        disabled={celebrating}>
                             Celebrate! <FaGift className="inline-block ml-2 h-5 w-5" />
                    </Button>
                </CardFooter>
            </div>
            </motion.div>
            {showConfetti && (
                <DynamicConfetti
                    width={windowSize.width}
                    height={windowSize.height}
                    colors={confettiColors}
                />
            )}
            {playSound && (
                <Howler
                    src="/birthday-sound.wav"
                    playing={playSound}
                />
            )}
        </div>
    );
}
