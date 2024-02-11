import { server } from '../../../test/server.ts';
import store from '../../../store/store.ts';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import Registration from './Registration.tsx';
import * as router from 'react-router';
import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../../../common/constants/api.ts';
import { BrowserRouter } from 'react-router-dom';

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

async function renderRegistrationPage() {
  act(() => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Registration />
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

describe('Registration - General', () => {
  test('Ввод корректного email и пароля', async () => {
    await renderRegistrationPage();
    await userEvent.type(screen.getByTestId('email-input'), 'test@test.com');
    await userEvent.type(screen.getByTestId('password-input'), 'Qwerty12');
    await userEvent.click(screen.getByTestId('signup-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Registration successfully! Activation link sent to your email!')).toBeInTheDocument();
    });
  });

  test('Ввод email, на который уже зарегистрирован аккаунт', async () => {
    server.use(
      http.post(`${BASE_URL}auth/signup`, () => {
        return HttpResponse.json(
          {
            message: 'Error!',
            data: {},
          },
          { status: 400 },
        );
      }),
    );
    await renderRegistrationPage();
    await userEvent.type(screen.getByTestId('email-input'), 'test@test.com');
    await userEvent.type(screen.getByTestId('password-input'), 'Qwerty12');
    await userEvent.click(screen.getByTestId('signup-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Error!')).toBeInTheDocument();
    });
  });

  test('Повторная отправка ссылки для активации на указанный email', async () => {
    await renderRegistrationPage();
    await userEvent.click(screen.getByTestId('resend-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Send again')).toBeInTheDocument();
    });
  });

  test('Переход на страницу аутентификации', async () => {
    const mockedNavigation = jest.fn();
    jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigation);
    await renderRegistrationPage();
    await userEvent.click(screen.getByTestId('signin-link'));
    expect(mockedNavigation).toHaveBeenCalled();
  });
});

describe('Registration - Email', () => {
  test('Корректное значение Email', async () => {
    await renderRegistrationPage();
    await userEvent.type(screen.getByTestId('email-input'), 'test@test.com');
    await userEvent.click(screen.getByTestId('password-input'));
    expect(screen.getByTestId('email-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Email - пустое', async () => {
    await renderRegistrationPage();
    await userEvent.click(screen.getByTestId('email-input'));
    await userEvent.click(screen.getByTestId('password-input'));
    expect(screen.getByTestId('email-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Email содержит буквы русского алфавита', async () => {
    await renderRegistrationPage();
    await userEvent.type(screen.getByTestId('email-input'), 'аваыв@test.com');
    await userEvent.click(screen.getByTestId('password-input'));
    expect(screen.getByTestId('email-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Email не содержит "@"', async () => {
    await renderRegistrationPage();
    await userEvent.type(screen.getByTestId('email-input'), 'testtest.com');
    await userEvent.click(screen.getByTestId('password-input'));
    expect(screen.getByTestId('email-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Email не содержит имени почтового ящика', async () => {
    await renderRegistrationPage();
    await userEvent.type(screen.getByTestId('email-input'), '@test.com');
    await userEvent.click(screen.getByTestId('password-input'));
    expect(screen.getByTestId('email-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Email не содержит доменного имени', async () => {
    await renderRegistrationPage();
    await userEvent.type(screen.getByTestId('email-input'), 'test@');
    await userEvent.click(screen.getByTestId('password-input'));
    expect(screen.getByTestId('email-error')).not.toBeEmptyDOMElement();
  });
});

describe('Registration - Password', () => {
  test('Минимальная длина поля Password', async () => {
    await renderRegistrationPage();
    await userEvent.type(screen.getByTestId('password-input'), 'Qwerty12');
    expect((screen.getByTestId('password-input') as HTMLInputElement).value).toHaveLength(8);
    await userEvent.click(screen.getByTestId('email-input'));
    expect(screen.getByTestId('password-error')).toBeEmptyDOMElement();
  });

  test('Длина поля Password меньше минимальной', async () => {
    await renderRegistrationPage();
    await userEvent.type(screen.getByTestId('password-input'), 'Qwerty1');
    expect((screen.getByTestId('password-input') as HTMLInputElement).value).toHaveLength(7);
    await userEvent.click(screen.getByTestId('email-input'));
    expect(screen.getByTestId('password-error')).not.toBeEmptyDOMElement();
  });

  test('Максимальная длина поля Password', async () => {
    await renderRegistrationPage();
    await userEvent.type(screen.getByTestId('password-input'), 'Qwertyuiopasdfghjklzxcvbngmhdk12');
    expect((screen.getByTestId('password-input') as HTMLInputElement).value).toHaveLength(32);
    await userEvent.click(screen.getByTestId('email-input'));
    expect(screen.getByTestId('password-error')).toBeEmptyDOMElement();
  });

  test('Длина поля Password больше максимальной', async () => {
    await renderRegistrationPage();
    await userEvent.type(screen.getByTestId('password-input'), 'Qwertyuiopasdfghjklzxcvbngmhdk123');
    expect((screen.getByTestId('password-input') as HTMLInputElement).value).toHaveLength(33);
    await userEvent.click(screen.getByTestId('email-input'));
    expect(screen.getByTestId('password-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Password - пустое', async () => {
    await renderRegistrationPage();
    await userEvent.click(screen.getByTestId('password-input'));
    await userEvent.click(screen.getByTestId('email-input'));
    expect(screen.getByTestId('password-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Password содержит буквы русского алфавита', async () => {
    await renderRegistrationPage();
    await userEvent.type(screen.getByTestId('password-input'), 'ыQwerty12');
    await userEvent.click(screen.getByTestId('email-input'));
    expect(screen.getByTestId('password-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Password содержит спец символы', async () => {
    await renderRegistrationPage();
    await userEvent.type(screen.getByTestId('password-input'), '*.Qwerty12');
    await userEvent.click(screen.getByTestId('email-input'));
    expect(screen.getByTestId('password-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Password не содержит цифры', async () => {
    await renderRegistrationPage();
    await userEvent.type(screen.getByTestId('password-input'), 'Qwertyrwere');
    await userEvent.click(screen.getByTestId('email-input'));
    expect(screen.getByTestId('password-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Password не содержит прописной латинской буквы', async () => {
    await renderRegistrationPage();
    await userEvent.type(screen.getByTestId('password-input'), 'wertyrwere12');
    await userEvent.click(screen.getByTestId('email-input'));
    expect(screen.getByTestId('password-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Password не содержит строчной латинской буквы', async () => {
    await renderRegistrationPage();
    await userEvent.type(screen.getByTestId('password-input'), 'QWETEGDDF12');
    await userEvent.click(screen.getByTestId('email-input'));
    expect(screen.getByTestId('password-error')).not.toBeEmptyDOMElement();
  });
});
