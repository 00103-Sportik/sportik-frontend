import { Field, FieldProps, Form, Formik } from 'formik';
import {
  SignUpFields,
  signUpInitialValues,
  signUpValidationSchema,
} from '../../../common/validations/validationSchema.ts';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRegistrationMutation } from '../../../store/auth/auth.api.ts';
import { mapPathToTitle } from '../../../common/types/auth.ts';
import { Input } from '../../../common/components/input/Input.tsx';

function Registration() {
  const [register, { isSuccess }] = useRegistrationMutation();
  const navigate = useNavigate();
  const onSubmit = (values: SignUpFields) => {
    register(values);
  };

  if (isSuccess) {
    navigate('/signin');
  }
  return (
    <>
      <Formik initialValues={signUpInitialValues} onSubmit={onSubmit} validationSchema={signUpValidationSchema}>
        {({ isValid, submitCount }) => (
          <Form className="layout">
            <h1>{mapPathToTitle[location.pathname as keyof typeof mapPathToTitle]}</h1>
            {!isValid && !!submitCount && <div>Введите корректный email или пароль.</div>}
            <Field name="email">
              {({ field, form, meta }: FieldProps) => (
                <Input
                  autoComplete="email"
                  type="text"
                  {...field}
                  placeholder="Email"
                  error={meta.touched && !!meta.error}
                  errorText={meta.error}
                  onClear={() => form.setFieldValue('email', '')}
                />
              )}
            </Field>
            <Field name="password">
              {({ field, meta }: FieldProps) => (
                <Input
                  autoComplete="new-password"
                  type="password"
                  {...field}
                  placeholder="Password"
                  error={meta.touched && !!meta.error}
                  errorText={meta.error}
                />
              )}
            </Field>
            <button className="btn-black" type="submit">
              Sign Up
            </button>
            <NavLink to="/signin">Already have an account? Sign In</NavLink>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default Registration;
