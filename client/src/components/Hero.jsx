import React from 'react'
import { Button } from './index.js'
const Hero = () => {
    return (
        <section className='py-24'>
            <div className="container">
                <div className="flex justify-center">
                    <div className='inline-flex py-1 px-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full text-neutral-950 font-semibold'>
                    🔍 Real-Time Social Sentiment Analysis
                    </div>
                </div>
                <h1 className='text-6xl md:text-7xl lg:text-8xl font-medium text-center mt-6'>SentiScope <br /> AI-Powered Insights </h1>
                <p className='text-center text-lg text-white/50 mt-8 max-w-2xl mx-auto'>
                Uncover real-time emotions behind trends, brands, and topics on Reddit, Twitter, and Facebook. Turn social chatter into powerful insights with AI-driven sentiment analysis!
                </p>
                <form className='flex border border-white/15 rounded-full p-2 mt-8 max-w-lg mx-auto'>
                    <input type="email" placeholder="Analyze sentiment—Try 'AI' or 'Bitcoin'!" className='bg-transparent px-4 md:flex-1'/>
                    <Button type='submit' variant='primary' className='whitespace-nowrap h-10'>Search</Button>
                </form>
            </div>
        </section>
    )
}

export default Hero