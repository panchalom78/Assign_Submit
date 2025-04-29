import React from 'react';
import styled from 'styled-components';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

// Card Component
const Card = ({ imageUrl }) => {
    return (
        <StyledWrapper>
            <div className="card">
                <span />
                <div className="content">
                    {imageUrl ? <img src={imageUrl} alt="Profile" className="profile-img" /> : 'Hover Me : )'}
                </div>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 190px;
    height: 254px;
    color: #fff;
    transition: 0.5s;
    cursor: pointer;
  }

  .card:hover {
    transform: translateY(-20px);
  }

  .card::before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(45deg, #ffbc00, #ff0058);
    border-radius: 1.2em;
  }

  .card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #ffbc00, #ff0058);
    filter: blur(30px);
  }

  .card span {
    position: absolute;
    top: 6px;
    left: 6px;
    right: 6px;
    bottom: 6px;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 2;
    border-radius: 1em;
  }

  .card span::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
  }

  .card .content {
    position: relative;
    padding: 10px;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.5em;
    transition: opacity 0.3s ease;
  }

  .card .content .profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1em;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .card:hover .content .profile-img {
    opacity: 1;
  }

  .card:hover .content {
    font-size: 0; /* Hide the "Hover Me : )" text on hover */
  }
`;

// About Component
const teamMembers = [
    {
        name: 'Om Panchal',
        email: 'ompanchal@example.com',
        github: 'https://github.com/ompanchal',
        linkedin: 'https://linkedin.com/in/ompanchal',
        imageUrl: './om.jpg', // Replace with actual image URL
    },
    {
        name: 'Dhaval Rathod',
        email: 'dhavalrathod@example.com',
        github: 'https://github.com/dhavalrathod',
        linkedin: 'https://linkedin.com/in/dhavalrathod',
        imageUrl: './dhaval.jpg', // Replace with actual image URL
    },
    {
        name: 'Sujal Patel',
        email: 'sujalpatel@example.com',
        github: 'https://github.com/sujalpatel',
        linkedin: 'https://linkedin.com/in/sujalpatel',
        imageUrl: './sujal.jpg', // Replace with actual image URL
    },
];

const About = () => {
    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className=" text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-xl text-[#FB773C] font-bold mb-4">AssignMate</h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto">
                        Simplifying assignment management for students and faculty with a seamless, digital platform.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-12 bg-[#1F1F1F]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-semibold text-center  text-[#FB773C] mb-4">Our Mission</h2>
                    <p className="text-white text-lg max-w-3xl mx-auto text-center">
                        AssignMate is a platform designed to streamline assignment handling.it aims to reduce manual work, automate submissions, and enhance efficiency for the students and faculty.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-black py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl text-[#FB773C] font-semibold text-center mb-8">What We Offer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 bg-[#FAF9F6] rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-2">Student Panel</h3>
                            <p className="text-gray-600">
                                Easily upload assignments, track their status, and stay organized with a user-friendly dashboard.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-2">Faculty Panel</h3>
                            <p className="text-gray-600">
                                Manage, review, and track student submissions efficiently with a dedicated dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-12 bg-black">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-semibold text-[#FB773C] text-center mb-8">Meet the Developers</h2>
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="w-72">
                                <Card imageUrl={member.imageUrl} /> {/* Pass the image URL to the Card */}
                                <div className="mt-4 text-center">
                                    <h3 className="text-xl  text-white font-bold mb-2">{member.name}</h3>
                                    <div className="flex justify-center gap-4">
                                        <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                                            <FaGithub size={24} />
                                        </a>
                                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                                            <FaLinkedin size={24} />
                                        </a>
                                        <a href={`mailto:${member.email}`} className="text-red-600 hover:text-red-800">
                                            <FaEnvelope size={24} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* CTA Section */}
            < section className="bg-[#1F1F1F] text-white py-12" >
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-semibold  text-[#FB773C] mb-4">Ready to Get Started?</h2>
                    <p className="text-lg mb-6 text-white">
                        Join AssignMate today and experience hassle-free assignment management!
                    </p>
                    <a
                        href="/login"
                        className="inline-block bg-white text-[#FB773C] font-semibold py-2 px-6 rounded-lg hover:bg-gray-200"
                    >
                        Log In Now
                    </a>
                </div>
            </section >

            {/* Footer */}
            < footer className="bg-gray-800 text-white py-6" >
                <div className="container mx-auto px-4 text-center">
                    <p>
                        © 2025 AssignMate | Faculty of Technology and Engineering | Computer Science Engineering
                    </p>
                </div>
            </footer >
        </div >
    );
};

export default About;