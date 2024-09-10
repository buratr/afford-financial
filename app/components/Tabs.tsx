"use client"

import React, { FC, useEffect, useState } from 'react';
import Button from './Button';
import Image from 'next/image';
import sortIcon from "/app/assets/svgs/sort-icon.svg"
import { useRouter } from 'next/navigation';

interface InputProps {
  type?: string;
  label?: string;
  placeholder?: string;
}

const Tabs: FC<InputProps> = () => {
    const router = useRouter();
    const [records, setRecords] = useState<any[]>([]);
    const [tabAllAplication ,setTabAllAplication ] =  useState(false)
    const [tabProcessed ,setTabProcessed ] =  useState(false)
    const [tabApproved ,setTabApproved ] =  useState(true)   
    const [tabFunded  ,setFunded ] =  useState(false)
    const [searchApplicant  ,setSearchApplicant ] =  useState("")
    const [sort, setSort ] =  useState({field:"id", order:"DESC"})
    const [activeTab  ,setActiveTab ] =  useState(2)

    function handleSort(field:string){
      if(field === sort.field){
        if(sort.order === "DESC"){
          setSort({
            field:field,
            order:"ASC"
          })
        }else{
          setSort({
            field:field,
            order:"DESC"
          })
        }
      }else{
        setSort({
          field:field,
          order:"DESC"
        })
      }
      
    }

    function selectTab(id:number){
        switch (id) {
            case 4:setActiveTab(4);setTabAllAplication(true);setTabProcessed(false);setTabApproved(false);setFunded(false);break;
            case 1:setActiveTab(1);setTabAllAplication(false);setTabProcessed(true);setTabApproved(false);setFunded(false);break;
            case 2:setActiveTab(2);setTabAllAplication(false);setTabProcessed(false);setTabApproved(true);setFunded(false);break;
            case 3:setActiveTab(3);setTabAllAplication(false);setTabProcessed(false);setTabApproved(false);setFunded(true);break;
        }
    }
    function generateId() {
      return Math.random().toString(36).substr(2, 9);
    }

    useEffect(() => {
      let rand = generateId();
      const timestamp = Date.now(); 
      let filterStatus="Approved";
      switch (activeTab) {
        case 1: filterStatus ="Awaiting signature"; break;
        case 2: filterStatus ="Approved"; break;
        case 3: filterStatus ="Expired"; break;
        default: filterStatus=""; break;
      }
      const fetchRecords = async () => {
        const response = await fetch(`/api/get-records`, {
          cache: 'no-store',
          method: 'POST',
          headers: {
            'Cache-Control': 'no-cache',
          },
          body: JSON.stringify({
            search: searchApplicant,
            sort:sort,
            status: filterStatus,
          }),
        });
        const data = await response.json();
       
        setRecords(data.data);
      };
  
      fetchRecords();
    }, [searchApplicant, sort, activeTab]);
    

    function handleReSend(id:string){
      router.push('/add?id='+id);
    }
    return (
      <div className="w-full">
        
        <button 
        onClick={()=>{selectTab(4)}}
        className={tabAllAplication?"tab-btn-active":`tab-btn`}>ALL APPLICATIONS</button>
        <button 
        onClick={()=>{selectTab(1)}}
        className={tabProcessed?"tab-btn-active":`tab-btn`}>IN PROCESS</button>
        <button 
        onClick={()=>{selectTab(2)}}
        className={tabApproved?"tab-btn-active":`tab-btn`}>APPROVED</button>
        <button 
        onClick={()=>{selectTab(3)}}
        className={tabFunded?"tab-btn-active":`tab-btn`}>FUNDED</button>
        
       <div className='bg-neutral-300 p-12 rounded-tr-3xl rounded-br-3xl rounded-bl-3xl  max-md:p-6'>
              <div className='max-w-80 '>
                <input
                  id="search"
                  className='input-gray '
                  type="text"
                  placeholder="Search"
                  value={searchApplicant}
                  onChange={(e) => setSearchApplicant(e.target.value)}
                />
              </div>
          
          <div className='max-md:overflow-x-scroll mt-5'>
          {tabAllAplication && 
            <div className='grid gap-3 grid-flow-row max-md:w-max'>
            
            {/* ALL APPLICATIONS */}
            {records && records.length > 0 && (
              <div className='tabl-grid '>
                    <div className='tabl-text tabl-text-hover'
                     onClick={()=>{handleSort("id")}}>#
                      <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "id" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>
                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("applicant_phone")}}>Applicant Phone
                     <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "applicant_phone" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>
                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("applicant_date")}}>Applicant Date
                     <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "applicant_date" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>

                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("status")}}>Status
                     <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "status" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>
                    <div className='w-20'></div>
                    <div className='w-20'></div>
                </div>
            )}
                  
                {records && records.length > 0 ? (
                  records.map((record, index) => (
                    <div key={index} className='tabl-grid bg-slate-100'>
                      <div className='tabl-text w-6'>{record.id}</div>
                      <div className='tabl-text'>{record.applicant_phone}</div>
                      <div className='tabl-text'>
                        {record.applicant_date ? record.applicant_date.split('T')[0].split('-').reverse().join('/').replace(/\d{4}/, (year: string | any[]) => year.slice(-2)) : ""}
                      </div>
                      <div className='tabl-text'>{record.status}</div>
                      <div className='tabl-text'>
                        <Button text="Re-send" />
                      </div>
                      <div className='tabl-text'>
                        <Button btnClick={() => { handleReSend(record.applicant_id) }} text="Complete application" />
                      </div>
                    </div>
                  ))
                  ) : (
                  <div className='italic my-3 text-violet'>
                    No entries
                  </div>
                )}

            </div>}
          {tabProcessed && 
            <div className='grid gap-3 grid-flow-row max-md:w-max'>
            
            {/* IN PROCESS */}
            {records && records.length > 0 && (
                  <div className='tabl-grid '>
                    <div className='tabl-text tabl-text-hover'
                     onClick={()=>{handleSort("id")}}>#
                      <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "id" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>
                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("applicant_phone")}}>Applicant Phone
                     <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "applicant_phone" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>
                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("applicant_date")}}>Applicant Date
                     <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "applicant_date" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>

                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("status")}}>Status
                     <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "status" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>
                    <div className='w-20'></div>
                    <div className='w-20'></div>
                </div>
            )}
                  
                {records && records.length > 0 ? (
                  records.map((record, index) => (
                    <div key={index} className='tabl-grid bg-slate-100'>
                      <div className='tabl-text w-6'>{record.id}</div>
                      <div className='tabl-text'>{record.applicant_phone}</div>
                      <div className='tabl-text'>
                        {record.applicant_date
                          ? record.applicant_date.split('T')[0].split('-').reverse().join('/').replace(/\d{4}/, (year: string | any[]) => year.slice(-2))
                          : ""}
                      </div>
                      <div className='tabl-text'>{record.status}</div>
                      <div className='tabl-text'>
                        <Button text="Re-send" />
                      </div>
                      <div className='tabl-text'>
                        <Button btnClick={() => { handleReSend(record.applicant_id) }} text="Complete application" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='italic my-3 text-violet'>
                    No entries
                  </div>
                )}
            </div>}
          {tabApproved && 
            <div className='grid gap-3 grid-flow-row max-md:w-max'>
               
               {/* APPROVED */}
               {records && records.length > 0 && (
                <div className='tabl-grid '>
                    <div className='tabl-text tabl-text-hover'
                     onClick={()=>{handleSort("id")}}>#
                      <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "id" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>

                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("name")}}
                    >Applicant Name 
                      <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "name" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>
                    
                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("student_name")}}>Student Name
                      <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "student_name" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>
                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("applicant_phone")}}>Applicant Phone
                     <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "applicant_phone" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>
                    
                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("loan_amount")}}>Approved Amount
                     <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "loan_amount" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>

                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("applicant_date")}}>Applicant Date
                     <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "applicant_date" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>
                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("expiration")}}>Expiration
                     <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "expiration" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                     </div>
                    <div className='w-20'></div>
                  </div>
               )}
                  


                {records && records.length > 0 ? (
                  records.map((record, index) => (
                    <div key={index} className='tabl-grid bg-slate-100'>
                      <div className='tabl-text w-6'>{record.id}</div>
                      <div className='tabl-text'>{record.name} {record.last_name}</div>
                      <div className='tabl-text'>{record.student_name}</div>
                      <div className='tabl-text break-all text-center'>{record.applicant_phone}</div>
                      <div className='tabl-text'>${record.loan_amount}</div>
                      <div className='tabl-text'>
                        {record.applicant_date 
                          ? record.applicant_date.split('T')[0].split('-').reverse().join('/').replace(/\d{4}/, (year: string | any[]) => year.slice(-2)) 
                          : ""}
                      </div>
                      <div className='tabl-text'>
                        {record.expiration 
                          ? record.expiration.split('T')[0].split('-').reverse().join('/').replace(/\d{4}/, (year: string | any[]) => year.slice(-2)) 
                          : ""}
                      </div>
                      <div className='tabl-text'>
                        <Button btnClick={() => { handleReSend(record.applicant_id) }} text="Re-send" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='italic my-3 text-violet'>
                    No entries
                  </div>
                )}

            
            </div>}
          {tabFunded && <div className='grid gap-3 grid-flow-row max-md:w-max'>
            
            {/* FUNDED */}
            {records && records.length > 0 && (
              <div className='tabl-grid '>
                    <div className='tabl-text tabl-text-hover'
                     onClick={()=>{handleSort("id")}}>#
                      <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "id" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>
                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("name")}}>Applicant Name 
                      <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "name" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>
                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("student_name")}}>Student Name
                      <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "student_name" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>
                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("applicant_phone")}}>Applicant Phone
                     <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "applicant_phone" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>
                    
                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("loan_amount")}}>Loan Amount
                     <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "loan_amount" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>
                    
                    <div className='tabl-text tabl-text-hover'
                    onClick={()=>{handleSort("applicant_date")}}>Funded
                     <Image width={10} height={10} className={`ml-2 ${sort.order === "DESC"?"scale-y-[-1]":""}  ${sort.field !== "applicant_date" ? "opacity-0" : ""}`}   src={sortIcon} alt="sort" />
                    </div>
                    <div className='w-20'></div>
                  </div>
            )}
                  

                {records && records.length > 0 ? (
                  records.map((record, index) => (
                    <div key={index} className='tabl-grid bg-slate-100'>
                      <div className='tabl-text w-6'>{record.id}</div>
                      <div className='tabl-text'>{record.name} {record.last_name}</div>
                      <div className='tabl-text'>{record.student_name}</div>
                      <div className='tabl-text'>{record.applicant_phone}</div>
                      <div className='tabl-text'>${record.loan_amount}</div>
                      <div className='tabl-text'>
                        {record.applicant_date 
                          ? record.applicant_date.split('T')[0].split('-').reverse().join('/').replace(/\d{4}/, (year: string | any[]) => year.slice(-2)) 
                          : ""}
                      </div>
                      <div className='tabl-text'>
                        <Button text="Re-send" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='italic my-3 text-violet'>
                    No entries
                  </div>
                )}
            </div>}
          </div>
          
        </div>
      </div>
    );
  };
  
  export default Tabs;
