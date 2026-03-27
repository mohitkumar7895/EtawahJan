'use client';

import type { InputHTMLAttributes, ReactNode } from 'react';
import { adminInputClass, adminLabelClass } from '@/lib/admin-form-styles';

export type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
  hint?: ReactNode;
  containerClassName?: string;
};

export default function InputField({
  label,
  hint,
  id,
  name,
  className = '',
  containerClassName = '',
  ...rest
}: InputFieldProps) {
  const inputId = id ?? (typeof name === 'string' ? name : undefined);

  return (
    <div className={containerClassName}>
      <label htmlFor={inputId} className={adminLabelClass}>
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        className={`${adminInputClass} ${className}`.trim()}
        {...rest}
      />
      {hint ? (
        <p className="mt-1 text-xs text-gray-500 dark:text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}
