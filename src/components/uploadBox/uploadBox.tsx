import {ChangeEvent, FC, ReactNode, useEffect, useState} from "react"
import download from './../../assets/icons/download.svg'
import img_placeholder from './../../assets/icons/img_placeholder.svg'

interface IUploadBox {
    label?: string;
    icon?: string;
    file?: File | null;
    children?: ReactNode;
    upload: (event: ChangeEvent<HTMLInputElement>) => void;
    onRemove?: () => void;
    accept?: string;
}

const getFileSize = (fileSize: number) => {
    const fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
        let i = 0;
    while (fileSize > 900) {
        fileSize /= 1024;
        i++;
    }
    const size = (Math.round(fileSize * 100) / 100) + ' ' + fSExt[i];

    return size
}

export const UploadBox: FC<IUploadBox> = ({label, icon, file, upload, onRemove, accept, children}) => {

    const [progress, setProgress] = useState(40);

    useEffect(() => {
        if (!file) return;

        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 500);
        return () => clearInterval(interval);
    }, [file]);

    return (
        file ?
            <div
                className="flex items-center justify-between border border-solid border-[#D5D7DA] rounded-lg py-[2.5rem] px-[4rem] w-full">
                <div className="flex items-center space-x-3">
                    <div className=" flex items-center justify-center rounded">
                        <img src={img_placeholder} alt=""/>
                    </div>
                    <div>
                        <p className="text-[1.6rem] text-[#666666] font-medium">{file.name}</p>
                        <p className="text-[1.6rem] text-[#B3B3B3]">{getFileSize(file.size)} - Uploading {progress}% ...</p>
                    </div>
                </div>
                <div className="flex items-center gap-[1.6rem]">
                    {onRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="w-[3.2rem] h-[3.2rem] bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center cursor-pointer border-none transition-colors"
                            title="Remove file"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F04438" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                    <div className="relative">
                        <svg className="w-[6.4rem] h-[6.4rem]" viewBox="0 0 36 36">
                            <path
                                className="text-gray-200"
                                strokeWidth="3"
                                fill="none"
                                stroke="currentColor"
                                d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 1 1 0-31"
                            />
                            <path
                                className="text-teal-400"
                                strokeWidth="3"
                                fill="none"
                                strokeLinecap="round"
                                stroke="currentColor"
                                strokeDasharray="100"
                                strokeDashoffset={100 - progress}
                                d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 1 1 0-31"
                            />
                        </svg>
                        <span
                            className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                          {progress}%
                        </span>
                    </div>
                </div>
            </div>
            :
            <label htmlFor={`file-upload-${label}`} className="w-full cursor-pointer">
                {label && <span className="font-medium text-[#666666] text-[1.6rem]">{label}</span>}
                <div
                    className="w-full mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-[#F0FBFB] rounded-lg p-6 text-center gap-[0.6rem]">
                    <div>
                        <img src={download} alt="Download Icon"/>
                    </div>
                    {children}
                    <input id={`file-upload-${label}`} type="file" className="hidden"
                           onChange={(event) => upload(event)}
                           accept={accept || "image/png, image/jpeg, image/jpg"}/>
                </div>
            </label>
    )
}
