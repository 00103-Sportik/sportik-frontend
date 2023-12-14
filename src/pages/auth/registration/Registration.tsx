import { Field, FieldProps, Form, Formik } from 'formik';
import {
  SignUpFields,
  signUpInitialValues,
  signUpValidationSchema,
} from '../../../common/validations/authValidationSchema.ts';
import { NavLink } from 'react-router-dom';
import { useRegistrationMutation, useResendEmailMutation } from '../../../store/auth/auth.api.ts';
import { mapPathToTitle } from '../../../common/types/auth.ts';
import { Input } from '../../../common/components/input/Input.tsx';
import { useEffect, useState } from 'react';
import { Dialog } from '@ariakit/react';
import { toast } from 'react-toastify';
import styles from '../../../pages/auth/authLayout/AuthLayout.module.css';

function Registration() {
  const [open, setOpen] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [email, setEmail] = useState('');
  const [registration, { isSuccess }] = useRegistrationMutation();
  const [resendEmail, {}] = useResendEmailMutation();

  useEffect(() => {
    if (seconds > 0 && timerActive) {
      setTimeout(setSeconds, 1000, seconds - 1);
    } else {
      setTimerActive(false);
    }
  }, [seconds, timerActive]);

  const onSubmit = async (values: SignUpFields) => {
    setEmail(values.email);
    registration(values);
  };

  if (isSuccess && !open) {
    toast('Activation link sent to your email!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    setOpen(true);
    setTimerActive(!timerActive);
  }

  return (
    <>
      <Formik initialValues={signUpInitialValues} onSubmit={onSubmit} validationSchema={signUpValidationSchema}>
        {() => (
          <Form>
            <div className={styles.titleLayout}>
              <h1 className={styles.titleSize}>{mapPathToTitle[location.pathname as keyof typeof mapPathToTitle]}</h1>
            </div>
            <div className={styles.inputsBox}>
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
            </div>
            <button className="btn-black" type="submit">
              Sign Up
            </button>
            <Dialog
              open={open}
              getPersistentElements={() => document.querySelectorAll('.Toastify')}
              backdrop={<div className="backdrop" />}
              className="dialog"
            >
              <p className="description">
                An activation link has been sent to your email. If you did not receive it, click on the "Send again":
              </p>
              <div className="buttons">
                {seconds ? (
                  <div className="@apply flex flex-col">
                    <p className="@apply">Time to resend: {seconds} sec.</p>
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
                      toast('Activation link sent to your email!', {
                        position: 'top-center',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'dark',
                      });
                    }}
                  >
                    Send again
                  </button>
                )}
              </div>
            </Dialog>
            <NavLink to="/signin" className={styles.referenceBack}>
              Already have an account? Sign In
            </NavLink>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default Registration;
