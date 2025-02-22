import {FC} from "react";
import './Link.scss'

type Props = {
    title: string;
    type: 'primary' | 'secondary' | 'tertiary';
    outline?: boolean;
    href: string;
    classNames?: string
}

export const Link: FC<Props> = ({type, outline, title, href, classNames}) => {
    return (
        <div className={`link link-${type} ${classNames ? classNames : ''} ${outline ? 'outline' : ''}`}>
            <a href={href} className="link__button">
                {title}
            </a>
        </div>
    )
}