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
import {
  setApproaches,
  setCountWorkouts,
  setCurrentWorkouts,
  setExercise,
  setMainInfo,
} from '../../store/workouts/workouts.slice.ts';
import { ApproachRequest, ExerciseRequestPost } from '../../common/types/workouts.ts';
import { AiOutlineClose } from 'react-icons/ai';
import styles from '../../styles/base.module.css';
import styles2 from './Workout.module.css';
import { IMask } from 'react-imask';

function Workout() {
  const count = useAppSelector(selectWorkoutsCount) + 1;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const exercisesFromStore = useAppSelector(selectExercises);
  const [exercises, setExercises] = useState<ExerciseRequestPost[]>(exercisesFromStore);
  const [updateWorkout, { error: errorUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate }] =
    useUpdateWorkoutMutation();
  const [createWorkout, { error: errorCreate, isSuccess: isSuccessCreate, data: dataCreate, isError: isErrorCreate }] =
    useCreateWorkoutMutation();
  const [delWorkout, { error: errorDelete, isSuccess: isSuccessDelete, isError: isErrorDelete }] =
    useDeleteWorkoutMutation();
  const { uuid } = useParams();
  const dispatch = useAppDispatch();
  const workoutInfo = useAppSelector(selectFullWorkoutInfo);

  const convertToLocalDate = (date: string) => {
    const parts = date.split('-');
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };

  const [fields, setFields] = useState<WorkoutFields>({
    name: workoutInfo.name || `Новая тренировка ${count}`,
    date: workoutInfo.date ? convertToLocalDate(workoutInfo.date) : new Date().toLocaleDateString(),
    type: workoutInfo.type || 'strength',
    comment: workoutInfo.comment || '',
  });
  const { data, isSuccess } = useGetWorkoutQuery({ uuid });

  useEffect(() => {
    setExercises(exercisesFromStore);
  }, [exercisesFromStore]);

  useEffect(() => {
    if (data) {
      data?.data.exercises.map((curExercise) => {
        if (!exercises.find((tmpExercise) => curExercise.uuid === tmpExercise.uuid)) {
          dispatch(setExercise(curExercise));
          dispatch(setApproaches({ exerciseId: curExercise.uuid, approaches: curExercise.approaches || [] }));
        }
      });
    }
  }, [setExercises, data]);

  useEffect(() => {
    if (isSuccess && uuid) {
      setFields({
        uuid: data?.data.uuid || '',
        name: data?.data.name || `Новая тренировка ${count}`,
        date: data?.data.date ? convertToLocalDate(data?.data.date) : new Date().toLocaleDateString(),
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

  useEffect(() => {
    if (isSuccessCreate && dataCreate) {
      navigate(`${WORKOUTS_URL}/${dataCreate?.data.uuid}`);
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
      dispatch(setCountWorkouts({ count: count + 1 }));
    }
  }, [isSuccessCreate, dataCreate]);

  useEffect(() => {
    if (isSuccessUpdate) {
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
      navigate('/');
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

  const convertDate = (date: string) => {
    const parts = date.split('.');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const onSubmit = async () => {
    const toExercises: ExerciseRequestPost[] = exercises.map((exercise) => {
      return { uuid: exercise.uuid, approaches: exercise.approaches || [] } as ExerciseRequestPost;
    });
    if (uuid) {
      await updateWorkout({
        uuid,
        date: convertDate(fields.date),
        name: fields.name,
        type: fields.type,
        comment: fields.comment,
        exercises: toExercises,
      });
    } else {
      await createWorkout({
        date: convertDate(fields.date),
        name: fields.name,
        type: fields.type,
        comment: fields.comment,
        exercises: toExercises,
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

  const deleteWorkout = async () => {
    await delWorkout({ uuid });
  };

  const goToSubtypes = () => {
    dispatch(
      setMainInfo({
        uuid: uuid,
        date: convertDate(fields.date),
        name: fields.name,
        type: fields.type,
        comment: fields.comment,
      }),
    );
    navigate(SUBTYPES_URL + '/' + fields.type);
  };

  const goToApproaches = (id: string, approaches: ApproachRequest[]) => {
    dispatch(setApproaches({ exerciseId: id, approaches }));
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
                      id="workout-date"
                      type="text"
                      {...field}
                      value={fields.date}
                      onChange={(event) => {
                        props.handleChange(event);
                        const element = document.getElementById(`workout-date`);
                        const maskOptions = {
                          mask: '00.00.0000',
                        };
                        // @ts-ignore
                        IMask(element, maskOptions);
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
                    <option
                      value="strength"
                      selected={fields.type === 'strength'}
                      className="select-option"
                      hidden={exercises.length !== 0 && fields.type !== 'strength'}
                    >
                      strength
                    </option>
                    <option
                      value="cardio"
                      selected={fields.type === 'cardio'}
                      className="select-option"
                      hidden={exercises.length !== 0 && fields.type !== 'cardio'}
                    >
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
                            goToApproaches(exercise.uuid || '', exercise.approaches || []);
                          }
                        }}
                      >
                        <div className={styles.boxContent}>
                          <div className={styles.boxInfo}>
                            <span>{exercise.name}</span>
                            <span>approaches: {exercise?.approaches?.length || 0}</span>
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
                <button className="btn-red-less-margin" onClick={() => setOpen(true)} type="reset">
                  Delete
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
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
    </>
  );
}

export default Workout;
