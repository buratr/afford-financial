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
  const [SS, setSS] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [income, setIncome] = useState('');
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
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setIncome(value);
    }
  };

  const fetchRecordById = async (id: string) => {
    const response = await fetch(`/api/get-records/${id}`);
    const data = await response.json();
    const record =data.data[0]; // data.find((item: any) => item.aplicant_id === id);
    //console.log("record: ", data)
    if (record) {
      setName(record?.name || '');
      setLastName(record?.last_name || '');
      setSS(record?.ss || '');
      setDateOfBirth(record?.date_of_birth || '');
      setIncome(record?.income || '');
    }
  };

  const handleUpdateRecord = async () => {
    if (!id) {
      setMessage('No ID provided');
      return;
    }
    setPageBusy(true);
    const response = await fetch('/api/update-record', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
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
