import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { CorporationValidationResponse, OnboardingFormData, ApiError } from '../types/types';

const API_BASE_URL = 'https://fe-hometask-api.qa.vault.tryvault.com';

/**
 * Validate corporation number via GET request
 */
const fetchCorporationValidation = async (
  corporationNumber: string
): Promise<CorporationValidationResponse> => {
  const { data } = await axios.get<CorporationValidationResponse>(
    `${API_BASE_URL}/corporation-number/${corporationNumber}`
  );
  return data;
};

/**
 * Submit profile details via POST request
 */
const submitProfile = async (
  formData: OnboardingFormData
): Promise<void> => {
  await axios.post(`${API_BASE_URL}/profile-details`, formData);
};


/**
 * Hook to validate corporation number using React Query
 */
export const useValidateCorporationNumber = (corporationNumber: string) => {
  return useQuery<CorporationValidationResponse, ApiError>({
    queryKey: ['corporationValidation', corporationNumber],
    queryFn: () => fetchCorporationValidation(corporationNumber),
    enabled: corporationNumber.length === 9, // Only run when length is 9
    retry: false, 
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to submit profile details using React Query mutation
 */
export const useSubmitProfile = () => {
  return useMutation<void, ApiError, OnboardingFormData>({
    mutationFn: submitProfile,
    mutationKey: ['submitProfile'],
  });
};