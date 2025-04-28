import React, { useState, useEffect} from 'react';
import HomeNavbar from '../components/HomeNavabar';
import './home.css';
import { useNavigate } from "react-router";



const HomePage = () => {
  const [typedText, setTypedText] = useState('');
  const [typedText2, setTypedText2] = useState('');
  const fullText = "Welcome to Assign";
  const fullText2 = "Mate";
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // First part typing animation
    let i = 0;
    const typingInterval1 = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval1);
        
        // Second part typing animation
        let j = 1;
        const typingInterval2 = setInterval(() => {
          if (j < fullText2.length) {
            setTypedText2(fullText2.substring(0, j + 1));
            j++;
          } else {
            clearInterval(typingInterval2);
            setShowSubtitle(true);
            setTimeout(() => setShowButton(true), 500);
          }
        }, 150); // Slightly slower for emphasis
      }
    }, 100);

    return () => {
      clearInterval(typingInterval1);
    };
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#000000] to-[#160209] overflow-hidden'>
      <HomeNavbar />

      <div className='container mx-auto px-6 py-24 md:py-36 flex flex-col items-center justify-center text-center relative z-10'>
        {/* Animated heading with different colors */}
        <h1 className='text-4xl md:text-6xl font-extrabold mb-6'>
          <span className='text-transparent bg-clip-text bg-[#FBC740]'>
            {typedText}
          </span>
          <span className='text-transparent bg-clip-text bg-[#EB3678] ml-2'>
            {typedText2}
          </span>
          <span className='typing-cursor'>|</span>
        </h1>

        {/* Subtitle with fade-in animation */}
        {showSubtitle && (
          <p className={`text-xl md:text-2xl text-white/80 mb-12 max-w-2xl leading-relaxed opacity-0 animate-fadeIn ${showSubtitle ? 'opacity-100' : ''}`}>
            The ultimate platform to <span className='font-semibold text-[#FB773C]'>organize</span>, <span className='font-semibold text-[#EB3678]'>track</span>, and <span className='font-semibold text-[#FB773C]'>excel</span> in your academic journey
          </p>
        )}

        {/* CTA button with Uiverse.io style */}
        {showButton && (
          <div className={`opacity-0 animate-bounceIn ${showButton ? 'opacity-100' : ''}`}>
            <button className='uiverse-btn' 
            onClick={()=>{
              navigate('/signup')
            }
            
            }>
              <span className='uiverse-span'
              
              >Get Started For Free</span>
            </button>
            <p className='mt-4 text-sm text-white/60'>No credit card required</p>
          </div>
        )}

        {/* Feature cards */}
       
      </div>

      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {/* Large floating circles */}
        {[...Array(5)].map((_, i) => (
          <div 
            key={`circle-${i}`}
            className='absolute rounded-full opacity-10 animate-float'
            style={{
              background: `radial-gradient(circle, ${i % 2 === 0 ? '#EB3678' : '#FB773C'}, transparent)`,
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 30 + 30}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}

        {/* Small particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className='absolute rounded-full bg-white/5 animate-float'
            style={{
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;