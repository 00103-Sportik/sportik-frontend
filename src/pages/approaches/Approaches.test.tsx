import { server } from '../../test/server.ts';
import store from '../../store/store.ts';
import {
  discardWorkoutInfo,
  setCurrentWorkouts,
  setExercise,
  setMainInfo,
  unsetExercise,
} from '../../store/workouts/workouts.slice.ts';
import { act, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import Approaches from './Approaches.tsx';
import userEvent from '@testing-library/user-event';
import * as router from 'react-router';

const mockedNavigation = jest.fn();
jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigation);
jest.spyOn(router, 'useParams').mockReturnValue({ uuid: 'wrrwrwerwe' });

beforeAll(() => server.listen());

afterEach(() => {
  store.dispatch(discardWorkoutInfo());
  store.dispatch(unsetExercise({ index: 0 }));
  server.resetHandlers();
});

afterAll(() => server.close());

async function renderApproachesPage() {
  store.dispatch(setCurrentWorkouts({ uuid: 'fssf9sdfj9sjaf9s' }));
  store.dispatch(
    setMainInfo({
      uuid: 'fssf9sdfj9sjaf9s',
      date: '2024-02-10',
      name: 'Workout 1',
      type: 'cardio',
      comment: '',
    }),
  );
  store.dispatch(
    setExercise({
      uuid: 'wrrwrwerwe',
      name: 'exercise 1',
      combination_params: 'count_weight',
      approaches: [
        {
          uuid: 'ndisgnds9gd',
          param1: 100,
          param2: 50,
        },
        {
          uuid: 'mofgmifgmi',
          param1: 1123,
          param2: 789,
        },
      ],
    }),
  );
  // @ts-ignore
  delete global.window.location;
  // @ts-ignore
  global.window.location = new URL('http://localhost:5173/approaches/wrrwrwerwe');
  act(() => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Approaches />
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

async function renderClearApproachesPage() {
  store.dispatch(
    setMainInfo({
      uuid: 'fssf9sdfj9sjaf9s',
      date: '2024-02-10',
      name: 'Workout 1',
      type: 'cardio',
      comment: '',
    }),
  );
  // @ts-ignore
  delete global.window.location;
  // @ts-ignore
  global.window.location = new URL('http://localhost:5173/approaches/wrrwrwerwe');
  act(() => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Approaches />
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

describe('Approaches - General', () => {
  test('Добавление нового подхода', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderClearApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('param1-0-input')).toBeEmptyDOMElement();
      expect(screen.getByTestId('param2-0-input')).toBeEmptyDOMElement();
    });
  });

  test('Добавление нового подхода, который будет дублировать предыдущий', async () => {
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('param1-2-input')).toHaveValue('1123');
      expect(screen.getByTestId('param2-2-input')).toHaveValue('789');
    });
  });

  test('Удаление последнего подхода', async () => {
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('delete-btn'));
    expect(screen.getByTestId('count-p')).toHaveTextContent('Approaches: 1');
  });

  test('Удаление выбранного подхода', async () => {
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('delete0-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('param1-0-input')).toHaveValue('1123');
      expect(screen.getByTestId('param2-0-input')).toHaveValue('789');
    });
  });

  test('Сохранение подходов', async () => {
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.click(screen.getByTestId('save-btn'));
    await waitFor(() => {
      expect(store.getState().workouts.exercises[0].approaches).toHaveLength(3);
    });
    expect(mockedNavigation).toHaveBeenCalledWith(`/workouts/fssf9sdfj9sjaf9s`);
  });
});

