import React from 'react';

export interface SpinnerProps {
  /**
   * The size of the spinner
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * The visual style of the spinner
   * @default 'default'
   */
  variant?: 'default' | 'gradient' | 'dots' | 'pulse';
  /**
   * Additional classes to add to the wrapper
   */
  className?: string;
  /**
   * Whether to display the spinner in a fullscreen overlay
   * @default false
   */
  fullScreen?: boolean;
  /**
   * Optional text to display below the spinner
   */
  text?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  variant = 'default',
  className = '',
  fullScreen = false,
  text
}) => {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const currentSize = sizeMap[size];

  const renderSpinnerVariant = () => {
    switch (variant) {
      case 'gradient':
        return (
          <div className={`relative flex justify-center items-center ${currentSize}`}>
             <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 animate-spin" style={{ padding: size === 'sm' ? '2px' : '4px' }}>
                <div className="w-full h-full bg-white dark:bg-gray-950 rounded-full"></div>
             </div>
          </div>
        );
      case 'dots':
        const dotSize = {
          sm: 'w-1.5 h-1.5',
          md: 'w-3 h-3',
          lg: 'w-4 h-4',
          xl: 'w-5 h-5'
        }[size];
        return (
          <div className="flex space-x-2 justify-center items-center">
            <div className={`${dotSize} bg-blue-600 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`${dotSize} bg-purple-600 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`${dotSize} bg-pink-600 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
        );
      case 'pulse':
        return (
          <div className={`relative flex justify-center items-center ${currentSize}`}>
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full bg-purple-500 opacity-40 animate-pulse"></div>
            <div className="relative rounded-full bg-gradient-to-r from-blue-600 to-purple-600 w-1/2 h-1/2 shadow-lg"></div>
          </div>
        );
      case 'default':
      default:
        const borderWidth = {
          sm: 'border-2',
          md: 'border-4',
          lg: 'border-4',
          xl: 'border-[6px]'
        }[size];
        
        return (
          <div className={`relative flex justify-center items-center ${currentSize}`}>
            <div className={`absolute inset-0 rounded-full ${borderWidth} border-gray-200 dark:border-gray-800`}></div>
            <div className={`absolute inset-0 rounded-full ${borderWidth} border-blue-600 border-t-transparent animate-spin`}></div>
          </div>
        );
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`} role="status">
      {renderSpinnerVariant()}
      {text && (
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 animate-pulse">
          {text}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default Spinner;
