import React from "react";

export const InfoIcon = ({ variant = 'default', ...props }: React.SVGProps<SVGSVGElement> & { variant?: 'default' | 'active' }) => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {variant === 'default' ? (
        <g>
          <circle cx="16" cy="16" r="11" fill="#0D5EA6"/>
          <path d="M16 10.5C16.8284 10.5 17.5 11.1716 17.5 12C17.5 12.8284 16.8284 13.5 16 13.5C15.1716 13.5 14.5 12.8284 14.5 12C14.5 11.1716 15.1716 10.5 16 10.5Z" fill="white"/>
          <path d="M16 21.5C15.7239 21.5 15.5 21.2761 15.5 21V16C15.5 15.7239 15.7239 15.5 16 15.5C16.2761 15.5 16.5 15.7239 16.5 16V21C16.5 21.2761 16.2761 21.5 16 21.5Z" fill="white"/>
          <rect x="15" y="15" width="2" height="6" rx="1" fill="white"/>
        </g>
      ) : (
        <g>
          <circle cx="16" cy="16" r="11" fill="#0EA5E9"/>
          <path d="M16 10.5C16.8284 10.5 17.5 11.1716 17.5 12C17.5 12.8284 16.8284 13.5 16 13.5C15.1716 13.5 14.5 12.8284 14.5 12C14.5 11.1716 15.1716 10.5 16 10.5Z" fill="white"/>
          <path d="M16 21.5C15.7239 21.5 15.5 21.2761 15.5 21V16C15.5 15.7239 15.7239 15.5 16 15.5C16.2761 15.5 16.5 15.7239 16.5 16V21C16.5 21.2761 16.2761 21.5 16 21.5Z" fill="white"/>
          <rect x="15" y="15" width="2" height="6" rx="1" fill="white"/>
        </g>
      )}
    </svg>
  );
};