describe('Approaches - param1 === count', () => {
  test('Значение поля param1 - дефолтное', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    expect(screen.getByTestId('param1-0-input')).toHaveValue('0');
  });

  test('Значение поля param1 граничное снизу', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '0');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).toBeEmptyDOMElement();
  });

  test('Значение поля param1 имеет минимальное отклонение от граничного значения снизу (-1)', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '-1');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param1 имеет минимальное отклонение от граничного значения снизу (+1)', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '1');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).toBeEmptyDOMElement();
  });

  test('Значение поля param1 граничное сверху', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '9999');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).toBeEmptyDOMElement();
  });

  test('Значение поля param1 имеет минимальное отклонение от граничного значения сверху (+1)', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '10000');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param1 имеет минимальное отклонение от граничного значения сверху (-1)', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '9998');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).toBeEmptyDOMElement();
  });

  test('Значение поля param1 - дробное число', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '99.9');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param1 содержит буквы латинского алфавита', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), 'sad');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param1 содержит буквы русского алфавита', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), 'аыв');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param1 содержит спец символы', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '%*');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param1 - пустое', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.click(screen.getByTestId('param1-0-input'));
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).not.toBeEmptyDOMElement();
  });
});

describe('Approaches - param1 === distant', () => {
  test('Значение поля param1 - дефолтное', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    expect(screen.getByTestId('param1-0-input')).toHaveValue('0');
  });

  test('Значение поля param1 граничное снизу', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '0');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).toBeEmptyDOMElement();
  });

  test('Значение поля param1 имеет минимальное отклонение от граничного значения снизу (-0.1)', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '-0.1');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param1 имеет минимальное отклонение от граничного значения снизу (+0.1)', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '0.1');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).toBeEmptyDOMElement();
  });

  test('Значение поля param1 граничное сверху', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '999.9');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).toBeEmptyDOMElement();
  });

  test('Значение поля param1 имеет минимальное отклонение от граничного значения сверху (+0.1)', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '1000');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param1 имеет минимальное отклонение от граничного значения сверху (-0.1)', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '999.8');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).toBeEmptyDOMElement();
  });

  test('Отсутствие целой части поля param1', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '.9');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).not.toBeEmptyDOMElement();
  });

  test('Длина дробной части поля param1 больше максимальной', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '9.99');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param1 содержит буквы латинского алфавита', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), 'sad');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param1 содержит буквы русского алфавита', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), 'аыв');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param1 содержит спец символы', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.type(screen.getByTestId('param1-0-input'), '%*');
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param1 - пустое', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param1-0-input'));
    await userEvent.click(screen.getByTestId('param1-0-input'));
    await userEvent.click(screen.getByTestId('param2-0-input'));
    expect(screen.getByTestId('param1-0-error')).not.toBeEmptyDOMElement();
  });
});

describe('Approaches - param2 === time', () => {
  test('Значение поля param2 - дефолтное', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    expect(screen.getByTestId('param2-0-input')).toHaveValue('00:00:00');
  });

  test('Значение минут поля param2 - граничное сверху', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param2-0-input'));
    await userEvent.type(screen.getByTestId('param2-0-input'), '99:59:00');
    await userEvent.click(screen.getByTestId('param1-0-input'));
    expect(screen.getByTestId('param2-0-error')).toBeEmptyDOMElement();
  });

  test('Значение минут поля param2 имеет минимальное отклонение от граничного значения сверху (+1)', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param2-0-input'));
    await userEvent.type(screen.getByTestId('param2-0-input'), '99:60:00');
    await userEvent.click(screen.getByTestId('param1-0-input'));
    expect(screen.getByTestId('param2-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение минут поля param2 - граничное сверху', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param2-0-input'));
    await userEvent.type(screen.getByTestId('param2-0-input'), '99:10:59');
    await userEvent.click(screen.getByTestId('param1-0-input'));
    expect(screen.getByTestId('param2-0-error')).toBeEmptyDOMElement();
  });

  test('Значение секунд поля param2 имеет минимальное отклонение от граничного значения сверху (+1)', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'distant_time',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param2-0-input'));
    await userEvent.type(screen.getByTestId('param2-0-input'), '99:10:60');
    await userEvent.click(screen.getByTestId('param1-0-input'));
    expect(screen.getByTestId('param2-0-error')).not.toBeEmptyDOMElement();
  });
});

