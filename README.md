# Onboarding Form - Vite + React + TypeScript

A Production-ready onboarding form built with Vite, React, TypeScript, and Zod validation etc

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run start

# Run type check
npm run type-check

# Run tests
npm test
```


## Project Structure

```
src/
├── api/
│   └── queries.ts          # React Query hooks + Axios
├── components/
│   ├── Input.tsx           # Text Input Component
│   ├── PhoneInput.tsx      # Phone Input with country selector
│   └── OnboardingForm.tsx  # Main form
├── hooks/
│   └── useOnboardingForm.ts # Form logic
├── styles/
│   └── GlobalStyles.ts      # Global theme
├── types/
│   └── form.ts             # TypeScript types
└── utils/
    └── validation.ts        # Zod schemas
```

## Demo
[Onboarding Form.webm](https://github.com/user-attachments/assets/13b83d21-6089-472f-b939-d89d0762c259)





