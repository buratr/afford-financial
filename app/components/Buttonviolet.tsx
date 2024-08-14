import React, { FC } from 'react';

interface ButtonvioletProps {
  text:string;
  clickBtn:() => void;
}

const Buttonviolet: FC<ButtonvioletProps> = ({ text, clickBtn }) =>  {
    return (
      <div className="w-56 max-md:grow max-md:shrink">
        <button
          className="button-violet"
          onClick={clickBtn}
        >
          {text}
        </button>
      </div>
    );
  };
  
  export default Buttonviolet;