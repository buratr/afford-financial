"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('admin-auth-token');
    console.log("token: ", token)
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>You are logged in as an administrator.</p>
    </div>
  );
}
