import React, { FC, useState } from 'react';

interface ButtonProps {
    text?: string;
    class?: string;
    placeholder?: string;
  }

const Button : FC<ButtonProps> = ({text}) => {
    return (
      <div className="">
        <button
          className="hover:bg-opacity-75 w-full text-[#424e5c] bg-hover shadow appearance-none rounded-md py-1 px-3  leading-tight"
        >
            {text}
            </button>
      </div>
    );
  };
  
  export default Button;