import React from 'react'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from '../../public/asset/logo.png';
import { Icon } from '@iconify-icon/react';
import { Hourglass } from 'react-loader-spinner'


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




const AddArticle: React.FC<State> = ({ editId, setStateEA, reload, setReload, setLastData}) => {



const [picture, setPicture] = useState<string[]>(['']);
const [title, setTitle] = useState<string>('');
const [textAreas, setTextAreas] = useState<TextArea[]>([
    { text: '', size: 'Paragraph', bold: false }
]);
const [formattedDate, setFormattedDate] = useState<string>('');

console.log(textAreas)

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
}, [textAreas]); // เมื่อ textAreas เปลี่ยนแปลง

// เช็คว่า textAreas ทุกตัวมีข้อมูลครบหรือไม่
const allInfoFilled = textAreas.every(({ text, bold }) => {
    return text !== '' && typeof bold === 'boolean';
});

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


return (
    <>
    {editId== null ? 
        <div>
            <div className='w-full h-14 flex items-center justify-between pr-5'>
                <Icon
                onClick={() => setStateEA(false)}
                className=' cursor-pointer text-normalText' icon="ion:chevron-back" width="40" height="40" />
                <div className='text-xl font-bold text-normalText'>ArticleId</div>
            </div>
            <div className=' w-full border-2 border-accent rounded-lg mt-5 pl-5 p-2 pb-8 relative'>
                <div className='text-xl bg-neutral absolute px-3 left-10 top-[-15px] text-accent'>หัวข้อและหน้าปกบทความ</div>
                <div className='w-96 h-60 ml-3 bg-unselectInput mt-5 rounded-lg flex justify-center items-center cursor-pointer active:bg-gray-300 duration-100'>
                    <Icon className='text-gray-400' icon="material-symbols:upload-rounded" width="50" height="50" />
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
                            <div className='w-[312px] h-[180px] bg-gray-200'></div>
                            <div className={title?'w-full mt-3 px-3 h-auto text-lg font-bold break-words min-h-7':'w-full mt-2 px-3 h-auto text-lg font-bold break-words min-h-7 text-unselectMenu'}>{title?title:'หัวข้อ'}</div>
                            <div className='w-full mt-2 px-3 h-auto text-xs break-words mb-5'>{formattedDate}</div>
                            {/* ถ้ามีรูปเอารูปมาแสดง */}
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


                    <div className='w-3/5'>
                        <div className='w-full flex justify-between mt-5 px-3'>

                        </div>
                            <div className='w-96 h-60 ml-3 bg-unselectInput rounded-lg flex justify-center items-center cursor-pointer active:bg-gray-300 duration-100'>
                                <Icon className='text-gray-400' icon="material-symbols:upload-rounded" width="50" height="50" />
                            </div>
                            
                        
                        
                        <div className='w-full mt-10 flex flex-col justify-center gap-8'>
                        {textAreas.map(({ text, size, bold }, index) => (
                            <div className='w-full px-3 flex justify-center items-center relative' key={index}>
                                <textarea
                                id={`auto-resize-textarea-${index}`}
                                placeholder='กรอกคำอธิบาย'
                                value={text}
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
            {/* <div className='w-40 h-12 bg-err rounded-lg flex items-center justify-center text-white cursor-pointer' >
                ลบบทความ
            </div> */}
            <div className={allInfoFilled?'w-40 h-12 bg-primary rounded-lg flex items-center justify-center text-white cursor-pointer duration-100 active:scale-95'
            :'w-40 h-12 bg-unselectMenu rounded-lg flex items-center justify-center text-white cursor-pointer'} >
                เพิ่มบทความ
            </div>
        </div>
    </div>
    
    : 
        <div>editId : {editId}</div> 
    }
    </>
  )
}

export default AddArticle