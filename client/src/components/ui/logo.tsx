import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo = ({ size = 'md', showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const iconSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg shadow-md">
        <FontAwesomeIcon 
          icon={faClipboardCheck} 
          className={`${iconSizes[size]} text-primary-foreground`}
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${sizeClasses[size]} font-bold text-primary leading-none`}>
            CBT Attend
          </h1>
          <span className="text-xs text-text-secondary font-medium tracking-wide">
            ATTENDANCE PLATFORM
          </span>
        </div>
      )}
    </div>
  );
};