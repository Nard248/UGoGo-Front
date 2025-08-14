import React from 'react';
import classNames from 'classnames';
import './ResponsiveGrid.scss';

interface IResponsiveGrid {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'small' | 'medium' | 'large';
  className?: string;
}

export const ResponsiveGrid: React.FC<IResponsiveGrid> = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'large',
  className
}) => {
  return (
    <div 
      className={classNames(
        'responsive-grid',
        `responsive-grid--gap-${gap}`,
        `responsive-grid--mobile-${columns.mobile}`,
        `responsive-grid--tablet-${columns.tablet}`,
        `responsive-grid--desktop-${columns.desktop}`,
        className
      )}
    >
      {children}
    </div>
  );
};