// src/utils/testUtils.js
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

// Custom render function that includes common providers
const CustomWrapper = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

CustomWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

const customRender = (ui, options) =>
  render(ui, { wrapper: CustomWrapper, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
