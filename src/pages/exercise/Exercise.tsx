import { Field, FieldProps, Form, Formik } from 'formik';
import { Input } from '../../common/components/input/Input.tsx';
import {
  ExerciseFields,
  exerciseInitialValue,
  exerciseValidationSchema,
} from '../../common/validations/exerciseValidationSchema.ts';
import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks.ts';
import { selectSubtype, selectType } from '../../store/workouts/workouts.selectors.ts';
import { produce } from 'immer';
import { useGetSubtypesQuery } from '../../store/subtype/subtype.api.ts';
import { combinationParams, ExerciseRequest } from '../../common/types/workouts.ts';
import {
  useCreateExerciseMutation,
  useDeleteExerciseMutation,
  useGetExercisesQuery,
  useUpdateExerciseMutation,
} from '../../store/exercise/exercise.api.ts';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Exercise.module.css';
import { EXERCISES_URL } from '../../common/constants/api.ts';
import { SubtypeResponse } from '../../common/types/subtypes.ts';

function Exercise() {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const type = useAppSelector(selectType);
  const subtype = useAppSelector(selectSubtype);
  const { data: dataExercise, isSuccess: isSuccessExercise } = useGetExercisesQuery({ subtype_uuid: subtype });
  const [subtypes, setSubtypes] = useState<SubtypeResponse[]>([]);
  const [addExercise, { isSuccess: isSuccessCreate, error: errorCreate, isError: isErrorCreate }] =
    useCreateExerciseMutation();
  const [updateExercise, { isSuccess: isSuccessUpdate, error: errorUpdate, isError: isErrorUpdate }] =
    useUpdateExerciseMutation();
  const [delExercise, { isSuccess: isSuccessDelete, error: errorDelete, isError: isErrorDelete }] =
    useDeleteExerciseMutation();
  const [fields, setFields] = useState<ExerciseFields>({
    name: '',
    description: '',
    type: type || '',
    subtype: subtype || '',
    combination_params: 'distant_time',
  });
  const { data, isSuccess } = useGetSubtypesQuery({ type: fields.type });

  useEffect(() => {
    if (isSuccessExercise && uuid) {
      const exercise = dataExercise.data.exercises.filter((exercise) => exercise.uuid === uuid)[0];
      setFields({
        name: exercise.name,
        description: exercise.description,
        type: type || '',
        subtype: exercise.subtype_uuid,
        combination_params: exercise.combination_params,
      });
    }
  }, [isSuccessExercise, dataExercise, uuid]);

  useEffect(() => {
    if (isSuccess) {
      setSubtypes(data?.data.subtypes);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccessCreate) {
      navigate(`${EXERCISES_URL}/${subtype}`);
      toast('Created successfully!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, [isSuccessCreate]);

  useEffect(() => {
    if (isSuccessUpdate) {
      navigate(`${EXERCISES_URL}/${subtype}`);
      toast('Updated successfully!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, [isSuccessUpdate]);

  useEffect(() => {
    if (isSuccessDelete) {
      navigate(`${EXERCISES_URL}/${subtype}`);
      toast('Deleted successfully!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, [isSuccessDelete]);

  useEffect(() => {
    if (isErrorCreate && errorCreate) {
      toast('message' in errorCreate ? errorCreate && errorCreate.message : 'Create failed!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, [errorCreate, isErrorCreate]);

  useEffect(() => {
    if (isErrorUpdate && errorUpdate) {
      toast('message' in errorUpdate ? errorUpdate && errorUpdate.message : 'Update failed!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, [errorUpdate, isErrorUpdate]);

  useEffect(() => {
    if (errorDelete && isErrorDelete) {
      toast('message' in errorDelete ? errorDelete && errorDelete.message : 'Delete failed!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, [errorDelete, isErrorDelete]);

  const getValues = (values: ExerciseFields) => {
    const { type: _, subtype: subtype_uuid, ...val } = values;
    if (uuid) {
      return { ...val, subtype_uuid, uuid };
    }
    return { ...val, subtype_uuid };
  };

  const onSubmit = async (values: ExerciseFields) => {
    const toCreate: ExerciseRequest = getValues(values);
    if (uuid) {
      updateExercise(toCreate);
    } else {
      await addExercise(toCreate);
    }
  };

  const changeField = useCallback((field: keyof ExerciseFields, value: string) => {
    setFields(
      produce((draft) => {
        draft[field] = value;
      }),
    );
  }, []);

  const deleteExercise = async (uuid: string) => {
    await delExercise({ uuid });
  };

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
                    strength
                  </option>
                  <option value="cardio" selected={fields.type === 'cardio'}>
                    cardio
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
                  {subtypes.length !== 0 ? (
                    subtypes.map((subtype) => (
                      <option value={subtype.name} selected={fields.name === subtype.name}>
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
                    changeField('combination_params', event.target.value);
                  }}
                >
                  {combinationParams.map((combination) => (
                    <option value={combination.params} selected={fields.combination_params === combination.params}>
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
                <button
                  className="btn-black"
                  onClick={() => {
                    if (fields.name) {
                      onSubmit(fields);
                    }
                  }}
                >
                  Save
                </button>
                {uuid && (
                  <button className="btn-red-less-margin" onClick={() => deleteExercise(uuid)}>
                    Delete
                  </button>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}

export default Exercise;
