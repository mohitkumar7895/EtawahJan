'use client';

import type { ReactNode, TextareaHTMLAttributes } from 'react';
import { adminLabelClass, adminTextareaClass } from '@/lib/admin-form-styles';

export type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: ReactNode;
  hint?: ReactNode;
  containerClassName?: string;
};

export default function TextAreaField({
  label,
  hint,
  id,
  name,
  className = '',
  containerClassName = '',
  rows = 3,
  ...rest
}: TextAreaFieldProps) {
  const tid = id ?? (typeof name === 'string' ? name : undefined);

  return (
    <div className={containerClassName}>
      <label htmlFor={tid} className={adminLabelClass}>
        {label}
      </label>
      <textarea
        id={tid}
        name={name}
        rows={rows}
        className={`${adminTextareaClass} ${className}`.trim()}
        {...rest}
      />
      {hint ? (
        <p className="mt-1 text-xs text-gray-500 dark:text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}
