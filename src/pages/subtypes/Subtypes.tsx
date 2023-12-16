import styles from '../../styles/base.module.css';
import { EXERCISES_URL } from '../../common/constants/api.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SubtypeResponse } from '../../common/types/subtypes.ts';
import {
  useGetSubtypesQuery,
  useCreateSubtypeMutation,
  useDeleteSubtypeMutation,
  useUpdateSubtypeMutation,
} from '../../store/subtype/subtype.api.ts';
import { Dialog, DialogDismiss } from '@ariakit/react';
import { Input } from '../../common/components/input/Input.tsx';
import { Field, FieldProps, Form, Formik } from 'formik';
import {
  SubtypeField,
  subtypeInitialValue,
  subtypeValidationSchema,
} from '../../common/validations/subtypeValidationSchema.ts';
import { toast } from 'react-toastify';
import { AiFillEdit, AiOutlineClose } from 'react-icons/ai';

function Subtypes() {
  const navigate = useNavigate();
  const { type } = useParams();
  const [subtype, setSubtype] = useState('');
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const { data, isSuccess } = useGetSubtypesQuery({ type: type || '' });
  const [createSubtype, { isSuccess: isSuccessCreate, error: errorCreate, isError: isErrorCreate }] =
    useCreateSubtypeMutation();
  const [updateSubtype, { isSuccess: isSuccessUpdate, error: errorUpdate, isError: isErrorUpdate }] =
    useUpdateSubtypeMutation();
  const [delSubtype, { isSuccess: isSuccessDelete, error: errorDelete, isError: isErrorDelete }] =
    useDeleteSubtypeMutation();
  const [subtypes, setSubtypes] = useState<SubtypeResponse[]>([]);
  const [uuid, setUuid] = useState('');

  useEffect(() => {
    if (isSuccess) {
      setSubtypes(data?.data.subtypes);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccessCreate) {
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
      setSubtype('');
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

  const onSubmit = async (values: SubtypeField) => {
    if (isUpdate) {
      setIsUpdate(false);
      await updateSubtype({ type: type || '', name: values.name, uuid });
    } else {
      await createSubtype({ name: values.name, type: type || '' });
    }
  };

  const deleteSubtype = async (uuid: string) => {
    await delSubtype({ uuid });
  };

  return (
    <>
      <p className={styles.p1}>{type}</p>
      <p className={styles.p2}>Subtypes</p>
      <div className={styles.mainBox}>
        {subtypes.length !== 0 ? (
          subtypes.map((subtype) => (
            <div className={styles.itemBox}>
              <div
                className={styles.boxItems}
                onClick={(event) => {
                  const target = event.target as HTMLElement;
                  const button = target.closest('button');
                  if (button) {
                    if (button.classList.contains('delete-subtype')) {
                      deleteSubtype(subtype.uuid);
                    } else if (button.classList.contains('update-subtype')) {
                      setIsUpdate(true);
                      setSubtype(subtype.name);
                      setUuid(subtype.uuid);
                      setOpen(true);
                    }
                  } else {
                    navigate(`${EXERCISES_URL}/${subtype.uuid}`);
                  }
                }}
              >
                <div className={styles.boxContent}>
                  <div className={styles.boxInfo}>
                    <span>{subtype.name}</span>
                  </div>
                  <div hidden={subtype.user_uuid === null} className={styles.sideButtonsBox}>
                    <button className="delete-subtype" hidden={subtype.user_uuid === null}>
                      <AiOutlineClose />
                    </button>
                    <button className="update-subtype">
                      <AiFillEdit />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1 className={styles.noEntities}>There are no subtypes yet</h1>
        )}
      </div>
      <Formik initialValues={subtypeInitialValue} onSubmit={onSubmit} validationSchema={subtypeValidationSchema}>
        {(props) => {
          return (
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              getPersistentElements={() => document.querySelectorAll('.Toastify')}
              backdrop={<div className="backdrop" />}
              className="dialog"
            >
              <p className={styles.p}>Input subtype name:</p>
              <Form>
                <Field name="name" className={styles.formInput}>
                  {({ field, meta }: FieldProps) => (
                    <Input
                      type="text"
                      {...field}
                      value={subtype}
                      onChange={(event) => {
                        props.handleChange(event);
                        setSubtype(event.target.value);
                      }}
                      placeholder="Name"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                      className="form-input-modal"
                    ></Input>
                  )}
                </Field>
              </Form>
              <div className={styles.buttonsBox}>
                <DialogDismiss className="btn-black" onClick={() => onSubmit({ name: subtype })}>
                  Save
                </DialogDismiss>
                <DialogDismiss className="btn-red">Exit</DialogDismiss>
              </div>
            </Dialog>
          );
        }}
      </Formik>
      <button className="btn-black" onClick={() => setOpen(true)}>
        Add
      </button>
    </>
  );
}

export default Subtypes;
