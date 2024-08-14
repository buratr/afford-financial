"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await fetch('/api/logout', {
        method: 'POST',
      });
      router.push('/login');
    };
    
    logout();
  }, [router]);

  return (
    <main>
    <Navbar/>
    <section className="w-full bg-white flex flex-col justify-start items-center min-h-screen py-8">
      <div className="container px-4">
        <div className="w-full">
          <p>Logging out...</p>
        </div>
      </div>
    </section>   
</main>
  );
}
