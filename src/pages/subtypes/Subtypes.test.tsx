import * as router from 'react-router';
import { server } from '../../test/server.ts';
import { act, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store/store.ts';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import Subtypes from './Subtypes.tsx';

const mockedNavigation = jest.fn();
jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigation);

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

afterAll(() => server.close());

let dispatchRequest: jest.Mock;

async function renderSubtypesPage() {
  dispatchRequest = jest.fn();
  server.events.on('request:end', dispatchRequest);
  // @ts-ignore
  delete global.window.location;
  // @ts-ignore
  global.window.location = new URL('http://localhost:5173/subtypes');
  act(() => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Subtypes />
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

describe('Subtypes - General', () => {
  test('Выбор подтипов', async () => {
    await renderSubtypesPage();
    await waitFor(() => {
      expect(screen.getByTestId('exercise1-div')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('exercise1-div'));
    expect(mockedNavigation).toHaveBeenCalledWith(`/exercises/kodfgkodkgodf`);
  });

  test('Добавление подтипа', async () => {
    await renderSubtypesPage();
    await userEvent.click(screen.getByTestId('add-btn'));
    await userEvent.type(screen.getByTestId('name-input'), 'NewSub');
    await userEvent.click(screen.getByTestId('save-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Created successfully!')).toBeInTheDocument();
    });
  });

  test('Обновление подтипа', async () => {
    await renderSubtypesPage();
    await userEvent.click(screen.getByTestId('update1-btn'));
    await userEvent.clear(screen.getByTestId('name-input'));
    await userEvent.type(screen.getByTestId('name-input'), 'wwww');
    expect(screen.getByTestId('name-input')).toHaveValue('wwww');
    await userEvent.click(screen.getByTestId('save-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Updated successfully!')).toBeInTheDocument();
    });
  });

  test('Обновление подтипа с выходом', async () => {
    await renderSubtypesPage();
    await userEvent.click(screen.getByTestId('update1-btn'));
    await userEvent.clear(screen.getByTestId('name-input'));
    await userEvent.type(screen.getByTestId('name-input'), 'wwww');
    expect(screen.getByTestId('name-input')).toHaveValue('wwww');
    await userEvent.click(screen.getByTestId('exit-btn'));
  });

  test('Удаление подтипа', async () => {
    await renderSubtypesPage();
    await userEvent.click(screen.getByTestId('delete1-btn'));
    await waitFor(() => {
      expect(screen.queryByText('Deleted successfully!')).toBeInTheDocument();
    });
  });
});

describe('Subtypes - Name', () => {
  test('Минимальная длина поля Name', async () => {
    await renderSubtypesPage();
    await userEvent.type(screen.getByTestId('name-input'), 'adaw');
    expect(screen.getByTestId('name-input')).toHaveValue('adaw');
    expect((screen.getByTestId('name-input') as HTMLInputElement).value).toHaveLength(4);
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Длина поля Name меньше минимальной', async () => {
    await renderSubtypesPage();
    await userEvent.type(screen.getByTestId('name-input'), 'ada');
    expect(screen.getByTestId('name-input')).toHaveValue('ada');
    expect((screen.getByTestId('name-input') as HTMLInputElement).value).toHaveLength(3);
    await userEvent.click(screen.getByTestId('save-btn'));
    expect(screen.getByTestId('name-error')).not.toBeEmptyDOMElement();
  });

  test('Максимальная длина поля Name', async () => {
    await renderSubtypesPage();
    await userEvent.type(screen.getByTestId('name-input'), 'qwertyuiopasdfghjklzxcvbngmhdkss');
    expect(screen.getByTestId('name-input')).toHaveValue('qwertyuiopasdfghjklzxcvbngmhdkss');
    expect((screen.getByTestId('name-input') as HTMLInputElement).value).toHaveLength(32);
    await userEvent.click(screen.getByTestId('save-btn'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Длина поля Name больше максимальной', async () => {
    await renderSubtypesPage();
    await userEvent.type(screen.getByTestId('name-input'), 'qwertyuiopasdfghjklzxcvbngmhdksas');
    expect(screen.getByTestId('name-input')).toHaveValue('qwertyuiopasdfghjklzxcvbngmhdksas');
    expect((screen.getByTestId('name-input') as HTMLInputElement).value).toHaveLength(33);
    await userEvent.click(screen.getByTestId('save-btn'));
    expect(screen.getByTestId('name-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Name - пустое', async () => {
    await renderSubtypesPage();
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.click(screen.getByTestId('save-btn'));
    expect(screen.getByTestId('name-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Name содержит буквы русского алфавита', async () => {
    await renderSubtypesPage();
    await userEvent.type(screen.getByTestId('name-input'), 'фыфыы');
    expect(screen.getByTestId('name-input')).toHaveValue('фыфыы');
    await userEvent.click(screen.getByTestId('save-btn'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Name содержит цифры', async () => {
    await renderSubtypesPage();
    await userEvent.type(screen.getByTestId('name-input'), '1212');
    expect(screen.getByTestId('name-input')).toHaveValue('1212');
    await userEvent.click(screen.getByTestId('save-btn'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Name содержит спец символы', async () => {
    await renderSubtypesPage();
    await userEvent.type(screen.getByTestId('name-input'), '*.№№');
    await userEvent.click(screen.getByTestId('save-btn'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });
});
