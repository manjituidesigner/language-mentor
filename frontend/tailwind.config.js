/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#3f3bbd', primaryDark: '#1E40AF', accent: '#14B8A6',
        success: '#22C55E', warning: '#F59E0B', danger: '#EF4444',
        background: '#fcf8ff', surface: '#fcf8ff', border: '#e4e1ec',
        divider: '#F1F5F9', textPrimary: '#1b1b23', textSecondary: '#464554', textLight: '#94A3B8',
        'on-primary': '#ffffff', 'surface-variant': '#e4e1ec', 'surface-container-lowest': '#ffffff',
        'secondary-fixed-dim': '#adc6ff', 'secondary': '#0058bc', 'on-tertiary-fixed-variant': '#713700',
        'inverse-primary': '#c2c1ff', 'surface-container-low': '#f5f2fd', 'on-tertiary-fixed': '#301400',
        'inverse-on-surface': '#f3effa', 'primary-fixed-dim': '#c2c1ff', 'on-surface-variant': '#464554',
        'on-primary-container': '#e7e4ff', 'on-surface': '#1b1b23', 'inverse-surface': '#302f38',
        'primary-container': '#5856d6', 'error-container': '#ffdad6', 'on-secondary-fixed': '#001a41',
        'secondary-container': '#0070eb', 'outline-variant': '#c7c4d6', 'outline': '#777585',
        'on-error': '#ffffff', 'error': '#ba1a1a', 'primary-fixed': '#e2dfff', 'secondary-fixed': '#d8e2ff',
        'on-secondary': '#ffffff', 'tertiary-container': '#a25100', 'tertiary': '#7e3e00',
        'surface-container': '#f0ecf8', 'on-secondary-fixed-variant': '#004493', 'tertiary-fixed-dim': '#ffb785',
        'surface-tint': '#4f4ccd', 'on-background': '#1b1b23', 'surface-dim': '#dcd8e4',
        'surface-container-high': '#eae6f2', 'surface-bright': '#fcf8ff', 'on-tertiary': '#ffffff',
        'on-secondary-container': '#fefcff', 'tertiary-fixed': '#ffdcc6', 'surface-container-highest': '#e4e1ec',
        'on-error-container': '#93000a', 'on-primary-fixed': '#0c006a', 'on-tertiary-container': '#ffe1cf',
        'on-primary-fixed-variant': '#3631b4'
      },
      fontFamily: {
        sans: ['Inter_400Regular', 'sans-serif'],
        semibold: ['Inter_600SemiBold', 'sans-serif'],
        bold: ['Inter_700Bold', 'sans-serif'],
      },

      borderRadius: {
        xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '20px', '2xl': '24px', '3xl': '32px', full: '9999px',
      },
      boxShadow: {
        card: '0px 4px 6px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.1)',
        button: '0px 2px 4px rgba(37, 99, 235, 0.2)',
        floating: '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
        modal: '0px 20px 25px rgba(0, 0, 0, 0.15), 0px 10px 10px rgba(0, 0, 0, 0.05)',
        bottomSheet: '0px -4px 10px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
