import React from 'react'
import { useState } from 'react'
import { Icon } from '@iconify-icon/react';
import Link from 'next/link'
import Image from 'next/image'
import logo from '../../public/asset/logo.png'


interface state {
    stateManu: boolean
    search: string
    setSearch: (search: string) => void
    setEditId: (id: number | null) => void
    stateEA: boolean
    setStateEA: (state: boolean) => void
}

const Navbar: React.FC<state> = ({stateManu, search, setSearch, setEditId, stateEA, setStateEA}) => {




  return (
    <div className={stateEA?"w-full h-28 m bg-neutral/30 pb-6 flex items-end mt-8":"w-full h-28 backdrop-blur-sm bg-neutral/30 sticky top-0 z-10 pb-6 flex items-end mt-8"}>
      <div className='w-full h-14 bg-gray-300 rounded-s-lg flex items-center justify-between pl-5 '>
          <div className='text-primary text-lg w-40 shrink-0'>
              {stateManu?'บ้านพักคนชรา':'บทความการเงิน'}
          </div>
          {stateEA?null
          :<>
            <div className='w-1/2 h-9 flex justify-center bg-neutral rounded-md min-w-32'>
              <div className={search?'w-10 h-7 flex items-center justify-center text-primary2 my-auto':'w-10 h-7 flex items-center justify-center text-gray-300 my-auto'}>
                <Icon icon="material-symbols:search-rounded" width="24" height="24" />
              </div>
              <input 
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={stateManu?'ค้นหาบ้านพักที่ต้องการ':'ค้นหาบทความที่ต้องการ'}
              className='w-full bg-none outline-none pr-2 rounded-md text-sm text-normalText'/>
            </div>
            <div 
            onClick={() => {
              setEditId(null)
              setStateEA(true)
            }}
            className='text-primary mr-10 h-10 w-10 items-center justify-center flex cursor-pointer duration-100 hover:scale-125 active:scale-100'>
              <Icon icon="ic:round-plus" width="30" height="30" />
            </div>
          </>}
      </div>
    </div>
  )
}

export default Navbar