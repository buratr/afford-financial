"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, ChangeEvent } from 'react';
import { Navbar } from '../components/Navbar';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import preloader from "@/app/assets/svgs/preloader.gif"

export default function Add() {
  const router = useRouter();

  const [records, setRecords] = useState<any[]>([]);
  const [maxDate, setMaxDate] = useState('');
  const [pageBusy, setPageBusy] = useState(false);

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [SS, setSS] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [income, setIncome] = useState('');
  
  // const [aplicantDate, setAplicantDate] = useState('');
  // const [loanAmount, setLoanAmount] = useState('');
  // const [status, setStatus] = useState('');
  // const [expiration, setExpiration] = useState('');
  const [message, setMessage] = useState('');
  const [currentId, setCurrentId] = useState('');



  const searchParams = useSearchParams();
  //const id = searchParams.get('id');

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = searchParams.get('id');
      if (id) {
        setCurrentId(id);
        fetchRecordById(id);
      }
    }
  }, [searchParams]);



  // useEffect(() => {
  //   if (id) {
  //     setCurrentId(id)
  //     // Здесь можно загрузить текущие данные для этого ID, если необходимо
  //     fetchRecordById(id);
  //   }
  // }, [id]);

  useEffect(() => {
    // Вычисляем дату 18 лет назад
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    
    // Форматируем дату в строку YYYY-MM-DD
    const formattedDate = eighteenYearsAgo.toISOString().split('T')[0];
    setMaxDate(formattedDate);
  }, []);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateOfBirth(event.target.value);
    console.log(event.target.value)
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setIncome(value);
    }
  };

  const fetchRecordById = async (id: string) => {
    try {
      const response = await fetch('/api/get-records');
      const data = await response.json();
      const record = data.find((item: any) => item.id === id);
  
      if (record) {
        setName(record.name || '');
        setLastName(record.lastName || '');
        setSS(record.SS || '');
        setDateOfBirth(record.dateOfBirth || '');
        setIncome(record.income || '');
      }
    } catch (error) {
      console.error('Error fetching record:', error);
    }
  };

  useEffect(() => {
    const fetchRecords = async () => {
      const response = await fetch('/api/get-records');
      const data = await response.json();
      setRecords(data);
    };

    fetchRecords();
  }, []);


  const handleUpdateRecord = async () => {
    if (!currentId) {
      setMessage('No ID provided');
      return;
    }
    setPageBusy(true)
    const response = await fetch('/api/update-record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id:currentId,
        name,
        lastName,
        SS,
        dateOfBirth,
        income,
      }),
    });

    if (response.ok) {
      setMessage('Record updated successfully');
      router.push('/');
    } else {
      setMessage('Failed to update record');
      setPageBusy(false)
    }
  };

  // const handleAddRecord = async () => {
  //   const response = await fetch('/api/add-record', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       name,
  //       lastName,
  //       aplicantDate,
  //       loanAmount,
  //       status,
  //       expiration,
  //     }),
  //   });

  //   if (response.ok) {
  //     // Обновление списка записей после успешного добавления
  //     const updatedRecords = await (await fetch('/api/get-records')).json();
  //     setRecords(updatedRecords);
  //   } else {
  //     alert('Failed to add record');
  //   }
  // };

  return (
    
     <main>
     <Navbar/>
    <section className="w-full bg-white flex flex-col justify-start items-center min-h-screen py-40">
      {pageBusy && <div className='opacity-45  z-10 absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center'>
        <Image className='w-full h-full object-cover'
                    src={preloader}
                    alt="burger"
                    />
        </div>}
    <div className="container px-4">
      <div>
        {/* <h1>Records</h1>
        <div>Current ID: {currentId}</div> */}
        <form
        className='max-w-96 mx-auto flex flex-col gap-3'
        onSubmit={(e) => e.preventDefault()}>
          <div className='add-form-grid'>
            <label className='text-sm font-semibold shrink-0 text-right' htmlFor="Name">First Name</label>
            <input
              id="Name"
              className='input-gray'
              type="text"
              placeholder=""
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
            
          <div className='add-form-grid'>
            <label className='text-sm font-semibold shrink-0 text-right' htmlFor="Last">Last Name</label>
            <input
              id="Last"
              className='input-gray'
              type="text"
              placeholder=""
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className='add-form-grid'>
            <label className='text-sm font-semibold shrink-0 text-right' htmlFor="ss">SS #</label>
            <input
              id="ss"
              className='input-gray'
              type="text"
              placeholder=""
              value={SS}
              onChange={(e) => setSS(e.target.value)}
            />
          </div>

          <div className='add-form-grid'>
            <label className='text-sm font-semibold shrink-0 text-right' htmlFor="dateOfBirth">DOB</label>
            <input
              className='input-gray'
              type="date"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={handleDateChange}
              max={maxDate}
            />

          </div>
          <div className='add-form-grid'>
            <label className='text-sm font-semibold shrink-0 text-right' htmlFor="income">Annual Income</label>
            <div className='relative col-span-2 flex '>
              <div className='mr-4 text-slate-500 absolute right-0 left-auto top-0 bottom-0 my-auto flex justify-center items-center'>$</div>
                <input
                id="income"
                className='input-gray'
                type="text"
                placeholder=""
                value={income}
                onChange={handleNumberChange}
              />
            </div>
          </div>

          <div className='min-w-36 mx-auto mt-16'>
            <button className='button-green !rounded-2xl' type="button" onClick={handleUpdateRecord}>Apply</button>  
          </div>
          
        </form>

        {/* <h2>Record List</h2>
        <ul>
          {records.map((record, index) => (
            <li key={index}>
              {record.aplicantName} - {record.aplicantDate} - {record.loanAmount} - {record.status} - {record.expiration}
            </li>
          ))}
        </ul> */}
      </div>
     </div>
    </section>
 </main>
  );
}
