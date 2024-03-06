import { server } from '../../src/test-utils/server';
import store from '../../src/store/store';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import Workouts from '../../src/pages/workouts/Workouts';
import Login from '../../src/pages/auth/login/Login';
import Activation from '../../src/pages/auth/activation/Activation';
import { ReactElement } from 'react';
import Workout from '../../src/pages/workout/Workout';
import Exercises from '../../src/pages/exercises/Exercises';
import Exercise from '../../src/pages/exercise/Exercise';
import { Navbar } from '../../src/common/components/navbar/Navbar';
import { setMainInfo } from '../../src/store/workouts/workouts.slice';
import HRCalc from '../../src/pages/hrCalc/HRCalc';
import Profile from '../../src/pages/profile/Profile';
import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../../src/common/constants/api';

beforeAll(() => server.listen());

afterEach(() => {
  jest.clearAllMocks();
  server.resetHandlers();
});

afterAll(() => server.close());

async function renderPages(pages: ReactElement[], initialEntries = '/') {
  act(() => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialEntries]}>
          <Routes>{...pages}</Routes>
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
        </MemoryRouter>
      </Provider>,
    );
  });
}

describe('Integration tests', () => {
  test('Аутентификация пользователя', async () => {
    await renderPages(
      [<Route index element={<Workouts />} />, <Route path="/signin" element={<Login />} />],
      '/signin',
    );
    await userEvent.type(screen.getByTestId('email-input'), 'test@test.com');
    await userEvent.type(screen.getByTestId('password-input'), 'Qwerty12');
    await userEvent.click(screen.getByTestId('signin-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Login successfully!')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('sort-select')).toBeInTheDocument();
    });
  });

  test('Выход пользователя из аккаунта', async () => {
    await renderPages([
      <Route
        index
        element={
          <>
            <Navbar></Navbar>
            <Workouts />
          </>
        }
      />,
      <Route index element={<Navbar></Navbar>} />,
      <Route path="/signin" element={<Login />} />,
    ]);
    await userEvent.click(screen.getByTestId('signout-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
    });
  });

  test('Активация аккаунта', async () => {
    await renderPages(
      [<Route path="activate" element={<Activation />} />, <Route path="signin" element={<Login />} />],
      '/activate',
    );
    await waitFor(() => {
      expect(screen.queryByText('Activated successfully!')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
    });
  });

  test('Cоздание новой тренировки', async () => {
    await renderPages([
      <Route index element={<Workouts />} />,
      <Route path="workouts" element={<Workout />} />,
      <Route path="workouts/:uuid" element={<Workout />} />,
    ]);
    await userEvent.click(screen.getByTestId('add-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('save-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Created successfully!')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('delete-btn')).toBeInTheDocument();
    });
  });

  test('Удаление существующей тренировки', async () => {
    await renderPages([
      <Route path="/" element={<Workouts />} />,
      <Route path="workouts/:uuid" element={<Workout />} />,
    ]);
    await userEvent.selectOptions(screen.getByTestId('sort-select'), 'old');
    await waitFor(() => {
      expect(screen.getByTestId('workout0-div')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('workout0-div'));
    await waitFor(() => {
      expect(screen.getByTestId('delete-btn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('delete-dialog-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Deleted successfully!')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('sort-select')).toBeInTheDocument();
    });
  });

  test('Создание нового упражнения', async () => {
    store.dispatch(
      setMainInfo({
        uuid: 'fssf9sdfj9sjaf9s',
        date: '2024-02-10',
        name: 'Workout 1',
        type: 'cardio',
        comment: '',
      }),
    );
    await renderPages(
      [
        <Route path="exercises/:type" element={<Exercises />} />,
        <Route path="exercises" element={<Exercise />} />,
        <Route path="exercise/:uuid" element={<Exercise />} />,
      ],
      '/exercises/kodfgkodkgodf',
    );
    await userEvent.click(screen.getByTestId('add-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
    });
    await userEvent.type(screen.getByTestId('name-input'), 'Test');
    await userEvent.click(screen.getByTestId('save-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Created successfully!')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('subtype-p1')).toBeInTheDocument();
    });
  });

  test('Вычисление пульсовых зон по возрасту при указанном возрасте', async () => {
    await renderPages(
      [
        <Route
          path="profile"
          element={
            <>
              <Navbar></Navbar>
              <Profile />
              <HRCalc />
            </>
          }
        />,
      ],
      '/profile',
    );
    expect(screen.getByTestId('age-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('age-input'), '20');
    server.use(
      http.get(`${BASE_URL}profile`, () => {
        return HttpResponse.json(
          {
            message: 'Успешное завершение операции',
            data: {
              height: null,
              weight: null,
              email: 'test@test.ru',
              name: '',
              surname: '',
              age: '20',
              sex: '',
              image: '',
            },
          },
          { status: 200 },
        );
      }),
    );
    await userEvent.click(screen.getByTestId('saving-dialog-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Updated successfully!')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(store.getState().profile.age).not.toBeNull();
    });

    await userEvent.click(screen.getByTestId('hr-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('hr-input')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('age-calc-btn'));
    expect(screen.getByTestId('row1')).toHaveTextContent('180-200');
    expect(screen.getByTestId('row2')).toHaveTextContent('160-180');
    expect(screen.getByTestId('row3')).toHaveTextContent('140-160');
    expect(screen.getByTestId('row4')).toHaveTextContent('120-140');
    expect(screen.getByTestId('row5')).toHaveTextContent('100-120');
    expect(screen.queryByText("You didn't indicate your age in your profile")).not.toBeInTheDocument();
  });

  test('Вычисление пульсовых зон по возрасту при неуказанном возрасте', async () => {
    await renderPages(
      [
        <Route
          path="profile"
          element={
            <>
              <Navbar></Navbar>
              <Profile />
              <HRCalc />
            </>
          }
        />,
      ],
      '/profile',
    );
    await userEvent.clear(screen.getByTestId('age-input'));
    await userEvent.click(screen.getByTestId('saving-dialog-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Updated successfully!')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('hr-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('hr-input')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('age-calc-btn'));
    expect(screen.getByTestId('row1')).toHaveTextContent('');
    expect(screen.getByTestId('row2')).toHaveTextContent('');
    expect(screen.getByTestId('row3')).toHaveTextContent('');
    expect(screen.getByTestId('row4')).toHaveTextContent('');
    expect(screen.getByTestId('row5')).toHaveTextContent('');
    expect(screen.queryByText("You didn't indicate your age in your profile")).toBeInTheDocument();
  });
});
