import React, { FC } from 'react';

interface InputProps {
  type: string;
  label?: string;
  placeholder?: string;
  value:string;
  changeInput:(value: string) => void;
}

const Input: FC<InputProps> = ({ type, label, placeholder, value, changeInput }) => {
    return (
      <div className="md:mr-6 w-56 max-md:grow max-md:shrink ">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          className="input-violet"
          onChange={(e) => changeInput(e.target.value)}
        />
      </div>
    );
  };
  
  export default Input;

  