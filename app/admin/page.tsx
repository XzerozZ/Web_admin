'use client'

import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import logo from '../../public/asset/logo.png';
import { Icon } from '@iconify-icon/react';

import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import Card from '../Components/Card';
import AddHome from './AddHome';
import AddArticle from './AddArticle';

export default function Home() {


const [stateManu, setStateManu] = useState(true) //true = nursingHome, false = financeArticle

const [search, setSearch] = useState('')


const [editId, setEditId] = useState('')
const [stateEA, setStateEA] = useState(false)



  return (
    <>
      <div className='flex w-full h-screen bg-neutral'>
        <Sidebar stateManu={stateManu} setStateManu={setStateManu} setSearch={setSearch} setStateEA={setStateEA}/>
        <div className='w-full h-full ml-5'>
          <Navbar stateManu={stateManu} search={search} setSearch={setSearch} setEditId={setEditId} stateEA={stateEA} setStateEA={setStateEA}/>
          <div className={stateEA?'w-full px-5 flex flex-col pb-20':'w-full py-5 pl-5 mt-5 gap-5 flex flex-wrap shrink-0 z-0 overflow-auto'}>
            {
              stateEA?
              (stateManu?
                <AddHome editId={editId} setStateEA={setStateEA}/>
                :<AddArticle editId={editId} setStateEA={setStateEA}/>
              )
              :
              <Card stateManu={stateManu} search={search} setEditId={setEditId} setStateEA={setStateEA}/>
            }
            
          </div>
        </div>
      </div>
    </>
  );
}
