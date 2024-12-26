import React, { use } from 'react'
import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import logo from '../../public/asset/logo.png';
import { Icon } from '@iconify-icon/react';
import { Hourglass } from 'react-loader-spinner'
import Port from '../Port';


interface state {
    editId: number | null,
    setStateEA: (state: boolean) => void
    reload: boolean
    setReload: (state: boolean) => void
    stateBanner: boolean
    setStateBanner: (state: boolean) => void
    setLastData: (data: any) => void
}

interface NursingHouse {
    nh_id: number;
    name: string;
    province: string;
    address: string;
    price: number;
    map: string;
    phone_number: string;
    site: string;
    Date: string;
    Status: string;
  }

const EditHome: React.FC<state> = ({editId, setStateEA, reload, setReload, stateBanner, setStateBanner, setLastData}) => {

    const [numPic, setNumPic] = useState(0);
    const [pictures, setPictures] = useState<string[]>([]);
    const [showPictures, setShowPictures] = useState<any[]>([]);
const [info, setInfo] = useState<NursingHouse>({
    nh_id: 0,
    name: '',
    province: '',
    address: '',
    price: 0,
    map: '',
    phone_number: '',
    site: '',
    Date: '',
    Status: '',
});
const [loading, setLoading] = useState(false)

const allInfoFilled = Object.values(info).every(value => {
    // If it's a number (like price), check if it's non-zero
    if (typeof value === 'number') {
      return value !== 0;
    }
    return value !== ''; // Check if the value is not an empty string
  }) && numPic > 0; // Ensure all pictures are filled
  



// Handle image upload
const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        setLoading(true);
        setNumPic((prev) => prev + 1);
        const reader = new FileReader();
        reader.onloadend = () => {
            const newPicture = [...pictures];
            const newShowPicture = [...showPictures];
            newPicture.push(file);
            newShowPicture.push(reader.result);
            setPictures(newPicture);
            setShowPictures(newShowPicture);
            setLoading(false);
        };
        reader.readAsDataURL(file);
    }
};

const removePictureField = (index) => {
    const updatedPictures = pictures.filter((_, i) => i !== index);
    const updatedShowPictures = showPictures.filter((_, i) => i !== index);
    setNumPic((prev) => prev - 1);
    setPictures(updatedPictures);
    setShowPictures(updatedShowPictures);
};

