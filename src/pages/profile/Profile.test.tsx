import { act, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store/store.ts';
import userEvent from '@testing-library/user-event';
import Profile from './Profile.tsx';
import { ToastContainer } from 'react-toastify';
import '@testing-library/jest-dom';
import { server } from '../../test/server.ts';
import { BASE_URL } from '../../common/constants/api.ts';
import { http, HttpResponse } from 'msw';
import { image } from '../../test/constants.ts';
import { setProfile } from '../../store/profile/profile.slice.ts';
import base64toUint8 from '../../test/utils.ts';

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
  store.dispatch(
    setProfile({
      email: '',
      name: '',
      surname: '',
      sex: '',
      age: '',
      height: '',
      weight: '',
      image: '',
    }),
  );
});

afterAll(() => server.close());

async function renderProfilePage() {
  const dispatchRequest = jest.fn();
  server.events.on('request:end', dispatchRequest);
  act(() => {
    render(
      <Provider store={store}>
        <Profile />
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
      </Provider>,
    );
  });
  await waitFor(() => {
    expect(dispatchRequest).toHaveBeenCalledTimes(1);
  });
}

async function inputProfileInfo() {
  await waitFor(() => {
    expect(screen.getByTestId('email-input')).toHaveValue('test@test.ru');
  });
  await userEvent.type(screen.getByTestId('name-input'), 'name');
  expect(screen.getByTestId('name-input')).toHaveValue('name');

  await userEvent.type(screen.getByTestId('surname-input'), 'surname');
  expect(screen.getByTestId('surname-input')).toHaveValue('surname');

  await userEvent.selectOptions(screen.getByTestId('sex-select'), 'male');
  expect(screen.getByTestId('sex-select')).toHaveTextContent('male');

  await userEvent.type(screen.getByTestId('age-input'), '20');
  expect(screen.getByTestId('age-input')).toHaveValue('20');

  await userEvent.type(screen.getByTestId('height-input'), '12');
  expect(screen.getByTestId('height-input')).toHaveValue('12');

  await userEvent.type(screen.getByTestId('weight-input'), '10.1');
  expect(screen.getByTestId('weight-input')).toHaveValue('10.1');
}

describe('Profile - General', () => {
  test('Пустые поля', async () => {
    await renderProfilePage();
    await waitFor(() => {
      expect(screen.getByTestId('email-input')).toHaveValue('test@test.ru');
    });
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('surname-input')).toHaveValue('');
    expect(screen.getByTestId('sex-select')).toHaveValue('');
    expect(screen.getByTestId('age-input')).toHaveValue('');
    expect(screen.getByTestId('height-input')).toHaveValue('');
    expect(screen.getByTestId('weight-input')).toHaveValue('');
  });

  test('Получение данных с бэка', async () => {
    server.use(
      http.get(`${BASE_URL}profile`, () => {
        return HttpResponse.json(
          {
            message: 'Успешное завершение операции',
            data: {
              height: 12,
              weight: 10.1,
              email: 'test1@test.ru',
              name: 'name',
              surname: 'surname',
              age: 20,
              sex: 'male',
              image: '',
            },
          },
          { status: 200 },
        );
      }),
    );
    await renderProfilePage();
    await waitFor(() => {
      expect(screen.getByTestId('email-input')).toHaveValue('test1@test.ru');
    });
    expect(screen.getByTestId('name-input')).toHaveValue('name');
    expect(screen.getByTestId('surname-input')).toHaveValue('surname');
    expect(screen.getByTestId('sex-select')).toHaveValue('male');
    expect(screen.getByTestId('age-input')).toHaveValue('20');
    expect(screen.getByTestId('height-input')).toHaveValue('12');
    expect(screen.getByTestId('weight-input')).toHaveValue('10.1');
  });

  test('Подтверждение отправки данных бэку', async () => {
    await renderProfilePage();
    await inputProfileInfo();

    await userEvent.click(screen.getByTestId('saving-btn'));
    await userEvent.click(screen.getByTestId('saving-dialog-btn'));

    await waitFor(() => {
      expect(screen.queryByText('Updated successfully!')).toBeInTheDocument();
    });
  });

  test('Отмена отправки данных бэку', async () => {
    await renderProfilePage();
    await inputProfileInfo();

    await userEvent.click(screen.getByTestId('saving-btn'));
    await userEvent.click(screen.getByTestId('not-saving-dialog-btn'));

    expect(screen.queryByText('Save changes?')).not.toBeVisible();
  });

  test('Подтверждение отмены внесенных изменений', async () => {
    await renderProfilePage();
    await inputProfileInfo();

    await userEvent.click(screen.getByTestId('discard-btn'));
    await userEvent.click(screen.getByTestId('discard-dialog-btn'));

    await waitFor(() => {
      expect(screen.queryByText('Updates cancelled!')).toBeInTheDocument();
    });
  });

  test('Отмена отмены внесенных изменений', async () => {
    await renderProfilePage();
    await inputProfileInfo();

    await userEvent.click(screen.getByTestId('discard-btn'));
    await userEvent.click(screen.getByTestId('not-discard-dialog-btn'));

    expect(screen.queryByText('Discard changes?')).not.toBeVisible();
  });

  test('Обработка 400 ошибки при обновлении профиля', async () => {
    server.use(
      http.put(`${BASE_URL}profile`, () => {
        return HttpResponse.json(
          {
            message: 'Error!',
            data: {},
          },
          { status: 400 },
        );
      }),
    );
    await renderProfilePage();
    await inputProfileInfo();

    await userEvent.click(screen.getByTestId('saving-btn'));
    await userEvent.click(screen.getByTestId('saving-dialog-btn'));

    await waitFor(() => {
      expect(screen.queryByText('Error!')).toBeInTheDocument();
    });
  });

  test('Обработка 500 ошибки при обновлении профиля', async () => {
    server.use(
      http.put(`${BASE_URL}profile`, () => {
        return HttpResponse.json(
          {
            message: '',
            data: {},
          },
          { status: 500 },
        );
      }),
    );
    await renderProfilePage();
    await inputProfileInfo();

    await userEvent.click(screen.getByTestId('saving-btn'));
    await userEvent.click(screen.getByTestId('saving-dialog-btn'));

    await waitFor(() => {
      expect(screen.queryByText('Error on the server. Please try again later')).toBeInTheDocument();
    });
  });

  test('Обработка неизвестной ошибки при обновлении профиля', async () => {
    server.use(
      http.put(`${BASE_URL}profile`, () => {
        return HttpResponse.json(
          {
            message: '',
            data: {},
          },
          { status: 52 },
        );
      }),
    );
    await renderProfilePage();
    await inputProfileInfo();

    await userEvent.click(screen.getByTestId('saving-btn'));
    await userEvent.click(screen.getByTestId('saving-dialog-btn'));

    await waitFor(() => {
      expect(screen.queryByText('Unexpected error')).toBeInTheDocument();
    });
  });
});

