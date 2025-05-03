import {Button} from "../../components/button/Button";
import {UploadBox} from "../../components/uploadBox/uploadBox";
import {ChangeEvent, useState} from "react";
import {IPID} from "../../types/global";
import {profileVerification} from "../../api/route";
import {VerificationPopup} from "../../components/verificationPopup/VerificationPopup";
import {useNavigate} from "react-router-dom";

export const ProfileVerification = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState<IPID>({pid_type: 'passport'} as IPID);
    const [verificationState, setVerificationState] = useState<{ message: string, isSuccess: boolean } | null>(null)

    const onUploadPassport = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement
        if (!target.files?.length) {
            return
        }

        setFormData({...formData, pid_picture: target.files[0]})
    }

    const onUploadSelfie = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement
        if (!target.files?.length) {
            return
        }

        setFormData({...formData, pid_selfie: target.files[0]})
    }

    const verify = async () => {
        try {
            const payLoad = new FormData();

            Object.keys(formData).forEach(item => {
                // @ts-ignore
                payLoad.append(item, formData[item]);
            })

            await profileVerification(payLoad);

            setVerificationState({message: 'Your passport pictures have been uploaded successfully. Please wait while we verify the details. You\'ll be notified once the verification process is complete.', isSuccess: true})

        } catch (e) {
            console.log(e);
            setVerificationState({message: 'Something was wrong!', isSuccess: false})
        }

    }

    return (
        <>
            {verificationState &&
                <VerificationPopup isError={!verificationState.isSuccess} message={verificationState.message}
                                   buttonText={'Close'}
                                   onClick={() => {
                                       setVerificationState(null);
                                       navigate('/')
                                   }}
                />
            }
            <div className="flex flex-col gap-[7rem] w-full">
                <h3 className="text-[2rem]">
                    Verify your identity
                </h3>
                <div className="flex flex-col gap-[5rem]">
                    {/*<div className="flex flex-col gap-[1.7rem]">*/}
                    {/*    <p className="text-[#666666] text-[1.6rem]">*/}
                    {/*        Verify my identity using*/}
                    {/*    </p>*/}
                    {/*    <div className="flex justify-between items-center w-2/6">*/}
                    {/*        <Button title={'Identity card'} type={'primary'} outline={true} handleClick={() => {*/}
                    {/*        }}/>*/}
                    {/*        <Button title={'Passport'} type={'primary'} outline={true} handleClick={() => {*/}
                    {/*        }}/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className="flex flex-col gap-[1.7rem]">
                        <p className="text-[#666666] text-[2rem]">
                            Upload a picture of valid document
                        </p>
                        <div className="flex flex-col justify-between items-center">
                            <UploadBox label={'Front side'} file={formData.pid_picture} upload={onUploadPassport}>
                                <p className="text-teal-600 font-medium">Click to upload</p>
                                <p className="text-gray-500 text-sm">or drag and drop</p>
                                <p className="text-gray-400 text-xs mt-1">PDF, JPG, JPEG, PNG LESS THAN 10MB.</p>
                                <p className="text-gray-400 text-xs">Ensure your document is in good condition and
                                    readable</p>
                            </UploadBox>
                        </div>
                    </div>
                    {/*<div className="flex flex-col gap-[1.7rem]">*/}
                    {/*    <p className="text-[#666666] text-[2rem]">*/}
                    {/*        Take a picture of valid document*/}
                    {/*    </p>*/}
                    {/*    <div className="flex flex-col justify-between items-center">*/}
                    {/*        <UploadBox label={'Back side'} upload={}>*/}
                    {/*            <p className="text-teal-600 font-medium">Click to upload</p>*/}
                    {/*            <p className="text-gray-500 text-sm">or drag and drop</p>*/}
                    {/*            <p className="text-gray-400 text-xs mt-1">PDF, JPG, JPEG, PNG LESS THAN 10MB.</p>*/}
                    {/*            <p className="text-gray-400 text-xs">Ensure your document is in good condition and*/}
                    {/*                readable</p>*/}
                    {/*        </UploadBox>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className="flex flex-col gap-[1.7rem]">
                        <p className="text-[#666666] text-[2rem]">
                            Upload a selfie with your document
                        </p>
                        <div className="flex flex-col justify-between items-center">
                            <UploadBox label={'Front side'} file={formData.pid_selfie} upload={onUploadSelfie}>
                                <p className="text-teal-600 font-medium">Click to upload</p>
                                <p className="text-gray-500 text-sm">or drag and drop</p>
                                <p className="text-gray-400 text-xs mt-1">PDF, JPG, JPEG, PNG LESS THAN 10MB.</p>
                                <p className="text-gray-400 text-xs">Ensure your document is in good condition and
                                    readable</p>
                            </UploadBox>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="flex flex-1">
                        <Button title={'Cancel'} type={'tertiary'} outline={true} handleClick={() => {
                        }}/>
                    </div>
                    <div className="flex gap-[4rem]">
                        <Button title={'Back'} type={'secondary'} outline={true} handleClick={() => {
                        }}/>
                        <Button title={'Continue'} type={'primary'}
                                disabled={!formData.pid_selfie || !formData.pid_picture} handleClick={verify}/>
                    </div>
                </div>
            </div>
        </>
    )
}