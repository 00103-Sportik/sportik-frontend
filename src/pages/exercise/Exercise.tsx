import { useFormik } from 'formik';
import { Input } from '../../common/components/input/Input.tsx';
import {
  ExerciseFields,
  exerciseInitialValue,
  exerciseValidationSchema,
} from '../../common/validations/exerciseValidationSchema.ts';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks.ts';
import { selectSubtype, selectType } from '../../store/workouts/workouts.selectors.ts';
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
  const onSubmit = async (values: ExerciseFields) => {
    const toCreate: ExerciseRequest = getValues(values);
    if (uuid) {
      updateExercise(toCreate);
    } else {
      await addExercise(toCreate);
    }
  };

  const formik = useFormik({
    initialValues: exerciseInitialValue,
    onSubmit,
    validationSchema: exerciseValidationSchema,
  });

  const { data, isSuccess } = useGetSubtypesQuery({ type: formik.values.type });

  useEffect(() => {
    if (isSuccessExercise && uuid) {
      const exercise = dataExercise.data.exercises.filter((exercise) => exercise.uuid === uuid)[0];
      formik.setValues({
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
      formik.values.subtype = data?.data.subtypes[0].name;
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccessCreate) {
      navigate(`${EXERCISES_URL}/${subtype}`);
      toast('Created successfully!', {
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
  }, [isSuccessCreate]);

  useEffect(() => {
    if (isSuccessUpdate) {
      navigate(`${EXERCISES_URL}/${subtype}`);
      toast('Updated successfully!', {
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
  }, [isSuccessUpdate]);

  useEffect(() => {
    if (isSuccessDelete) {
      navigate(`${EXERCISES_URL}/${subtype}`);
      toast('Deleted successfully!', {
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
  }, [isSuccessDelete]);

  useEffect(() => {
    if (isErrorCreate && errorCreate) {
      toast('message' in errorCreate ? errorCreate && errorCreate.message : 'Create failed!', {
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
  }, [errorCreate, isErrorCreate]);

  useEffect(() => {
    if (isErrorUpdate && errorUpdate) {
      toast('message' in errorUpdate ? errorUpdate && errorUpdate.message : 'Update failed!', {
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
  }, [errorUpdate, isErrorUpdate]);

  useEffect(() => {
    if (errorDelete && isErrorDelete) {
      toast('message' in errorDelete ? errorDelete && errorDelete.message : 'Delete failed!', {
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
  }, [errorDelete, isErrorDelete]);

  const getValues = (values: ExerciseFields) => {
    const { type: _, subtype: name, ...val } = values;
    if (uuid) {
      return { ...val, subtype_uuid: subtypes.filter((curSubtype) => curSubtype.name === name)[0].uuid, uuid };
    }
    return { ...val, subtype_uuid: subtypes.filter((curSubtype) => curSubtype.name === name)[0].uuid };
  };

  const deleteExercise = async (uuid: string) => {
    await delExercise({ uuid });
  };

  return (
    <>
      <form id="exercise-form" onSubmit={formik.handleSubmit}>
        <Input
          type="text"
          {...formik.getFieldProps('name')}
          error={formik.getFieldMeta('name').touched && !!formik.getFieldMeta('name').error}
          errorText={formik.getFieldMeta('name').error}
          placeholder="Name"
          className="form-input-wider"
        />
        <div className="select-container-wider">
          <select
            className="select-box-wider"
            value={formik.values.type}
            onChange={(type) => formik.setFieldValue('type', type.target.value)}
          >
            <option value="strength" selected={formik.values.type === 'strength'} className="select-option">
              strength
            </option>
            <option value="cardio" selected={formik.values.type === 'cardio'} className="select-option">
              cardio
            </option>
          </select>
        </div>
        <div className="select-container-wider">
          <select
            className="select-box-wider"
            value={formik.values.subtype}
            onChange={(subtype) => formik.setFieldValue('subtype', subtype.target.value)}
          >
            {subtypes.length !== 0 ? (
              subtypes.map((subtype) => (
                <option value={subtype.name} className="select-option" selected={formik.values.name === subtype.name}>
                  {subtype.name}
                </option>
              ))
            ) : (
              <option value="" selected disabled hidden className="select-option">
                Subtype
              </option>
            )}
          </select>
        </div>
        <div className="select-container-wider">
          <select
            className="select-box-wider"
            value={formik.values.combination_params}
            onChange={(combination_params) =>
              formik.setFieldValue('combination_params', combination_params.target.value)
            }
          >
            {combinationParams.map((combination) => (
              <option
                value={combination.params}
                selected={formik.values.combination_params === combination.params}
                className="select-option"
              >
                {combination.name}
              </option>
            ))}
          </select>
        </div>
        <Input
          type="text"
          {...formik.getFieldProps('description')}
          error={formik.getFieldMeta('description').touched && !!formik.getFieldMeta('description').error}
          errorText={formik.getFieldMeta('description').error}
          placeholder="Description"
          className="form-input-wider"
        />
        <div className={styles.buttonsBox}>
          <button className="btn-black" type="submit">
            Save
          </button>
          {uuid && (
            <button className="btn-red" onClick={() => deleteExercise(uuid)}>
              Delete
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default Exercise;