describe('Profile - Name', () => {
  test('Минимальная длина поля Name', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), 'ad');
    expect(screen.getByTestId('name-input')).toHaveValue('ad');
    expect((screen.getByTestId('name-input') as HTMLInputElement).value).toHaveLength(2);
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Длина поля Name меньше минимальной', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), 'a');
    expect(screen.getByTestId('name-input')).toHaveValue('a');
    expect((screen.getByTestId('name-input') as HTMLInputElement).value).toHaveLength(1);
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('name-error')).not.toBeEmptyDOMElement();
  });

  test('Максимальная длина поля Name', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), 'qwertyuiopasdfghjklzxcvbngmhdkss');
    expect(screen.getByTestId('name-input')).toHaveValue('qwertyuiopasdfghjklzxcvbngmhdkss');
    expect((screen.getByTestId('name-input') as HTMLInputElement).value).toHaveLength(32);
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Длина поля Name больше максимальной', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), 'qwertyuiopasdfghjklzxcvbngmhdksas');
    expect(screen.getByTestId('name-input')).toHaveValue('qwertyuiopasdfghjklzxcvbngmhdksas');
    expect((screen.getByTestId('name-input') as HTMLInputElement).value).toHaveLength(33);
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('name-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Name - пустое', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Name содержит буквы русского алфавита', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), 'фы');
    expect(screen.getByTestId('name-input')).toHaveValue('фы');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Name содержит цифры', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), '12');
    expect(screen.getByTestId('name-input')).toHaveValue('12');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Name содержит спец символы', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('name-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('name-input'), '*.');
    expect(screen.getByTestId('name-input')).toHaveValue('*.');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('name-error')).toBeEmptyDOMElement();
  });
});

