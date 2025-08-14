import React from 'react';
import { Button } from '../button/Button';
import './EmptyState.scss';

interface IEmptyState {
  icon?: string;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  illustration?: 'no-offers' | 'no-requests' | 'no-items' | 'no-results' | 'error' | 'empty-search';
}

export const EmptyState: React.FC<IEmptyState> = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  illustration = 'no-results'
}) => {
  const getIllustration = () => {
    const illustrations = {
      'no-offers': (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#E8F5F5" />
          <path d="M60 100 L140 100" stroke="#73B2B2" strokeWidth="2" strokeDasharray="5,5" />
          <path d="M70 80 L100 60 L130 80" stroke="#73B2B2" strokeWidth="2" fill="none" />
          <rect x="85" y="110" width="30" height="25" rx="4" fill="#AEE6E6" />
          <path d="M100 60 L100 110" stroke="#73B2B2" strokeWidth="2" />
        </svg>
      ),
      'no-requests': (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#E8F5F5" />
          <rect x="70" y="70" width="60" height="60" rx="8" fill="#AEE6E6" />
          <rect x="80" y="85" width="40" height="4" rx="2" fill="#73B2B2" />
          <rect x="80" y="95" width="30" height="4" rx="2" fill="#73B2B2" />
          <rect x="80" y="105" width="35" height="4" rx="2" fill="#73B2B2" />
        </svg>
      ),
      'no-items': (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#E8F5F5" />
          <rect x="75" y="75" width="50" height="50" rx="6" fill="#AEE6E6" />
          <path d="M90 90 L110 110 M110 90 L90 110" stroke="#73B2B2" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
      'no-results': (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#E8F5F5" />
          <circle cx="95" cy="90" r="30" stroke="#73B2B2" strokeWidth="3" fill="none" />
          <path d="M115 110 L130 125" stroke="#73B2B2" strokeWidth="3" strokeLinecap="round" />
          <path d="M85 90 L105 90" stroke="#73B2B2" strokeWidth="2" />
          <path d="M85 100 L95 100" stroke="#73B2B2" strokeWidth="2" />
        </svg>
      ),
      'empty-search': (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#E8F5F5" />
          <circle cx="90" cy="85" r="35" stroke="#AEE6E6" strokeWidth="4" fill="none" />
          <path d="M115 110 L135 130" stroke="#AEE6E6" strokeWidth="4" strokeLinecap="round" />
          <text x="90" y="90" textAnchor="middle" fill="#73B2B2" fontSize="18" fontWeight="bold">?</text>
        </svg>
      ),
      'error': (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#FFE8E8" />
          <path d="M100 60 L100 100" stroke="#FF6B6B" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="120" r="3" fill="#FF6B6B" />
        </svg>
      )
    };
    return illustrations[illustration] || illustrations['no-results'];
  };

  return (
    <div className="empty-state">
      <div className="empty-state__content">
        {icon ? (
          <img src={icon} alt="Empty state" className="empty-state__icon" />
        ) : (
          <div className="empty-state__illustration">
            {getIllustration()}
          </div>
        )}
        <h3 className="empty-state__title">{title}</h3>
        {description && (
          <p className="empty-state__description">{description}</p>
        )}
        {(primaryAction || secondaryAction) && (
          <div className="empty-state__actions">
            {primaryAction && (
              <Button
                title={primaryAction.label}
                type="primary"
                handleClick={primaryAction.onClick}
              />
            )}
            {secondaryAction && (
              <Button
                title={secondaryAction.label}
                type="secondary"
                handleClick={secondaryAction.onClick}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};