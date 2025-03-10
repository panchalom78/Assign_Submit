import React from 'react';

const cardTypes = [
    { id: 1, cname: "Total Assignment", number: 5 },
    { id: 2, cname: "Pending Assignment", number: 2 },
    { id: 3, cname: "Recent Grade", number: "A+" },
    { id: 4, cname: "Remark", number: "5" }
];

const Card = () => {
    return (
        <div className='flex flex-wrap justify-center items-center px-4 py-6 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 w-full h-auto'>
            {cardTypes.map((card) => (
                <div 
                    key={card.id} 
                    className='h-32 w-40 sm:h-36 sm:w-44 md:h-40 md:w-48 lg:h-44 lg:w-52 xl:h-48 xl:w-56 bg-cyan-300 text-white flex flex-col justify-center items-center rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105'
                >
                    <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold'>{card.number}</h1>
                    <p className='text-sm sm:text-base md:text-lg'>{card.cname}</p>
                </div>
            ))}
        </div>
    );
};

export default Card;
