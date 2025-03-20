import {Button} from "../button/Button";
import {FC, useEffect, useState} from "react";
import iconSvg from './../../assets/icons/item.svg'
import plusIcon from './../../assets/icons/plus.svg'
import classNames from "classnames";
import {useNavigate} from "react-router-dom";

interface ISelectItemPopup {
    data: any[];
    onClose: () => void;
}

const Items = [
    {
        id: 1,
    },
    {
        id: 2,
    },
    {
        id: 3,
    },
    {
        id: 4,
    }
]

export const SelectItemPopup: FC<ISelectItemPopup> = ({data, onClose}) => {
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState<
        number[] | null
    >();

    const handleCardClick = (id: number) => {
        if (selectedItems?.includes(id)) {
            const _selectedItems = selectedItems.filter(
                (item) => item !== id
            );
            setSelectedItems(_selectedItems);
            return;
        }
        const _selectedItems = selectedItems?.length
            ? [...selectedItems, id]
            : [id];
        setSelectedItems(_selectedItems);
    };
    
    const onConfirm = () => {
        localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
        navigate('/transaction');
    }

    return (
        <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex justify-center items-center w-full h-full bg-[#d0e3eb8c]">
            <div className="flex flex-col p-[3rem] gap-[2rem] w-[90rem] max-h-[60rem] rounded-[.8rem] border-[#D5D7DA] border-solid border bg-[#fff]">
                <div className="flex justify-between">
                    <h3 className="text-[2rem] font-medium">
                        My items
                    </h3>
                    <Button type={'tertiary'} outline={true} handleClick={onClose}/>
                </div>
                <div className="grid grid-cols-3 gap-[2rem] justify-items-center overflow-y-scroll">
                    {data.map(({id}) => (
                        <button
                            key={id}
                            className={classNames(
                                "flex flex-col justify-center items-center gap-[2rem] border-solid border-[#D5D7DA] border rounded-[.5rem] w-[20.5rem] h-[20.5rem] p-[1.5rem]",
                                {'!border-[#73B2B2] text-[#73B2B2]': selectedItems?.includes(id)}
                            )}
                            onClick={() => handleCardClick(id)}
                        >
                            <div>
                                <img className="object-scale-down" src={iconSvg}/>
                            </div>
                            <h3>
                                item title
                            </h3>
                        </button>
                    ))}
                    <button
                        className={classNames(
                            "flex flex-col justify-center items-center gap-[2rem] border-solid border-[#D5D7DA] border rounded-[.5rem] w-[20.5rem] h-[20.5rem] p-[1.5rem]",
                        )}
                        onClick={() => navigate('/add-item')}
                    >
                        <div>
                            <img className="object-scale-down" src={plusIcon}/>
                        </div>
                        <h3>
                            Add new item
                        </h3>
                    </button>
                </div>
                <div className="flex justify-end gap-[4rem]">
                    <Button title={'Confirm'} type={'primary'} handleClick={onConfirm}/>
                </div>
            </div>
        </div>
    )
}