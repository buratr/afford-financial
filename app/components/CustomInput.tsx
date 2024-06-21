"use client";

import React, { useState, useEffect } from 'react';
import Tag from './Tag';
import calculator from "../lib/calculator"

interface CustomInputProps {
  name: string;
  endpoint: string;
}

const CustomInput: React.FC<CustomInputProps> = ({name, endpoint})=> {

  const isAllowedKey = (key: string) => {
    const allowedCharacters = /^[0-9a-zA-Z\+\-\*\/\^\(\) ]$/;
    if (key === 'Backspace' || key === 'Control' || key === 'Alt' || key === 'Shift') {
      return false;
    }
    if (!allowedCharacters.test(key)) {
      return false;
    }
    return true;
  };
  const isSpecialKey = (key: string) => {
    const allowedSpecialCharacters = /^[\+\-\*\/\^\(\)]$/;
    return allowedSpecialCharacters.test(key);
  };

  const fetchTagsVariants = async (query: string)=>{
    if (!query) { return;}
    try {
      const response = await fetch(endpoint);
      const dataTags = await response.json();
      const filteredObjects = dataTags.filter((obj: { name: string | string[]; }) => obj.name.includes(query));
      setAutocomplete(filteredObjects)
    } catch (error) {
      console.error("Error Tags Variants:", error);
    }
  }

  let [isFocused, setIsFocused] = useState(false);
  let [data, setData] = useState<any[]>([]);
  let [formulaArr, setFormulaArr] = useState<any[]>([]);
  let [dataX, setDataX] = useState<string>("5");
  let [query, setQuery] = useState<string>("");
  let [autocomplete, setAutocomplete] = useState<any[]>([]);
  let [formulaString, setFormulaString] = useState<string>("");
  let [formulaResult, setFormulaResult] = useState<number>();

  const recalculate = ()=>{
    let timeArr:string[] = []
    formulaArr.forEach(item =>{
      timeArr.push(item?.value?item.value:item )
    })
    if(!isSpecialKey(timeArr[timeArr.length-1]) && timeArr.length>1){
      // setFormulaResult(eval(timeArr.join('')))
      setFormulaResult(calculator(timeArr.join('')) )
    }
    setFormulaString(timeArr.join(''))
  }

const addTag = (tag:object) => {
  console.log("tag:", tag)
  setFormulaArr(prevData => [...prevData, tag]);
  setAutocomplete([])
  setQuery("")
  setData([]);
  // setIsFocused(true)
}

useEffect(() => {
  recalculate()
}, [formulaArr]); 


const changformulaArr = (value:string, id:string)=>{
  const updatedArray = formulaArr.map(item => 
    item.id === id ? { ...item, value: value } : item
  );
  setFormulaArr(updatedArray);
}

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Backspace') {
      if (data.length > 0) {
        setData(prevData => prevData.slice(0, -1));
        const sQuery = query.slice(0, -1);
        setQuery(sQuery)
        setAutocomplete([])
      }else{
        setFormulaArr(prevData => prevData.slice(0, -1));
      }
      setFormulaResult(0)
    } else {
      if (isAllowedKey(event.key)) {
        if(isSpecialKey(event.key)){
          if(data.length > 0){
            setFormulaArr(data);
            setData([event.key]);
            setQuery("")
          }else{
            setData(prevData => [...prevData, event.key]);
            setFormulaArr(prevData => [...prevData, event.key]);
          }
        }else{
          setData(prevData => [...prevData, event.key]);
          setQuery(query += event.key)
          if(query.length > 1){
            fetchTagsVariants(query)
          }
        }
        console.log("data: ", data)
      }
    }
  };

  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
       handleKeyDown(event);
    };
    if (isFocused) {
       document.addEventListener('keydown', keydownHandler);
    } else {
       document.removeEventListener('keydown', keydownHandler);
    }
    return () => {
       document.removeEventListener('keydown', keydownHandler);
    };
  }, [isFocused, data]);

  return (
    <div className='relative w-2/3 pt-16 border-solid border border-stone-400 pl-4 pr-4 pb-4 mb-8'>
   {formulaResult ? (
        <div className='absolute top-1'>
          <div className='font-bold'>Preview:</div>
          <div className='flex'>
            {formulaString}
            <div>={formulaResult}</div>
          </div>
        </div>
      ) : null}
      
      <div className='font-bold flex'>{name}:
      <svg viewBox="0 0 16 16" className="ml-1 h-6 w-4 fill-current"><path d="M3 1h13v2H5v12l-5-2v-2.3L3 12V1z"></path><path d="M7 15h2.13l2.296-3.635h.056L13.686 15H16l-3.325-5.077L15.945 5h-2.13L11.61 8.48h-.055L9.406 5H7.092l3.27 4.942L7 15z"></path></svg>
      </div>
      <div 
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={isFocused?
          "border-solid border-2 border-gray-500 p-5 flex-wrap rounded-xl cursor-text flex content-center"
          :
          "border-solid border-2 border-gray-400 p-5 flex-wrap rounded-xl cursor-text flex content-center" }
      >
        
        {formulaArr.map((item, index) => {
          if (item?.category !== undefined) {
            return (
              <Tag key={index} name={item.name} x={item.value} id={item.id} changFocused={(val) => setIsFocused(val)} onDataChange={(value, id) => {console.log(value); changformulaArr(value, id)}} />
            );
          }else{
            return (<div className='text-xl flex items-center min-w-2' key={index}>{item}</div>);
          }
          
        })}
        
        {data.map((item, index) => {
          if (!isSpecialKey(item)) {
            return ( <div className='text-xl flex items-center min-w-2' key={index}>{item}</div>)
          }
         
        })}
        <div className={isFocused ? 'blink text-xl flex items-center' : 'opacity-0 text-xl'}>|</div>
        
      </div>
        <div className='z-20 absolute w-full max-w-[576px] bg-neutral-300 max-h-96 overflow-x-auto rounded-xl'>
          {autocomplete.map((item, index)=>(

            <div 
            onClick={()=>{addTag(item)}}
            key={index}
            className='text-lg p-3 border-b border-gray-500 hover:bg-slate-100 cursor-pointer flex justify-between'>
              {item.name}
              <div className='min-w-32'>| Value: {item.value}</div>
              </div>
          ))}
          
        </div>
    </div>
    
  );
}

export default CustomInput;
