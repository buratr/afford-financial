"use client";

import { Suspense, useState, useEffect, ChangeEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import Image from 'next/image';
import preloader from "/app/assets/svgs/preloader.gif"
import pen from "/app/assets/svgs/pen.svg"
import close from "/app/assets/svgs/close.svg"
import Terms from "../components/termstext"

function calculateMonthlyPayment(loanAmount:number, months:number, annualRate:number) {
    // Ежемесячная процентная ставка
    const monthlyRate = annualRate / 12 / 100;
    
    // Формула расчета аннуитетного платежа
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    return parseFloat(monthlyPayment.toFixed(2));
}

function ActualAddPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [records, setRecords] = useState<any[]>([]);
  const [maxDate, setMaxDate] = useState('');
  const [pageBusy, setPageBusy] = useState(false);
  const [placeholder, setPlaceholder] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [SS, setSS] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [income, setIncome] = useState('');
  const [message, setMessage] = useState('');
  const [currentId, setCurrentId] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [mo12, setMo12] = useState(0);
  const [mo36, setMo36] = useState(0);
  const [mo60, setMo60] = useState(0);
  const [period, setPeriod] = useState({status:false, month:0});
  const [percent, setPercent] = useState('0');

  useEffect(() => {
    if (id) {
      setCurrentId(id);
      fetchRecordById(id);
    }
  }, [id]);

  useEffect(() => {
    setMo12(parseFloat((Number(loanAmount)/12).toFixed(2)))
    setMo36(calculateMonthlyPayment(Number(loanAmount), 36, 6.99))
    setMo60(calculateMonthlyPayment(Number(loanAmount), 60, 9.99))
  }, [loanAmount]);

  useEffect(() => {
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    const formattedDate = eighteenYearsAgo.toISOString().split('T')[0];
    setMaxDate(formattedDate);
  }, []);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateOfBirth(event.target.value);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (/^\d*$/.test(value)) {
        if(Number(value) > 10000){
            value = "10000"
        }
        setLoanAmount(value);
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
    //console.log("record: ", data)
    if (record) {
      setName(record?.name || '');
      setLastName(record?.last_name || '');
      setStudentName(record?.student_name || '');
      setSS(record?.ss || '');
      setDateOfBirth(record?.date_of_birth.split('T')[0] || '');
      setIncome(record?.income || '');
      setLoanAmount(record?.loan_amount || '')

      setMo12(parseFloat((Number(record?.loan_amount)/12).toFixed(2)))
      setMo36(calculateMonthlyPayment(Number(record?.loan_amount), 36, 6.99))
      setMo60(calculateMonthlyPayment(Number(record?.loan_amount), 60, 9.99))
    }
  };

  const handleUpdateRecord = async () => {
    if (!id) {
      setMessage('No ID provided');
      return;
    }
    setPageBusy(true);
    const currentDate = new Date();
    let expiration
    currentDate.setMonth(currentDate.getMonth() + Number(period.month));
    expiration = currentDate.toISOString().split('T')[0];
    const response = await fetch('/api/update-record', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        terms:true
      }),
    });

    if (response.ok) {
      setMessage('Record updated successfully');
      router.push('/congratulations');
    } else {
      setMessage('Failed to update record');
      setPageBusy(false);
    }
  };

  function handleChangeMonth(month:number, percent:string){
    setPeriod({status:true, month:month})
    setPercent(percent)
  }

  function handleSign(e: ChangeEvent<HTMLInputElement>){
    let value = e.target.value;
    if(value !== ""){
        setPlaceholder(true)
    }else{
        setPlaceholder(false)
    }
  }

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
        className='max-w-96 mx-auto flex flex-col gap-3 relative'
        onSubmit={(e) => e.preventDefault()}>
            <a href="/" className='absolute w-4 left-auto right-0 top-[-40px] hover:opacity-50'>
            <Image width={16} src={close} alt="loading" />
            </a>
           
            <div className=' text-sm font-extrabold mt-5'>
            Terms and conditions:
            </div>

            <div className='max-h-60 overflow-y-scroll border-gray-300 border p-4 mb-6'>
                <Terms/>
            </div>

            <div className="p-2 relative z-20">
                <label className='flex items-center'>
                    <input className='mr-2' type="radio" name="month" value="12" onChange={()=>{setConfirm(true)}} />
                    <div className='w-full flex justify-between'>
                        I agree to term and conditions
                    </div>
                </label>
            </div>

            <div className='border-gray-300 border rounded-md h-24 flex items-center justify-center mt-2 relative'>
                <input className='relative z-10 bg-transparent sign-input mr-2 w-full text-center text-9xl py-4 flex justify-center items-center rounded-md' type="text" name="signature" onChange={handleSign}/>
                <div className='absolute left-auto right-auto text-xs text-slate-600'>
                  {!placeholder?"Enter full name for digital signature":""}  
                </div>
            </div>

           <div className='min-w-36 mx-auto mt-8'>
                <button disabled={!confirm}  className={`${!confirm?"hover:bg-opacity-100 opacity-65":""} button-green !rounded-2xl`} type="button" onClick={handleUpdateRecord}>Confirm</button>  
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
