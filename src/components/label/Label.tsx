import {FC} from "react";
import './Label.scss';

type Props = {
    title: string;
    htmlFor?: string;
    classnames?: string;
    children?: JSX.Element
}

export const Label: FC<Props> = ({ title, htmlFor, classnames, children }) => {
    return (
        <>
            <label htmlFor={htmlFor} className={`label ${classnames ? classnames : ''}`}>
                {title}
            </label>
            {children}
        </>
    )
}