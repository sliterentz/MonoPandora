import { render } from '@testing-library/react';

import ThemeUi from './theme-ui';

describe('ThemeUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ThemeUi />);
    expect(baseElement).toBeTruthy();
  });
});
