import { FC, ReactNode } from "react";
import './InfoPage.scss';

interface InfoPageProps {
  title: string;
  children: ReactNode;
}

export const InfoPage: FC<InfoPageProps> = ({ title, children }) => (
  <div className="info-page">
    <h1>{title}</h1>
    <div>{children}</div>
  </div>
);
