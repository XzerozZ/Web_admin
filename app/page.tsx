'use client'

import React from 'react';
import { useState, useEffect } from 'react';
import { FormEvent } from 'react';
import Image from 'next/image';
import logo from '../public/asset/logo.png';
import { Icon } from '@iconify-icon/react';
import Link from 'next/link';
import Port from './Port';
import Banner from './Components/Banner';


interface LastData {
  error?: string;
  data?: any;
  message?: string;
}



export default function Home() {

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const [lastData, setLastData] = useState<LastData>({});
const [stateBanner, setStateBanner] = useState(false)


const handleLogin = async (e: React.MouseEvent<HTMLDivElement>) => {
  e.preventDefault();
  try {
    const response = await fetch(`${Port.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "email": email,
          "password": password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message && errorData.message.includes('invalid')) {
          setLastData({ error: 'invalid_email_or_password' });
          setStateBanner(true);
          throw new Error(errorData.message);
      }else{
          setLastData({ error: 'something_went_wrong' });
          setStateBanner(true);
          throw new Error('Network response was not ok');
      }
    }

    const data = await response.json();
    localStorage.setItem('token', data.result.token);
    localStorage.setItem('username', data.result.uname);
    localStorage.setItem('login', 'ok');
    window.location.href =`/admin`;
  } catch (error) {
    throw new Error( error as string);
  }
};

useEffect(() => {
  stateBanner
  ?setTimeout(() => {
    setStateBanner(false)
  }, 4000)
  :null
})




  return (
    <>
    <div className={stateBanner?'fixed z-50 w-screen flex justify-center top-10 duration-500':'fixed z-50 w-screen flex justify-center top-[-100px] opacity-0 duration-500'}>
      <Banner lastData={lastData}/>
    </div>
      <div className="w-full h-screen flex flex-col items-center justify-center bg-neutral2 px-2 gap-10">
        <div className="w-full max-w-80 flex items-center justify-center p-10">
          <Image
            src={logo}
            alt="Logo"
            className='object-contain min-w-28'
            />
        </div>
        <div className='w-full max-w-96 flex flex-col gap-10 mb-40'>
          <div className="relative">
            <div className='absolute h-10 flex items-center justify-center w-10'>
              <Icon className={`${email ? 'text-primary2' : 'text-unselectMenu'}`} icon="ic:round-email" width="24" height="24" />
            </div>
            <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            className="w-full max-w-96 px-2 pl-10 rounded-md h-10 text shadow-md outline-none text-normalText"/>
          </div>
          <div className="relative">
            <div className='absolute h-10 flex items-center justify-center w-10'>
              <Icon className={`${password ? 'text-primary2' : 'text-unselectMenu'}`} icon="mdi:password" width="24" height="24" />
            </div>
            <input
            value={password}
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full max-w-96 px-2 pl-10 rounded-md h-10 text shadow-md outline-none text-normalText"/>
          </div>
          <div 
            id="login_button"
            onClick={email && password ? (e: React.MouseEvent<HTMLDivElement>) => handleLogin(e) : undefined }
            className={email && password 
              ? "w-full max-w-96 h-12 bg-primary text-neutral rounded-md text shadow-md hover:opacity-90 active:scale-95 duration-100 flex justify-center items-center cursor-pointer"
              : "w-full max-w-96 h-12 bg-label text-neutral rounded-md text shadow-md flex justify-center items-center"}>
            เข้าสู่ระบบ
          </div>
        </div>
      </div>
    </>
  );
}