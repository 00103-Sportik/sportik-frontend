import { useAuthenticationMutation } from '../../../store/auth/auth.api.ts';
import {
  SignInFields,
  signInInitialValues,
  signInValidationSchema,
} from '../../../common/validations/validationSchema.ts';
import { Field, FieldProps, Form, Formik } from 'formik';
import { mapPathToTitle } from '../../../common/types/auth.ts';
import { Input } from '../../../common/components/input/Input.tsx';
import { NavLink } from 'react-router-dom';

function Login() {
  const [authentication] = useAuthenticationMutation();

  const onSubmit = (values: SignInFields) => {
    authentication(values);
  };

  return (
    <>
      <Formik initialValues={signInInitialValues} onSubmit={onSubmit} validationSchema={signInValidationSchema}>
        {({ isValid, submitCount, values }) => {
          return (
            <Form className="layout">
              <h1>{mapPathToTitle[location.pathname as keyof typeof mapPathToTitle]}</h1>
              <Field name="email">
                {({ field, form }: FieldProps) => (
                  <Input
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
                  <Input autoComplete="current-password" type="password" {...field} placeholder="Password" />
                )}
              </Field>
              {!isValid && !!submitCount && <div>Incorrect email or password!</div>}
              <button
                disabled={values.email.length === 0 || values.password.length === 0}
                className="btn-black"
                type="submit"
              >
                Sign In
              </button>
              <NavLink to="/signup">You do not have an account? Sign Up</NavLink>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}

export default Login;
