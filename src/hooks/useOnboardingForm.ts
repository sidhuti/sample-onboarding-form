import { useState, useCallback, useEffect } from 'react';
import { ZodError } from 'zod';
import type { OnboardingFormData, ValidationErrors } from '../types/types';
import { onboardingSchema } from '../utils/validation';
import { useValidateCorporationNumber } from '../api/queries';

export const useOnboardingForm = () => {
  const [formData, setFormData] = useState<OnboardingFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    corporationNumber: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<keyof OnboardingFormData>>(new Set());
  
  // Use React Query for corporation number validation
  const {
    data: corporationValidation,
    isLoading: isValidatingCorporation,
    error: corporationError,
  } = useValidateCorporationNumber(formData.corporationNumber);

  // Update errors when corporation validation completes
  useEffect(() => {
    if (formData.corporationNumber.length === 9 && touched.has('corporationNumber')) {
      if (corporationValidation && !corporationValidation.valid) {
        setErrors((prev) => ({
          ...prev,
          corporationNumber: corporationValidation.message || 'Invalid corporation number',
        }));
      } else if (corporationValidation && corporationValidation.valid) {
        setErrors((prev) => ({
          ...prev,
          corporationNumber: undefined,
        }));
      } else if (corporationError) {
        setErrors((prev) => ({
          ...prev,
          corporationNumber: corporationError.response.data.message || 'Invalid corporation number',
        }));
      }
    }
  }, [corporationValidation, corporationError, formData.corporationNumber, touched]);

  const handleChange = useCallback((field: keyof OnboardingFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  }, [errors]);

  const handleBlur = useCallback(async (field: keyof OnboardingFormData) => {
    setTouched((prev) => new Set(prev).add(field));

    try {
      const fieldValue = formData[field];
      onboardingSchema.shape[field].parse(fieldValue);
      
      // For corporation number, React Query handles the async validation
      // For other fields, clear error if validation passes
      if (field !== 'corporationNumber') {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldError = error.errors[0];
        setErrors((prev) => ({
          ...prev,
          [field]: fieldError.message,
        }));
      }
    }
  }, [formData]);

  const validateForm = useCallback(async (): Promise<boolean> => {
    try {
      // Validate all fields with Zod
      onboardingSchema.parse(formData);
      
      // Check corporation number validation status
      if (formData.corporationNumber.length === 9) {
        if (!corporationValidation || !corporationValidation.valid) {
          setErrors({
            corporationNumber: corporationValidation?.message || 'Invalid corporation number',
          });
          return false;
        }
      }
      
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors: ValidationErrors = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof OnboardingFormData;
          validationErrors[field] = err.message;
        });
        setErrors(validationErrors);
      }
      return false;
    }
  }, [formData, corporationValidation]);

  const resetForm = useCallback(() => {
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      corporationNumber: '',
    });
    setErrors({});
    setTouched(new Set());
  }, []);

  return {
    formData,
    errors,
    touched,
    isValidatingCorporation,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  };
};