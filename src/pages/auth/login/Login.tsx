import { useAuthenticationMutation } from '../../../store/auth/auth.api.ts';
import {
  SignInFields,
  signInInitialValues,
  signInValidationSchema,
} from '../../../common/validations/validationSchema.ts';
// import { toast } from 'react-toastify';
import { Field, Form, Formik } from 'formik';
import { mapPathToTitle } from '../../../common/types/auth.ts';

function Login() {
  const [login] = useAuthenticationMutation();
  const onSubmit = (values: SignInFields) => {
    login(values);
  };

  return (
    <>
      <Formik initialValues={signInInitialValues} onSubmit={onSubmit} validationSchema={signInValidationSchema}>
        {({ isValid, submitCount }) => {
          return (
            <Form className="layout">
              {!isValid && !!submitCount && <div>Введите корректный email или пароль.</div>}
              <h1>{mapPathToTitle[location.pathname as keyof typeof mapPathToTitle]}</h1>
              <Field name="email"></Field>
              <Field name="password"></Field>
              {!isValid && !!submitCount && <div>Введите корректный email или пароль.</div>}
              <button className="btn-black" type="submit">
                Войти
              </button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}

export default Login;
