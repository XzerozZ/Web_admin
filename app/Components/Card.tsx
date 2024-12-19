import React, { use } from 'react'
import { Icon } from '@iconify-icon/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';


interface CardProps {
    stateManu: boolean
    search: string
    setEditId: (id: string) => void
    setStateEA: (state: boolean) => void
}

const Card: React.FC<CardProps> = ({stateManu, search, setEditId, setStateEA}) => {

const [homeIds, setHomeIds] = useState(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
const [articleIds, setArticleIds] = useState(['1', '2', '3', '4', '5', '6', '7']);

const dataNoSearch = stateManu ? homeIds : articleIds;
const [data, setData] = useState(dataNoSearch)

useEffect(() => {
  if (search) {
    const filteredData = data.filter((item) => item.includes(search))
    setData(filteredData)
  }else{
    setData(dataNoSearch)
  }
}, [search, stateManu])

  return (
    <>
      {data.map((item, index) => (
        <div 
          key={index} 
          onClick={() => {
            setEditId(item)
            setStateEA(true)
          }}
          className='w-60 bg-white rounded-lg shadow border-[1px] border-accent cursor-pointer hover:shadow-lg hover:scale-105 duration-200 flex flex-col relative'>
          <div className='mx-auto w-56 bg-gray-200 mt-2 h-40 rounded-md shrink-0'>
              
          </div>
          <div className='mx-auto h-12 w-56 my-2 break-words line-clamp-2'>
              {item}
          </div>
          <div className=' text-white text-sm absolute top-0 left-0 w-20 h-6 bg-accent flex items-center justify-center rounded-tl-md rounded-br-lg opacity-80'>
            {item}
          </div> 
          <div className='mt-1 text-accent text-sm pr-2 absolute top-1 right-0'>
            <Icon icon="mage:edit" width="20" height="20" />
          </div> 
        </div>
      ))}
    </>
  )
}

export default Card