import React from 'react'
import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import logo from '../../public/asset/logo.png';
import { Icon } from '@iconify-icon/react';
import { Hourglass } from 'react-loader-spinner'
import Port from '../Port';
import { text } from 'stream/consumers';


interface State {
    editId: number | null;
    setStateEA: (state: boolean) => void;
    reload: boolean;
    setReload: (state: boolean) => void;
    stateBanner: boolean
    setStateBanner: (state: boolean) => void
    setLastData: (data: any) => void
}

interface TextArea {
    text: string;
    size: 'Heading' | 'Paragraph' | 'Small';
    bold: boolean;
}

interface DialogItem {
    desc: string;
    type: 'Heading' | 'Paragraph' | 'Small';
    text?: string;
    size?: 'Heading' | 'Paragraph' | 'Small';
}


const EditArticle: React.FC<State> = ({editId, setStateEA, reload, setReload, stateBanner, setStateBanner, setLastData}) => {


const [titlePicture, setTitlePicture] = useState<File>();
const [showTitlePicture, setShowTitlePicture] = useState<any>();
const [oldTitlePictureId, setOldTitlePictureId] = useState();
const [deleteTitlePictureId, setDeleteTitlePictureId] = useState('');
const [descriptionPicture, setDescriptionPicture] = useState<File>();
const [showDescriptionPicture, setShowDescriptionPicture] = useState<any>();
const [oldDescriptionPictureId, setOldDescriptionPictureId] = useState<string | undefined>(undefined);
const [deleteDescriptionPictureId, setDeleteDescriptionPictureId] = useState('');

const [oldTitle, setOldTitle] = useState<string>('');
const [oldTextAreas, setOldTextAreas] = useState<TextArea[]>([
    { text: '', size: 'Paragraph', bold: false }
]);
const [title, setTitle] = useState<string>('');
const [textAreas, setTextAreas] = useState<TextArea[]>([
    { text: '', size: 'Paragraph', bold: false }
]);

const [formattedDate, setFormattedDate] = useState<string>('');


// ฟังก์ชันจัดการการเปลี่ยนแปลงของ textarea
const handleChangetextarea = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const newTextAreas = [...textAreas];
    newTextAreas[index].text = e.target.value; // อัพเดทค่า text ในอ็อบเจ็กต์
    setTextAreas(newTextAreas);
};

// ฟังก์ชันเพิ่ม textarea ใหม่
const addTextArea = () => {
    setTextAreas([...textAreas, { text: '', size: 'Paragraph', bold: false }]); // เพิ่มอ็อบเจ็กต์ใหม่
};


useEffect(() => {
    if (typeof window !== 'undefined') {
      const date = new Date();
      const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
      const yearInBE = date.getFullYear() + 543;
      const formatted = `${date.getDate()} ${thaiMonths[date.getMonth()]} ${yearInBE}`;
      setFormattedDate(formatted);
    }
  }, []);
// useEffect เพื่อปรับขนาดทุกๆ textarea
useEffect(() => {
    textAreas.forEach((_, index) => {
    const textarea = document.getElementById(`auto-resize-textarea-${index}`) as HTMLTextAreaElement;
    if (textarea) {
        textarea.style.height = 'auto'; // รีเซ็ตความสูง
        textarea.style.height = `${textarea.scrollHeight}px`; // ปรับความสูงตามเนื้อหาภายใน
    }
    });
}, [textAreas]);


const handleSizeChange = (index: number) => {
    const newTextAreas = [...textAreas];
    const currentSize = newTextAreas[index].size;

    // เปลี่ยนขนาดตามลำดับ Paragraph -> Heading -> Small -> Paragraph
    if (currentSize === 'Paragraph') {
    newTextAreas[index].size = 'Heading';
    } else if (currentSize === 'Heading') {
    newTextAreas[index].size = 'Small';
    } else if (currentSize === 'Small') {
    newTextAreas[index].size = 'Paragraph';
    }

    setTextAreas(newTextAreas); // อัปเดต state
};



