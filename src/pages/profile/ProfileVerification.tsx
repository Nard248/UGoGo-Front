import {Button} from "../../components/button/Button";
import imageUpload from "../../assets/icons/imageUpload.svg";
import {UploadBox} from "../../components/uploadBox/uploadBox";

export const ProfileVerification = () => {
    return (
        <div className="flex flex-col gap-[7rem] w-full">
            <h3 className="text-[2rem]">
                Verify your identity
            </h3>
            <div className="flex flex-col gap-[5rem]">
                <div className="flex flex-col gap-[1.7rem]">
                    <p className="text-[#666666] text-[1.6rem]">
                        Verify my identity using
                    </p>
                    <div className="flex justify-between items-center w-2/6">
                        <Button title={'Identity card'} type={'primary'} handleClick={() => {
                        }}/>
                        <Button title={'Passport'} type={'primary'} handleClick={() => {
                        }}/>
                    </div>
                </div>
                <div className="flex flex-col gap-[1.7rem]">
                    <p className="text-[#666666] text-[2rem]">
                        Take a picture of valid document
                    </p>
                    <div className="flex flex-col justify-between items-center">
                        <UploadBox label={'Front side'} uploaded={true} children={
                            <>
                                <p className="text-teal-600 font-medium">Click to upload</p>
                                <p className="text-gray-500 text-sm">or drag and drop</p>
                                <p className="text-gray-400 text-xs mt-1">PDF, JPG, JPEG, PNG LESS THAN 10MB.</p>
                                <p className="text-gray-400 text-xs">Ensure your document is in good condition and
                                    readable</p>
                            </>
                        }/>
                    </div>
                </div>
                <div className="flex flex-col gap-[1.7rem]">
                    <p className="text-[#666666] text-[2rem]">
                        Take a picture of valid document
                    </p>
                    <div className="flex flex-col justify-between items-center">
                        <UploadBox label={'Back side'} children={
                            <>
                                <p className="text-teal-600 font-medium">Click to upload</p>
                                <p className="text-gray-500 text-sm">or drag and drop</p>
                                <p className="text-gray-400 text-xs mt-1">PDF, JPG, JPEG, PNG LESS THAN 10MB.</p>
                                <p className="text-gray-400 text-xs">Ensure your document is in good condition and
                                    readable</p>
                            </>
                        }/>
                    </div>
                </div>
                <div className="flex flex-col gap-[1.7rem]">
                    <p className="text-[#666666] text-[2rem]">
                        Take a selfie with your document
                    </p>
                    <div className="flex flex-col justify-between items-center">
                        <UploadBox label={'Back side'} children={
                            <>
                                <p className="text-teal-600 font-medium">Click to take a selfie</p>
                                <p className="text-gray-500 text-sm">with your identity document</p>
                                <p className="text-gray-400 text-xs mt-1">To match your face to your Passport or ID photo</p>
                            </>
                        }/>
                    </div>
                </div>
            </div>
        </div>
    )
}