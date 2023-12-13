import { Field, FieldProps, Form, Formik } from 'formik';
import { Input } from '../../common/components/input/Input.tsx';
import {
  ExerciseFields,
  exerciseInitialValue,
  exerciseValidationSchema,
} from '../../common/validations/exerciseValidationSchema.ts';
import { useCallback, useState } from 'react';
import { useAppSelector } from '../../store/hooks.ts';
import { selectSubtype, selectType } from '../../store/workouts/workouts.selectors.ts';
import { produce } from 'immer';
import { useGetSubtypesQuery } from '../../store/subtype/subtype.api.ts';
import { combinationParams } from '../../common/types/workouts.ts';
import { useCreateExerciseMutation } from '../../store/exercise/exercise.api.ts';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './Exercise.module.css';
import { EXERCISES_URL } from '../../common/constants/api.ts';

function Exercise() {
  const navigate = useNavigate();
  const type = useAppSelector(selectType);
  const subtype = useAppSelector(selectSubtype);
  const { data, isSuccess } = useGetSubtypesQuery({ type });
  const [addExercise] = useCreateExerciseMutation();

  const [fields, setFields] = useState<ExerciseFields>({
    name: '',
    description: '',
    type: type || '',
    subtype: subtype || '',
    combinationParams: '',
  });
  const onSubmit = async (values: ExerciseFields) => {
    await addExercise(values);
    navigate(`${EXERCISES_URL}/${subtype}`);
    toast('Create successful!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  const changeField = useCallback((field: keyof ExerciseFields, value: string) => {
    setFields(
      produce((draft) => {
        draft[field] = value;
      }),
    );
  }, []);

  return (
    <>
      <Formik initialValues={exerciseInitialValue} onSubmit={onSubmit} validationSchema={exerciseValidationSchema}>
        {(props) => {
          return (
            <Form>
              <Field name="name">
                {({ field, meta }: FieldProps) => (
                    <Input
                        type="text"
                        {...field}
                        value={fields.name}
                        onChange={(event) => {
                          props.handleChange(event);
                          changeField('name', event.target.value);
                        }}
                        placeholder="Name"
                        error={meta.touched && !!meta.error}
                        errorText={meta.error}
                        className="form-input-wider"
                    />
                )}
              </Field>
              <div className="select-container-wider">
                <select
                    className="select-box-wider"
                    onChange={(event) => {
                      props.handleChange(event);
                      changeField('type', event.target.value);
                    }}
                >
                  <option value="strength" selected={fields.type === 'strength'}>
                    Strength
                  </option>
                  <option value="cardio" selected={fields.type === 'cardio'}>
                    Cardio
                  </option>
                </select>
              </div>
              <div className="select-container-wider">
                <select
                    className="select-box-wider"
                    onChange={(event) => {
                      props.handleChange(event);
                      changeField('subtype', event.target.value);
                    }}
                >
                  {isSuccess ? (
                      data?.data.subtypes.map((subtype) => (
                          <option value={subtype.name} selected={fields.subtype === subtype.name}>
                            {subtype.name}
                          </option>
                      ))
                  ) : (
                      <option value="" selected disabled hidden>
                        Subtype
                      </option>
                  )}
                </select>
              </div>
              <div className="select-container-wider">
                <select
                    className="select-box-wider"
                    onChange={(event) => {
                      props.handleChange(event);
                      changeField('combinationParams', event.target.value);
                    }}
                >
                  {combinationParams.map((combination) => (
                      <option value={combination.params} selected={fields.combinationParams === combination.params}>
                        {combination.name}
                      </option>
                  ))}
                </select>
              </div>
              <Field name="description">
                {({ field, meta }: FieldProps) => (
                    <Input
                        type="text"
                        {...field}
                        value={fields.description}
                        onChange={(event) => {
                          props.handleChange(event);
                          changeField('description', event.target.value);
                        }}
                        placeholder="Description"
                        error={meta.touched && !!meta.error}
                        errorText={meta.error}
                        className="form-input-wider"
                    />
                )}
              </Field>
              <div className={styles.buttonsBox}>
                <button className="btn-black" type="submit">
                  Add
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}

export default Exercise;
