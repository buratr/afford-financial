"use client"

import React, { FC, useEffect, useState } from 'react';
import Button from './Button';


interface InputProps {
  type?: string;
  label?: string;
  placeholder?: string;
}

const Tabs: FC<InputProps> = () => {

    const [records, setRecords] = useState<any[]>([]);
    const [tabProcessed ,setTabProcessed ] =  useState(false)
    const [tabApproved ,setTabApproved ] =  useState(true)   
    const [tabFunded  ,setFunded ] =  useState(false)

    function selectTab(id:number){
        switch (id) {
            case 1:setTabProcessed(true);setTabApproved(false);setFunded(false);break;
            case 2:setTabProcessed(false);setTabApproved(true);setFunded(false);break;
            case 3:setTabProcessed(false);setTabApproved(false);setFunded(true);break;
        }
    }
    function generateId() {
      return Math.random().toString(36).substr(2, 9);
    }

    useEffect(() => {
      let rand = generateId();
      const timestamp = Date.now(); 
      const fetchRecords = async () => {
        const response = await fetch(`/api/get-records/${timestamp}`, {
          cache: 'no-store',
          method: 'POST',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        const data = await response.json();
       
        setRecords(data.data);
      };
  
      fetchRecords();
    }, []);
    
    return (
      <div className="w-full">
        
        <button 
        onClick={()=>{selectTab(1)}}
        className={tabProcessed?"tab-btn-active":`tab-btn`}>IN PROCESSED</button>
        <button 
        onClick={()=>{selectTab(2)}}
        className={tabApproved?"tab-btn-active":`tab-btn`}>APPROVED</button>
        <button 
        onClick={()=>{selectTab(3)}}
        className={tabFunded?"tab-btn-active":`tab-btn`}>FUNDED</button>
        
       <div className='bg-neutral-300 p-12 rounded-tr-3xl rounded-br-3xl rounded-bl-3xl max-md:overflow-x-scroll max-md:p-6'>
          {tabProcessed && 
            <div>
            IN PROCESSED
            </div>}
          {tabApproved && 
            <div className='grid gap-3 grid-flow-row max-md:w-max'>
             
                <div className='tabl-grid '>
                    <div className='tabl-text'>Aplicant Name</div>
                    <div className='tabl-text'>Aplicant Date</div>
                    <div className='tabl-text'>Loan Amount</div>
                    <div className='tabl-text'>Status</div>
                    <div className='tabl-text'>Expiration</div>
                    <div className='w-20'></div>
                </div>
                {records && records.map((record, index) => (
                 <div key={index} className='tabl-grid bg-slate-100'>
                    <div className='tabl-text'>{record.name} {record.last_name}</div>
                    <div className='tabl-text'>{record.aplicant_date?record.aplicant_date.split('T')[0].split('-').reverse().join('/').replace(/\d{4}/, (year: string | any[]) => year.slice(-2)):""}</div>
                    <div className='tabl-text'>${record.loan_amount}</div>
                    <div className='tabl-text'>{record.status}</div>
                    <div className='tabl-text'>{record.expiration?record.expiration.split('T')[0].split('-').reverse().join('/').replace(/\d{4}/, (year: string | any[]) => year.slice(-2)):""}</div>
                    <div className='tabl-text'>
                        <Button text="Re-send"/>
                    </div>
                </div>
                
                ))}
            
            </div>}
          {tabFunded && <div>FUNDED</div>}
        </div>
      </div>
    );
  };
  
  export default Tabs;
