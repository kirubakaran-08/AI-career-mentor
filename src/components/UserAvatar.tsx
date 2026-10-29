import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { getInitials } from '../lib/imageUtils';

interface UserAvatarProps {
  avatarUrl?: string;
  name?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showInitialsFallback?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
  '2xl': 'w-24 h-24 text-2xl'
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatarUrl,
  name = 'User',
  className = '',
  size = 'md',
  showInitialsFallback = true
}) => {
  const [imgError, setImgError] = useState(false);

  // Reset error state whenever avatarUrl changes
  useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  const hasPhoto = Boolean(avatarUrl && avatarUrl.trim() && !imgError);

  if (hasPhoto) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        onError={() => setImgError(true)}
        className={`${sizeClasses[size]} rounded-2xl object-cover shadow-sm ${className}`}
      />
    );
  }

  // Default avatar fallback with gradient and initials/icon
  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm select-none shrink-0 ${className}`}
      title={name}
      aria-label={`${name}'s default avatar`}
    >
      {showInitialsFallback && name ? (
        <span className="tracking-wider uppercase font-['Syne'] font-extrabold">{getInitials(name)}</span>
      ) : (
        <User className="w-1/2 h-1/2 text-white/90" />
      )}
    </div>
  );
};