describe('Approaches - param2 === weight', () => {
  test('Значение поля param2 - дефолтное', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    expect(screen.getByTestId('param2-0-input')).toHaveValue('0');
  });

  test('Значение поля param2 граничное снизу', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param2-0-input'));
    await userEvent.type(screen.getByTestId('param2-0-input'), '0');
    await userEvent.click(screen.getByTestId('param1-0-input'));
    expect(screen.getByTestId('param2-0-error')).toBeEmptyDOMElement();
  });

  test('Значение поля param2 имеет минимальное отклонение от граничного значения снизу (-0.1)', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param2-0-input'));
    await userEvent.type(screen.getByTestId('param2-0-input'), '-0.1');
    await userEvent.click(screen.getByTestId('param1-0-input'));
    expect(screen.getByTestId('param2-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param2 имеет минимальное отклонение от граничного значения снизу (+0.1)', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param2-0-input'));
    await userEvent.type(screen.getByTestId('param2-0-input'), '0.1');
    await userEvent.click(screen.getByTestId('param1-0-input'));
    expect(screen.getByTestId('param2-0-error')).toBeEmptyDOMElement();
  });

  test('Значение поля param2 граничное сверху', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param2-0-input'));
    await userEvent.type(screen.getByTestId('param2-0-input'), '999.9');
    await userEvent.click(screen.getByTestId('param1-0-input'));
    expect(screen.getByTestId('param2-0-error')).toBeEmptyDOMElement();
  });

  test('Значение поля param2 имеет минимальное отклонение от граничного значения сверху (+0.1)', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param2-0-input'));
    await userEvent.type(screen.getByTestId('param2-0-input'), '1000');
    await userEvent.click(screen.getByTestId('param1-0-input'));
    expect(screen.getByTestId('param2-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param2 имеет минимальное отклонение от граничного значения сверху (-0.1)', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param2-0-input'));
    await userEvent.type(screen.getByTestId('param2-0-input'), '999.8');
    await userEvent.click(screen.getByTestId('param1-0-input'));
    expect(screen.getByTestId('param2-0-error')).toBeEmptyDOMElement();
  });

  test('Отсутствие целой части поля param2', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param2-0-input'));
    await userEvent.type(screen.getByTestId('param2-0-input'), '.9');
    await userEvent.click(screen.getByTestId('param1-0-input'));
    expect(screen.getByTestId('param2-0-error')).not.toBeEmptyDOMElement();
  });

  test('Длина дробной части поля param2 больше максимальной', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param2-0-input'));
    await userEvent.type(screen.getByTestId('param2-0-input'), '9.99');
    await userEvent.click(screen.getByTestId('param1-0-input'));
    expect(screen.getByTestId('param2-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param2 содержит буквы латинского алфавита', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param2-0-input'));
    await userEvent.type(screen.getByTestId('param2-0-input'), 'sad');
    await userEvent.click(screen.getByTestId('param1-0-input'));
    expect(screen.getByTestId('param2-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param2 содержит буквы русского алфавита', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param2-0-input'));
    await userEvent.type(screen.getByTestId('param2-0-input'), 'аыв');
    await userEvent.click(screen.getByTestId('param1-0-input'));
    expect(screen.getByTestId('param2-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param2 содержит спец символы', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param2-0-input'));
    await userEvent.type(screen.getByTestId('param2-0-input'), '%*');
    await userEvent.click(screen.getByTestId('param1-0-input'));
    expect(screen.getByTestId('param2-0-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля param2 - пустое', async () => {
    store.dispatch(
      setExercise({
        uuid: 'wrrwrwerwe',
        name: 'exercise 1',
        combination_params: 'count_weight',
        approaches: [],
      }),
    );
    await renderApproachesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.clear(screen.getByTestId('param2-0-input'));
    await userEvent.click(screen.getByTestId('param2-0-input'));
    await userEvent.click(screen.getByTestId('param1-0-input'));
    expect(screen.getByTestId('param2-0-error')).not.toBeEmptyDOMElement();
  });
});
