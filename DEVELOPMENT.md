# Development Guide - React Best Practices

This guide outlines the development patterns and best practices implemented in this codebase.

## 🏗️ Component Development Guidelines

### 1. Component Structure Template

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// Always start with a descriptive comment
// Component description and purpose

const ComponentName = React.memo(function ComponentName({
  // Destructure props with defaults
  prop1,
  prop2 = 'defaultValue',
  className = '',
  children,
  ...rest
}) {
  // Hooks at the top
  const [state, setState] = useState(initialValue);
  const ref = useRef(null);
  
  // Event handlers (memoized if passed to children)
  const handleClick = useCallback((event) => {
    // Handle the event
  }, [dependencies]);

  // Early returns for conditional rendering
  if (someCondition) {
    return null;
  }

  return (
    <div 
      className={clsx(
        'base-classes',
        'responsive-classes',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

// PropTypes immediately after component
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ComponentName;
```

### 2. When to Use React.memo

✅ **Use React.memo when:**
- Component receives props that change infrequently
- Component is expensive to render
- Component is rendered many times with same props
- Parent component re-renders frequently

❌ **Don't use React.memo when:**
- Props change on every render
- Component is very simple/fast to render
- You haven't measured performance impact

### 3. Hook Usage Guidelines

```jsx
// ✅ Good: Hooks at the top level
function Component() {
  const [state, setState] = useState();
  const value = useMemo(() => computeValue(), [deps]);
  const callback = useCallback(() => {}, [deps]);
  
  // Component logic
}

// ❌ Bad: Conditional hooks
function Component({ condition }) {
  if (condition) {
    const [state, setState] = useState(); // Never do this
  }
}
```

## 🎨 Styling Guidelines

### 1. Tailwind CSS Patterns

```jsx
// ✅ Good: Logical grouping with clsx
className={clsx(
  // Base styles
  'flex items-center',
  // State styles
  'hover:bg-gray-100 focus:ring-2',
  // Responsive styles
  'text-sm md:text-base',
  // Conditional styles
  isActive && 'bg-blue-500 text-white',
  // Custom className
  className
)}

// ❌ Avoid: Long className strings
className="flex items-center hover:bg-gray-100 focus:ring-2 text-sm md:text-base bg-blue-500 text-white"
```

### 2. Responsive Design Patterns

```jsx
// ✅ Mobile-first approach
<div className="w-full md:w-1/2 lg:w-1/3">
  
// ✅ Consistent breakpoints
<div className="px-4 md:px-6 lg:px-8">

// ✅ Hide/show elements responsively
<div className="block md:hidden"> {/* Mobile only */}
<div className="hidden md:block"> {/* Desktop only */}
```

## ♿ Accessibility Patterns

### 1. Semantic HTML First

```jsx
// ✅ Good: Semantic elements
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

<main id="main-content">
  <h1>Page Title</h1>
  <section aria-labelledby="section-heading">
    <h2 id="section-heading">Section Title</h2>
  </section>
</main>

// ❌ Bad: Div soup
<div>
  <div>Home</div>
</div>
```

### 2. Interactive Elements

```jsx
// ✅ Good: Proper button with accessibility
<button
  aria-label="Close dialog"
  onClick={handleClose}
  className="focus:ring-2 focus:ring-blue-500"
>
  ✕
</button>

// ✅ Good: Link with proper attributes
<a 
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={`Open ${title} in new tab`}
>
  {title}
</a>
```

### 3. Focus Management

```jsx
// ✅ Good: Focus management in modals
useEffect(() => {
  if (isOpen) {
    // Focus first element
    firstElementRef.current?.focus();
  } else {
    // Return focus to trigger
    triggerRef.current?.focus();
  }
}, [isOpen]);
```

## 🧪 Testing Guidelines

### 1. Test Structure

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../utils/testUtils';
import Component from './Component';

describe('Component', () => {
  // Test props and basic rendering
  it('renders with required props', () => {
    render(<Component prop="value" />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  // Test user interactions
  it('handles user interactions', () => {
    const handleClick = vi.fn();
    render(<Component onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test accessibility
  it('is accessible', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label');
  });
});
```

### 2. Testing Philosophy

- **Test behavior, not implementation**
- **Use screen.getByRole() for better accessibility testing**
- **Mock external dependencies, not internal logic**
- **Test error states and edge cases**

## ⚡ Performance Guidelines

### 1. Memoization Strategy

```jsx
// ✅ Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyComputation(data);
}, [data]);

// ✅ Memoize callbacks passed to children
const handleSubmit = useCallback((formData) => {
  onSubmit(formData);
}, [onSubmit]);

// ❌ Don't memoize everything
const simpleValue = useMemo(() => prop1 + prop2, [prop1, prop2]); // Unnecessary
```

### 2. Code Splitting Patterns

```jsx
// ✅ Route-level splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

// ✅ Feature-level splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// ✅ Conditional splitting
const AdminPanel = lazy(() => 
  import('./AdminPanel').then(module => ({ default: module.AdminPanel }))
);
```

## 🗂️ File Organization

### 1. Feature-Based Structure

```
src/
├── features/
│   └── auth/
│       ├── components/
│       │   ├── LoginForm.jsx
│       │   └── SignupForm.jsx
│       ├── hooks/
│       │   └── useAuth.js
│       ├── utils/
│       │   └── validation.js
│       └── index.js
├── components/
│   ├── ui/           # Reusable UI components
│   └── common/       # Shared components
└── hooks/            # Global hooks
```

### 2. Import Organization

```jsx
// ✅ Good: Organized imports
// External libraries
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// Internal utilities
import { formatDate } from '../utils/date';

// UI components
import { Button, Card } from '../components/ui';

// Feature components
import { UserProfile } from '../features/user';
```

## 🔧 Development Tools

### 1. Debug Components

```jsx
// Use debug components in development
{import.meta.env.DEV && <BearDebug />}

// Performance monitoring
const MyComponent = () => {
  usePerformanceMonitor('MyComponent', import.meta.env.VITE_ENABLE_DEBUG_MODE);
  // Component logic
};
```

### 2. Environment Variables

```env
# Feature flags
VITE_ENABLE_DEBUG_MODE="true"
VITE_ENABLE_ANALYTICS="false"

# API endpoints
VITE_API_BASE_URL="http://localhost:3001"
```

## 🚀 Deployment Checklist

Before deploying:

- [ ] All tests pass (`pnpm test:run`)
- [ ] No lint errors (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Accessibility audit passes
- [ ] Performance audit passes
- [ ] Environment variables configured
- [ ] Error boundaries tested
- [ ] Loading states implemented

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Testing Library Docs](https://testing-library.com/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Performance Best Practices](https://react.dev/learn/render-and-commit)

---

Remember: These are guidelines, not absolute rules. Always consider the specific context and requirements of your feature when making decisions.
