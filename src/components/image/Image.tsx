import {FC} from "react";
import './Image.scss'

type Props = {
    src: string;
    alt: string;
    classnames?: string;
}

export const ImageComponent: FC<Props> = ({src, alt, classnames}) => {
    return (
        <div className={`image ${classnames || ''}`}>
            <img src={src} alt={alt}/>
        </div>
    )
}