const getFontSize = (size: 'Heading' | 'Paragraph' | 'Small'): string => {
    switch (size) {
      case 'Heading':
        return '16px';
      case 'Paragraph':
        return '14px';
      case 'Small':
        return '12px';
      default:
        return '14px'; // This line is redundant due to strict typing
    }
  };



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ป้องกันการ reload หน้าเว็บ
    try {
        console.log('************',textAreas)
        const formData = new FormData();
        formData.append('title', title);
        textAreas.forEach((textArea, index) => {
            formData.append(`desc`, textArea.text);
            formData.append(`type`, textArea.size);
            formData.append(`bold`, String(textArea.bold));
        });
        if (titlePicture) {
            formData.append('images', titlePicture as Blob);
        }
        if (descriptionPicture) {
            formData.append('images', descriptionPicture as Blob);
        }        
        const combinedDeleteIds = [deleteTitlePictureId, deleteDescriptionPictureId].join(',');
        formData.append('delete_images', combinedDeleteIds);
        
        formData.forEach((value, key) => {
            console.log('key:', key, 'value:', value);
        });

      const response = await fetch(`${Port.BASE_URL}/news/${editId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        setLastData({ error: 'something_went_wrong' }); // Save error info in state
        setStateBanner(true);
        throw new Error('Network response was not ok'); // Re-throw error for logging
      }

      const data = await response.json();
      console.log('Success:', data);
      setReload(!reload); // โหลดข้อมูลใหม่
      setStateEA(false); // ปิดหน้า AddHome
      setStateBanner(true);
      setLastData({data:data.result.news_id, massage:'EditArticle_success'}); // ส่งข้อมูลล่าสุดไปยัง Banner
    } catch (error) {
        console.log('Error:', error);
      throw new Error( error as string);
    }
  };


const handleUploadtitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setTitlePicture(file);
        const reader = new FileReader();
        reader.onload = () => {
            setShowTitlePicture([reader.result]);
        };
        reader.readAsDataURL(file);
    }
};

const removePictureFieldtitle = () => {
    if (oldTitlePictureId !== undefined) {
        setDeleteTitlePictureId(oldTitlePictureId);
    }
    setTitlePicture(undefined);
    setShowTitlePicture(undefined);
};

const handleUploaddescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setDescriptionPicture(file);
        const reader = new FileReader();
        reader.onload = () => {
            setShowDescriptionPicture([reader.result]);
        };
        reader.readAsDataURL(file);
    }
};

const removePictureFielddescription = () => {
    if (oldDescriptionPictureId !== undefined) {
        setDeleteDescriptionPictureId(oldDescriptionPictureId);
    }
    setDescriptionPicture(undefined);
    setShowDescriptionPicture(undefined);
};


// ----------------------------------------------------------------------------------------


useEffect(() => {
    if (editId) {
      const fetchData = async () => {
        const response = await fetch(`${Port.BASE_URL}/news/${editId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(editId)
        console.log('result--------',result.result)
        const { title, dialog, images } = result.result;
        setOldTitle(title);
        
        setTitle(title);

        const updatedDialog: TextArea[] = dialog.map((item: DialogItem) => ({
            ...item,                         // คัดลอกข้อมูลทั้งหมดของ item
            text: item.desc,                  // เพิ่ม key ใหม่ชื่อ 'text' และกำหนดค่าจาก 'desc'
            size: item.type,                  // เพิ่ม key ใหม่ชื่อ 'size' และกำหนดค่าจาก 'type'
            desc: undefined,                  // กำจัด key 'desc' (ถ้าไม่ต้องการเก็บไว้)
            type: undefined                   // กำจัด key 'type' (ถ้าไม่ต้องการเก็บไว้)
        }));
        setTextAreas(updatedDialog);
        const updatedOldDialog: TextArea[] = dialog.map((item: DialogItem) => ({
            ...item,                         // คัดลอกข้อมูลทั้งหมดของ item
            text: item.desc,                  // เพิ่ม key ใหม่ชื่อ 'text' และกำหนดค่าจาก 'desc'
            size: item.type,                  // เพิ่ม key ใหม่ชื่อ 'size' และกำหนดค่าจาก 'type'
            desc: undefined,                  // กำจัด key 'desc' (ถ้าไม่ต้องการเก็บไว้)
            type: undefined                   // กำจัด key 'type' (ถ้าไม่ต้องการเก็บไว้)
        }));
        setOldTextAreas(updatedOldDialog);
        setOldTitlePictureId(images[0].image_id);
        setShowTitlePicture([images[0].image_link]);
        if(images.length > 1){
            setOldDescriptionPictureId(images[1].image_id);
            setShowDescriptionPicture([images[1].image_link]);
        }
        
        
      };
  
      fetchData();
    }
  }, [editId]);


    const [hasChanged, setHasChanged] = useState<boolean>(false);

    useEffect(() => {
        checkChanges();
      }, [ title, textAreas, deleteTitlePictureId, deleteDescriptionPictureId, showTitlePicture, showDescriptionPicture, descriptionPicture ]);

    const checkChanges = () => {
    const titleChanged = title !== oldTitle;
    const numberTextAreasChanged = textAreas.length !== oldTextAreas.length;
    const textAreasChanged = textAreas.some((textArea, index) => {
        const oldTextArea = oldTextAreas[index]; // ดึงข้อมูลเก่าออกมา
        if (!oldTextArea) return true; // ถ้าไม่มีข้อมูลเก่า ถือว่าเปลี่ยนแปลงแล้ว
    
        // เปรียบเทียบค่าระหว่าง textArea ปัจจุบันและเดิม
        return (
            textArea.text !== oldTextArea?.text ||
            textArea.size !== oldTextArea?.size ||
            textArea.bold !== oldTextArea?.bold
        );
    });
    

    const pictureChanged = deleteTitlePictureId || deleteDescriptionPictureId;
    const allInfoFilled = textAreas.every(({ text, bold }) => {
        return text !== '' && showTitlePicture !== undefined ;
        // return text !== '' && typeof bold === 'boolean' && showTitlePicture !== undefined ;
    });
    const allInfoFilled2 = title !== '';

    const allInfoFilled3 =  descriptionPicture !== undefined;

    console.log('infoChanged',textAreasChanged, allInfoFilled, allInfoFilled2)

    
    
    const changes = (titleChanged || textAreasChanged || pictureChanged || allInfoFilled3 || numberTextAreasChanged) && allInfoFilled && allInfoFilled2 ? true : false;
    setHasChanged(changes);

    };


