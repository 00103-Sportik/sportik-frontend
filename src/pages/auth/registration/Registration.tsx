import { Field, FieldProps, Form, Formik } from 'formik';
import {
  SignUpFields,
  signUpInitialValues,
  signUpValidationSchema,
} from '../../../common/validations/authValidationSchema.ts';
import styles from './Registration.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRegistrationMutation, useResendEmailMutation } from '../../../store/auth/auth.api.ts';
import { mapPathToTitle } from '../../../common/types/auth.ts';
import { Input } from '../../../common/components/input/Input.tsx';
import { useEffect, useState } from 'react';
import { Dialog } from '@ariakit/react';

function Registration() {
  const [open, setOpen] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [email, setEmail] = useState('');
  const [registration, { isSuccess }] = useRegistrationMutation();
  const [resendEmail, {}] = useResendEmailMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (seconds > 0 && timerActive) {
      setTimeout(setSeconds, 1000, seconds - 1);
    } else {
      setTimerActive(false);
    }
  }, [seconds, timerActive]);

  const onSubmit = (values: SignUpFields) => {
    setEmail(values.email);
    registration(values);
  };

  if (isSuccess) {
    navigate('/signin');
  }

  return (
    <>
      <Formik initialValues={signUpInitialValues} onSubmit={onSubmit} validationSchema={signUpValidationSchema}>
        {({ isValid, submitCount }) => (
          <Form className="layout">
            <div className="title-layout">
              <h1 className={styles.titleLayout}>{mapPathToTitle[location.pathname as keyof typeof mapPathToTitle]}</h1>
            </div>
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
            <div className="field-password">
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
            </div>
            <button
              className="btn-black"
              type="submit"
              onClick={() => {
                setOpen(true);
                setTimerActive(!timerActive);
              }}
            >
              Sign Up
            </button>
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              getPersistentElements={() => document.querySelectorAll('.Toastify')}
              backdrop={<div className="backdrop" />}
              className="dialog"
            >
              <p className="description">
                An activation link has been sent to your email. If you did not receive it, click on the "Send again":
              </p>
              <div className="buttons">
                {seconds ? (
                  <div className="@apply flex flex-row">
                    <p className="@apply px-3">Time to resend: {seconds}</p>
                    <button disabled className="btn-black">
                      Send again
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn-black"
                    onClick={() => {
                      resendEmail({ email });
                      setSeconds(60);
                      setTimerActive(true);
                    }}
                  >
                    Send again
                  </button>
                )}
              </div>
            </Dialog>
            <NavLink to="/signin">Already have an account? Sign In</NavLink>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default Registration;
