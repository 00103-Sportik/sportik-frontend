import styles from './Registration.module.scss';
import { Field, Form, Formik } from 'formik';
import {
  SignUpFields,
  signUpInitialValues,
  signUpValidationSchema,
} from '../../../common/validations/validationSchema.ts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRegistrationMutation } from '../../../store/auth/auth.api.ts';
import { mapPathToTitle } from '../../../common/types/auth.ts';

function Registration() {
  const [register, { isSuccess, data }] = useRegistrationMutation();
  const navigate = useNavigate();
  const onSubmit = (values: SignUpFields) => {
    register(values);
  };

  if (isSuccess) {
    toast(data?.message || 'Регистрация прошла успешно!');
    navigate('/signin');
  }
  return (
    <>
      <Formik
        initialValues={signUpInitialValues}
        onSubmit={onSubmit}
        validationSchema={signUpValidationSchema}
      >
        {({ isValid, submitCount }) => (
          <Form className="layout">
            {!isValid && !!submitCount && (
              <div className={styles.errorNotification}>
                Введите корректный email или пароль.
              </div>
            )}
            <h1>
              {mapPathToTitle[location.pathname as keyof typeof mapPathToTitle]}
            </h1>
            <Field name="email"></Field>
            <Field name="password"></Field>
            <button className="btn-black" type="submit">
              Зарегистрироваться
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default Registration;
