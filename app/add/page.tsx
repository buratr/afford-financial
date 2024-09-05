"use client";

import { Suspense, useState, useEffect, ChangeEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import Image from 'next/image';
import preloader from "/app/assets/svgs/preloader.gif"

function ActualAddPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [records, setRecords] = useState<any[]>([]);
  const [maxDate, setMaxDate] = useState('');
  const [pageBusy, setPageBusy] = useState(false);

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [SS, setSS] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [income, setIncome] = useState('');

  const [status, setStatus] = useState('');

  const [errorName, setErrorName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorStudentName, setErrorStudentName] = useState(false);
  const [errorSS, setErrorSS] = useState(false);
  const [errorDateOfBirth, setErrorDateOfBirth] = useState(false);
  const [errorIncome, setErrorIncome] = useState(false);

  const [message, setMessage] = useState('');
  const [currentId, setCurrentId] = useState('');

  useEffect(() => {
    if (id) {
      setCurrentId(id);
      fetchRecordById(id);
    }
  }, [id]);

  useEffect(() => {
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    const formattedDate = eighteenYearsAgo.toISOString().split('T')[0];
    setMaxDate(formattedDate);
  }, []);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateOfBirth(event.target.value);
    setErrorDateOfBirth(false);
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setIncome(value);
    }
  };
///api/get-records/${id}
  const fetchRecordById = async (id: string) => {
    const response = await fetch(`/api/get-records`, {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        id: id
      }),
    });
    const data = await response.json();
    const record =data.data[0]; // data.find((item: any) => item.applicant_id === id);
    console.log("record: ", data)
    if (record) {
      setName(record?.name || '');
      setLastName(record?.last_name || '');
      setStudentName(record?.student_name || '');
      setSS(record?.ss || '');
      setDateOfBirth(record?.date_of_birth?.split('T')[0] || '');
      setIncome(record?.income || '');

      setStatus(record?.status || '')
    }
  };

  const handleUpdateRecord = async () => {
    let errorInput;
    if (!id) {
      setMessage('No ID provided');
      return;
    }
    if(name===""){setErrorName(true)}
    if(lastName===""){setErrorLastName(true)}
    if(studentName===""){setErrorStudentName(true)}
    if(SS===""){setErrorSS(true)}
    if(dateOfBirth===""){setErrorDateOfBirth(true)}
    if(income===""){setErrorIncome(true)}

    if(!name || !lastName || !studentName || !SS || !dateOfBirth || !income){
      return
    }

    setPageBusy(true);
    const loanAmount = 10000 //Math.round(((income/100)*10)  / 1000) * 1000 
    let expiration
    const currentDate = new Date();
    // const applicantDate = currentDate.toISOString().split('T')[0];
    currentDate.setFullYear(currentDate.getFullYear() +1);
    expiration = currentDate.toISOString().split('T')[0];
    const response = await fetch('/api/update-record', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        name,
        lastName,
        studentName,
        SS,
        dateOfBirth,
        income,
        loanAmount,
        expiration,
        status: "Approved",
        //applicantDate,

      }),
    });

    if (response.ok) {
      setMessage('Record updated successfully');
      router.push('/result?id='+id);
    } else {
      setMessage('Failed to update record');
      setPageBusy(false);
    }
  };

  return (
    <main>
      <Navbar />
      <section className="w-full bg-white flex flex-col justify-start items-center min-h-screen py-40">
        {pageBusy && (
          <div className='opacity-45  z-10 absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center'>
            <Image className='w-full h-full object-cover' src={preloader} alt="loading" />
          </div>
        )}
        <div className="container px-4">
        <form
        className='max-w-96 mx-auto flex flex-col gap-3'
        onSubmit={(e) => e.preventDefault()}>
          <div className='add-form-grid'>
            <label className={`text-sm font-semibold shrink-0 text-right ${errorName?"!text-red-400":""}`} htmlFor="Name">First Name</label>
            <input
              id="Name"
              className={`input-gray ${errorName?"!border-red-400":""}`}
              type="text"
              placeholder=""
              value={name}
              onChange={(e) => {setName(e.target.value); setErrorName(false)}}
            />
          </div>
            
          <div className='add-form-grid'>
            <label className={`text-sm font-semibold shrink-0 text-right ${errorLastName?"!text-red-400":""}`} htmlFor="Last">Last Name</label>
            <input
              id="Last"
              className={`input-gray ${errorLastName?"!border-red-400":""}`}
              type="text"
              placeholder=""
              value={lastName}
              onChange={(e) => {setLastName(e.target.value); setErrorLastName(false)}}
            />
          </div>

          <div className='add-form-grid'>
            <label className={`text-sm font-semibold shrink-0 text-right ${errorStudentName?"!text-red-400":""}`} htmlFor="Last">Student Name</label>
            <input 
              id="Last"
              className={`input-gray ${errorStudentName?"!border-red-400":""}`}
              type="text"
              placeholder=""
              value={studentName}
              onChange={(e) => {setStudentName(e.target.value);  setErrorStudentName(false)}}
            />
          </div>

          <div className='add-form-grid'>
            <label className={`text-sm font-semibold shrink-0 text-right ${errorSS?"!text-red-400":""}`} htmlFor="ss">SS #</label>
            <input 
              id="ss"
              className={`input-gray ${errorSS?"!border-red-400":""}`}
              type="text"
              placeholder=""
              value={SS}
              onChange={(e) => {setSS(e.target.value);  setErrorSS(false)}}
            />
          </div>

          <div className='add-form-grid'>
            <label className={`text-sm font-semibold shrink-0 text-right ${errorDateOfBirth?"!text-red-400":""}`} htmlFor="dateOfBirth">DOB</label>
            <input 
              className={`input-gray ${errorDateOfBirth?"!border-red-400":""}`}
              type="date"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={handleDateChange}
              max={maxDate}
            />

          </div>
          <div className='add-form-grid'>
            <label className={`text-sm font-semibold shrink-0 text-right ${errorIncome?"!text-red-400":""}`} htmlFor="income">Annual Income</label>
            <div className='relative col-span-2 flex '>
              <div className='mr-4 text-slate-500 absolute right-0 left-auto top-0 bottom-0 my-auto flex justify-center items-center'>$</div>
                <input 
                id="income"
                className={`input-gray ${errorIncome?"!border-red-400":""}`}
                type="text"
                placeholder=""
                value={income}
                onChange={(e)=>{handleNumberChange(e);  setErrorIncome(false)}}
              />
            </div>
          </div>

          {/* <div className='add-form-grid'>
            <label className={`text-sm font-semibold shrink-0 text-right `} htmlFor="income">Status</label>
            <div className='relative col-span-2 flex '>
                <input 
                id="income"
                className={`input-gray `}
                type="text"
                placeholder=""
                value={status}
                onChange={(e)=>{setStatus(e.target.value);}}
              />
            </div>
          </div> */}

          <div className='min-w-36 mx-auto mt-16'>
            <button className='button-green !rounded-2xl' type="button" onClick={handleUpdateRecord}>Apply</button>  
          </div>
          
        </form>
        </div>
      </section>
    </main>
  );
}

export default function Add() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActualAddPage />
    </Suspense>
  );
}
