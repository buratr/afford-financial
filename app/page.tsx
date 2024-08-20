"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Navbar } from "./components/Navbar";
import { Providerportal } from "./components/Providerportal";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('admin-auth-token');
      setToken(token);
      if (!token) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    // Показываем индикатор загрузки или ничего не отображаем
    return <main>
            <Navbar/>
            <section className="w-full bg-white flex flex-col justify-start items-center min-h-screen py-8">
              <div className="container px-4 xl:px-4">
                <div className="w-full pt-32">
                  <p>Loading...</p>
                </div>
              </div>
            </section>   
        </main>;
  }

  return (
    <main>
      {token && 
        <div>
        <Navbar/>
          <section className="w-full bg-white flex flex-col justify-start items-center min-h-screen py-8">
            <div className="container px-4 xl:px-4">
              <Providerportal/>
            </div>
          </section>
        </div>}
    </main>
  );
}