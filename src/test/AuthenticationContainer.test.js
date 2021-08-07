import React from 'react'
import { unmountComponentAtNode } from "react-dom";
import AuthenticationContainer from '../containers/Authentication/AuthenticationContainer'
import { render } from "@testing-library/react";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('Test if the component is mounted successful', () => {
  const { getByText } = render(<AuthenticationContainer/>)
  const linkElement = getByText(/Acceso al sistema/i);
  expect(linkElement).toBeInTheDocument()
})