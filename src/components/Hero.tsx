import React from 'react'
import heroImage from '../assets/imgs/hero.jpg'
import { Link } from 'react-router-dom'

export default function Hero() {
    return (
        <div className='relative h-64 w-full overflow-hidden sm:h-96 lg:h-[28rem] relative'>
            <img
                className='h-full w-full object-cover'
                src={heroImage}
                alt="hero_image"
            />

            <div className='absolute inset-x-0 bottom-0 flex h-[35%] flex-col items-center justify-end bg-gradient-to-t from-black/80 to-black/0 px-4 pb-4 sm:h-[40%]'>
                <Link
                    to='/discover'
                    className='rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-green-400'
                >
                    Discover
                </Link>
                <p className='mt-2 text-center text-sm text-white/90'>Explore trending movies and discover your next favorite.</p>
            </div>

        </div>
    )
}
