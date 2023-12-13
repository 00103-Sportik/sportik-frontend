import { Input } from '../../common/components/input/Input.tsx';
import { Field, FieldProps, Form, Formik } from 'formik';
import {
  ProfileFields,
  profileInitialValues,
  profileValidationSchema,
} from '../../common/validations/profileValidationSchema.ts';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../store/profile/profile.api.ts';
import logo from '../../assets/avatar.jpg';
import React, { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { updateAvatar } from '../../store/profile/profile.slice.ts';
import { AvatarUpdate } from '../../common/types/profile.ts';
import { selectAvatar } from '../../store/profile/profile.selectors.ts';
import { Dialog, DialogDismiss } from '@ariakit/react';
import { produce } from 'immer';
import { toast } from 'react-toastify';
import styles from './Profile.module.css';

function Profile() {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [updateProfile, { isSuccess }] = useUpdateProfileMutation();
  const { data, refetch } = useGetProfileQuery();
  const dispatch = useAppDispatch();
  const avatar = useAppSelector(selectAvatar);

  const [fields, setFields] = useState<ProfileFields>({
    email: data?.data.email || '',
    name: data?.data.name || '',
    surname: data?.data.surname || '',
    sex: data?.data.sex || '',
    age: data?.data.age || '',
    height: data?.data.height || '',
    weight: data?.data.weight || '',
    avatar: data?.data.avatar || '',
  });

  const onSubmit = async (values: ProfileFields) => {
    await updateProfile(values);
    if (isSuccess) {
      setOpen(false);
      toast('Profile updated successfully!', {
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
      toast('Profile update failed!', {
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

  const discard = async () => {
    await refetch();
    setOpen2(false);
    toast('Updates have been canceled!', {
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

  const changeField = useCallback((field: keyof ProfileFields, value: string) => {
    setFields(
      produce((draft) => {
        draft[field] = value;
      }),
    );
  }, []);

  const convertBase64 = ({ file }: { file: any }) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve((fileReader.result as string).split('base64,')[1]);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  async function changeAvatar(e: React.ChangeEvent) {
    const target = e.target as HTMLInputElement;
    const file = (target.files as FileList)[0];
    const base64 = (await convertBase64({ file: file })) as string;
    const data: AvatarUpdate = {
      avatar: base64,
    };
    dispatch(updateAvatar(data));
  }

  return (
    <>
      <h1 className={styles.profileH1}>Profile</h1>
      <div className="@apply flex flex-row">
        <Formik initialValues={profileInitialValues} onSubmit={onSubmit} validationSchema={profileValidationSchema}>
          {(props) => {
            return (
              <Form>
                <Field name="email">
                  {({ field, meta }: FieldProps) => (
                    <Input
                      autoComplete="email"
                      disabled={true}
                      type="text"
                      {...field}
                      value={fields.email}
                      placeholder="Email"
                      error={meta.touched && !!meta.error}
                      errorText={meta.error}
                    />
                  )}
                </Field>
                <div>
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
                      />
                    )}
                  </Field>
                  <Field name="surname">
                    {({ field, meta }: FieldProps) => (
                      <Input
                        type="text"
                        {...field}
                        value={fields.surname}
                        onChange={(event) => {
                          props.handleChange(event);
                          changeField('surname', event.target.value);
                        }}
                        placeholder="Surname"
                        error={meta.touched && !!meta.error}
                        errorText={meta.error}
                      />
                    )}
                  </Field>
                </div>
                <div>
                  <Field name="age">
                    {({ field, meta }: FieldProps) => (
                      <Input
                        type="text"
                        {...field}
                        value={fields.age}
                        onChange={(event) => {
                          props.handleChange(event);
                          changeField('age', event.target.value);
                        }}
                        placeholder="Age"
                        error={meta.touched && !!meta.error}
                        errorText={meta.error}
                      />
                    )}
                  </Field>
                  <div className="select-container">
                    <select
                      className="select-box"
                      onChange={(event) => {
                        props.handleChange(event);
                        changeField('sex', event.target.value);
                      }}
                    >
                      <option value="" selected={fields.sex === ''} disabled hidden>
                        Sex
                      </option>
                      <option value="Male" selected={fields.sex === 'Male'}>
                        Male
                      </option>
                      <option value="Female" selected={fields.sex === 'Female'}>
                        Female
                      </option>
                    </select>
                  </div>
                  <div>
                    <Field name="height">
                      {({ field, meta }: FieldProps) => (
                        <Input
                          type="text"
                          {...field}
                          value={fields.height}
                          onChange={(event) => {
                            props.handleChange(event);
                            changeField('height', event.target.value);
                          }}
                          placeholder="Height"
                          error={meta.touched && !!meta.error}
                          errorText={meta.error}
                        />
                      )}
                    </Field>
                    <Field name="weight">
                      {({ field, meta }: FieldProps) => (
                        <Input
                          type="text"
                          {...field}
                          value={fields.weight}
                          onChange={(event) => {
                            props.handleChange(event);
                            changeField('weight', event.target.value);
                          }}
                          placeholder="Weight"
                          error={meta.touched && !!meta.error}
                          errorText={meta.error}
                        />
                      )}
                    </Field>
                  </div>
                </div>
                <Dialog
                  open={open}
                  onClose={() => setOpen(false)}
                  getPersistentElements={() => document.querySelectorAll('.Toastify')}
                  backdrop={<div className="backdrop" />}
                  className="dialog"
                >
                  <p className={styles.p}>Save changes?</p>
                  <div className="flex gap-[10px]">
                    <button className="btn-red" type="submit">
                      Yes
                    </button>
                    <DialogDismiss className="btn-black">No</DialogDismiss>
                  </div>
                </Dialog>
                <Dialog
                  open={open2}
                  onClose={() => setOpen2(false)}
                  getPersistentElements={() => document.querySelectorAll('.Toastify')}
                  backdrop={<div className="backdrop" />}
                  className="dialog"
                >
                  <p className={styles.p}>Discard changes?</p>
                  <div className="flex gap-[10px]">
                    <button className="btn-red" onClick={discard}>
                      Yes
                    </button>
                    <DialogDismiss className="btn-black">No</DialogDismiss>
                  </div>
                </Dialog>
              </Form>
            );
          }}
        </Formik>
        <div>
          <img
            className={styles.img}
            width={100}
            height={100}
            src={!avatar ? logo : `data:image/*;base64,${avatar}`}
            alt="avatar"
          />
          <label className="@apply btn-black w-[100px] cursor-pointer my-4">
            <input className="@apply hidden" onChange={changeAvatar} type="file" />
            <span>Upload avatar</span>
          </label>
        </div>
      </div>
      <div className="flex gap-[70px]">
        <button className="btn-black" onClick={() => setOpen(true)}>
          Save
        </button>
        <button className="btn-red" onClick={() => setOpen2(true)}>
          Discard
        </button>
      </div>
    </>
  );
}

export default Profile;
