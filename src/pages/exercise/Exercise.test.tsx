import * as router from 'react-router';
import { server } from '../../test-utils/server.ts';
import { act, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store/store.ts';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import Exercise from './Exercise.tsx';

const mockedNavigation = jest.fn();
jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigation);

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

afterAll(() => server.close());

let dispatchRequest: jest.Mock;

async function renderNewExercisePage() {
  dispatchRequest = jest.fn();
  server.events.on('request:end', dispatchRequest);
  jest.spyOn(router, 'useParams').mockReturnValue({ uuid: undefined });
  // @ts-ignore
  delete global.window.location;
  // @ts-ignore
  global.window.location = new URL('http://localhost:5173/exercises');
  act(() => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Exercise />
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

async function renderExercisePage() {
  dispatchRequest = jest.fn();
  server.events.on('request:end', dispatchRequest);
  jest.spyOn(router, 'useParams').mockReturnValue({ uuid: 'wrrw23rwerwe' });
  // @ts-ignore
  delete global.window.location;
  // @ts-ignore
  global.window.location = new URL('http://localhost:5173/exercise/wrrw23rwerwe');
  act(() => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Exercise />
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

describe('Exercise - General', () => {
  test('Удаление упражнения', async () => {
    await renderExercisePage();
    await userEvent.click(screen.getByTestId('delete-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Deleted successfully!')).toBeInTheDocument();
    });
  });

  test('Сохранение нового упражнения', async () => {
    await renderNewExercisePage();
    await userEvent.type(screen.getByTestId('name-input'), 'adaw');
    await userEvent.click(screen.getByTestId('save-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Created successfully!')).toBeInTheDocument();
    });
  });

  test('Обновление информации об упражнении', async () => {
    await renderExercisePage();
    await userEvent.click(screen.getByTestId('save-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Updated successfully!')).toBeInTheDocument();
    });
  });
});

describe('Exercise - Name', () => {
  test('Минимальная длина поля Name', async () => {
    await renderNewExercisePage();
    await userEvent.clear(screen.getByTestId('name-input'));
    await userEvent.type(screen.getByTestId('name-input'), 'adaw');
    expect(screen.getByTestId('name-input')).toHaveValue('adaw');
    expect((screen.getByTestId('name-input') as HTMLInputElement).value).toHaveLength(4);
    await userEvent.click(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Длина поля Name меньше минимальной', async () => {
    await renderNewExercisePage();
    await userEvent.clear(screen.getByTestId('name-input'));
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), 'ada');
    expect(screen.getByTestId('name-input')).toHaveValue('ada');
    expect((screen.getByTestId('name-input') as HTMLInputElement).value).toHaveLength(3);
    await userEvent.click(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('name-error')).not.toBeEmptyDOMElement();
  });

  test('Максимальная длина поля Name', async () => {
    await renderNewExercisePage();
    await userEvent.clear(screen.getByTestId('name-input'));
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), 'qwertyuiopasdfghjklzxcvbngmhdkss');
    expect(screen.getByTestId('name-input')).toHaveValue('qwertyuiopasdfghjklzxcvbngmhdkss');
    expect((screen.getByTestId('name-input') as HTMLInputElement).value).toHaveLength(32);
    await userEvent.click(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Длина поля Name больше максимальной', async () => {
    await renderNewExercisePage();
    await userEvent.clear(screen.getByTestId('name-input'));
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), 'qwertyuiopasdfghjklzxcvbngmhdksas');
    expect(screen.getByTestId('name-input')).toHaveValue('qwertyuiopasdfghjklzxcvbngmhdksas');
    expect((screen.getByTestId('name-input') as HTMLInputElement).value).toHaveLength(33);
    await userEvent.click(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('name-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Name - пустое', async () => {
    await renderNewExercisePage();
    await userEvent.clear(screen.getByTestId('name-input'));
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.click(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('name-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Name содержит буквы русского алфавита', async () => {
    await renderNewExercisePage();
    await userEvent.clear(screen.getByTestId('name-input'));
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), 'фыфыы');
    expect(screen.getByTestId('name-input')).toHaveValue('фыфыы');
    await userEvent.click(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Name содержит цифры', async () => {
    await renderNewExercisePage();
    await userEvent.clear(screen.getByTestId('name-input'));
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), '1212');
    expect(screen.getByTestId('name-input')).toHaveValue('1212');
    await userEvent.click(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Name содержит спец символы', async () => {
    await renderNewExercisePage();
    await userEvent.clear(screen.getByTestId('name-input'));
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), '*.№№');
    expect(screen.getByTestId('name-input')).toHaveValue('*.№№');
    await userEvent.click(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });
});

describe('Exercise - Type', () => {
  test('Изменение типа упражнения', async () => {
    await renderNewExercisePage();
    await userEvent.selectOptions(screen.getByTestId('type-select'), 'cardio');
    expect(screen.getByTestId('type-select')).toHaveTextContent('cardio');
  });
});

describe('Exercise - Subtype', () => {
  test('Изменение подтипа упражнения', async () => {
    await renderNewExercisePage();
    await userEvent.selectOptions(screen.getByTestId('subtype-select'), 'Butterfly');
    expect(screen.getByTestId('subtype-select')).toHaveTextContent('Butterfly');
  });
});

describe('Exercise - Params', () => {
  test('Изменение параметров упражнения', async () => {
    await renderNewExercisePage();
    await userEvent.selectOptions(screen.getByTestId('params-select'), 'distant_time');
    expect(screen.getByTestId('params-select')).toHaveTextContent('Distant/Time');
  });
});

describe('Exercise - Comment', () => {
  test('Максимальная длина поля Comment', async () => {
    await renderNewExercisePage();
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
    await userEvent.click(screen.getByTestId('name-input'));
    expect(screen.getByTestId('comment-error')).toBeEmptyDOMElement();
  }, 20000);

  test('Длина поля Comment больше максимальной', async () => {
    await renderNewExercisePage();
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
    await userEvent.click(screen.getByTestId('name-input'));
    expect(screen.getByTestId('comment-error')).not.toBeEmptyDOMElement();
  }, 20000);

  test('Значение поля Comment - пустое', async () => {
    await renderNewExercisePage();
    await userEvent.clear(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('comment-input')).toHaveValue('');
    await userEvent.click(screen.getByTestId('name-input'));
    expect(screen.getByTestId('comment-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Comment содержит буквы русского алфавита', async () => {
    await renderNewExercisePage();
    await userEvent.clear(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('comment-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('comment-input'), 'фыфыы');
    expect(screen.getByTestId('comment-input')).toHaveValue('фыфыы');
    await userEvent.click(screen.getByTestId('name-input'));
    expect(screen.getByTestId('comment-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Comment содержит цифры', async () => {
    await renderNewExercisePage();
    await userEvent.clear(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('comment-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('comment-input'), '1212');
    expect(screen.getByTestId('comment-input')).toHaveValue('1212');
    await userEvent.click(screen.getByTestId('name-input'));
    expect(screen.getByTestId('comment-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Comment содержит спец символы', async () => {
    await renderNewExercisePage();
    await userEvent.clear(screen.getByTestId('comment-input'));
    expect(screen.getByTestId('comment-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('comment-input'), '*.№№');
    expect(screen.getByTestId('comment-input')).toHaveValue('*.№№');
    await userEvent.click(screen.getByTestId('name-input'));
    expect(screen.getByTestId('comment-error')).toBeEmptyDOMElement();
  });
});
