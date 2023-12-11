import { useNavigate, useParams } from 'react-router-dom';
import styles from './Exercises.module.css';
import { useGetExercisesQuery } from '../../store/exercise/exercise.api.ts';
import { useAppDispatch } from '../../store/hooks.ts';
import { setExercise, setSubtype } from '../../store/workouts/workouts.slice.ts';
import { ExerciseRequest } from '../../common/types/workouts.ts';

function Exercises() {
  const navigate = useNavigate();
  const { type } = useParams();
  const { data, isLoading } = useGetExercisesQuery({ type: type || '' });
  const dispatch = useAppDispatch();

  // if (isLoading) {
  //   return <h1>Loading...</h1>;
  // }

  const exercises = data?.data.exercises;

  const addToWorkout = (exercise: ExerciseRequest) => {
    dispatch(setExercise(exercise));
    navigate('/workouts');
  };

  const goToCreateExercises = () => {
    dispatch(setSubtype({ subtype: type || '' }));
    navigate('/exercises');
  };

  return (
    <>
      <p>{type}</p>
      <div className={styles.exercises}>
        {exercises?.map((exercise) => (
          <div className={styles.box}>
            <div className={styles.boxInfo} onClick={() => addToWorkout(exercise)}>
              <span>{exercise.name}</span>
            </div>
          </div>
        ))}
        <div className={styles.box}>
          <div
            className={styles.boxInfo}
            onClick={() =>
              addToWorkout({
                id: 'fsfs',
                name: 'sfsdf',
                type: 'fsdfsd',
                combinationParams: 'fsdfsdf',
                description: 'ffsdfs',
                approaches: [],
              })
            }
          >
            <span>name</span>
          </div>
        </div>
        <div className={styles.box}>
          <div
            className={styles.boxInfo}
            onClick={() =>
              addToWorkout({
                id: 'fsfs',
                name: 'sfsdf',
                type: 'fsdfsd',
                combinationParams: 'fsdfsdf',
                description: 'ffsdfs',
                approaches: [],
              })
            }
          >
            <span>name</span>
          </div>
        </div>
        <div className={styles.box}>
          <div
            className={styles.boxInfo}
            onClick={() =>
              addToWorkout({
                id: 'fsfs',
                name: 'sfsdf',
                type: 'fsdfsd',
                combinationParams: 'fsdfsdf',
                description: 'ffsdfs',
                approaches: [],
              })
            }
          >
            <span>name</span>
          </div>
        </div>
        <div className={styles.box}>
          <div
            className={styles.boxInfo}
            onClick={() =>
              addToWorkout({
                id: 'fsfs',
                name: 'sfsdf',
                type: 'fsdfsd',
                combinationParams: 'fsdfsdf',
                description: 'ffsdfs',
                approaches: [],
              })
            }
          >
            <span>name</span>
          </div>
        </div>
        <div className={styles.box}>
          <div
            className={styles.boxInfo}
            onClick={() =>
              addToWorkout({
                id: 'fsfs',
                name: 'sfsdf',
                type: 'fsdfsd',
                combinationParams: 'fsdfsdf',
                description: 'ffsdfs',
                approaches: [],
              })
            }
          >
            <span>name</span>
          </div>
        </div>
        <div className={styles.box}>
          <div
            className={styles.boxInfo}
            onClick={() =>
              addToWorkout({
                id: 'fsfs',
                name: 'sfsdf',
                type: 'fsdfsd',
                combinationParams: 'fsdfsdf',
                description: 'ffsdfs',
                approaches: [],
              })
            }
          >
            <span>name</span>
          </div>
        </div>
        <div className={styles.box}>
          <div
            className={styles.boxInfo}
            onClick={() =>
              addToWorkout({
                id: 'fsfs',
                name: 'sfsdf',
                type: 'fsdfsd',
                combinationParams: 'fsdfsdf',
                description: 'ffsdfs',
                approaches: [],
              })
            }
          >
            <span>name</span>
          </div>
        </div>
        <div className={styles.box}>
          <div
            className={styles.boxInfo}
            onClick={() =>
              addToWorkout({
                id: 'fsfs',
                name: 'sfsdf',
                type: 'fsdfsd',
                combinationParams: 'fsdfsdf',
                description: 'ffsdfs',
                approaches: [],
              })
            }
          >
            <span>name</span>
          </div>
        </div>
      </div>
      <button className="btn-black" onClick={() => goToCreateExercises()}>
        Add
      </button>
    </>
  );
}

export default Exercises;
