import React from 'react'
import Navbar from '../components/Navbar'
import Menu from '../components/Menu'
import Card from '../components/Card'
import ProfileCard from '../components/ProfileCard'

const profile = () => {
  return (
    <div className="h-auto w-full bg-black">
    <Navbar />

    <div className="flex flex-wrap  items-start gap-4 px-4">
        <Menu />
    </div>
    <div className="md:ml-70 h-auto w-auto bg-black">
        <ProfileCard />
    </div>
</div>
  )
}

export default profile
