import {ChangeEvent, FC} from "react";
import './Select.scss';

type Props = {
    id?: string;
    name?: string;
    placeholder?: string;
    classnames?: string;
    options: any[];
    handleSelectChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export const Select: FC<Props> = ({id, name, placeholder, classnames, options, handleSelectChange}) => {
    return (
        <select id={id} className={`select ${classnames ? classnames : ''}`} onChange={(event) => handleSelectChange(event)}>
            <option value="" disabled selected>{placeholder}</option>
            {options.map(({id, airport_name, airport_code}) => (
                <option key={id} value={id}>{airport_name} ({airport_code})</option>
            ))}
        </select>
    )
}