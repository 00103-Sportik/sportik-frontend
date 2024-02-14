import * as router from 'react-router';
import { server } from '../../test/server.ts';
import { act, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store/store.ts';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import Exercises from './Exercises.tsx';
import { setCurrentWorkouts, setMainInfo } from '../../store/workouts/workouts.slice.ts';

const mockedNavigation = jest.fn();
jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigation);
jest.spyOn(router, 'useParams').mockReturnValue({ type: 'kodfgkodkgodf' });

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

let dispatchRequest: jest.Mock;

async function renderExercisesPage() {
  store.dispatch(setCurrentWorkouts({ uuid: 'fssf9sdfj9sjaf9s' }));
  store.dispatch(
    setCurrentWorkouts({
      uuid: 'fssf9sdfj9sjaf9s',
    }),
  );
  store.dispatch(
    setMainInfo({
      uuid: 'fssf9sdfj9sjaf9s',
      date: '2024-02-10',
      name: 'Workout 1',
      type: 'cardio',
      comment: '',
    }),
  );
  dispatchRequest = jest.fn();
  server.events.on('request:end', dispatchRequest);
  act(() => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Exercises />
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
    expect(dispatchRequest).toHaveBeenCalled();
  });
}

describe('Exercises - General', () => {
  test('Переход на страницу с упражнением', async () => {
    await renderExercisesPage();
    await waitFor(() => {
      expect(screen.getByTestId('exercise1-div')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('update1-btn'));
    expect(mockedNavigation).toHaveBeenCalledWith(`/exercise/wrrw23rwerwe`);
  });

  test('Переход на страницу с созданием упражнения', async () => {
    await renderExercisesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    expect(mockedNavigation).toHaveBeenCalledWith('/exercises');
  });

  test('Выбор упражнения', async () => {
    await renderExercisesPage();
    await userEvent.click(screen.getByTestId('exercise1-div'));
    expect(mockedNavigation).toHaveBeenCalledWith(`/workouts/fssf9sdfj9sjaf9s`);
  });

  test('Удаление упражнения', async () => {
    await renderExercisesPage();
    await userEvent.click(screen.getByTestId('delete1-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Deleted successfully!')).toBeInTheDocument();
    });
  });
});
