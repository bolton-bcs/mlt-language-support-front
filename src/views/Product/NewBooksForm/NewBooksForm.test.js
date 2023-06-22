import React from 'react';
import ReactDOM from 'react-dom';
import NewBooksForm from './';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NewBooksForm />, div);
  ReactDOM.unmountComponentAtNode(div);
});
