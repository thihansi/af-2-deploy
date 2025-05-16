// Add polyfill for TextEncoder/TextDecoder before ANY imports
const util = require('util');
global.TextEncoder = util.TextEncoder;
global.TextDecoder = util.TextDecoder;

import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

// Custom render that includes providers
export function renderWithProviders(ui, options = {}) {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>,
    options
  );
}

export * from "@testing-library/react";
