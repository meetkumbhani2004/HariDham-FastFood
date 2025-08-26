import { render, screen } from '@testing-library/react';
import { test, expect, describe } from 'vitest';
import "@testing-library/jest-dom";
import Greeting from './Greeting';
import userEvent from '@testing-library/user-event';


test('renders greeting message', () => {
  render(<Greeting />);
  expect(screen.getByText(/hello word/i)).toBeInTheDocument();
});

test('render "good to see you" if the button was NOT clicked', () => {
  render(<Greeting/>);

    expect(screen.getByText(/good to see you/i)).toBeInTheDocument();
  // const outputElement = screen.getByText('//i',{ exact: false });
  // expect(outputElement.toBeInTheDocument());
});

test('renders "Changed!" if the button was clicked', async () => {
  render(<Greeting />);

  const buttonElement = screen.getByRole('button');
  await userEvent.click(buttonElement);

  const outputElement = screen.getByText('Changed!',{exact: false});
  expect(outputElement).toBeInTheDocument();
});

test('does not render "good to see you" if the button was NOT clicked', async() => {
  render(<Greeting/>);

  const buttonElement = screen.getByRole('button');
  await userEvent.click(buttonElement);

    const outputElement = screen.queryByText('good to see you', {exact: false});
   expect(outputElement).toBeNull();
});