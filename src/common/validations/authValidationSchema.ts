import * as Yup from 'yup';
import { AuthRequest } from '../types/auth.ts';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 32;

const containsAtLeastOneUppercase = /[A-Z]+/;
const containsAtLeastOneLowerCase = /[a-z]+/;
const containsAtLeastOneDigit = /[0-9]+/;
const containsOnlyValidChar = /[0-9A-Za-z]+/;
const containsWhiteSpaces = /\s/;

export type SignInFields = AuthRequest;

export type SignUpFields = SignInFields;

export type ResendEmailFields = Pick<AuthRequest, 'email'>;

export const signInValidationSchema = Yup.object().shape({
    email: Yup.string()
        .test('noSpaces', 'No spaces allowed', (value) => !containsWhiteSpaces.test(value || ''))
        .required('Required field')
        .email('Incorrect email'),
    password: Yup.string()
        .test('noSpaces', 'No spaces allowed', (value) => !containsWhiteSpaces.test(value || ''))
        .required('Required field')
        .min(MIN_PASSWORD_LENGTH, `Min length ${MIN_PASSWORD_LENGTH} characters`)
        .max(MAX_PASSWORD_LENGTH, `Max length ${MAX_PASSWORD_LENGTH} characters`)
        .test(
            'containsOnlyAllowedCharacters',
            'The password must contain Latin letters (at least one lowercase and one uppercase) and at least one number',
            (value) => {
                return (
                    containsAtLeastOneUppercase.test(value || '') &&
                    containsAtLeastOneLowerCase.test(value || '') &&
                    containsAtLeastOneDigit.test(value || '') &&
                    !(value || '').replace(containsOnlyValidChar, '')
                );
            },
        ),
});

export const resendEmailValidationSchema = Yup.object().shape({
    email: Yup.string()
        .test('noSpaces', 'No spaces allowed', (value) => !containsWhiteSpaces.test(value || ''))
        .required('Required field')
        .email('Incorrect email'),
});

export const signUpValidationSchema = signInValidationSchema;

export const signInInitialValues: SignInFields = {
    email: '',
    password: '',
};

export const signUpInitialValues = signInInitialValues;
