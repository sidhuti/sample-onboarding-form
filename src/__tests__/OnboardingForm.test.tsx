import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnboardingForm } from '../components/OnboardingForm';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Helper function to render with QueryClient
const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('OnboardingForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('01 - renders all form fields and text correctly', () => {
    renderWithQueryClient(<OnboardingForm />);
    
    // form-fields label check
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /phone number/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/corporation number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

    // step-indicator display check
    expect(screen.getByText(/step 1 of 5/i)).toBeInTheDocument();
  });

  it('02 - shows validation error for empty first name on blur', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<OnboardingForm />);
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.click(firstNameInput);
    await user.tab();
    
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });

  it('03 - enforces character limit via maxLength attribute', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<OnboardingForm />);
    
    const longName = 'a'.repeat(51);
    const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;
    
    await user.type(firstNameInput, longName);
    
    // maxLength attribute limits to 50 characters
    expect(firstNameInput.value).toHaveLength(50);
  });

  it('04 - validates phone number format', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<OnboardingForm />);
    
    // PhoneInput has the input with class PhoneInputInput
    const phoneInput = screen.getByRole('textbox', { name: /phone number/i });
    
    // Type invalid phone number
    await user.type(phoneInput, '1234567890');
    await user.tab();
    
    await waitFor(() => {
      expect(screen.getByText(/invalid canadian phone number/i)).toBeInTheDocument();
    });
  });

  it('05 - validates corporation number length', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<OnboardingForm />);
    
    const corpInput = screen.getByLabelText(/corporation number/i);
    
    await user.type(corpInput, '12345');
    await user.tab();
    
    await waitFor(() => {
      expect(screen.getByText(/must be exactly 9 characters/i)).toBeInTheDocument();
    });
  });

  it('06 - calls API to validate corporation number on blur', async () => {
    const user = userEvent.setup();
    mockedAxios.get.mockResolvedValue({
      data: { valid: true, corporationNumber: '123456789' },
    });
    
    renderWithQueryClient(<OnboardingForm />);
    
    const corpInput = screen.getByLabelText(/corporation number/i);
    
    await user.type(corpInput, '123456789');
    await user.tab();
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://fe-hometask-api.qa.vault.tryvault.com/corporation-number/123456789'
      );
    });
  });

  it('07 - shows validating and subsequent error for invalid corporation number from API', async () => {
    const user = userEvent.setup();

    // Delay the rejection
    mockedAxios.get.mockImplementation(() => 
      new Promise((_resolve, reject) => 
        setTimeout(() => reject({ 
          data: { valid: false, message: 'Error validating corporation number'} 
        }), 100)
      )
    );
    
    renderWithQueryClient(<OnboardingForm />);
    
    const corpInput = screen.getByLabelText(/corporation number/i);
    
    await user.type(corpInput, '999999999');
    await user.tab();

    // corporation number is being validated with the API
    expect(screen.getByText(/validating/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/validating/i)).not.toBeInTheDocument();
    });
    
    // check if error message shows up
    await waitFor(() => {
      expect(screen.getByText(/Error validating corporation number/i)).toBeInTheDocument();
    });
  });



  it('08 - shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<OnboardingForm />);
    
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid canadian phone number/i)).toBeInTheDocument();
      expect(screen.getByText(/corporation number must be exactly 9 characters/i)).toBeInTheDocument();
    });
  });

  it('09 - shows API error message on submission failure', async () => {
    const user = userEvent.setup();
    
    mockedAxios.get.mockResolvedValue({
      data: { valid: true, corporationNumber: '123456789' },
    });
    
    // Mock axios error properly
    const axiosError = new Error('Invalid phone number');
    (axiosError as any).response = {
      data: { message: 'Invalid phone number' }
    };
    mockedAxios.post.mockRejectedValue(axiosError);
    
    renderWithQueryClient(<OnboardingForm />);
    
    // Fill in all fields
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByRole('textbox', { name: /phone number/i }), '+13062776103');
    
    const corpInput = screen.getByLabelText(/corporation number/i);
    await user.type(corpInput, '123456789');
    await user.tab();
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });
    
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid phone number/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('10 - submits form with valid data', async () => {
    const user = userEvent.setup();
    
    mockedAxios.get.mockResolvedValue({
      data: { valid: true, corporationNumber: '123456789' },
    });
    
    mockedAxios.post.mockResolvedValue({ data: {} });
    
    renderWithQueryClient(<OnboardingForm />);
    
    // Fill in all fields
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByRole('textbox', { name: /phone number/i }), '+13062776103');
    
    const corpInput = screen.getByLabelText(/corporation number/i);
    await user.type(corpInput, '123456789');
    await user.tab();
    
    // Wait for corporation validation
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://fe-hometask-api.qa.vault.tryvault.com/profile-details',
        {
          firstName: 'John',
          lastName: 'Doe',
          phone: '+13062776103',
          corporationNumber: '123456789',
        }
      );
    });
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/form submitted successfully/i)).toBeInTheDocument();
    });
  });
});
