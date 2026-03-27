'use client';

import type { ReactNode } from 'react';
import { adminCardClass, adminCardTitleClass } from '@/lib/admin-form-styles';

type CardContainerProps = {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  /** Render title as h2 (default) or h3 for nested sections */
  titleAs?: 'h2' | 'h3';
  icon?: ReactNode;
};

export default function CardContainer({
  children,
  className = '',
  title,
  titleAs: TitleTag = 'h2',
  icon,
}: CardContainerProps) {
  const showHeading = title != null || icon != null;

  return (
    <div className={`${adminCardClass} ${className}`.trim()}>
      {showHeading ? (
        <TitleTag className={adminCardTitleClass}>
          {icon}
          {title}
        </TitleTag>
      ) : null}
      {children}
    </div>
  );
}