const handleDeleteArticle = async () => {
    try {
        const response = await fetch(`${Port.BASE_URL}/news/${editId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Success:', data);
        setReload(!reload);
        setStateEA(false);
        setStateBanner(true);
        setLastData({data:editId, massage:'Deletearticla_success'});
    } catch (error) {
        console.error('Error:', error);
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
                <div className='text-xl font-bold text-normalText'>Article Id : {editId}</div>
            </div>
            <div className=' w-full border-2 border-accent rounded-lg mt-5 pl-5 p-2 pb-8 relative'>
                <div className='text-xl bg-neutral absolute px-3 left-10 top-[-15px] text-accent'>หัวข้อและหน้าปกบทความ</div>
                <div className='w-96 h-60 ml-3 bg-unselectInput mt-5 rounded-lg flex justify-center items-center active:bg-gray-300 duration-100'>
                    {showTitlePicture === undefined ?
                    <>
                        <label htmlFor='upload-input' 
                        className='cursor-pointer w-full h-full bg-gray-100 rounded-lg flex justify-center items-center'>
                        <Icon className='text-gray-400' icon="material-symbols:upload-rounded" width="50" height="50" />
                        </label>
                        <input
                            id='upload-input'
                            type='file'
                            accept='image/*'
                            style={{ display: 'none' }}
                            onChange={handleUploadtitle}
                        />
                    </>
                    : <>
                        <div className='w-96 h-60 rounded-lg relative'>
                            <img
                                src={showTitlePicture ? showTitlePicture : undefined}
                                alt='Picture'
                                className='object-cover rounded-lg w-full h-full'
                                style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
                            />
                            <div
                            className='absolute top-1 right-1 w-10 h-10 flex justify-center items-center text-unselectMenu hover:text-err shrink-0 cursor-pointer active:scale-95'
                            onClick={removePictureFieldtitle}
                            >
                                <Icon icon='majesticons:delete-bin' width='30' height='30' />
                            </div>
                        </div>
                    </>
                        }
                    
                    
                </div>
                <div className='ml-3 mt-3 text-normalText text-lg'>หัวข้อ</div>
                <div className='w-full mt-2 flex justify-center'>
                    <div className='w-full px-3 flex justify-center items-center'>
                        <input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='กรองหัวข้อบทความ'
                        className='w-full h-14 rounded-lg border-2 border-unselectInput outline-none px-3 text-normalText'/>
                    </div>
                </div>
            </div>
            {/* ------------------------------------------------------------------------------- */}
            <div className=' w-full border-2 border-accent rounded-lg mt-10 p-2 pb-8 relative flex flex-col items-end'>
                <div className='text-xl bg-neutral absolute px-3 left-10 top-[-15px] text-accent'>คำอธิบาย</div>
                <div 
                onClick={addTextArea}
                className='w-40 h-10 bg-primary rounded-lg flex items-center justify-center text-white cursor-pointer duration-100 active:scale-95 sticky top-5 mt-3 mr-3 z-10'>
                    เพิ่มกล่องข้อความ
                </div>
                <div className='w-full flex justify-center'>

                    <div className='w-2/5'>
                        <div className='w-[320px] h-[600px] z-20 bg-neutral pb-5 bg-netural rounded-3xl my-3 mx-auto sticky top-10 shadow-lg border-4 border-normalText overflow-y-auto slidenon'>
                            <div className='w-[313px] h-[180px] bg-gray-200'>
                            {showTitlePicture === undefined ?
                                <>
                                    <label htmlFor='upload-input' 
                                    className='cursor-pointer w-full h-full bg-gray-100 rounded-lg flex justify-center items-center'>
                                    <Icon className='text-gray-400' icon="material-symbols:upload-rounded" width="50" height="50" />
                                    </label>
                                    <input
                                        id='upload-input'
                                        type='file'
                                        accept='image/*'
                                        style={{ display: 'none' }}
                                        onChange={handleUploadtitle}
                                    />
                                </>
                                : <>
                                    <div className='w-full h-full relative'>
                                        <img
                                            src={showTitlePicture ? showTitlePicture : undefined}
                                            alt='Picture'
                                            className='object-cove w-full h-full rounded-none'
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                </>
                                    }
                            </div>
                            <div className={title?'w-full mt-3 px-3 h-auto text-lg font-bold break-words min-h-7':'w-full mt-2 px-3 h-auto text-lg font-bold break-words min-h-7 text-unselectMenu'}>{title?title:'หัวข้อ'}</div>
                            <div className='w-full mt-2 px-3 h-auto text-xs break-words mb-5'>{formattedDate}</div>
                            {/* ถ้ามีรูปเอารูปมาแสดง */}
                            
                            {showDescriptionPicture === undefined ?
                                <>
                                </>
                                : <>
                                <div className='w-[220px] mx-auto'>
                                        <div className='w-full h-full relative'>
                                            <img
                                                src={showDescriptionPicture ? showDescriptionPicture : undefined}
                                                alt='Picture'
                                                className='object-cove w-full h-full rounded-none'
                                                style={{ objectFit: 'contain' }}
                                            />
                                        </div>
                                    </div>
                                </>
                            }
                            
                            <div className='w-full mt-5 h-auto'>
                                {textAreas.map((textArea, index) => (
                                    <div key={index} className='w-full px-3 h-auto'>
                                    <div 
                                        style={{
                                        fontSize: getFontSize(textArea.size),
                                        fontWeight: textArea.bold ? 'bold' : 'normal',
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        }}>
                                        {textArea.text}
                                    </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>


                    <div className='w-3/5'>
                        <div className='w-full flex justify-between mt-5 px-3'>

                        </div>
                            <div className='w-96 min-h-60 ml-3 bg-gray-100 rounded-lg flex justify-center items-center active:bg-gray-300 duration-100'>
                                {showDescriptionPicture === undefined ?
                                    <>
                                        <label htmlFor='upload-input' 
                                        className='cursor-pointer w-full h-full rounded-lg flex justify-center items-center'>
                                        <Icon className='text-gray-400' icon="material-symbols:upload-rounded" width="50" height="50" />
                                        </label>
                                        <input
                                            id='upload-input'
                                            type='file'
                                            accept='image/*'
                                            style={{ display: 'none' }}
                                            onChange={handleUploaddescription}
                                        />
                                    </>
                                    : <>
                                        <div className='w-96 h-auto rounded-lg relative'>
                                            <img
                                                src={showDescriptionPicture ? showDescriptionPicture : undefined}
                                                alt='Picture'
                                                className='object-cover rounded-lg w-full h-full'
                                                style={{ objectFit: 'contain', borderRadius: '0.5rem' }}
                                            />
                                            <div
                                            className='absolute top-1 right-1 w-10 h-10 flex justify-center items-center text-unselectMenu hover:text-err shrink-0 cursor-pointer active:scale-95'
                                            onClick={removePictureFielddescription}
                                            >
                                                <Icon icon='majesticons:delete-bin' width='30' height='30' />
                                            </div>
                                        </div>
                                    </>
                                        }
                            </div>
                            
                        
                        
                        <div className='w-full mt-10 flex flex-col justify-center gap-8'>
                        {textAreas.map(({ text, size, bold }, index) => (
                            <div className='w-full px-3 flex justify-center items-center relative' key={index}>
                                <textarea
                                id={`auto-resize-textarea-${index}`}
                                placeholder='กรอกคำอธิบาย'
                                value={text || ''}
                                typeof='text'
                                onChange={(e) => handleChangetextarea(e, index)}
                                className={`py-2 w-full h-40 resize-none pr-8 overflow-hidden rounded-lg border-2 border-unselectInput outline-none px-3 text-normalText ${bold ? 'font-bold' : ''}`}
                                style={{ fontSize: size === 'Paragraph' ? '14px' : size === 'Heading' ? '18px' : '12px' }}
                                />
                                <div className='h-6 absolute top-[-24px] left-8 text-xs flex items-center justify-around text-unselectMenu'>ส่วนที่ {index+1}</div>
                                <div className='w-32 h-6 absolute top-[-23px] left-24 rounded-t-md text-xs flex items-center justify-end border border-unselectInput '>
                                    <div>
                                        <div 
                                        onClick={() => handleSizeChange(index)}
                                        className='w-20 h-full bg-transparent text-normalText outline-none flex items-center justify-center cursor-pointer duration-100 active:scale-95'>
                                            <div 
                                            style={{ fontSize: size === 'Paragraph' ? '14px' : size === 'Heading' ? '16px' : '12px' }}
                                            >{size === 'Paragraph'?'Paragraph':(size === 'Heading'?'Heading':'Small')}</div>
                                            <Icon className='text-gray-500 mr-1' icon="mingcute:right-fill" width="18" height="18" />
                                        </div>
                                    </div>
                                    <div 
                                    onClick={() => {
                                        const newTextAreas = [...textAreas];
                                        newTextAreas[index].bold = !bold;
                                        setTextAreas(newTextAreas);
                                    }}
                                    className={bold?'w-8 h-6 flex items-center justify-center font-bold text-accent cursor-pointer border-l bg-orange-200 rounded-tr-md active:scale-95':'w-8 h-6 flex items-center justify-center text-unselectMenu cursor-pointer border-l active:scale-95'}>
                                        B
                                    </div>
                                </div>
                                <Icon 
                                onClick={() => {
                                    const newTextAreas = [...textAreas];
                                    newTextAreas.splice(index, 1);
                                    setTextAreas(newTextAreas);
                                }}
                                className=' absolute top-2 right-5 text-unselectMenu hover:text-err cursor-pointer' icon="majesticons:delete-bin" width="24" height="24" />
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                {/* ------------------------------------------------------------------------------- */}
            </div> 
            <div className='w-full flex justify-end mt-5 gap-5'>
            <div 
            onClick={handleDeleteArticle}
            className='w-40 h-12 bg-err rounded-lg flex items-center justify-center text-white cursor-pointer' >
                ลบบทความ
            </div>
            <button 
            type={hasChanged?'submit':'button'}
            className={hasChanged?'w-40 h-12 bg-primary rounded-lg flex items-center justify-center text-white cursor-pointer duration-100 active:scale-95'
            :'w-40 h-12 bg-unselectMenu rounded-lg flex items-center justify-center text-white'} >
                แก้ไขบทความ
            </button>
        </div>
    </form>
    </>
  )
}

export default EditArticle