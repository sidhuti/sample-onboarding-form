import React from 'react';
import styled from 'styled-components';
import PhoneInputWithCountry from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { type PhoneInputProps } from '../types/types';



const PhoneInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  position: relative;
`;

const PhoneLabel = styled.label`
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: 0.01em;
`;

const StyledPhoneInputContainer = styled.div<{ $hasError?: boolean }>`
  .PhoneInput {
    display: flex;
    align-items: center;
  }

  .PhoneInputInput {
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
  }

  .PhoneInputCountry {
    margin-right: 0.5rem;
    padding: 0.875rem 0.75rem;
    background: var(--color-surface);
    border: 1.5px solid ${props => props.$hasError ? 'var(--color-error)' : 'var(--color-border)'};
    border-radius: var(--radius-md);
    transition: all var(--transition-base);

    &:hover {
      border-color: ${props => props.$hasError ? 'var(--color-error)' : 'var(--color-border-focus)'};
    }
  }

  .PhoneInputCountryIcon {
    width: 1.5rem;
    height: 1.5rem;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  }

  .PhoneInputCountrySelectArrow {
    width: 0.5rem;
    height: 0.5rem;
    margin-left: 0.5rem;
    opacity: 0.6;
    color: var(--color-text-primary);
  }

  .PhoneInputCountrySelect {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
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

export const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
}) => {
  return (
    <PhoneInputWrapper>
      <PhoneLabel htmlFor={name}>
        {label}
      </PhoneLabel>
      <StyledPhoneInputContainer $hasError={!!error}>
        <PhoneInputWithCountry
          defaultCountry='CA'
          international
          countries={['CA']}
          value={value}
          onChange={(value) => onChange(value || '')}
          onBlur={onBlur}
          id={name}
          name={name}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
          addInternationalOption={false}
        />
      </StyledPhoneInputContainer>
      {error && (
        <ErrorMessage id={`${name}-error`} role="alert">
          {error}
        </ErrorMessage>
      )}
    </PhoneInputWrapper>
  );
};