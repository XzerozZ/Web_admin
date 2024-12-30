import React from 'react'
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

type InfoType = {
    name: string;
    province: string;
    address: string;
    map: string;
    price: number;
    phone_number: string;
    site: string;
    Date: string;
};



const AddHome: React.FC<state> = ({editId, setStateEA, reload, setReload, stateBanner, setStateBanner, setLastData}) => {

const [HomeId, setHomeId] = useState<number>(0);
const [numPic, setNumPic] = useState(0);
const [pictures, setPictures] = useState<File[]>([]);
const [showPictures, setShowPictures] = useState<any[]>([]);
const [info, setInfo] = useState<InfoType>({
    name: '',
    province: '',
    address: '',
    map: '',
    price: 0,
    phone_number: '',
    site: '',
    Date: '',
});
const [loading, setLoading] = useState(false)

const allInfoFilled = Object.values(info).every(value => {
    if (typeof value === 'number') {
      return value > 0;
    }
    return value !== '';
  }) && numPic > 0;
  



// Handle image upload
const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

const removePictureField = (index: number) => {
    const updatedPictures = pictures.filter((_, i) => i !== index);
    const updatedShowPictures = showPictures.filter((_, i) => i !== index);
    setNumPic((prev) => prev - 1);
    setPictures(updatedPictures);
    setShowPictures(updatedShowPictures);
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${Port.BASE_URL}/nursinghouses/id`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        
        setHomeId(result.result);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);






  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {

        const formData = new FormData();
        formData.append('name', info.name);
        formData.append('province', info.province);
        formData.append('address', info.address);
        formData.append('price', String(info.price));
        formData.append('google_map', info.map);
        formData.append('phone_number', info.phone_number);
        formData.append('web_site', info.site);
        formData.append('time', info.Date);

        pictures.forEach((picture) => {
            formData.append('images', picture);
        });
      const response = await fetch(`${Port.BASE_URL}/nursinghouses`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message && errorData.message.includes('uni_nursing_houses_name')) {
            setLastData({ error: 'uni_nursing_houses_name' });
            setStateBanner(true);
            throw new Error(errorData.message);
        }else{
            setLastData({ error: 'something_went_wrong' });
            setStateBanner(true);
            throw new Error('Network response was not ok');
        }
      }

      const data = await response.json();
      console.log('Success:', data);
      setReload(!reload);
      setStateEA(false);
      setStateBanner(true);
      setLastData({data:data.result, massage:'Addhome_success'});
    } catch (error) {
        console.log('Error:', error);
      throw new Error( error as string);
    }
  };








return (
    <>

        <form onSubmit={handleSubmit}>
            <div className='w-full h-14 flex items-center justify-between pr-5'>
                <Icon
                onClick={() => setStateEA(false)}
                className=' cursor-pointer text-normalText' icon="ion:chevron-back" width="40" height="40" />
                <div className='text-xl font-bold text-normalText'>Home Id : {HomeId}</div>
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
                            onChange={(e) => setInfo({...info, province: e.target.value})}
                            placeholder='จังหวัด'
                            className='w-4/12 h-14 rounded-lg border-2 border-unselectInput outline-none px-3 text-normalText'/>
                        <input
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
                        onChange={(e) => setInfo({...info, Date: e.target.value})}
                        placeholder='เวลาทำการ'
                        className='w-full h-full rounded-lg border-2 border-unselectInput outline-none p-3 text-normalText resize-none slide'/>
                    </div>
                    <div className='w-14 h-14 shrink-0'></div>
                </div>
            </div>
            {/* ------------------------------------------------------------------------------- */}
            <div className='w-full flex justify-end mt-5'>
                <button 
                type={allInfoFilled?'submit':'button'}
                 className={allInfoFilled?'w-40 h-12 bg-primary rounded-lg flex items-center justify-center text-white cursor-pointer duration-100 active:scale-95'
                :'w-40 h-12 bg-unselectMenu rounded-lg flex items-center justify-center text-white cursor-pointer'} >
                    เพิ่มบ้านพัก
                </button>
            </div>
        </form>
    </>
  )
}

export default AddHome