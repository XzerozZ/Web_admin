'use client'

import React from 'react'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const EditHome: React.FC = () => {

const router = useRouter();
const param = useParams<{ HomeId?: string }>();
const[ homeId, setHomeId ] = useState('')

useEffect(() => {
    if(param.HomeId){
        setHomeId(param.HomeId)
    }
    }, [param.HomeId]);



  return (
    <div>homeId : {homeId}</div>
  )
}

export default EditHome