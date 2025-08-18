import React, { useState, useEffect } from 'react';
import { User, OfferForChat } from '../../../types/chat.types';
import { chatAPI } from '../../../api/chat';
import '../ChatPage.scss';

interface UserSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: User) => void;
}

export const UserSelectorModal: React.FC<UserSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectUser
}) => {
  const [offers, setOffers] = useState<OfferForChat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchOffers = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      if (query.trim()) {
        response = await chatAPI.searchOffers(query);
      } else {
        response = await chatAPI.getAvailableOffers();
      }
      
      // Handle different possible response formats
      const offerData = response.data?.results || response.data || [];
      console.log('Raw offer data:', offerData);
      
      if (Array.isArray(offerData)) {
        // Filter out offers with missing user data
        const validOffers = offerData.filter(offer => offer && offer.user_flight && offer.user_flight.user);
        console.log('Valid offers after filtering:', validOffers);
        setOffers(validOffers);
      } else {
        console.warn('Offer data is not an array:', offerData);
        setOffers([]);
      }
    } catch (err: any) {
      console.error('Error fetching offers:', err);
      setError('Failed to load offers');
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load all offers when modal opens
  useEffect(() => {
    if (isOpen) {
      searchOffers('');
    }
  }, [isOpen]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchOffers(searchQuery);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelectOffer = (offer: OfferForChat) => {
    if (offer.user_flight?.user) {
      onSelectUser(offer.user_flight.user);
      onClose();
      setSearchQuery('');
      setOffers([]);
    } else {
      setError('Invalid offer data - missing user information');
    }
  };

  const handleClose = () => {
    onClose();
    setSearchQuery('');
    setOffers([]);
    setError(null);
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="user-selector-modal-overlay" onClick={handleClose}>
      <div className="user-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select a Courier</h3>
          <button className="close-button" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by destination city or airport..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="user-search-input"
              autoFocus
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {loading && (
            <div className="loading-message">
              {searchQuery ? 'Searching offers...' : 'Loading available offers...'}
            </div>
          )}

          {!loading && !error && searchQuery && offers.length === 0 && (
            <div className="no-results">
              No offers found for "{searchQuery}"
            </div>
          )}

          {!loading && !error && searchQuery === '' && offers.length === 0 && (
            <div className="search-prompt">
              No available offers at the moment
            </div>
          )}

          <div className="offers-list">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="offer-item selectable"
                onClick={() => handleSelectOffer(offer)}
              >
                <div className="offer-user-avatar">
                  <div className="avatar-placeholder">
                    {(offer.user_flight?.user?.full_name || 'U').charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="offer-info">
                  <div className="offer-header">
                    <div className="courier-name">
                      {offer.user_flight?.user?.full_name || 'Unknown Courier'}
                    </div>
                    <div className="flight-number">
                      {offer.user_flight?.flight?.from_airport?.airport_code || 'N/A'}-{offer.user_flight?.flight?.to_airport?.airport_code || 'N/A'}
                    </div>
                  </div>
                  <div className="route-info">
                    <div className="route">
                      <span className="from">
                        {offer.user_flight?.flight?.from_airport?.city?.city_name || 'Unknown'}, {offer.user_flight?.flight?.from_airport?.city?.country?.country_name || 'Unknown'}
                      </span>
                      <span className="arrow">→</span>
                      <span className="to">
                        {offer.user_flight?.flight?.to_airport?.city?.city_name || 'Unknown'}, {offer.user_flight?.flight?.to_airport?.city?.country?.country_name || 'Unknown'}
                      </span>
                    </div>
                    <div className="departure-info">
                      {offer.user_flight?.flight?.departure_datetime ? formatDateTime(offer.user_flight.flight.departure_datetime) : 'Date TBD'}
                    </div>
                  </div>
                  <div className="offer-details">
                    <span className="weight">{offer.available_weight || 0}kg</span>
                    <span className="price">${offer.price || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};