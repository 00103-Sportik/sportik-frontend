import { useAuthenticationMutation } from '../../../store/auth/auth.api.ts';
import {
  SignInFields,
  signInInitialValues,
  signInValidationSchema,
} from '../../../common/validations/authValidationSchema.ts';
import styles from '../../../pages/auth/authLayout/AuthLayout.module.css';
import { Field, FieldProps, Form, Formik } from 'formik';
import { mapPathToTitle } from '../../../common/types/auth.ts';
import { Input } from '../../../common/components/input/Input.tsx';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
  const [authentication, { error, isSuccess }] = useAuthenticationMutation();
  const navigate = useNavigate();

  const onSubmit = (values: SignInFields) => {
    authentication(values);
  };

  if (isSuccess) {
    navigate('/');
    toast('Login successfully!', {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  }
  if (error) {
    toast('message' in error ? error && error.message : 'Incorrect email or password', {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  }

  return (
    <>
      <Formik initialValues={signInInitialValues} onSubmit={onSubmit} validationSchema={signInValidationSchema}>
        {({ isValid, submitCount, values }) => {
          return (
            <Form>
              <div className={styles.titleLayout}>
                <h1 className={styles.titleSize}>{mapPathToTitle[location.pathname as keyof typeof mapPathToTitle]}</h1>
              </div>
              <div className={styles.inputsBox}>
                <Field name="email">
                  {({ field, form }: FieldProps) => (
                    <Input
                      testid="email"
                      autoComplete="email"
                      type="text"
                      {...field}
                      placeholder="Email"
                      onClear={() => form.setFieldValue('email', '')}
                    />
                  )}
                </Field>
                <Field name="password">
                  {({ field }: FieldProps) => (
                    <Input
                      testid="password"
                      autoComplete="current-password"
                      type="password"
                      {...field}
                      placeholder="Password"
                    />
                  )}
                </Field>
              </div>
              {!isValid && !!submitCount && (
                <p data-testid="error-p" className="text-error pl-5">
                  Incorrect email or password!
                </p>
              )}
              <button
                data-testid="signin-btn"
                disabled={values.email.length === 0 || values.password.length === 0}
                className="btn-black"
                type="submit"
              >
                Sign In
              </button>
              <NavLink data-testid="signup-link" to="/signup" className={styles.referenceBack}>
                You do not have an account? Sign Up
              </NavLink>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}

export default Login;
