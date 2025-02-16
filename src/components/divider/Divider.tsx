import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./Divider.scss";

interface IDividerProps {
    appearance?: "primary" | "secondary" | "neutral";
    size?: 'small' | 'normal'
    className?: string;
}

export const Divider: FC<IDividerProps> = ({
    appearance = "primary",
    size = "small",
    className
}) => {
    return (
        <div
            className={classNames(
                `divider divider_color_${appearance} divider_size_${size}`,
                className,
            )}
        />
    );
};