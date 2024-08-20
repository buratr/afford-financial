  "use client"

// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

import Link from "next/link";
 import { useEffect, useState } from "react";
import burger from "@/app/assets/svgs/burger.svg"
import close from "@/app/assets/svgs/close.svg"
import out from "@/app/assets/svgs/sign-out.svg"

import Image from 'next/image';
import React from 'react';
import { link } from 'fs';

export const Navbar = ()=>{
    const [auth, setAuth] = useState<string | undefined>(undefined);

    const router = useRouter();
    const pathname = usePathname()

    useEffect(() => {
        const checkAuth = () => {
          const token = Cookies.get('admin-auth-token');
          setAuth(token);
        };
        checkAuth();
      }, [router]);
      
    function getActiveLink(link:string){
        return pathname.startsWith(link)
    }
    
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [menuIcon, setManuIcon] = useState<any>(burger)

    function getMenuClasses(){
        let menuClasses = [];
        if(isOpen){
            menuClasses = [
                "block", "absolute", "grid", "gap-10", "grid-flow-col", "auto-cols-max", "bg-white","left-0", "top-20", "w-full", "p-4", "pb-8", "z-10","max-md:grid-flow-row", "max-md:shadow-2xl", "md:static", "md:p-0", "justify-center","justify-items-center"
            ]           
        }else{
            menuClasses = [
                "hidden", "grid", "gap-10", "grid-flow-col", "auto-cols-max", "md:grid" 
            ]            
        }
        return menuClasses.join(" ");
    }

    useEffect(()=>{
        if(isOpen){
            setManuIcon(close)
        }else{
            setManuIcon(burger)
        }
    },[isOpen])
   
    const handleResize = () => {
        if (window.innerWidth < 767) {
            setIsOpen(false)
        }
      };
    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);
    const handleLogout = async () => {
        //await fetch('/api/logout');
        router.push('/logout');
      };
    return(
        <nav className="p-4 bg-white absolute top-0 left-0 right-0">
            <div className="container mx-auto flex justify-between items-center xl:px-4">
                <a href="/" className="block w-32"><img src="logo_hr.jpg" alt="" /></a>
                <div className="text-lg font-medium text-violet mr-auto ml-6">
                    PROVIDER PORTAL
                </div>
                
                <button className="md:hidden"
                 onClick={()=>{
                    setIsOpen(!isOpen);
                }}>
                    <Image
                    src={menuIcon}
                    alt="burger"
                    width={"24"}
                    height={"24"}
                    />
                </button>

                    <div className={getMenuClasses()}>
                        <Link className="nav-link" href="" >Resources</Link>
                        <Link className="nav-link" href="" >Reports</Link>
                        <Link className="nav-link" href="" >Contact</Link>
                        {auth && 
                        <div className='grid gap-1 grid-flow-col items-center'>
                            <Link className="nav-link" href="/logout" >Logout</Link>
                            <Image
                            src={out}
                            alt="out"
                            width={"18"}
                            height={"18"}
                            />
                        </div>
                        }
                        {!auth && <Link className={`nav-link ${getActiveLink('/login') ? '!text-hover' : ''}`} href="/login" >Login</Link>}
                        
                    </div>
                
                
            </div>
        </nav>
    );
}

export default Navbar