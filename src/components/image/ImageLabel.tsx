import {FC} from "react";
import imageUpload from './../../assets/icons/imageUpload.svg'
import './ImageLabel.scss'

type Props = {

    classnames?: string;
}

export const ImageLabel: FC<Props> = ({classnames}) => {
    return (
        <label
            className={`imageLabel grid h-full gap-4 cursor-pointer ${classnames || ''}`}
            htmlFor="fileDropRef"
        >
            <div
                className="text-gray80 flex w-full rounded-lg border border-dashed border-primary-700 bg-primary-50 p-5">
                <div className="flex w-full flex-col items-center justify-center gap-3">
                    <div className="items-center tablet:block">
                        <img src={imageUpload} alt="Upload image" className="text-8xl text-gray-400"/>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="text-base font-semibold tracking-wide text-gray-950">
                            Drag & Drop Files
                        </div>
                        <div className="text-sm font-normal leading-5">or</div>
                        <span
                            className="cursor-pointer text-base font-semibold tracking-wide text-primary-500"
                            >
                            Click To Upload
                        </span>
                    </div>
                    <div className="text-center text-sm font-normal">
                        Individual file size is limited to
                        20 MB
                        and the overall size of all files must not exceed 25 MB.
                    </div>
                </div>
                <input
                    className="hidden"
                    id="fileDropRef"
                    type="file"
                    multiple/>
            </div>
        </label>
    )
}