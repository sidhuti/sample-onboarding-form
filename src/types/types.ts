export interface OnboardingFormData {
  firstName: string;
  lastName: string;
  phone: string;
  corporationNumber: string;
}

export interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  corporationNumber?: string;
}

export interface CorporationValidationResponse {
  corporationNumber?: string;
  valid: boolean;
  message?: string;
}

export interface ProfileSubmissionResponse {
  message?: string;
}


export interface ApiError {
  status: number,
  code: string,
  message: string,
  name: string
  response: {
    data: {
      message: string
    }
  }
}


export interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  placeholder?: string;
  maxLength?: number;
  type?: string;
}

export type  PhoneInputProps = Omit<InputProps, 'maxLength'| 'type'>