import {FC} from "react";
import './Link.scss'

type Props = {
    title: string;
    type: 'primary' | 'secondary' | 'tertiary';
    href: string;
    classNames?: string
}

export const Link: FC<Props> = ({type, title, href, classNames}) => {
    return (
        <div className={`link link-${type} ${classNames ? classNames : ''}`}>
            <a href={href} className="link__button">
                {title}
            </a>
        </div>
    )
}