'use client'

import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import logo from '../public/asset/logo.png';
import { Icon } from '@iconify-icon/react';
import Link from 'next/link';

export default function Home() {

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');




  return (
    <>
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
              <Icon className={email ?' text-primary2':'text-unselectMenu'} icon="ic:round-email" width="24" height="24" />
            </div>
            <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            className="w-full max-w-96 px-2 pl-10 rounded-md h-10 text shadow-md outline-none text-normalText"/>
          </div>
          <div className="relative">
            <div className='absolute h-10 flex items-center justify-center w-10'>
              <Icon className={password ?' text-primary2':'text-unselectMenu'} icon="material-symbols:password-rounded" width="24" height="24" />
            </div>
            <input
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full max-w-96 px-2 pl-10 rounded-md h-10 text shadow-md outline-none text-normalText"/>
          </div>
          <Link 
          href={email && password ?"/admin":'/'}
          className={email && password ?"w-full max-w-96 h-12 bg-primary text-neutral rounded-md text shadow-md hover:opacity-90 active:scale-95 duration-100 flex justify-center items-center":"w-full max-w-96 h-12 bg-label text-neutral rounded-md text shadow-md flex justify-center items-center"}>เข้าสู่ระบบ</Link>
        </div>
      </div>
    </>
  );
}