useEffect(() => {
    if (editId) {
      const fetchData = async () => {
        const response = await fetch(`${Port.BASE_URL}/nursinghouses/${editId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result);
        setInfo(result.result);
        // setPicture(result.result.picture
        //     .split(',')
        //     .map((pic: string) => pic.trim())
        //     .filter((pic: string) => pic !== ''));
      };
  
      fetchData();
    }
  }, [editId]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ป้องกันการ reload หน้าเว็บ
    try {
        const body = {
            ...info,
            picture: pictures.join(','),
            };
            console.log(body);
            const response = await fetch(`${Port.BASE_URL}/nursinghouses/${editId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            });
            if (!response.ok) {
                const errorData = await response.json(); // Try to parse error details
                if (errorData.message && errorData.message.includes('uni_nursing_houses_name')) {
                    console.log('--> Error: duplicate key value violates unique constraint "uni_nursing_houses_name" (SQLSTATE 23505)');
                    setLastData({ error: 'uni_nursing_houses_name' }); // Save error info in state
                    setStateBanner(true);
                    throw new Error(errorData.message); // Re-throw error for logging
                }else{
                    setLastData({ error: 'something_went_wrong' }); // Save error info in state
                    setStateBanner(true);
                    throw new Error('Network response was not ok'); // Re-throw error for logging
                }
              }
              const data = await response.json();
              setLastData({data:data.result, massage:'EditHome_success'}); // ส่งข้อมูลล่าสุดไปยัง Banner
              setReload(!reload);
              setStateEA(false);
              setStateBanner(true);
            } catch (err) {
                console.error(err);
            }
    
  };



const handleToggle = () => {
    setInfo({...info, Status: info.Status == "Active"?"Inactive":"Active"});
};



console.log(info);


return (
    <>

        <form onSubmit={handleSubmit}>
            <div className='w-full h-14 flex items-center justify-between pr-5'>
                <Icon
                onClick={() => setStateEA(false)}
                className=' cursor-pointer text-normalText' icon="ion:chevron-back" width="40" height="40" />
                <div className='text-xl font-bold text-normalText'>Home ID : {editId}</div>
            </div>
            <div className='w-full h-auto border-2 border-accent rounded-lg mt-5 py-10 p-2 relative flex flex-wrap justify-center gap-5'>
            <div className='text-xl bg-neutral absolute px-3 left-10 top-[-15px] text-accent'>รูปภาพบ้านพัก</div>
            {numPic > 0 && (
                showPictures.map((pic, index) => (
                    <div key={index} className='w-80 h-52 shadow shrink-0 rounded-lg overflow-hidden flex justify-center items-center text-primary relative'>
                        {loading ? (
                            <Hourglass
                                visible={true}
                                height='30'
                                width='30'
                                ariaLabel='rings-loading'
                            />
                        ) : (
                            <>
                                <img
                                    src={pic}
                                    alt='Picture'
                                    className='object-cover rounded-lg'
                                    width={320}
                                    height={208}
                                    style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
                                />
                                <div
                                    className='absolute top-1 right-1 w-10 h-10 flex justify-center items-center text-unselectMenu hover:text-err shrink-0 cursor-pointer active:scale-95'
                                    onClick={() => removePictureField(index)}
                                >
                                    <Icon icon='majesticons:delete-bin' width='30' height='30' />
                                </div>
                            </>
                        )}
                    </div>
                ))
            )}

            {numPic < 5 && (
                <div className='w-80 h-52 shrink-0 overflow-hidden flex justify-center items-center text-primary relative'>
                    <label htmlFor='upload-input' className='cursor-pointer w-full h-full bg-gray-100 rounded-lg flex justify-center items-center'>
                        <Icon icon='ic:round-plus' width='40' height='40' />
                    </label>
                    <input
                        id='upload-input'
                        type='file'
                        accept='image/*'
                        style={{ display: 'none' }}
                        onChange={handleUpload}
                    />
                </div>
            )}
            </div>
            {/* ------------------------------------------------------------------------------- */}
            <div className=' w-full border-2 border-accent rounded-lg mt-10 pl-5 p-2 pb-8 relative'>
                <div className='text-xl bg-neutral absolute px-3 left-10 top-[-15px] text-accent'>คำอธิบายบ้านพัก</div>
                {/* ชื่อ */}
                <div className='w-full mt-5 flex justify-center'>
                    <div className='w-14 h-14 shrink-0 flex flex-col justify-between items-center'>
                        <Icon className='text-primary' icon="ic:round-home" width="40" height="40" />
                        <div className=' text-label'>ชื่อ</div>
                    </div>
                    <div className='w-full px-3 flex justify-center items-center'>
                        <input 
                        value={info.name}
                        onChange={(e) => setInfo({...info, name: e.target.value})}
                        placeholder='ชื่อบ้านพักคนชรา'
                        className='w-full h-14 rounded-lg border-2 border-unselectInput outline-none px-3 text-normalText'/>
                    </div>
                    <div className='w-14 h-14 shrink-0'></div>
                </div>
                {/* ที่อยู่ */}
                <div className='w-full mt-7 flex justify-center'>
                    <div className='w-14 h-14 shrink-0 flex flex-col justify-between items-center'>
                        <Icon className=' text-accent' icon="weui:location-filled" width="40" height="35" />
                        <div className=' text-label'>ที่อยู่</div>
                    </div>
                    <div className='w-full px-3 flex justify-center items-center gap-3'>
                        <input
                            value={info.province}
                            onChange={(e) => setInfo({...info, province: e.target.value})}
                            placeholder='จังหวัด'
                            className='w-4/12 h-14 rounded-lg border-2 border-unselectInput outline-none px-3 text-normalText'/>
                        <input
                            value={info.address}
                            onChange={(e) => setInfo({...info, address: e.target.value})}
                            placeholder='ที่อยู่'
                            className='w-8/12 h-14 rounded-lg border-2 border-unselectInput outline-none px-3 text-normalText'/>
                    </div>
                    <div className='w-14 h-14 shrink-0'></div>
                </div>
                {/* ลิงค์ที่อยู่ */}
                <div className='w-full mt-7 flex justify-center'>
                    <div className='w-14 h-14 shrink-0 flex flex-col justify-between items-center'>
                        <Icon className=' text-purple-700' icon="et:map" width="40" height="35" />
                        <div className="text-label text-xs flex justify-center items-center text-center">google map</div>
                    </div>
                    <div className='w-full px-3 flex justify-center items-center'>
                        <input 
                        value={info.map}
                        onChange={(e) => setInfo({...info, map: e.target.value})}
                        placeholder='ลิงค์ที่อยู่'
                        className='w-full h-14 rounded-lg border-2 border-unselectInput outline-none px-3 text-normalText'/>
                    </div>
                    <div className='w-14 h-14 shrink-0'></div>
                </div>
                {/* ราคา */}
                <div className='w-full mt-7 flex justify-center'>
                    <div className='w-14 h-14 shrink-0 flex flex-col justify-between items-center'>
                        <Icon className=' text-green-600' icon="tdesign:money-filled" width="40" height="35" />
                        <div className=' text-label'>ราคา</div>
                    </div>
                    <div className='w-full px-3 flex justify-center items-center gap-3'>
                        <input 
                        value={info.price}
                        onChange={(e) => setInfo({...info, price: parseInt(e.target.value)})}
                        type='number'
                        placeholder='ช่วงราคา'
                        className='w-full h-14 rounded-lg border-2 border-unselectInput outline-none px-3 text-normalText'/>
                    </div>
                    <div className='w-14 h-14 shrink-0'></div>
                </div>
                {/* โทร */}
                <div className='w-full mt-7 flex justify-center'>
                    <div className='w-14 h-14 shrink-0 flex flex-col justify-between items-center'>
                        <Icon className=' text-normalText' icon="mynaui:telephone-solid" width="40" height="35" />
                        <div className=' text-label'>โทร</div>
                    </div>
                    <div className='w-full px-3 flex justify-center items-center'>
                        <input 
                        value={info.phone_number}
                        onChange={(e) => setInfo({...info, phone_number: e.target.value})}
                        placeholder='เบอร์โทร'
                        className='w-full h-14 rounded-lg border-2 border-unselectInput outline-none px-3 text-normalText'/>
                    </div>
                    <div className='w-14 h-14 shrink-0'></div>
                </div>
                {/* เว็บ */}
                <div className='w-full mt-7 flex justify-center'>
                    <div className='w-14 h-14 shrink-0 flex flex-col justify-between items-center'>
                        <Icon className=' text-primary2' icon="zondicons:network" width="40" height="35" />
                        <div className=' text-label text-xs'>เว็บไซต์</div>
                    </div>
                    <div className='w-full px-3 flex justify-center items-center'>
                        <input 
                        value={info.site}
                        onChange={(e) => setInfo({...info, site: e.target.value})}
                        placeholder='ลิงค์เว็บไซต์'
                        className='w-full h-14 rounded-lg border-2 border-unselectInput outline-none px-3 text-normalText'/>
                    </div>
                    <div className='w-14 h-14 shrink-0'></div>
                </div>
                {/* เวลา */}
                <div className='w-full mt-7 flex justify-center'>
                    <div className='w-14 h-14 shrink-0 flex flex-col justify-between items-center'>
                        <Icon className=' text-err' icon="tabler:clock-filled" width="40" height="35" />
                        <div className=' text-label text-center text-xs'>เวลา<br />เปิด/ปิด</div>
                    </div>
                    <div className='w-full px-3 flex justify-center items-center'>
                        <textarea
                        value={info.Date}
                        onChange={(e) => setInfo({...info, Date: e.target.value})}
                        placeholder='เวลาทำการ'
                        className='w-full h-full rounded-lg border-2 border-unselectInput outline-none p-3 text-normalText resize-none slide'/>
                    </div>
                    <div className='w-14 h-14 shrink-0'></div>
                </div>
            </div>
            {/* ------------------------------------------------------------------------------- */}
            <div className='w-full flex justify-between mt-5'>
                <div className='w-40 h-12 flex items-center justify-center text-lg font-bold gap-3'>
                    Active
                    <div className="checkbox-wrapper-22">
                    <label className="switch">
                        <input 
                        checked={info.Status == "Active"?true:false} 
                        onChange={handleToggle}
                        type="checkbox" 
                        id="checkbox" />
                        <div className="slider round"></div>
                    </label>
                    </div>
                </div>
                <button 
                type={allInfoFilled?'submit':'button'}
                 className={allInfoFilled?'w-40 h-12 bg-primary rounded-lg flex items-center justify-center text-white cursor-pointer duration-100 active:scale-95'
                :'w-40 h-12 bg-unselectMenu rounded-lg flex items-center justify-center text-white cursor-pointer'} >
                    ยืนยันแก้ไข
                </button>
            </div>
        </form>
    </>
  )
}

export default EditHome