describe('Profile - Surname', () => {
  test('Минимальная длина поля Surname', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('surname-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('surname-input'), 'ad');
    expect(screen.getByTestId('surname-input')).toHaveValue('ad');
    expect((screen.getByTestId('surname-input') as HTMLInputElement).value).toHaveLength(2);
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('surname-error')).toBeEmptyDOMElement();
  });

  test('Длина поля Surname меньше минимальной', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('surname-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('surname-input'), 'a');
    expect(screen.getByTestId('surname-input')).toHaveValue('a');
    expect((screen.getByTestId('surname-input') as HTMLInputElement).value).toHaveLength(1);
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('surname-error')).not.toBeEmptyDOMElement();
  });

  test('Максимальная длина поля Surname', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('surname-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('surname-input'), 'qwertyuiopasdfghjklzxcvbngmhdkss');
    expect(screen.getByTestId('surname-input')).toHaveValue('qwertyuiopasdfghjklzxcvbngmhdkss');
    expect((screen.getByTestId('surname-input') as HTMLInputElement).value).toHaveLength(32);
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('surname-error')).toBeEmptyDOMElement();
  });

  test('Длина поля Surname больше максимальной', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('surname-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('surname-input'), 'qwertyuiopasdfghjklzxcvbngmhdksas');
    expect(screen.getByTestId('surname-input')).toHaveValue('qwertyuiopasdfghjklzxcvbngmhdksas');
    expect((screen.getByTestId('surname-input') as HTMLInputElement).value).toHaveLength(33);
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('surname-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Surname - пустое', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('surname-input')).toHaveValue('');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('surname-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Surname содержит буквы русского алфавита', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('surname-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('surname-input'), 'фы');
    expect(screen.getByTestId('surname-input')).toHaveValue('фы');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('surname-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Surname содержит цифры', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('surname-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('surname-input'), '12');
    expect(screen.getByTestId('surname-input')).toHaveValue('12');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('surname-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Surname содержит спец символы', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('surname-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('surname-input'), '*.');
    expect(screen.getByTestId('surname-input')).toHaveValue('*.');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('surname-error')).toBeEmptyDOMElement();
  });
});

describe('Profile - Sex', () => {
  test('Изменение значения', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('sex-select')).toHaveTextContent('Sex');
    await userEvent.selectOptions(screen.getByTestId('sex-select'), 'male');
    expect(screen.getByTestId('sex-select')).toHaveTextContent('male');
  });
});

describe('Profile - Age', () => {
  test('Значение поля Age граничное снизу', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('age-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('age-input'), '0');
    expect(screen.getByTestId('age-input')).toHaveValue('0');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('age-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Age имеет минимальное отклонение от граничного значения снизу (-1)', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('age-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('age-input'), '-1');
    expect(screen.getByTestId('age-input')).toHaveValue('-1');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('age-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Age имеет минимальное отклонение от граничного значения снизу (+1)', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('age-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('age-input'), '1');
    expect(screen.getByTestId('age-input')).toHaveValue('1');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('age-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Age граничное сверху', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('age-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('age-input'), '150');
    expect(screen.getByTestId('age-input')).toHaveValue('150');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('age-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Age имеет минимальное отклонение от граничного значения сверху (+1)', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('age-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('age-input'), '151');
    expect(screen.getByTestId('age-input')).toHaveValue('151');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('age-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Age имеет минимальное отклонение от граничного значения сверху (-1)', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('age-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('age-input'), '149');
    expect(screen.getByTestId('age-input')).toHaveValue('149');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('age-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Age - пустое', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('age-input')).toHaveValue('');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('age-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Age содержит буквы латинского алфавита', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('age-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('age-input'), '1d');
    expect(screen.getByTestId('age-input')).toHaveValue('1d');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('age-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Age содержит буквы русского алфавита', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('age-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('age-input'), '1ы');
    expect(screen.getByTestId('age-input')).toHaveValue('1ы');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('age-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Age - дробное число', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('age-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('age-input'), '12.1');
    expect(screen.getByTestId('age-input')).toHaveValue('12.1');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('age-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Age содержит спец символы', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('age-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('age-input'), '1*');
    expect(screen.getByTestId('age-input')).toHaveValue('1*');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('age-error')).not.toBeEmptyDOMElement();
  });
});

describe('Profile - Height', () => {
  test('Минимальная длина поля Height', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('height-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('height-input'), '00');
    expect(screen.getByTestId('height-input')).toHaveValue('00');
    expect((screen.getByTestId('height-input') as HTMLInputElement).value).toHaveLength(2);
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('height-error')).toBeEmptyDOMElement();
  });

  test('Длина поля Height меньше минимальной', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('height-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('height-input'), '0');
    expect(screen.getByTestId('height-input')).toHaveValue('0');
    expect((screen.getByTestId('height-input') as HTMLInputElement).value).toHaveLength(1);
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('height-error')).not.toBeEmptyDOMElement();
  });

  test('Максимальная длина поля Height', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('height-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('height-input'), '000');
    expect(screen.getByTestId('height-input')).toHaveValue('000');
    expect((screen.getByTestId('height-input') as HTMLInputElement).value).toHaveLength(3);
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('height-error')).toBeEmptyDOMElement();
  });

  test('Длина поля Height больше максимальной', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('height-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('height-input'), '0000');
    expect(screen.getByTestId('height-input')).toHaveValue('0000');
    expect((screen.getByTestId('height-input') as HTMLInputElement).value).toHaveLength(4);
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('height-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Height - пустое', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('height-input')).toHaveValue('');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('height-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Height содержит буквы латинского алфавита', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('height-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('height-input'), '0d');
    expect(screen.getByTestId('height-input')).toHaveValue('0d');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('height-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Height содержит буквы русского алфавита', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('height-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('height-input'), '0ы');
    expect(screen.getByTestId('height-input')).toHaveValue('0ы');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('height-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Height - дробное число', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('height-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('height-input'), '12.0');
    expect(screen.getByTestId('height-input')).toHaveValue('12.0');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('height-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Height содержит спец символы', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('height-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('height-input'), '0*');
    expect(screen.getByTestId('height-input')).toHaveValue('0*');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('height-error')).not.toBeEmptyDOMElement();
  });
});

describe('Profile - Weight', () => {
  test('Минимальная длина целой части поля Weight', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('weight-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('weight-input'), '0.0');
    expect(screen.getByTestId('weight-input')).toHaveValue('0.0');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('weight-error')).toBeEmptyDOMElement();
  });

  test('Отсутствие целой части поля Weight', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('weight-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('weight-input'), '.0');
    expect(screen.getByTestId('weight-input')).toHaveValue('.0');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('weight-error')).not.toBeEmptyDOMElement();
  });

  test('Максимальная длина целой части поля Weight', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('weight-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('weight-input'), '000.0');
    expect(screen.getByTestId('weight-input')).toHaveValue('000.0');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('weight-error')).toBeEmptyDOMElement();
  });

  test('Длина целой части поля Weight больше максимальной', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('weight-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('weight-input'), '0000.0');
    expect(screen.getByTestId('weight-input')).toHaveValue('0000.0');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('weight-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Weight - целое число', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('weight-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('weight-input'), '000');
    expect(screen.getByTestId('weight-input')).toHaveValue('000');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('weight-error')).toBeEmptyDOMElement();
  });

  test('Длина дробной части поля Weight больше максимальной', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('weight-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('weight-input'), '000.00');
    expect(screen.getByTestId('weight-input')).toHaveValue('000.00');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('weight-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Weight - пустое', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('weight-input')).toHaveValue('');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('weight-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Weight - отрицательное число', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('weight-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('weight-input'), '-0.0');
    expect(screen.getByTestId('weight-input')).toHaveValue('-0.0');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('weight-error')).toBeEmptyDOMElement();
  });

  test('Значение поля Weight содержит буквы латинского алфавита', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('weight-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('weight-input'), '0d.f');
    expect(screen.getByTestId('weight-input')).toHaveValue('0d.f');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('weight-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Weight содержит буквы русского алфавита', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('weight-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('weight-input'), '0ы.ы');
    expect(screen.getByTestId('weight-input')).toHaveValue('0ы.ы');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('weight-error')).not.toBeEmptyDOMElement();
  });

  test('Значение поля Weight содержит спец символы', async () => {
    await renderProfilePage();
    expect(screen.getByTestId('weight-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('weight-input'), '0*.#');
    expect(screen.getByTestId('weight-input')).toHaveValue('0*.#');
    await userEvent.click(screen.getByTestId('saving-btn'));
    expect(screen.getByTestId('weight-error')).not.toBeEmptyDOMElement();
  });
});

describe('Profile - Avatar', () => {
  test('Загрузка изображения', async () => {
    await renderProfilePage();
    const file = new File(base64toUint8(image), '3.jpeg');
    await userEvent.upload(screen.getByTestId('avatar-input'), file);
    await waitFor(() => {
      // @ts-ignore
      expect((screen.getByTestId('avatar-input') as HTMLInputElement).files[0].name).toBe('3.jpeg');
      // @ts-ignore
      expect((screen.getByTestId('avatar-input') as HTMLInputElement).files.length).toBe(1);
    });
  });

  test('Загрузка не изображения', async () => {
    await renderProfilePage();
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    await userEvent.upload(screen.getByTestId('avatar-input'), file);
    expect(screen.queryByText('Error! This is not an image!')).toBeInTheDocument();
  });

  test('Получение аватара с бэка', async () => {
    server.use(
      http.get(`${BASE_URL}profile`, () => {
        return HttpResponse.json(
          {
            message: 'Успешное завершение операции',
            data: {
              height: undefined,
              weight: undefined,
              email: 'test@test.ru',
              name: undefined,
              surname: undefined,
              age: undefined,
              sex: undefined,
              image: image,
            },
          },
          { status: 200 },
        );
      }),
    );
    await renderProfilePage();
    await waitFor(() => {
      expect(screen.getByTestId('avatar-img')).toHaveAttribute('src', `data:image/*;base64,${image}`);
    });
  });
});
