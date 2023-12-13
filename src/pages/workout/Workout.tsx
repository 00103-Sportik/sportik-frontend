import { Field, FieldProps, Form, Formik } from 'formik';
import { Input } from '../../common/components/input/Input.tsx';
import {
  WorkoutFields,
  workoutInitialValues,
  workoutValidationSchema,
} from '../../common/validations/workoutValidationSchema.ts';
import { useCallback, useState } from 'react';
import {
  useCreateWorkoutMutation,
  useDeleteWorkoutMutation,
  useGetWorkoutQuery,
  useUpdateWorkoutMutation,
} from '../../store/workouts/workouts.api.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { produce } from 'immer';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import {
  selectExercises,
  selectFullWorkoutInfo,
  selectWorkoutsCount,
} from '../../store/workouts/workouts.selectors.ts';
import styles from './Workout.module.css';
import { toast } from 'react-toastify';
import { APPROACHES_URL, SUBTYPES_URL, WORKOUTS_URL } from '../../common/constants/api.ts';
import { Dialog, DialogDismiss } from '@ariakit/react';
import { discardWorkoutInfo, setCurrentWorkouts, setMainInfo } from '../../store/workouts/workouts.slice.ts';
import { ExerciseRequest } from '../../common/types/workouts.ts';

function Workout() {
  const count = useAppSelector(selectWorkoutsCount) + 1;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const exercisesFromStore = useAppSelector(selectExercises);
  const [exercises, setExercises] = useState<ExerciseRequest[]>(exercisesFromStore);
  const [updateWorkout, { error: updateError }] = useUpdateWorkoutMutation();
  const [createWorkout, { error: createError, data }] = useCreateWorkoutMutation();
  const [delWorkout, { error: deleteError }] = useDeleteWorkoutMutation();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const workoutInfo = useAppSelector(selectFullWorkoutInfo);
  let [fields, setFields] = useState<WorkoutFields>({
    name: workoutInfo.name || `Новая тренировка ${count}`,
    date: workoutInfo.date || new Date().toISOString().split('T')[0],
    type: workoutInfo.type || 'strength',
    comment: workoutInfo.comment || '',
  });

  if (id) {
    dispatch(setCurrentWorkouts({ id }));
    const { data, isLoading, isSuccess } = useGetWorkoutQuery({ id });
    // if (isLoading) {
    //   return <h1>Loading...</h1>;
    // }
    if (isSuccess) {
      [fields, setFields] = useState<WorkoutFields>({
        id: data?.data.id || '',
        name: data?.data.name || `Новая тренировка ${count}`,
        date: data?.data.date
          ? new Date(data?.data.date * 1000).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        type: data?.data.type || 'strength',
        comment: data?.data.comment || '',
      });
      setExercises(data?.data?.exercises || []);
    }
  }

  const onSubmit = async (values: WorkoutFields) => {
    if (id) {
      await updateWorkout({
        id: values.id,
        date: new Date(values.date).getTime(),
        name: values.name,
        type: values.type,
        comment: values.comment,
        exercises: exercises,
      });
      if (updateError) {
        toast('message' in updateError ? updateError && updateError.message : 'Update failed!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else {
        toast('Update successful!', {
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
    } else {
      await createWorkout({
        date: new Date(values.date).getTime(),
        name: values.name,
        type: values.type,
        comment: values.comment,
        exercises: exercises,
      });
      if (createError) {
        toast('message' in createError ? createError && createError.message : 'Create failed!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else {
        dispatch(discardWorkoutInfo());
        navigate(`${WORKOUTS_URL}/${data?.data.id}`);
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
      }
    }
  };

  const changeField = useCallback((field: keyof WorkoutFields, value: string) => {
    setFields(
      produce((draft) => {
        draft[field] = value;
      }),
    );
  }, []);

  const deleteWorkout = async () => {
    await delWorkout({ id });
    if (deleteError) {
      toast('message' in deleteError ? deleteError && deleteError.message : 'Delete successful!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } else {
      navigate('/');
      toast('Delete successful!', {
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
  };

  const goToSubtypes = () => {
    dispatch(setMainInfo({ id: id, date: fields.date, name: fields.name, type: fields.type, comment: fields.comment }));
    navigate(SUBTYPES_URL + '/' + fields.type);
  };

  const goToApproaches = (id: string) => {
    navigate(`${APPROACHES_URL}/${id}`);
  };

  return (
    <>
      <div>
        <Formik initialValues={workoutInitialValues} onSubmit={onSubmit} validationSchema={workoutValidationSchema}>
          {(props) => {
            return (
              <Form>
                <div className={styles.parametersBox}>
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
                      ></Input>
                    )}
                  </Field>
                  <Field name="date">
                    {({ field, meta }: FieldProps) => (
                      <Input
                        type="date"
                        {...field}
                        value={fields.date}
                        onChange={(event) => {
                          props.handleChange(event);
                          changeField('date', event.target.value);
                        }}
                        placeholder="Date"
                        min="0000-01-01"
                        max="9999-12-31"
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
                </div>
                <div className={styles.exercises}>
                  {exercises.length !== 0 ? (
                    exercises.map((exercise) => (
                      <div className={styles.box}>
                        <div className={styles.boxItems} onClick={() => goToApproaches(exercise.id || '')}>
                          <span className={styles.boxInfoSize}>{exercise.name}</span>
                          <span className={styles.boxInfoSize}>approaches: {exercise?.approaches?.length}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <h1 className={styles.noExercises}>There are no exercises yet</h1>
                  )}
                  <div className={styles.box}>
                    <div className={styles.boxItems} onClick={() => () => goToApproaches('1')}>
                      <div className={styles.boxInfo}>
                        <span className={styles.boxInfoSize}>{1}</span>
                        <span className={styles.boxInfoSize}>Approaches: {2}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.box}>
                    <div className={styles.boxItems} onClick={() => goToApproaches('1')}>
                      <div className={styles.boxInfo}>
                        <span className={styles.boxInfoSize}>{1}</span>
                        <span className={styles.boxInfoSize}>Approaches: {2}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.box}>
                    <div className={styles.boxItems} onClick={() => goToApproaches('1')}>
                      <div className={styles.boxInfo}>
                        <span className={styles.boxInfoSize}>{1}</span>
                        <span className={styles.boxInfoSize}>Approaches: {2}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.box}>
                    <div className={styles.boxItems} onClick={() => goToApproaches('1')}>
                      <div className={styles.boxInfo}>
                        <span className={styles.boxInfoSize}>{1}</span>
                        <span className={styles.boxInfoSize}>Approaches: {2}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.box}>
                    <div className={styles.boxItems} onClick={() => goToApproaches('1')}>
                      <div className={styles.boxInfo}>
                        <span className={styles.boxInfoSize}>{1}</span>
                        <span className={styles.boxInfoSize}>Approaches: {2}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.box}>
                    <div className={styles.boxItems} onClick={() => goToApproaches('1')}>
                      <div className={styles.boxInfo}>
                        <span className={styles.boxInfoSize}>{1}</span>
                        <span className={styles.boxInfoSize}>Approaches: {2}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.box}>
                    <div className={styles.boxItems} onClick={() => goToApproaches('1')}>
                      <div className={styles.boxInfo}>
                        <span className={styles.boxInfoSize}>{1}</span>
                        <span className={styles.boxInfoSize}>Approaches: {2}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="btn-black-less-margin" onClick={() => goToSubtypes()}>
                  Add
                </button>
                <div className={styles.parametersBox}>
                  <Field name="comment">
                    {({ field, meta }: FieldProps) => (
                      <Input
                        type="text"
                        {...field}
                        value={fields.comment}
                        onChange={(event) => {
                          props.handleChange(event);
                          changeField('comment', event.target.value);
                        }}
                        placeholder="Comment"
                        error={meta.touched && !!meta.error}
                        errorText={meta.error}
                        className="form-input-wider"
                      ></Input>
                    )}
                  </Field>
                </div>
                <div>
                  <div className={styles.buttonsBox}>
                    <button className="btn-black-less-margin" type="submit">
                      Save
                    </button>
                    {id && (
                      <button className="btn-red-less-margin" onClick={() => setOpen(true)}>
                        Delete
                      </button>
                    )}
                  </div>
                  <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    getPersistentElements={() => document.querySelectorAll('.Toastify')}
                    backdrop={<div className="backdrop" />}
                    className="dialog"
                  >
                    <p className={styles.p}>Delete workout?</p>
                    <div className={styles.buttonsBox}>
                      <DialogDismiss className="btn-black" onClick={deleteWorkout}>
                        Yes
                      </DialogDismiss>
                      <DialogDismiss className="btn-red">No</DialogDismiss>
                    </div>
                  </Dialog>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
}

export default Workout;
