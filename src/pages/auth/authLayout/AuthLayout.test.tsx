import * as router from 'react-router';
import { server } from '../../../test/server.ts';
import { act, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../store/store.ts';
import AuthLayout from './AuthLayout.tsx';
import { setCredentials } from '../../../store/auth/auth.slice.ts';

const mockedNavigation = jest.fn();
jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigation);
const useLocation = jest.spyOn(router, 'useLocation');

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

afterAll(() => server.close());

async function renderAuthLayout() {
  act(() => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <AuthLayout />
        </Provider>
      </BrowserRouter>,
    );
  });
}

describe('AuthLayout', () => {
  test('Переход на основную страницу при наличии JWT-токенов', async () => {
    useLocation.mockReturnValue({ search: '/' } as any);
    store.dispatch(
      setCredentials({
        access_token: 'fsgdgdfgdsg',
        refresh_token: 'dgdfgdfgdg',
      }),
    );
    await renderAuthLayout();
    expect(useLocation).toHaveBeenCalled();
  });

  test('Нахождение на текущей странице при отсутствии JWT-токенов', async () => {
    useLocation.mockReturnValue({ search: '/' } as any);
    store.dispatch(
      setCredentials({
        access_token: '',
        refresh_token: '',
      }),
    );
    await renderAuthLayout();
    expect(mockedNavigation).not.toHaveBeenCalled();
  });
});
