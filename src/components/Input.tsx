import React from 'react';
import styled from 'styled-components';
import { type InputProps } from '../types/types';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  position: relative;
`;

const InputLabel = styled.label`
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: 0.01em;
`;

const InputField = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.875rem 1rem;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1.5px solid ${props => props.$hasError ? 'var(--color-error)' : 'var(--color-border)'};
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  outline: none;

  &::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.6;
  }

  &:hover {
    border-color: ${props => props.$hasError ? 'var(--color-error)' : 'var(--color-border-focus)'};
  }

  &:focus {
    border-color: ${props => props.$hasError ? 'var(--color-error)' : 'var(--color-accent)'};
    box-shadow: ${props => props.$hasError 
      ? '0 0 0 3px rgba(200, 67, 51, 0.1)' 
      : '0 0 0 3px rgba(45, 36, 32, 0.08)'};
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.8125rem;
  color: var(--color-error);
  font-weight: 500;
  margin-top: -0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  animation: slideDown 200ms ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  maxLength,
  type = 'text',
}) => {
  return (
    <InputWrapper>
      <InputLabel htmlFor={name}>
        {label}
      </InputLabel>
      <InputField
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        $hasError={!!error}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <ErrorMessage id={`${name}-error`} role="alert">
          {error}
        </ErrorMessage>
      )}
    </InputWrapper>
  );
};
