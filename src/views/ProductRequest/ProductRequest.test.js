import React from 'react';
import ReactDOM from 'react-dom';
import PublicUsers from './';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PublicUsers />, div);
  ReactDOM.unmountComponentAtNode(div);
});
