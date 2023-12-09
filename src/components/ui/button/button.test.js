import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button component', () => {
  it('renders button with text', () => {
    const { container } = render(<Button text="Click" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders button without text', () => {
    const { container } = render(<Button />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders disabled button', () => {
    const { container } = render(<Button disabled />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders loader when isLoader prop is true', () => {
    const { container } = render(<Button isLoader />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('calls onClick callback when button is clicked', () => {
    const onClickMock = jest.fn();
    const { container } = render(<Button text="Click" onClick={onClickMock} />);
    expect(container.firstChild).toMatchSnapshot();

    const button = screen.getByRole('button', { name: /click/i });
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
