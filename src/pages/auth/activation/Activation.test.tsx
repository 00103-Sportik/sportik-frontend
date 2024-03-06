import * as router from 'react-router';
import { server } from '../../../test-utils/server.ts';
import { act, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../store/store.ts';
import { ToastContainer } from 'react-toastify';
import Activation from './Activation.tsx';
import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../../../common/constants/api.ts';

const mockedNavigation = jest.fn();
jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigation);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

async function renderActivationPage() {
  act(() => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Activation />
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

describe('Activation', () => {
  test('Успешная активация', async () => {
    await renderActivationPage();
    await waitFor(() => {
      expect(screen.queryByText('Activated successfully!')).toBeInTheDocument();
    });
    expect(mockedNavigation).toHaveBeenCalled();
  });

  test('Ошибка активации', async () => {
    server.use(
      http.put(`${BASE_URL}auth/activate`, () => {
        return HttpResponse.json(
          {
            message: 'Error!',
            data: {},
          },
          { status: 400 },
        );
      }),
    );
    await renderActivationPage();
    await waitFor(() => {
      expect(screen.queryByText('Error!')).toBeInTheDocument();
    });
  });
});
