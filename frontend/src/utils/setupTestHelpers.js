const { render, screen, fireEvent } = require('@testing-library/react');
const { act } = require('react-dom/test-utils');

const renderWithAct = (ui, options) => {
  let result;
  act(() => {
    result = render(ui, options);
  });
  return result;
};

const mockApiCall = (response) => {
  jest.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(response),
    })
  );
};

module.exports = {
  renderWithAct,
  mockApiCall,
};