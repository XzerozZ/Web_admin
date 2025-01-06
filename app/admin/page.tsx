'use client'

import React, { use } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from '../../public/asset/logo.png';
import { Icon } from '@iconify-icon/react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import Card from '../Components/Card';
import Banner from '../Components/Banner';
import AddHome from './AddHome';
import EditHome from './EditHome';
import AddArticle from './AddArticle';
import EditArticle from './EditArticle';


export default function Home() {


const [stateManu, setStateManu] = useState(true) //true = nursingHome, false = financeArticle

const [search, setSearch] = useState('')


const [editId, setEditId] = useState<number | null>(null)
const [stateEA, setStateEA] = useState(false)


const [lastData, setLastData] = useState<{ message: string } | []>([]); // ข้อมูลที่ดึงมาจาก API
const [reload, setReload] = useState(false); // สถานะโหลดข้อมูล

const [stateBanner, setStateBanner] = useState(false)

const [statusFilter, setStatusFilter] = useState('All')

const [token, setToken] = useState('')


useEffect(() => {
  const tokenS = localStorage.getItem('token');
  const login = localStorage.getItem('login');
  
  if(login){
    setToken(tokenS as string);
    setLastData({ message: 'Login_success' });
    setStateBanner(true);
    localStorage.removeItem('login');
  }else if(tokenS == undefined){
    window.location.href = '/';
  }else{
    setToken(tokenS as string);
  }
  
}, []);

useEffect(() => {
  stateBanner
  ?setTimeout(() => {
    setStateBanner(false)
  }, 4000)
  :null
})



  return (
    <>
      <div className='flex w-full h-screen bg-neutral'>
        <div className={stateBanner?'fixed z-50 w-screen flex justify-center top-10 duration-500':'fixed z-50 w-screen flex justify-center top-[-100px] opacity-0 duration-500'}>
          <Banner lastData={lastData}/>
        </div>
        <Sidebar stateManu={stateManu} setStateManu={setStateManu} setSearch={setSearch} setStateEA={setStateEA} token={token} setToken={setToken}/>
        <div className='w-full h-full pl-5'>
          <Navbar stateManu={stateManu} search={search} setSearch={setSearch} setEditId={setEditId} stateEA={stateEA} setStateEA={setStateEA}/>
          {stateManu && !stateEA
          ?<div className='w-full h-12 flex items-center pl-5'>
            <div className='h-12 flex items-center gap-5'>
                <div 
                id="filter-all"
                onClick={() => setStatusFilter('All')}
                className={statusFilter == 'All'?' cursor-pointer text-normalText':' cursor-pointer text-unselectMenu'}>All</div>
                <div className='w-[1px] h-8 bg-unselectInput'></div>
                <div
                id="filter-active"
                onClick={() => setStatusFilter('Active')}
                className={statusFilter == 'Active'?' cursor-pointer text-normalText':' cursor-pointer text-unselectMenu'}>Active</div>
                <div className='w-[1px] h-8 bg-unselectInput'></div>
                <div
                id="filter-inactive"
                onClick={() => setStatusFilter('Inactive')}
                className={statusFilter == 'Inactive'?' cursor-pointer text-normalText':' cursor-pointer text-unselectMenu'}>Inactive</div>

            </div>
          </div>
          :null}
          <div className={stateEA?'w-full px-5 flex flex-col pb-20':'w-full py-5 pl-5 mt-5 gap-5 flex flex-wrap shrink-0 z-0 overflow-auto'}>
            {
              stateEA?
              (stateManu?
                (editId == null
                  ?<AddHome editId={editId} setStateEA={setStateEA} reload={reload} setReload={setReload} stateBanner={stateBanner} setStateBanner={setStateBanner} setLastData={setLastData}/>
                  :<EditHome editId={editId} setStateEA={setStateEA} reload={reload} setReload={setReload} stateBanner={stateBanner} setStateBanner={setStateBanner} setLastData={setLastData}/>
                )
                
                :(editId == null
                  ?<AddArticle editId={editId} setStateEA={setStateEA} reload={reload} setReload={setReload} stateBanner={stateBanner} setStateBanner={setStateBanner} setLastData={setLastData}/>
                  :<EditArticle editId={editId} setStateEA={setStateEA} reload={reload} setReload={setReload} stateBanner={stateBanner} setStateBanner={setStateBanner} setLastData={setLastData}/>)
              )
              :
              <Card stateManu={stateManu} search={search} setEditId={setEditId} setStateEA={setStateEA} reload={reload} statusFilter={statusFilter} images={[]}/>
            }
            
          </div>
        </div>
      </div>
    </>
  );
}
