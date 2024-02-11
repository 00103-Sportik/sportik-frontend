import HRCalc from './HRCalc.tsx';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import store from '../../store/store.ts';
import '@testing-library/jest-dom';
import { ToastContainer } from 'react-toastify';
import { setProfile } from '../../store/profile/profile.slice.ts';

function renderHRCalcPage() {
  render(
    <Provider store={store}>
      <HRCalc />
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
}

describe('HRCalc с расчетом по HRmax', () => {
  test('Значение поля HRmax граничное снизу', async () => {
    renderHRCalcPage();
    expect(screen.getByTestId('hr-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('hr-input'), '100');
    expect(screen.getByTestId('hr-input')).toHaveValue('100');
    await userEvent.click(screen.getByTestId('hr-calc-btn'));
    expect(screen.getByTestId('row1')).toHaveTextContent('90-100');
    expect(screen.getByTestId('row2')).toHaveTextContent('80-90');
    expect(screen.getByTestId('row3')).toHaveTextContent('70-80');
    expect(screen.getByTestId('row4')).toHaveTextContent('60-70');
    expect(screen.getByTestId('row5')).toHaveTextContent('50-60');
    expect(screen.getByTestId('hr-error')).toBeEmptyDOMElement();
  });

  test('Значение поля HRmax имеет минимальное отклонение от граничного значения снизу (-1)', async () => {
    renderHRCalcPage();
    expect(screen.getByTestId('hr-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('hr-input'), '99');
    expect(screen.getByTestId('hr-input')).toHaveValue('99');
    await userEvent.click(screen.getByTestId('hr-calc-btn'));
    expect(screen.getByTestId('row1')).toHaveTextContent('');
    expect(screen.getByTestId('row2')).toHaveTextContent('');
    expect(screen.getByTestId('row3')).toHaveTextContent('');
    expect(screen.getByTestId('row4')).toHaveTextContent('');
    expect(screen.getByTestId('row5')).toHaveTextContent('');
    expect(screen.getByTestId('hr-error')).not.toHaveValue('');
  });

  test('Значение поля HRmax имеет минимальное отклонение от граничного значения снизу (+1)', async () => {
    renderHRCalcPage();
    expect(screen.getByTestId('hr-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('hr-input'), '101');
    expect(screen.getByTestId('hr-input')).toHaveValue('101');
    await userEvent.click(screen.getByTestId('hr-calc-btn'));
    expect(screen.getByTestId('row1')).toHaveTextContent('91-101');
    expect(screen.getByTestId('row2')).toHaveTextContent('81-91');
    expect(screen.getByTestId('row3')).toHaveTextContent('71-81');
    expect(screen.getByTestId('row4')).toHaveTextContent('61-71');
    expect(screen.getByTestId('row5')).toHaveTextContent('51-61');
    expect(screen.getByTestId('hr-error')).not.toHaveValue('');
  });

  test('Значение поля HRmax граничное сверху', async () => {
    renderHRCalcPage();
    expect(screen.getByTestId('hr-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('hr-input'), '250');
    expect(screen.getByTestId('hr-input')).toHaveValue('250');
    await userEvent.click(screen.getByTestId('hr-calc-btn'));
    expect(screen.getByTestId('row1')).toHaveTextContent('225-250');
    expect(screen.getByTestId('row2')).toHaveTextContent('200-225');
    expect(screen.getByTestId('row3')).toHaveTextContent('175-200');
    expect(screen.getByTestId('row4')).toHaveTextContent('150-175');
    expect(screen.getByTestId('row5')).toHaveTextContent('125-150');
    expect(screen.getByTestId('hr-error')).not.toHaveValue('');
  });

  test('Значение поля HRmax имеет минимальное отклонение от граничного значения сверху (+1)', async () => {
    renderHRCalcPage();
    expect(screen.getByTestId('hr-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('hr-input'), '249');
    expect(screen.getByTestId('hr-input')).toHaveValue('249');
    await userEvent.click(screen.getByTestId('hr-calc-btn'));
    expect(screen.getByTestId('row1')).toHaveTextContent('224-249');
    expect(screen.getByTestId('row2')).toHaveTextContent('199-224');
    expect(screen.getByTestId('row3')).toHaveTextContent('174-199');
    expect(screen.getByTestId('row4')).toHaveTextContent('149-174');
    expect(screen.getByTestId('row5')).toHaveTextContent('125-149');
    expect(screen.getByTestId('hr-error')).not.toHaveValue('');
  });

  test('Значение поля HRmax имеет минимальное отклонение от граничного значения сверху (-1)', async () => {
    renderHRCalcPage();
    expect(screen.getByTestId('hr-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('hr-input'), '101');
    expect(screen.getByTestId('hr-input')).toHaveValue('101');
    await userEvent.click(screen.getByTestId('hr-calc-btn'));
    expect(screen.getByTestId('row1')).toHaveTextContent('91-101');
    expect(screen.getByTestId('row2')).toHaveTextContent('81-91');
    expect(screen.getByTestId('row3')).toHaveTextContent('71-81');
    expect(screen.getByTestId('row4')).toHaveTextContent('61-71');
    expect(screen.getByTestId('row5')).toHaveTextContent('51-61');
    expect(screen.getByTestId('hr-error')).not.toHaveValue('');
  });

  test('Значение поля HRmax - дробное число', async () => {
    renderHRCalcPage();
    expect(screen.getByTestId('hr-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('hr-input'), '150.5');
    expect(screen.getByTestId('hr-input')).toHaveValue('150.5');
    await userEvent.click(screen.getByTestId('hr-calc-btn'));
    expect(screen.getByTestId('row1')).toHaveTextContent('');
    expect(screen.getByTestId('row2')).toHaveTextContent('');
    expect(screen.getByTestId('row3')).toHaveTextContent('');
    expect(screen.getByTestId('row4')).toHaveTextContent('');
    expect(screen.getByTestId('row5')).toHaveTextContent('');
    expect(screen.getByTestId('hr-error')).not.toHaveValue('');
  });

  test('Значение поля HRmax содержит буквы латинского алфавита', async () => {
    renderHRCalcPage();
    expect(screen.getByTestId('hr-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('hr-input'), '1dС');
    expect(screen.getByTestId('hr-input')).toHaveValue('1dС');
    await userEvent.click(screen.getByTestId('hr-calc-btn'));
    expect(screen.getByTestId('row1')).toHaveTextContent('');
    expect(screen.getByTestId('row2')).toHaveTextContent('');
    expect(screen.getByTestId('row3')).toHaveTextContent('');
    expect(screen.getByTestId('row4')).toHaveTextContent('');
    expect(screen.getByTestId('row5')).toHaveTextContent('');
    expect(screen.getByTestId('hr-error')).not.toHaveValue('');
  });

  test('Значение поля HRmax содержит буквы русского алфавита', async () => {
    renderHRCalcPage();
    expect(screen.getByTestId('hr-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('hr-input'), '1аР');
    expect(screen.getByTestId('hr-input')).toHaveValue('1аР');
    await userEvent.click(screen.getByTestId('hr-calc-btn'));
    expect(screen.getByTestId('row1')).toHaveTextContent('');
    expect(screen.getByTestId('row2')).toHaveTextContent('');
    expect(screen.getByTestId('row3')).toHaveTextContent('');
    expect(screen.getByTestId('row4')).toHaveTextContent('');
    expect(screen.getByTestId('row5')).toHaveTextContent('');
    expect(screen.getByTestId('hr-error')).not.toHaveValue('');
  });

  test('Значение поля HRmax содержит спец символы', async () => {
    renderHRCalcPage();
    expect(screen.getByTestId('hr-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('hr-input'), '1!*');
    expect(screen.getByTestId('hr-input')).toHaveValue('1!*');
    await userEvent.click(screen.getByTestId('hr-calc-btn'));
    expect(screen.getByTestId('row1')).toHaveTextContent('');
    expect(screen.getByTestId('row2')).toHaveTextContent('');
    expect(screen.getByTestId('row3')).toHaveTextContent('');
    expect(screen.getByTestId('row4')).toHaveTextContent('');
    expect(screen.getByTestId('row5')).toHaveTextContent('');
    expect(screen.getByTestId('hr-error')).not.toHaveValue('');
  });

  test('Значение поля HRmax - пустое', async () => {
    renderHRCalcPage();
    expect(screen.getByTestId('hr-input')).toHaveValue('');
    await userEvent.type(screen.getByTestId('hr-input'), '50');
    expect(screen.getByTestId('hr-input')).toHaveValue('50');
    await userEvent.click(screen.getByTestId('hr-calc-btn'));
    expect(screen.getByTestId('row1')).toHaveTextContent('');
    expect(screen.getByTestId('row2')).toHaveTextContent('');
    expect(screen.getByTestId('row3')).toHaveTextContent('');
    expect(screen.getByTestId('row4')).toHaveTextContent('');
    expect(screen.getByTestId('row5')).toHaveTextContent('');
  });
});

describe('HRCalc с расчетом по возрасту', () => {
  test('Значение age указано в профиле', async () => {
    store.dispatch(
      setProfile({
        email: '',
        name: '',
        surname: '',
        sex: '',
        age: '20',
        height: '',
        weight: '',
        image: '',
      }),
    );
    renderHRCalcPage();
    await userEvent.click(screen.getByTestId('age-calc-btn'));
    expect(screen.getByTestId('row1')).toHaveTextContent('180-200');
    expect(screen.getByTestId('row2')).toHaveTextContent('160-180');
    expect(screen.getByTestId('row3')).toHaveTextContent('140-160');
    expect(screen.getByTestId('row4')).toHaveTextContent('120-140');
    expect(screen.getByTestId('row5')).toHaveTextContent('100-120');
    expect(screen.queryByText("You didn't indicate your age in your profile")).not.toBeInTheDocument();
  });

  test('Значение age не указано в профиле', async () => {
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
    renderHRCalcPage();
    await userEvent.click(screen.getByTestId('age-calc-btn'));
    expect(screen.queryByText("You didn't indicate your age in your profile")).toBeInTheDocument();
  });
});
