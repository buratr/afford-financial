import React, { useState, useRef } from 'react';

interface TagProps {
  name: string;
  x: string;
  id: string;
  onDataChange: (value: string, id:string) => void;
  changFocused:(val:boolean)=>void;
}

const Tag: React.FC<TagProps> = ({ name, x, id, onDataChange, changFocused }) => {

  const [inputVisible, setInputVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  let [timeX, setTimeX] = useState(x);

  const handleClickX = () => {
    setInputVisible(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputVisible) {
        changFocused(false)
      if (event.key === 'Enter') {
        setInputVisible(false);
        onDataChange(timeX, id);
      } else if (event.key === 'Escape') {
        setInputVisible(false);
      } else {
        x += event.key;
        timeX += event.key;
      }
    }
  };

  const handleBlur = () => {
    setInputVisible(false);
    onDataChange(timeX, id); 
    // changFocused(true)
  };

  return (
    <div className="border-solid border border-gray-400 bg-zinc-300 py-1 px-2 my-[2px] rounded-md flex">
      <div>{name}</div>
      <div className='mx-2'>|</div>
      {inputVisible ? (
        <input
          className='w-14'
          type="text"
          value={timeX}
          onChange={(e) => setTimeX(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <div className='cursor-pointer text-zinc-500 hover:text-black' onClick={handleClickX}>
          [{x}]
        </div>
      )}
    </div>
  );
}

export default Tag;
