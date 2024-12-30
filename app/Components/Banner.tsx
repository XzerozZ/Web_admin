import { error } from 'console'
import React, { useState, useEffect } from 'react'

interface Props {
    lastData: any
}

const Banner: React.FC<Props> = ({lastData}) => {
  
console.log('lastData',lastData)
const [username, setUsername] = useState('')

useEffect(() => {
  const usernameGET = localStorage.getItem('username');
  setUsername(usernameGET || '');
}, []);

  return (
    <>
    {lastData.error == 'uni_nursing_houses_name' && <div className=' text-neutral flex px-10 bg-err py-5 rounded-xl text-lg'>Error : The name of this nursing home has been registered!</div>}
    {lastData.error == 'something_went_wrong' && <div className=' text-neutral flex px-10 bg-err py-5 rounded-xl text-lg'>Error : Failed to register. Something went wrong!</div>}
    {lastData.massage == 'Addhome_success' && <div className=' text-neutral flex px-10 bg-primary py-5 rounded-xl text-lg'>Added nursing home ID <div className=' underline font-bold mx-2'> {lastData.data.nh_id} </div> successfully!</div>}
    {lastData.massage == 'EditHome_success' && <div className=' text-neutral flex px-10 bg-primary2 py-5 rounded-xl text-lg'>Edited nursing home ID <div className=' underline font-bold mx-2'> {lastData.data} </div> successfully!</div>}
    {lastData.massage == 'Addarticla_success' && <div className=' text-neutral flex px-10 bg-primary py-5 rounded-xl text-lg'> Added article ID <div className=' underline font-bold mx-2'>{lastData.data.news_id}</div> successfully!</div>}
    {lastData.massage == 'EditArticle_success' && <div className=' text-neutral flex px-10 bg-primary2 py-5 rounded-xl text-lg'> Edited article ID <div className=' underline font-bold mx-2'>{lastData.data}</div> successfully!</div>}
    {lastData.massage == 'Deletearticla_success' && <div className=' text-neutral flex px-10 bg-accent py-5 rounded-xl text-lg'> Deleted article ID <div className=' underline font-bold mx-2'>{lastData.data}</div> successfully!</div>}
    
    
    
    {lastData.error == 'invalid_email_or_password' && <div className=' text-neutral flex px-10 bg-err py-5 rounded-xl text-lg'>invalid email or password</div>}
    {lastData.massage == 'Login_success' && <div className=' text-neutral flex px-10 bg-primary py-5 rounded-xl text-lg'>Login successful! Welcome <div className=' underline font-bold mx-2'>{username}</div> .</div>}
    
    </>
  )
}

export default Banner