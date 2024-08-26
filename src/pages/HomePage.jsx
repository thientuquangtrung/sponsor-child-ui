import Event from '@/components/landingpage/Event'
import FeaturedCampaign from '@/components/landingpage/FeaturedCampaign'
import FeedbackCenter from '@/components/landingpage/FeedbackCenter'
import Hero from '@/components/landingpage/Hero'
import HowToGetInvolved from '@/components/landingpage/HowToGetInvolved'
import React from 'react'

const HomePage = () => {
    return (
        <div>
            <Hero />
            <HowToGetInvolved />
            <FeaturedCampaign />
            <Event />
            <FeedbackCenter />
        </div>
    )
}

export default HomePage
