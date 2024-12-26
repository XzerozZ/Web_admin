import React, { use } from 'react'
import { Icon } from '@iconify-icon/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Port from '../Port';
import ClipLoader from "react-spinners/ClipLoader";


interface CardProps {
    stateManu: boolean
    search: string
    setEditId: (id: number | null) => void
    setStateEA: (state: boolean) => void
    reload: boolean
    setReload: (state: boolean) => void
    statusFilter: string
}
interface NursingHouse {
  nh_id: number;
  name: string;
  address: string;
  phone_number: string;
  price: number;
  province: string;
  site: string;
  map: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
}


const Card: React.FC<CardProps> = ({stateManu, search, setEditId, setStateEA, reload, setReload, statusFilter}) => {

const [homeIds, setHomeIds] = useState<NursingHouse[]>([]);
const [articleIds, setArticleIds] = useState<NursingHouse[]>([]);

const dataNoSearch = stateManu ? homeIds : articleIds;
const [data, setData] = useState<NursingHouse[]>([])
const [loading, setLoading] = useState(true); // สถานะโหลดข้อมูล

useEffect(() => {
  if (stateManu){
    if (statusFilter == 'Active') {
      const filteredData = dataNoSearch.filter((item) => item.Status == 'Active')
      if (search) {
        const filteredData2 = filteredData.filter(
          (item) =>
            item.nh_id.toString().includes(search) ||
            item.name.toString().includes(search)
        )
        setData(filteredData2)
      }else{
        setData(filteredData)
      }
    }else if (statusFilter == 'Inactive') {
      const filteredData = dataNoSearch.filter((item) => item.Status == 'Inactive')
      if (search) {
        const filteredData2 = filteredData.filter(
          (item) =>
            item.nh_id.toString().includes(search) ||
            item.name.toString().includes(search)
        )
        setData(filteredData2)
      }else{
        setData(filteredData)
      }
    }else{
      if (search) {
        const filteredData2 = dataNoSearch.filter(
          (item) =>
            item.nh_id.toString().includes(search) ||
            item.name.toString().includes(search)
        )
        setData(filteredData2)
      }else{
        setData(dataNoSearch)
      }
    }
  }
  
  
}, [statusFilter, stateManu, search])



useEffect(() => {
  setLoading(true)
  if (stateManu) {
      const fetchData = async () => {
        try {
          const response = await fetch(`${Port.BASE_URL}/nursinghouses`) // Home API
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const result = await response.json(); // แปลง JSON เป็น Object
          const reversedData = result.result.reverse();
          setData(reversedData);
          setHomeIds(reversedData); // เก็บข้อมูลใน state
          setLoading(false); // หยุดโหลดข้อมูล
          console.log(result.result)
        } catch (err) {
          setLoading(false);
        }
      };
  
      fetchData();
  }else{
    const fetchData = async () => {
      try {
        const response = await fetch(`${Port.BASE_URL}/nursinghouses`) // Article API
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json(); // แปลง JSON เป็น Object
        const reversedData = result.result.reverse();
        setData(reversedData); // เก็บข้อมูลใน state
        setArticleIds(reversedData); // เก็บข้อมูลใน state
        setLoading(false); // หยุดโหลดข้อมูล
      } catch (err) {
        setLoading(false);
      }
    };

    fetchData();
  }
}, [reload, stateManu])
console.log('+++',data)



  return (
    <>
    {loading
    ?<div className='w-full flex justify-center pr-5 '>
      <ClipLoader
        className="w-14 h-14"
        color='#2A4296'
      />
      </div>
    :(data.map((item, index) => (
        <div 
          key={index} 
          onClick={() => {
            setEditId(item.nh_id)
            setStateEA(true)
          }}
          className={item.Status == 'Active'? 'w-60 bg-white rounded-lg shadow border-[1px] border-accent cursor-pointer hover:shadow-lg hover:scale-105 duration-200 flex flex-col relative' 
          : 'w-60 bg-white rounded-lg shadow border-[1px] border-x-unselectMenu cursor-pointer hover:shadow-lg hover:scale-105 duration-200 flex flex-col relative'}>
          <div className='mx-auto w-56 bg-gray-200 mt-2 h-40 rounded-md shrink-0'>
              
          </div>
          <div className='mx-auto h-12 w-56 my-2 break-words line-clamp-2'>
              {item.name}
          </div>
          <div className={item.Status == 'Active'?' text-white text-sm absolute top-0 left-0 w-20 h-6 bg-accent flex items-center justify-center rounded-tl-md rounded-br-lg opacity-80'
          :' text-white text-sm absolute top-0 left-0 w-20 h-6 bg-unselectMenu flex items-center justify-center rounded-tl-md rounded-br-lg opacity-80'}>
            {item.nh_id}
          </div> 
          <div className='mt-1 text-accent text-sm pr-2 absolute top-1 right-0'>
            <Icon icon="mage:edit" width="20" height="20" />
          </div> 
        </div>
      )))}
    </>
  )
}

export default Card