import { render } from '@testing-library/react';
import { Circle } from './circle';
import { ElementStates } from '../../../types/element-states';


describe('Circle component', () => {

  const MockComponent = () => <div>Mock Component</div>

  it('renders circle with text', () => {
    const { container } = render(<Circle text="Click" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders circle without text', () => {
    const { container } = render(<Circle />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders circle with head', () => {
    const { container } = render(<Circle head={'head'} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders circle with head component', () => {
    const { container } = render(<Circle head={<MockComponent />} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders circle with tail', () => {
    const { container } = render(<Circle tail={'tail'} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders circle with tail component', () => {
    const { container } = render(<Circle tail={<MockComponent />} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders circle with index', () => {
    const { container } = render(<Circle index={1} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders circle with isSmall props', () => {
    const { container } = render(<Circle isSmall={true} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders circle with Default state', () => {
    const { container } = render(<Circle state={ElementStates.Default} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders circle with Changing state', () => {
    const { container } = render(<Circle state={ElementStates.Changing} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders circle with Modified state', () => {
    const { container } = render(<Circle state={ElementStates.Modified} />);
    expect(container.firstChild).toMatchSnapshot();
  });

});

