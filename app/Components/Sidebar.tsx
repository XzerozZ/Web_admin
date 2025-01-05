import React from 'react'

import { Icon } from '@iconify-icon/react';
import Image from 'next/image'
import logo from '../../public/asset/logo.png'
import Port from '../Port';

interface state {
    stateManu: boolean,
    setStateManu: (state: boolean) => void
    setSearch: (search: string) => void
    setStateEA: (state: boolean) => void
    token: string
    setToken: (search: string) => void
}
const Sidebar: React.FC<state> = ({stateManu, setStateManu, setSearch, setStateEA, token, setToken}) => {

const handleLogout = async () => {
    try {
        await fetch(`${Port.BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/';
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

    return (
        <>
            <div className='w-2/5 max-w-72 h-full'><div className="min-w-52 h-full"></div></div>
            <div className='w-1/5 max-w-72 h-full fixed top-0 left-0 z-40'>
                <div className="w-full min-w-52 h-full bg-neutral2 flex flex-col items-center justify-between pb-10">
                    <div className='w-full relative'>
                        <div>
                            <div className="w-full max-w-40 flex items-center justify-center p-10 mx-auto">
                                <Image
                                    src={logo}
                                    alt="Logo"
                                    id="sidebar_logo"
                                    className='object-contain min-w-28'
                                />
                            </div> 
                            <div id="sidebar_title" className='text-label mt-5 pl-5'>จัดการข้อมูลหลัก</div>
                            <div className='w-full flex flex-col gap-10 mt-5 z-10 relative'>
                                <div 
                                id="sidebar-tab-1"
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
                                id="sidebar-tab-2" 
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
                        </div>
                        
                        <div className={stateManu?'w-full flex items-center bg-primary rounded-r-lg pl-2 h-14 top-[245px] cursor-pointer text-white absolute z-0 duration-200':'w-full flex items-center bg-primary rounded-r-lg pl-2 h-14 top-[300px] cursor-pointer text-white absolute z-0 duration-200'}></div>
                    </div>
                    <div 
                    onClick={handleLogout}
                    className='w-full flex items-center h-14 cursor-pointer text-normalText duration-200 pl-10'>
                        Logout
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar