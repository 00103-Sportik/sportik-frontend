import * as router from 'react-router';
import { server } from '../../test/server.ts';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store/store.ts';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import Workouts from './Workouts.tsx';

const mockedNavigation = jest.fn();
jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigation);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

let dispatchRequest: jest.Mock;

async function renderWorkoutsPage() {
  dispatchRequest = jest.fn();
  server.events.on('request:end', dispatchRequest);
  act(() => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Workouts />
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
  await waitFor(() => {
    expect(dispatchRequest).toHaveBeenCalledTimes(1);
  });
}

describe('Workouts - General', () => {
  test('Переход на страницу с тренировкой', async () => {
    await renderWorkoutsPage();
    await waitFor(() => {
      expect(screen.getByTestId('workout0-div')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('workout0-div'));
    expect(mockedNavigation).toHaveBeenCalledWith(`/workouts/odfgdfolgdflg`);
  });

  test('Переход на страницу с созданием тренировки', async () => {
    await renderWorkoutsPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    expect(mockedNavigation).toHaveBeenCalledWith('/workouts');
  });

  test('Динамическая пагинация', async () => {
    await renderWorkoutsPage();
    fireEvent.scroll(screen.getByTestId('box-div'), { y: 100 });
    await waitFor(() => {
      expect(dispatchRequest).toHaveBeenCalled();
    });
  });
});

describe('Workouts - Sort/Filter', () => {
  test('Изменение Sort', async () => {
    await renderWorkoutsPage();
    await userEvent.selectOptions(screen.getByTestId('sort-select'), 'old');
    expect(screen.getByTestId('sort-select')).toHaveTextContent('Oldest');
    await waitFor(() => {
      expect(screen.getByTestId('workout0-date')).toHaveTextContent('10.02.2024');
    });
  });

  test('From больше to', async () => {
    await renderWorkoutsPage();
    await userEvent.click(screen.getByTestId('filter-btn'));
    await userEvent.type(screen.getByTestId('from-input'), '12.02.2024');
    await userEvent.type(screen.getByTestId('to-input'), '10.02.2024');
    await userEvent.click(screen.getByTestId('apply-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('no-workouts-h1')).toBeInTheDocument();
    });
  });

  test('From меньше to', async () => {
    await renderWorkoutsPage();
    await userEvent.click(screen.getByTestId('filter-btn'));
    await userEvent.type(screen.getByTestId('from-input'), '10.02.2024');
    await userEvent.type(screen.getByTestId('to-input'), '12.02.2024');
    await userEvent.click(screen.getByTestId('apply-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('workout0-date')).toHaveTextContent('10.02.2024');
    });
  });

  test('From === to', async () => {
    await renderWorkoutsPage();
    await userEvent.click(screen.getByTestId('filter-btn'));
    await userEvent.type(screen.getByTestId('from-input'), '10.02.2024');
    await userEvent.type(screen.getByTestId('to-input'), '10.02.2024');
    await userEvent.click(screen.getByTestId('apply-btn'));
    await waitFor(() => {
      expect(screen.queryByText('12.02.2024')).not.toBeInTheDocument();
    });
  });

  test('Некорректная дата в поле From', async () => {
    await renderWorkoutsPage();
    await userEvent.click(screen.getByTestId('filter-btn'));
    await userEvent.type(screen.getByTestId('from-input'), '99.99.9999');
    await userEvent.click(screen.getByTestId('to-input'));
    await waitFor(() => {
      expect(screen.getByTestId('from-error')).toHaveTextContent('Incorrect date');
    });
  });

  test('Некорректная дата в поле To', async () => {
    await renderWorkoutsPage();
    await userEvent.click(screen.getByTestId('filter-btn'));
    await userEvent.type(screen.getByTestId('to-input'), '99.99.9999');
    await userEvent.click(screen.getByTestId('from-input'));
    await waitFor(() => {
      expect(screen.getByTestId('to-error')).toHaveTextContent('Incorrect date');
    });
  });
});
