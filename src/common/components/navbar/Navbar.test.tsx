import { act, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../store/store.ts';
import userEvent from '@testing-library/user-event';
import { Navbar } from './Navbar.tsx';
import * as router from 'react-router';
import { setMainInfo } from '../../../store/workouts/workouts.slice.ts';
import '@testing-library/jest-dom';

const mockedNavigation = jest.fn();
jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigation);

async function renderNavbar() {
  store.dispatch(
    setMainInfo({
      uuid: '',
      name: 'dfgdfgdf',
      date: '',
      type: '',
      comment: '',
    }),
  );
  act(() => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Navbar />
        </Provider>
      </BrowserRouter>,
    );
  });
}

describe('Navbar', () => {
  test('Переход на страницу с тренировками', async () => {
    await renderNavbar();
    await userEvent.click(screen.getByTestId('link-a'));
    expect(store.getState().workouts.name).toContain('');
  });

  test('Открытие Menu', async () => {
    await renderNavbar();
    await userEvent.click(screen.getByTestId('menu-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('menu-btn')).toHaveClass('menu-btn menu-btn-open');
    });
  });
});
