import React from 'react';
import styled from 'styled-components';
import { Input } from './Input';
import { PhoneInput } from './PhoneInput';
import { useOnboardingForm } from '../hooks/useOnboardingForm';
import { useSubmitProfile } from '../api/queries';

const FormContainer = styled.div`
  width: 100%;
  max-width: 740px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const StepIndicator = styled.div`
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-align: center;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const FormCard = styled.div`
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--color-border);
  animation: fadeInUp 500ms cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 640px) {
    padding: var(--space-xl);
  }
`;

const FormTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: var(--space-xl);
  letter-spacing: -0.02em;

  @media (max-width: 640px) {
    font-size: 1.75rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ValidatingIndicator = styled.span`
  font-size: 0.8125rem;
  color: var(--color-validating);
  font-weight: 500;
  margin-top: -0.25rem;
  font-style: italic;
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 1rem 1.5rem;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background: var(--color-accent);
  border: none;
  border-radius: var(--radius-md);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all var(--transition-smooth);
  margin-top: var(--space-md);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-100%);
    transition: transform var(--transition-smooth);
  }

  &:hover::before {
    transform: ${props => props.disabled ? 'translateX(-100%)' : 'translateX(100%)'};
  }

  &:hover {
    background: ${props => props.disabled ? 'var(--color-text-secondary)' : '#1a1614'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-1px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 4px 12px rgba(45, 36, 32, 0.3)'};
  }

  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(0)'};
  }

  ${props => props.disabled && `
    background: var(--color-text-secondary);
  `}
`;

const ArrowIcon = styled.svg`
  width: 1.25rem;
  height: 1.25rem;
  transition: transform var(--transition-base);

  ${SubmitButton}:hover & {
    transform: translateX(4px);
  }
`;

const SubmitError = styled.div`
  padding: 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: center;
  animation: slideDown var(--transition-smooth);
  background: rgba(200, 67, 51, 0.1);
  color: var(--color-error);
  border: 1px solid rgba(200, 67, 51, 0.2);
`;

const SubmitSuccess = styled.div`
  padding: 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: center;
  animation: slideDown var(--transition-smooth);
  background: rgba(45, 122, 92, 0.1);
  color: var(--color-success);
  border: 1px solid rgba(45, 122, 92, 0.2);
`;

export const OnboardingForm: React.FC = () => {
  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    isValidatingCorporation,
  } = useOnboardingForm();

  // Use React Query mutation for form submission
  const { mutate: submitProfile, isPending: isSubmitting, error: submitError, isSuccess } = useSubmitProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm();
    
    if (!isValid) {
      return;
    }

    submitProfile(formData, {
      onSuccess: () => {
        resetForm();
      },
    });
  };

  return (
    <FormContainer>
      <StepIndicator>Step 1 of 5</StepIndicator>
      
      <FormCard>
        <FormTitle>Onboarding Form</FormTitle>
        
        <Form onSubmit={handleSubmit} noValidate>
          <FormRow>
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={(value) => handleChange('firstName', value)}
              onBlur={() => handleBlur('firstName')}
              error={errors.firstName}
              maxLength={50}
            />
            
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={(value) => handleChange('lastName', value)}
              onBlur={() => handleBlur('lastName')}
              error={errors.lastName}
              maxLength={50}
            />
          </FormRow>

          <PhoneInput
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={(value) => handleChange('phone', value)}
            onBlur={() => handleBlur('phone')}
            error={errors.phone}
            placeholder="306 277 6103"
          />

          <div>
            <Input
              label="Corporation Number"
              name="corporationNumber"
              value={formData.corporationNumber}
              onChange={(value) => handleChange('corporationNumber', value)}
              onBlur={() => handleBlur('corporationNumber')}
              error={errors.corporationNumber}
              maxLength={9}
            />
            {isValidatingCorporation && (
              <ValidatingIndicator>Validating...</ValidatingIndicator>
            )}
          </div>

          {submitError && (
            <SubmitError role="alert">
              {submitError.message || 'Submission failed. Please try again.'}
            </SubmitError>
          )}

          {isSuccess && (
            <SubmitSuccess role="alert">
              Form submitted successfully!
            </SubmitSuccess>
          )}

          <SubmitButton
            type="submit"
            disabled={isSubmitting || isValidatingCorporation}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
            <ArrowIcon viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </ArrowIcon>
          </SubmitButton>
        </Form>
      </FormCard>
    </FormContainer>
  );
};