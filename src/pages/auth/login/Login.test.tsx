import { server } from '../../../test-utils/server.ts';
import { act, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../store/store.ts';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import Login from './Login.tsx';
import * as router from 'react-router';
import { BASE_URL } from '../../../common/constants/api.ts';
import { http, HttpResponse } from 'msw';

const mockedNavigation = jest.fn();
jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigation);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

async function renderLoginPage() {
  act(() => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Login />
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </Provider>
      </BrowserRouter>,
    );
  });
}

describe('Login', () => {
  test('Поля email и password - пустые', async () => {
    await renderLoginPage();
    await userEvent.click(screen.getByTestId('signin-btn'));
    expect(screen.queryByText('Login successfully!')).not.toBeInTheDocument();
    expect(screen.queryByText('Incorrect email or password!')).not.toBeInTheDocument();
  });

  test('Ввод корректного email при пустом поле password', async () => {
    await renderLoginPage();
    await userEvent.type(screen.getByTestId('email-input'), 'test-utils@test-utils.com');
    await userEvent.click(screen.getByTestId('signin-btn'));
    expect(screen.queryByText('Login successfully!')).not.toBeInTheDocument();
    expect(screen.queryByText('Incorrect email or password!')).not.toBeInTheDocument();
  });

  test('Ввод корректного password при пустом поле email', async () => {
    await renderLoginPage();
    await userEvent.type(screen.getByTestId('password-input'), 'Qwerty12');
    await userEvent.click(screen.getByTestId('signin-btn'));
    expect(screen.queryByText('Login successfully!')).not.toBeInTheDocument();
    expect(screen.queryByText('Incorrect email or password!')).not.toBeInTheDocument();
  });

  test('Ввод корректного email и корректного пароля', async () => {
    await renderLoginPage();
    await userEvent.type(screen.getByTestId('email-input'), 'test-utils@test-utils.com');
    await userEvent.type(screen.getByTestId('password-input'), 'Qwerty12');
    await userEvent.click(screen.getByTestId('signin-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Login successfully!')).toBeInTheDocument();
    });
  });

  test('Ввод корректного email и некорректного пароля', async () => {
    await renderLoginPage();
    await userEvent.type(screen.getByTestId('email-input'), 'test-utils@test-utils.com');
    await userEvent.type(screen.getByTestId('password-input'), 'fsdf');
    await userEvent.click(screen.getByTestId('signin-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Incorrect email or password!')).toBeInTheDocument();
    });
  });

  test('Ввод некорректного email и корректного пароля', async () => {
    await renderLoginPage();
    await userEvent.type(screen.getByTestId('email-input'), '@test-utils.com');
    await userEvent.type(screen.getByTestId('password-input'), 'Qwerty12');
    await userEvent.click(screen.getByTestId('signin-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Incorrect email or password!')).toBeInTheDocument();
    });
  });

  test('Ввод некорректного email и некорректного пароля', async () => {
    await renderLoginPage();
    await userEvent.type(screen.getByTestId('email-input'), '@test-utils.com');
    await userEvent.type(screen.getByTestId('password-input'), 'sysdf');
    await userEvent.click(screen.getByTestId('signin-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Incorrect email or password!')).toBeInTheDocument();
    });
  });

  test('Ввод корректных данных, но такого пользователя не найдено', async () => {
    server.use(
      http.post(`${BASE_URL}auth/signin`, () => {
        return HttpResponse.json(
          {
            message: 'Error!',
            data: {},
          },
          { status: 400 },
        );
      }),
    );
    await renderLoginPage();
    await userEvent.type(screen.getByTestId('email-input'), 'test-utils@test-utils.com');
    await userEvent.type(screen.getByTestId('password-input'), 'Qwerty12');
    await userEvent.click(screen.getByTestId('signin-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Error!')).toBeInTheDocument();
    });
  });

  test('Переход на страницу регистрации', async () => {
    const mockedNavigation = jest.fn();
    jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigation);
    await renderLoginPage();
    await userEvent.click(screen.getByTestId('signup-link'));
    expect(mockedNavigation).toHaveBeenCalled();
  });
});
