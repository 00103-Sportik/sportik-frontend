import { Field, FieldProps, Form, Formik } from 'formik';
import { Input } from '../../common/components/input/Input.tsx';
import {
  WorkoutFields,
  workoutInitialValues,
  workoutValidationSchema,
} from '../../common/validations/workoutValidationSchema.ts';
import { useCallback, useEffect, useState } from 'react';
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
import { setCountWorkouts, setCurrentWorkouts, setMainInfo } from '../../store/workouts/workouts.slice.ts';
import { ExerciseRequestPost } from '../../common/types/workouts.ts';
import { AiOutlineClose } from 'react-icons/ai';
import styles from '../../styles/base.module.css';
import styles2 from './Workout.module.css';

function Workout() {
  const count = useAppSelector(selectWorkoutsCount) + 1;
  const [open, setOpen] = useState(false);
  const [check, setCheck] = useState(false);
  const navigate = useNavigate();
  const exercisesFromStore = useAppSelector(selectExercises);
  const [exercises, setExercises] = useState<ExerciseRequestPost[]>(exercisesFromStore);
  const [updateWorkout, { error: updateError, isSuccess: isSuccessUpdate }] = useUpdateWorkoutMutation();
  const [createWorkout, { error: createError, isSuccess: isSuccesCreate, data: dataCreate }] =
    useCreateWorkoutMutation();
  const [delWorkout, { error: deleteError, isSuccess: isSuccessDelete }] = useDeleteWorkoutMutation();
  const { uuid } = useParams();
  const dispatch = useAppDispatch();
  const workoutInfo = useAppSelector(selectFullWorkoutInfo);
  const [fields, setFields] = useState<WorkoutFields>({
    name: workoutInfo.name || `Новая тренировка ${count}`,
    date: workoutInfo.date
      ? new Date(workoutInfo.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    type: workoutInfo.type || 'strength',
    comment: workoutInfo.comment || '',
  });
  const { data, isSuccess } = useGetWorkoutQuery({ uuid });

  useEffect(() => {
    if (isSuccess && uuid) {
      setFields({
        uuid: data?.data.uuid || '',
        name: data?.data.name || `Новая тренировка ${count}`,
        date: data?.data.date
          ? new Date(data?.data.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        type: data?.data.type || 'strength',
        comment: data?.data.comment || '',
      });
    }
  }, [isSuccess, uuid]);

  useEffect(() => {
    if (uuid) {
      dispatch(setCurrentWorkouts({ uuid }));
    }
  }, [uuid]);

  if (updateError && check) {
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
    setCheck(false);
  }

  if (isSuccessUpdate && check) {
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
    setCheck(false);
  }

  if (createError && check) {
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
    setCheck(false);
  }

  if (isSuccesCreate && check) {
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
    setCheck(false);
  }

  const onSubmit = async () => {
    const toExercises: ExerciseRequestPost[] = exercises.map((exercise) => {
      return { uuid: exercise.uuid, approaches: exercise.approaches || [] } as ExerciseRequestPost;
    });
    if (uuid) {
      await updateWorkout({
        uuid,
        date: fields.date,
        name: fields.name,
        type: fields.type,
        comment: fields.comment,
        exercises: toExercises,
      });
    } else {
      await createWorkout({
        date: fields.date,
        name: fields.name,
        type: fields.type,
        comment: fields.comment,
        exercises: toExercises,
      });
    }
    setCheck(true);
  };

  const changeField = useCallback((field: keyof WorkoutFields, value: string) => {
    setFields(
      produce((draft) => {
        draft[field] = value;
      }),
    );
  }, []);

  if (deleteError && check) {
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
    setCheck(false);
  }

  if (isSuccessDelete && check) {
    dispatch(setCountWorkouts({ count }));
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
    setCheck(false);
  }

  const deleteWorkout = async () => {
    await delWorkout({ uuid });
    setCheck(true);
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

  const deleteExercise = (index: number) => {
    const tempExercises = [...exercises];
    tempExercises.splice(index, 1);
    setExercises(tempExercises);
  };

  return (
    <>
      <Formik initialValues={workoutInitialValues} onSubmit={onSubmit} validationSchema={workoutValidationSchema}>
        {(props) => {
          return (
            <Form>
              <div className={styles2.parametersBox}>
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
              <div className={styles2.mainBox}>
                {exercises.length !== 0 ? (
                  exercises.map((exercise, index) => (
                    <div className={styles.itemBox}>
                      <div
                        className={styles.boxItems}
                        onClick={(event) => {
                          const target = event.target as HTMLElement;
                          const button = target.closest('button');
                          if (button) {
                            if (button.classList.contains('delete-from-workout')) {
                              deleteExercise(index);
                            }
                          } else {
                            goToApproaches(exercise.uuid || '');
                          }
                        }}
                      >
                        <div className={styles.boxContent}>
                          <div className={styles.boxInfo}>
                            <span>{exercise.name}</span>
                            <span>approaches: {exercise?.approaches?.length}</span>
                          </div>
                          <div className={styles.deleteButton}>
                            <button className="delete-from-workout">
                              <AiOutlineClose />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1 className={styles.noEntities}>There are no exercises yet</h1>
                )}
              </div>
              <button className="btn-black-less-margin" onClick={() => goToSubtypes()}>
                Add
              </button>
              <div className={styles2.parametersBox}>
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
