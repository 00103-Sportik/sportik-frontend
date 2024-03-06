import * as router from 'react-router';
import { server } from '../../test-utils/server.ts';
import { act, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store/store.ts';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import Workout from './Workout.tsx';
import { discardWorkoutInfo } from '../../store/workouts/workouts.slice.ts';
import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../../common/constants/api.ts';

const mockedNavigation = jest.fn();
jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigation);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

let dispatchRequest: jest.Mock;

async function renderNewWorkoutPage() {
  dispatchRequest = jest.fn();
  server.events.on('request:end', dispatchRequest);
  store.dispatch(discardWorkoutInfo());
  // @ts-ignore
  delete global.window.location;
  // @ts-ignore
  global.window.location = new URL('http://localhost:5173/workouts');
  act(() => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Workout />
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

async function renderWorkoutPage() {
  dispatchRequest = jest.fn();
  server.events.on('request:end', dispatchRequest);
  store.dispatch(discardWorkoutInfo());
  // @ts-ignore
  delete global.window.location;
  // @ts-ignore
  global.window.location = new URL('http://localhost:5173/workouts/fssf9sdfj9sjaf9s');
  act(() => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Workout />
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

describe('Workout - General', () => {
  test('Переход на страницу с подходами упражнения', async () => {
    await renderWorkoutPage();
    await waitFor(() => {
      expect(screen.getByTestId('goto-exercise0-div')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('goto-exercise0-div'));
    expect(mockedNavigation).toHaveBeenCalledWith(`/approaches/wrrwrwerwe`);
  });

  test('Переход на страницу с выбором подтипа упражнения', async () => {
    await renderWorkoutPage();
    await userEvent.click(screen.getByTestId('add-exercise-btn'));
    expect(mockedNavigation).toHaveBeenCalledWith('/subtypes/strength');
  });

  test('Удаление упражнения из тренировки', async () => {
    await renderWorkoutPage();
    await userEvent.click(screen.getByTestId('delete-exercise0-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('no-entities-h1')).toBeInTheDocument();
    });
  });

  test('Сохранение новой тренировки', async () => {
    server.use(
      http.get(`${BASE_URL}workouts`, () => {
        return HttpResponse.json(
          {
            message: 'Успешное завершение операции',
            data: {
              name: 'My train',
              date: '2024-02-10',
              type: 'strength',
              comment: 'dfhfghdfghfghfghf',
              exercises: [
                {
                  uuid: 'wrrwrwerwe',
                  name: 'exercise 1',
                  combination_params: 'count_weight',
                  approaches: [
                    {
                      uuid: 'mofgmifgmi',
                      param1: 1123.78,
                      param2: 789.78,
                    },
                  ],
                },
              ],
            },
          },
          { status: 200 },
        );
      }),
    );
    await renderNewWorkoutPage();
    await userEvent.click(screen.getByTestId('save-btn'));
    await waitFor(() => {
      expect(mockedNavigation).toHaveBeenCalledWith('/workouts/fssf9sdfj9sjaf9s');
    });
  });

  test('Обновление информации о тренировке', async () => {
    await renderWorkoutPage();
    await userEvent.click(screen.getByTestId('save-btn'));
    await waitFor(() => {
      expect(mockedNavigation).toHaveBeenCalledWith('/workouts/fssf9sdfj9sjaf9s');
    });
  });

  test('Удаление тренировки', async () => {
    await renderWorkoutPage();
    await userEvent.click(screen.getByTestId('delete-dialog-btn'));
    await waitFor(() => {
      expect(mockedNavigation).toHaveBeenCalledWith('/');
    });
  });
});

describe('Workout - Name', () => {
  test('Постановка дефолтного названия тренировки', async () => {
    await renderNewWorkoutPage();
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue('Workout 7');
    });
  });

  test('Минимальная длина поля Name', async () => {
    await renderNewWorkoutPage();
    await userEvent.clear(screen.getByTestId('name-input'));
    await userEvent.type(screen.getByTestId('name-input'), 'adaw');
    expect(screen.getByTestId('name-input')).toHaveValue('adaw');
    expect((screen.getByTestId('name-input') as HTMLInputElement).value).toHaveLength(4);
    await userEvent.click(screen.getByTestId('date-input'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Длина поля Name меньше минимальной', async () => {
    await renderNewWorkoutPage();
    await userEvent.clear(screen.getByTestId('name-input'));
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), 'ada');
    expect(screen.getByTestId('name-input')).toHaveValue('ada');
    expect((screen.getByTestId('name-input') as HTMLInputElement).value).toHaveLength(3);
    await userEvent.click(screen.getByTestId('date-input'));
    expect(screen.getByTestId('name-error')).not.toBeEmptyDOMElement();
  });

  test('Максимальная длина поля Name', async () => {
    await renderNewWorkoutPage();
    await userEvent.clear(screen.getByTestId('name-input'));
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), 'qwertyuiopasdfghjklzxcvbngmhdkss');
    expect(screen.getByTestId('name-input')).toHaveValue('qwertyuiopasdfghjklzxcvbngmhdkss');
    expect((screen.getByTestId('name-input') as HTMLInputElement).value).toHaveLength(32);
    await userEvent.click(screen.getByTestId('date-input'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Длина поля Name больше максимальной', async () => {
    await renderNewWorkoutPage();
    await userEvent.clear(screen.getByTestId('name-input'));
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), 'qwertyuiopasdfghjklzxcvbngmhdksas');
    expect(screen.getByTestId('name-input')).toHaveValue('qwertyuiopasdfghjklzxcvbngmhdksas');
    expect((screen.getByTestId('name-input') as HTMLInputElement).value).toHaveLength(33);
    await userEvent.click(screen.getByTestId('date-input'));
    expect(screen.getByTestId('name-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Name - пустое', async () => {
    await renderNewWorkoutPage();
    await userEvent.clear(screen.getByTestId('name-input'));
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.click(screen.getByTestId('date-input'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Name содержит буквы русского алфавита', async () => {
    await renderNewWorkoutPage();
    await userEvent.clear(screen.getByTestId('name-input'));
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), 'фыфыы');
    expect(screen.getByTestId('name-input')).toHaveValue('фыфыы');
    await userEvent.click(screen.getByTestId('date-input'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Name содержит цифры', async () => {
    await renderNewWorkoutPage();
    await userEvent.clear(screen.getByTestId('name-input'));
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), '1212');
    expect(screen.getByTestId('name-input')).toHaveValue('1212');
    await userEvent.click(screen.getByTestId('date-input'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Name содержит спец символы', async () => {
    await renderNewWorkoutPage();
    await userEvent.clear(screen.getByTestId('name-input'));
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), '*.№№');
    expect(screen.getByTestId('name-input')).toHaveValue('*.№№');
    await userEvent.click(screen.getByTestId('date-input'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });
});

describe('Workout - Date', () => {
  test('Постановка текущей даты при создании новой тренировки', async () => {
    await renderNewWorkoutPage();
    await waitFor(() => {
      expect(screen.getByTestId('date-input')).toHaveValue(new Date().toLocaleDateString());
    });
  });

  test('Ввод некорректной даты', async () => {
    await renderNewWorkoutPage();
    await userEvent.clear(screen.getByTestId('date-input'));
    await userEvent.type(screen.getByTestId('date-input'), '99.99.9999');
    await userEvent.click(screen.getByTestId('name-input'));
    await waitFor(() => {
      expect(screen.getByTestId('date-error')).toHaveTextContent('Incorrect date');
    });
  });
});

describe('Workout - Type', () => {
  test('Изменение типа тренировки', async () => {
    await renderNewWorkoutPage();
    await userEvent.selectOptions(screen.getByTestId('type-select'), 'cardio');
    expect(screen.getByTestId('type-select')).toHaveTextContent('cardio');
  });
});

describe('Workout - Comment', () => {
  test('Максимальная длина поля Comment', async () => {
    await renderNewWorkoutPage();
    await userEvent.clear(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('comment-input')).toHaveValue('');
    await userEvent.type(
      screen.getByTestId('comment-input'),
      'jKxbdKXximkvggPhAKkVgamKfCZqovhpjBEbyUYXYVtWLmBAOQuyReaMhbunjWWFhzmoBBoCjCdSRCYvilJUygAfhUTCJGWvohBCqEnWORYbCpaiXFoVLoADjcJrhkTkHkEJpiesmkSELIuNghXMIcrlfBOGVTGZWJYqmBuGSDONSTMBLPrjeNvlMkxmbuIvoXrGYzjSUXJkHUnOayiAAevEiTLTHMmQzqVNcjAJEfEDXhNfRmoKJlSKehHNZPJ',
    );
    expect(screen.getByTestId('comment-input')).toHaveValue(
      'jKxbdKXximkvggPhAKkVgamKfCZqovhpjBEbyUYXYVtWLmBAOQuyReaMhbunjWWFhzmoBBoCjCdSRCYvilJUygAfhUTCJGWvohBCqEnWORYbCpaiXFoVLoADjcJrhkTkHkEJpiesmkSELIuNghXMIcrlfBOGVTGZWJYqmBuGSDONSTMBLPrjeNvlMkxmbuIvoXrGYzjSUXJkHUnOayiAAevEiTLTHMmQzqVNcjAJEfEDXhNfRmoKJlSKehHNZPJ',
    );
    expect((screen.getByTestId('comment-input') as HTMLInputElement).value).toHaveLength(255);
    await userEvent.click(screen.getByTestId('date-input'));
    expect(screen.getByTestId('comment-error')).toBeEmptyDOMElement();
  }, 20000);

  test('Длина поля Comment больше максимальной', async () => {
    await renderNewWorkoutPage();
    await userEvent.clear(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('comment-input')).toHaveValue('');
    await userEvent.type(
      screen.getByTestId('comment-input'),
      'jKxbdKXximkvggPhAKkVgamKfCZqovhpjBEbyUYXYVtWLmBAOQuyReaMhbunjWWFhzmoBBoCjCdSRCYvilJUygAfhUTCJGWvohBCqEnWORYbCpaiXFoVLoADjcJrhkTkHkEJpiesmkSELIuNghXMIcrlfBOGVTGZWJYqmBuGSDONSTMBLPrjeNvlMkxmbuIvoXrGYzjSUXJkHUnOayiAAevEiTLTHMmQzqVNcjAJEfEDXhNfRmoKJlSKehHNZPJs',
    );
    expect(screen.getByTestId('comment-input')).toHaveValue(
      'jKxbdKXximkvggPhAKkVgamKfCZqovhpjBEbyUYXYVtWLmBAOQuyReaMhbunjWWFhzmoBBoCjCdSRCYvilJUygAfhUTCJGWvohBCqEnWORYbCpaiXFoVLoADjcJrhkTkHkEJpiesmkSELIuNghXMIcrlfBOGVTGZWJYqmBuGSDONSTMBLPrjeNvlMkxmbuIvoXrGYzjSUXJkHUnOayiAAevEiTLTHMmQzqVNcjAJEfEDXhNfRmoKJlSKehHNZPJs',
    );
    expect((screen.getByTestId('comment-input') as HTMLInputElement).value).toHaveLength(256);
    await userEvent.click(screen.getByTestId('date-input'));
    expect(screen.getByTestId('comment-error')).not.toBeEmptyDOMElement();
  }, 20000);

  test('Значение поля Comment - пустое', async () => {
    await renderNewWorkoutPage();
    await userEvent.clear(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('comment-input')).toHaveValue('');
    await userEvent.click(screen.getByTestId('date-input'));
    expect(screen.getByTestId('comment-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Comment содержит буквы русского алфавита', async () => {
    await renderNewWorkoutPage();
    await userEvent.clear(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('comment-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('comment-input'), 'фыфыы');
    expect(screen.getByTestId('comment-input')).toHaveValue('фыфыы');
    await userEvent.click(screen.getByTestId('date-input'));
    expect(screen.getByTestId('comment-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Comment содержит цифры', async () => {
    await renderNewWorkoutPage();
    await userEvent.clear(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('comment-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('comment-input'), '1212');
    expect(screen.getByTestId('comment-input')).toHaveValue('1212');
    await userEvent.click(screen.getByTestId('date-input'));
    expect(screen.getByTestId('comment-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Comment содержит спец символы', async () => {
    await renderNewWorkoutPage();
    await userEvent.clear(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('comment-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('comment-input'), '*.№№');
    expect(screen.getByTestId('comment-input')).toHaveValue('*.№№');
    await userEvent.click(screen.getByTestId('date-input'));
    expect(screen.getByTestId('comment-error')).toBeEmptyDOMElement();
  });
});
