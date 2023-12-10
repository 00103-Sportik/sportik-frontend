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

function Profile() {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [updateProfile] = useUpdateProfileMutation();
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

  const onSubmit = (values: ProfileFields) => {
    updateProfile(values);
  };

  const saveProfile = () => {
    updateProfile(fields);
  };

  const discard = () => {
    refetch();
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
    console.log(base64);
    const data: AvatarUpdate = {
      avatar: base64,
    };
    dispatch(updateAvatar(data));
  }

  return (
    <>
      <h1>Profile</h1>
      <div className="@apply flex flex-row">
        <Formik initialValues={profileInitialValues} onSubmit={onSubmit} validationSchema={profileValidationSchema}>
          {(props) => {
            return (
              <Form className="layout">
                <div>
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
                  <div className="select-container">
                    <select
                      className="select-box"
                      onChange={(event) => {
                        props.handleChange(event);
                        changeField('sex', event.target.value);
                      }}
                    >
                      <option value="" disabled selected hidden>
                        {!fields.sex ? 'Sex' : fields.sex}
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                <Dialog
                  open={open}
                  onClose={() => setOpen(false)}
                  getPersistentElements={() => document.querySelectorAll('.Toastify')}
                  backdrop={<div className="backdrop" />}
                  className="dialog"
                >
                  <p className="description">Save changes?</p>
                  <div className="buttons">
                    <button className="btn-red" onClick={saveProfile}>
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
                  <p className="description">Discard changes?</p>
                  <div className="buttons">
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
            className="img"
            width={150}
            height={150}
            src={!avatar ? logo : `data:image/*;base64,${avatar}`}
            alt="avatar"
          />
          <label className="@apply btn-black cursor-pointer">
            <input className="@apply hidden" onChange={changeAvatar} type="file" />
            <span>Upload avatar</span>
          </label>
        </div>
      </div>
      <div className="flex mt-2">
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
