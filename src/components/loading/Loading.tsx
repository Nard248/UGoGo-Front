import './Loading.scss'

interface LoadingProps {
    centered?: boolean;
}

export const Loading = ({ centered = false }: LoadingProps) => {
    return (
        <div className={`spinner ${centered ? 'spinner--centered' : ''}`}></div>
    )
}