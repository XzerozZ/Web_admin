import React from 'react'
import { useState } from 'react';
import Image from 'next/image';
import logo from '../../public/asset/logo.png';
import { Icon } from '@iconify-icon/react';
import { Hourglass } from 'react-loader-spinner'


interface state {
    editId: string,
    setStateEA: (state: boolean) => void
}

type InfoType = {
    name: string;
    city: string;
    address: string;
    map: string;
    price: number;
    tel: string;
    web: string;
    time: string;
};

const AddHome: React.FC<state> = ({editId, setStateEA}) => {

const [picture, setPicture] = useState<string[]>(['']);
const [info, setInfo] = useState<InfoType>({
    name: '',
    city: '',
    address: '',
    map: '',
    price: 0,
    tel: '',
    web: '',
    time: '',
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

return (
    <>

    {editId=='' ? 
        <div>
            <div className='w-full h-14 flex items-center justify-between pr-5'>
                <Icon
                onClick={() => setStateEA(false)}
                className=' cursor-pointer text-normalText' icon="ion:chevron-back" width="40" height="40" />
                <div className='text-xl font-bold text-normalText'>HomeId</div>
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
                        className={picture.length == 1 ?"w-14 h-14 flex justify-center items-center shrink-0":"w-14 h-14 flex justify-center items-center text-err shrink-0 cursor-pointer active:scale-95"}
                        onClick={() => removePictureField(index)}
                    >
                        {picture.length == 1 ? (
                        null
                        ) : (
                            // "majesticons:delete-bin"
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
                            onChange={(e) => setInfo({...info, city: e.target.value})}
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
                        placeholder='ราคาเริ่มต้น'
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
                        onChange={(e) => setInfo({...info, tel: e.target.value})}
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
                        onChange={(e) => setInfo({...info, web: e.target.value})}
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
                        onChange={(e) => setInfo({...info, time: e.target.value})}
                        placeholder='เวลาทำการ'
                        className='w-full h-full rounded-lg border-2 border-unselectInput outline-none p-3 text-normalText resize-none slide'/>
                    </div>
                    <div className='w-14 h-14 shrink-0'></div>
                </div>
            </div>
            {/* ------------------------------------------------------------------------------- */}
            <div className='w-full flex justify-end mt-5'>
                <div className={allInfoFilled?'w-40 h-12 bg-primary rounded-lg flex items-center justify-center text-white cursor-pointer duration-100 active:scale-95'
                :'w-40 h-12 bg-unselectMenu rounded-lg flex items-center justify-center text-white cursor-pointer'} >
                    เพิ่มบ้านพัก
                </div>
            </div>
        </div>
    : 
        <div>editId : {editId}</div> 
    }
    </>
  )
}

export default AddHome