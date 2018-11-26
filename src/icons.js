import React from 'react';
import classNames from 'classnames';

const TooltipIconHolder = ({ title, children }) => {
  if (!title) {
    return children;
  }

  return (
    <div className="tooltip" data-title={title}>
      {children}
    </div>
  );
};

export const SearchIcon = ({ onClick, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" onClick={onClick} width="30" height="30" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
       className={classNames('icon', className)} color="#384047">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export const ClockIcon = ({ title, className }) => (
  <TooltipIconHolder title={title}>
    <svg className={classNames('icon', 'icon-clock', className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#384047">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  </TooltipIconHolder>
);

export const PlayIcon = ({ className, title, onClick }) => (
  <TooltipIconHolder title={title}>
    <svg xmlns="http://www.w3.org/2000/svg" onClick={onClick} viewBox="0 0 24 24" fill="none"
         className={classNames('icon', 'icon-play', className)}
         stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         color="#384047">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  </TooltipIconHolder>
);

export const RemoveIcon = ({ className, onClick }) => (
  <svg className={classNames('icon', 'icon-x', className)} onClick={onClick} xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
       strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export const SettingsIcon = ({ className, title, onClick }) => (
  <TooltipIconHolder title={title}>
    <svg className={classNames('icon', 'icon-settings', className)} onClick={onClick} xmlns="http://www.w3.org/2000/svg"
         width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3"/>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  </TooltipIconHolder>
);

export const EditIcon = () => (
  <svg className="icon icon-edit" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
       strokeLinejoin="round" aria-hidden="true">
    <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"/>
  </svg>
);

export const SwitchGroupIcon = ({ className, title, onClick }) => (
  <TooltipIconHolder title={title}>
    <svg className={classNames('icon', 'icon-switch-group', className)} onClick={onClick}
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  </TooltipIconHolder>
);

export const ColorsIcon = ({ className, title, onClick }) => (
  <TooltipIconHolder title={title}>
    <svg className={classNames('icon', 'icon-colors', className)} onClick={onClick} xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="20" y1="7.6" x2="4" y2="16.6"/>
      <line x1="4" y1="7.6" x2="20" y2="16.6"/>
      <line x1="12" y1="12" x2="12" y2="2"/>
      <line x1="12" y1="22" x2="12" y2="12"/>
    </svg>
  </TooltipIconHolder>
);

export const ShuffleIcon = () => (
  <svg className="icon icon-shuffle" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
       strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 3 21 3 21 8"/>
    <line x1="4" y1="20" x2="21" y2="3"/>
    <polyline points="21 16 21 21 16 21"/>
    <line x1="15" y1="15" x2="21" y2="21"/>
    <line x1="4" y1="4" x2="9" y2="9"/>
  </svg>
);

export const HeadphonesIcon = ({ className, title, onClick }) => (
  <TooltipIconHolder title={title}>
    <svg className={classNames('icon', 'icon-headphones', className)} onClick={onClick}
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
      <path
        d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
    </svg>
  </TooltipIconHolder>
);

export const GithubIcon = ({ className, title }) => (
  <TooltipIconHolder title={title}>
    <svg className={classNames('icon', 'icon-github', className)} xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         strokeLinejoin="round" aria-hidden="true" data-reactid="596">
      <path
        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>
  </TooltipIconHolder>
);
