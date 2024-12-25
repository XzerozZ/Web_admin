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

const [picture, setPicture] = useState<string[]>(['']);
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

const allInfoFilled = Object.values(info).every(value => {
    // If it's a number (like price), check if it's non-zero
    if (typeof value === 'number') {
      return value !== 0;
    }
    return value !== ''; // Check if the value is not an empty string
  }) && picture.every(pic => pic.trim() !== ''); // Ensure all pictures are filled
  

const addPictureField = () => {
    if (picture.length < 5) {
      setPicture([...picture, ""]); // Add an empty string if under the limit
    }
};

const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newPictures = [...picture];
    newPictures[index] = e.target.value; // Update the specific input field value
    setPicture(newPictures);
};

const removePictureField = (index: number) => {
    if (picture.length > 1) {
        const newPictures = picture.filter((_, i) => i !== index); // Remove the input at the specific index
        setPicture(newPictures);
    }
};
const [loader, setLoader] = useState(false);

const isValidUrl = (url: string): boolean => {
    try {
      new URL(url); // ตรวจสอบว่า URL ถูกต้อง
      return true;
    } catch {
      return false;
    }
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
            picture: picture.join(','),
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
            <div className=' w-full border-2 border-accent rounded-lg mt-5 pl-5 p-2 pb-8 relative'>
                <div className='text-xl bg-neutral absolute px-3 left-10 top-[-15px] text-accent'>รูปภาพบ้านพัก</div>
                <div className='w-full flex justify-end'>
                    <div 
                    onClick={addPictureField}
                    className={picture.length == 5?'w-28 h-10 bg-unselectMenu rounded-lg flex items-center justify-center text-white cursor-pointer':'w-28 h-10 bg-primary rounded-lg flex items-center justify-center text-white cursor-pointer duration-100 active:scale-95'}>
                        เพิ่มรูปภาพ
                    </div>
                </div>
                {picture.map((pic, index) => (
                    <div className="w-full mt-5 flex justify-center" key={index}>
                    <div className="w-14 h-14 rounded-lg shrink-0 overflow-hidden flex justify-center items-center text-primary">
                    {pic ? (
                        isValidUrl(pic) ?
                        <Image
                            src={pic}
                            alt="Picture"
                            className="object-cover rounded-lg"
                            width={56} // Specify width in pixels
                            height={56} // Specify height in pixels
                            style={{ objectFit: "cover" }}
                            onError={() => setLoader(true)}
                        />:
                        <Hourglass
                        visible={true}
                        height="30"
                        width="30"
                        ariaLabel="rings-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        />

                        ) : <div className='w-full h-full bg-unselectInput flex justify-center items-center'>
                                <Icon className='text-gray-400' icon="gravity-ui:picture" width="35" height="35" />
                            </div>}

                    </div>
                    <div className="w-full px-3 flex justify-center items-center">
                        <input
                        value={pic}
                        onChange={(e) => handlePictureChange(e, index)}
                        placeholder="เพิ่มลิงก์รูปภาพ"
                        className="w-full h-14 rounded-lg border-2 border-unselectInput outline-none px-3 text-normalText"
                        />
                    </div>
                    <div
                        className={picture.length == 1 ?"w-14 h-14 flex justify-center items-center shrink-0":"w-14 h-14 flex justify-center items-center text-unselectMenu hover:text-err shrink-0 cursor-pointer active:scale-95"}
                        onClick={() => removePictureField(index)}
                    >
                        {picture.length == 1 ? (
                        null
                        ) : (
                        <Icon icon="majesticons:delete-bin" width="30" height="30" />
                        )}  
                    </div>
                    </div>
                ))}

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