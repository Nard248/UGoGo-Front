import {ChangeEvent, FC, ReactNode, useEffect, useState} from "react"
import download from './../../assets/icons/download.svg'
import img_placeholder from './../../assets/icons/img_placeholder.svg'

interface IUploadBox {
    label?: string;
    icon?: string;
    file?: File | null;
    children?: ReactNode;
    upload: (event: ChangeEvent<HTMLInputElement>) => void;
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

export const UploadBox: FC<IUploadBox> = ({label, icon, file, upload, children}) => {

    const [progress, setProgress] = useState(40);

    useEffect(() => {
        if (file && progress < 100) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 500); // every half second
            return () => clearInterval(interval);
        }
    }, [file, progress]);

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
            :
            <label htmlFor={'file-upload'} className="w-full cursor-pointer">
                {label && <span className="font-medium text-[#666666] text-[1.6rem]">{label}</span>}
                <div
                    className="w-full mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-[#F0FBFB] rounded-lg p-6 text-center gap-[0.6rem]">
                    <div>
                        <img src={download} alt="Download Icon"/>
                    </div>
                    {children}
                    <input id="file-upload" type="file" className="hidden"
                           onChange={(event) => upload(event)}
                           accept="image/png, image/jpeg, image/jpg, application/pdf"/>
                </div>
            </label>
    )
}