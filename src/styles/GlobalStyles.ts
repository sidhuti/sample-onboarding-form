import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=DM+Sans:wght@400;500;700&display=swap');

  :root {
    /* Color Palette - Refined earth tones */
    --color-bg: #faf9f7;
    --color-surface: #ffffff;
    --color-text-primary: #1a1614;
    --color-text-secondary: #6b6560;
    --color-border: #e5e1db;
    --color-border-focus: #9c8d7e;
    --color-accent: #2d2420;
    --color-error: #c84333;
    --color-success: #2d7a5c;
    --color-validating: #8f7e6c;

    /* Typography */
    --font-display: 'Crimson Pro', serif;
    --font-body: 'DM Sans', sans-serif;
    
    /* Spacing */
    --space-xs: 0.5rem;
    --space-sm: 0.75rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;
    
    /* Border radius */
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    
    /* Transitions */
    --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-smooth: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-body);
    background: var(--color-bg);
    color: var(--color-text-primary);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-lg);
  }

  #root {
    width: 100%;
    max-width: 100%;
  }
`;
