import React from 'react';
import ReactDOM from 'react-dom';
import NewProductForm from './';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NewProductForm />, div);
  ReactDOM.unmountComponentAtNode(div);
});
