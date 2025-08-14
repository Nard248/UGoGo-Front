import { Skeleton } from '@mui/material';
import './OfferCardSkeleton.scss';

export const OfferCardSkeleton = () => {
  return (
    <div className="offer-card-skeleton">
      <Skeleton 
        variant="rectangular" 
        height={180} 
        sx={{ borderRadius: '8px 8px 0 0', backgroundColor: '#E8F5F5' }}
      />
      <div className="offer-card-skeleton__content">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton 
            variant="circular" 
            width={40} 
            height={40} 
            sx={{ backgroundColor: '#E8F5F5' }}
          />
          <Skeleton 
            variant="text" 
            width={120} 
            sx={{ backgroundColor: '#E8F5F5' }}
          />
        </div>
        <Skeleton 
          variant="text" 
          width="100%" 
          height={24} 
          sx={{ backgroundColor: '#E8F5F5', mb: 1 }}
        />
        <Skeleton 
          variant="text" 
          width="80%" 
          height={20} 
          sx={{ backgroundColor: '#E8F5F5', mb: 1 }}
        />
        <Skeleton 
          variant="text" 
          width="60%" 
          height={20} 
          sx={{ backgroundColor: '#E8F5F5', mb: 2 }}
        />
        <div className="flex gap-2 mt-4">
          <Skeleton 
            variant="rectangular" 
            width={100} 
            height={36} 
            sx={{ borderRadius: '4px', backgroundColor: '#E8F5F5' }} 
          />
          <Skeleton 
            variant="rectangular" 
            width={100} 
            height={36} 
            sx={{ borderRadius: '4px', backgroundColor: '#E8F5F5' }} 
          />
        </div>
      </div>
    </div>
  );
};