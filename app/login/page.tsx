"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import Input from '../components/Input';

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    });

    if (res.status === 200) {
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (

    <main>
    <Navbar/>
   <section className="w-full bg-white flex flex-col justify-start items-center min-h-screen py-8">
   <div className="container px-4">
      <div className="w-full pt-32">
        <div className='w-full text-center mb-11'>
          <h1 className='text-4xl font-semibold'>Admin Login</h1>      
        </div>
      
        <form 
        className='max-w-80 grid gap-5 mx-auto'
        onSubmit={handleSubmit}>
          
          <input
          className='input-violet'
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
          <input
          className='input-violet'
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className='button-violet' type="submit">Login</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
   </section>
</main>
  );
}