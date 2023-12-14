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
import { toast } from 'react-toastify';
import { APPROACHES_URL, SUBTYPES_URL, WORKOUTS_URL } from '../../common/constants/api.ts';
import { Dialog, DialogDismiss } from '@ariakit/react';
import { discardWorkoutInfo, setCurrentWorkouts, setMainInfo } from '../../store/workouts/workouts.slice.ts';
import { ExerciseRequest } from '../../common/types/workouts.ts';
import { AiOutlineClose } from 'react-icons/ai';
import styles from './Workout.module.css';

function Workout() {
  const count = useAppSelector(selectWorkoutsCount) + 1;
  const [open, setOpen] = useState(false);
  const [check, setCheck] = useState(true);
  const navigate = useNavigate();
  const exercisesFromStore = useAppSelector(selectExercises);
  const [exercises, setExercises] = useState<ExerciseRequest[]>(exercisesFromStore);
  const [updateWorkout, { error: updateError, isSuccess: isSuccessUpdate }] = useUpdateWorkoutMutation();
  const [createWorkout, { error: createError, isSuccess: isSuccesCreate, data: dataCreate }] =
    useCreateWorkoutMutation();
  const [delWorkout, { error: deleteError, isSuccess: isSuccessDelete }] = useDeleteWorkoutMutation();
  const { uuid } = useParams();
  const dispatch = useAppDispatch();
  const workoutInfo = useAppSelector(selectFullWorkoutInfo);

  let [fields, setFields] = useState<WorkoutFields>({
    name: workoutInfo.name || `Новая тренировка ${count}`,
    date: workoutInfo.date
      ? new Date(workoutInfo.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    type: workoutInfo.type || 'strength',
    comment: workoutInfo.comment || '',
  });

  if (uuid && check) {
    dispatch(setCurrentWorkouts({ uuid }));
    const { data, isSuccess } = useGetWorkoutQuery({ uuid });

    if (isSuccess) {
      [fields, setFields] = useState<WorkoutFields>({
        uuid: data?.data.uuid || '',
        name: data?.data.name || `Новая тренировка ${count}`,
        date: data?.data.date
          ? new Date(data?.data.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        type: data?.data.type || 'strength',
        comment: data?.data.comment || '',
      });
      setExercises(data?.data?.exercises || []);
    }
    setCheck(false);
  }

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
  }

  if (isSuccessUpdate) {
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
  }

  if (isSuccesCreate) {
    dispatch(discardWorkoutInfo());
    navigate(`${WORKOUTS_URL}/${dataCreate?.data.uuid}`);
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

  const onSubmit = async (values: WorkoutFields) => {
    if (uuid) {
      await updateWorkout({
        uuid: values.uuid,
        date: fields.date,
        name: fields.name,
        type: fields.type,
        comment: values.comment,
        exercises: exercises,
      });
    } else {
      await createWorkout({
        date: fields.date,
        name: fields.name,
        type: fields.type,
        comment: fields.comment,
        exercises: exercises,
      });
    }
  };

  const changeField = useCallback((field: keyof WorkoutFields, value: string) => {
    setFields(
      produce((draft) => {
        draft[field] = value;
      }),
    );
  }, []);

  if (deleteError) {
    toast('message' in deleteError ? deleteError && deleteError.message : 'Delete failed!', {
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

  if (isSuccessDelete) {
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

  const deleteWorkout = async () => {
    await delWorkout({ uuid });
  };

  const goToSubtypes = () => {
    dispatch(
      setMainInfo({
        uuid: uuid,
        date: new Date(fields.date).toISOString().split('T')[0],
        name: fields.name,
        type: fields.type,
        comment: fields.comment,
      }),
    );
    navigate(SUBTYPES_URL + '/' + fields.type);
  };

  const goToApproaches = (id: string) => {
    navigate(`${APPROACHES_URL}/${id}`);
  };

  return (
    <>
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
                      strength
                    </option>
                    <option value="cardio" selected={fields.type === 'cardio'}>
                      cardio
                    </option>
                  </select>
                </div>
              </div>
              <div className={styles.exercises}>
                {exercises.length !== 0 ? (
                  exercises.map((exercise) => (
                    <div className={styles.box}>
                      <div className={styles.boxItems} onClick={() => goToApproaches(exercise.uuid || '')}>
                        <div className={styles.boxContent}>
                          <div className={styles.boxInfo}>
                            <span className={styles.infoItem}>{exercise.name}</span>
                            <span className={styles.infoItem}>approaches: {exercise?.approaches?.length}</span>
                          </div>
                          <div className={styles.deleteButton}>
                            <button type="button">
                              <AiOutlineClose />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1 className={styles.noExercises}>There are no exercises yet</h1>
                )}
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
                  {uuid && (
                    <button className="btn-red-less-margin" onClick={() => setOpen(true)}>
                      Delete
                    </button>
                  )}
                </div>
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
            </Form>
          );
        }}
      </Formik>
    </>
  );
}

export default Workout;
