import { act, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../store/store.ts';
import userEvent from '@testing-library/user-event';
import { Menu } from './Menu.tsx';
import * as router from 'react-router';
import { setMainInfo } from '../../../store/workouts/workouts.slice.ts';
import { setCredentials } from '../../../store/auth/auth.slice.ts';

const mockedNavigation = jest.fn();
jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigation);

async function renderMenu() {
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
          <Menu />
        </Provider>
      </BrowserRouter>,
    );
  });
}

describe('Menu', () => {
  test('Переход на страницу профиля', async () => {
    await renderMenu();
    await userEvent.click(screen.getByTestId('profile-a'));
    expect(store.getState().workouts.name).toContain('');
  });

  test('Переход на страницу с калькулятором пульсовых зон', async () => {
    await renderMenu();
    await userEvent.click(screen.getByTestId('hr-a'));
    expect(store.getState().workouts.name).toContain('');
  });

  test('Выход из аккаунта', async () => {
    store.dispatch(
      setCredentials({
        access_token: 'fsgdgdfgdsg',
        refresh_token: 'dgdfgdfgdg',
      }),
    );
    await renderMenu();
    await userEvent.click(screen.getByTestId('signout-btn'));
    expect(store.getState().workouts.name).toContain('');
    expect(store.getState().auth.access_token).toBeNull();
    expect(store.getState().auth.refresh_token).toBeNull();
    expect(mockedNavigation).toHaveBeenCalledWith('/signin');
  });
});
