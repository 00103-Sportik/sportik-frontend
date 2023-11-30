import * as Yup from 'yup';
import { AuthRequest } from '../types/auth.ts';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 32;

const regexErrorMessage =
  'Пароль должен содержать латинские буквы(минимум одну строчную и одну прописную) и как минимум одну цифру';

const containsAtLeastOneUppercase = /[A-Z]+/;
const containsAtLeastOneLowerCase = /[A-Z]+/;
const containsAtLeastOneDigit = /[0-9]+/;
const containsWhiteSpaces = /\s/;

export type SignInFields = AuthRequest;

export type SignUpFields = SignInFields;

export type UpdatePasswordFields = Pick<AuthRequest, 'password'>;

export const signInValidationSchema = Yup.object().shape({
  email: Yup.string()
    .test(
      'noSpaces',
      'Не допускается наличие пробелов',
      (value) => !containsWhiteSpaces.test(value || ''),
    )
    .required('Обязательное поле')
    .email('Введите корректный email'),
  password: Yup.string()
    .test(
      'noSpaces',
      'Не допускается наличие пробелов',
      (value) => !containsWhiteSpaces.test(value || ''),
    )
    .required('Обязательное поле')
    .min(
      MIN_PASSWORD_LENGTH,
      `Длина пароля не может быть менее ${MIN_PASSWORD_LENGTH} символов`,
    )
    .max(
      MAX_PASSWORD_LENGTH,
      `Длина пароля не может быть более ${MAX_PASSWORD_LENGTH} символов`,
    )
    .test('containsOnlyAllowedCharacters', regexErrorMessage, (value) => {
      return (
        containsAtLeastOneUppercase.test(value || '') &&
        containsAtLeastOneLowerCase.test(value || '') &&
        containsAtLeastOneDigit.test(value || '')
      );
    }),
});

export const signUpValidationSchema = signInValidationSchema;

export const signInInitialValues: SignInFields = {
  email: '',
  password: '',
};

export const signUpInitialValues: SignUpFields = {
  email: '',
  password: '',
};
