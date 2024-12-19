import React from 'react'

import { Icon } from '@iconify-icon/react';
import Image from 'next/image'
import logo from '../../public/asset/logo.png'

interface state {
    stateManu: boolean,
    setStateManu: (state: boolean) => void
    setSearch: (search: string) => void
    setStateEA: (state: boolean) => void
}
const Sidebar: React.FC<state> = ({stateManu, setStateManu, setSearch, setStateEA}) => {

    return (
        <>
            <div className='w-2/5 max-w-72 h-full'><div className="min-w-52 h-full"></div></div>
            <div className='w-1/5 max-w-72 h-full fixed top-0 left-0 z-50'>
                <div className="w-full min-w-52 h-full bg-neutral2 flex flex-col items-center">
                    <div className='w-full relative'>
                        <div className="w-full max-w-40 flex items-center justify-center p-10 mx-auto">
                            <Image
                                src={logo}
                                alt="Logo"
                                className='object-contain min-w-28'
                            />
                        </div> 
                        <div className='text-label mt-5 pl-5'>จัดการข้อมูลหลัก</div>
                        <div className='w-full flex flex-col gap-10 mt-5 z-10 relative'>
                            <div 
                            onClick={() => {
                                setStateManu(true);
                                setStateEA(false);
                                setSearch('');
                            }}
                            className={stateManu?'w-full flex items-center rounded-r-lg pl-2 h-14 cursor-pointer text-white duration-200':'w-full flex items-center rounded-r-lg pl-2 h-14 cursor-pointer text-normalText duration-200'}>
                                <div className='w-10 h-10 flex items-center justify-center'>
                                    <Icon icon="healthicons:old-man" width="27" height="27" />
                                </div>
                                <div>บ้านพักคนชรา</div>
                            </div>
                        </div>
                        <div className='w-full flex flex-col gap-10 z-10 relative'>
                            <div 
                            onClick={() => {
                                setStateManu(false);
                                setStateEA(false);
                                setSearch('');
                            }}
                            className={stateManu?'w-full flex items-center rounded-r-lg pl-2 h-14 cursor-pointer text-normalText duration-200':'w-full flex items-center rounded-r-lg pl-2 h-14 cursor-pointer text-white duration-200'}>
                                <div className='w-10 h-10 flex items-center justify-center'>
                                    <Icon icon="octicon:graph-16" width="27" height="27" />
                                </div>
                                <div>บทความการเงิน</div>
                            </div>
                        </div>
                        <div className={stateManu?'w-full flex items-center bg-primary rounded-r-lg pl-2 h-14 top-[245px] cursor-pointer text-white absolute z-0 duration-200':'w-full flex items-center bg-primary rounded-r-lg pl-2 h-14 top-[300px] cursor-pointer text-white absolute z-0 duration-200'}></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar