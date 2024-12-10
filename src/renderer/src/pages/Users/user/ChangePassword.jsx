import { MdManageAccounts } from 'react-icons/md'
import './ChangePassword.css'
import { Form, Input, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { eyeOff } from 'react-icons-kit/feather/eyeOff'
import { eye } from 'react-icons-kit/feather/eye'
import { Icon } from 'react-icons-kit'
import { toast } from 'react-toastify'
import React, { useState } from 'react'
import validator from 'validator'
import { useUpdateMutation } from '../../../slices/userAPISlices.js'

const ChangePassword = () => {
  const loggedInUser = sessionStorage.getItem('userInfo')
    ? JSON.parse(sessionStorage.getItem('userInfo'))
    : 'Account'
  const navigate = useNavigate()
  const [updateUser] = useUpdateMutation()

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const backHandler = () => {
    navigate('/')
  }

  // const validate = (value) => {
  //   if (
  //     validator.isStrongPassword(value, {
  //       minLength: 8,
  //       minLowercase: 1,
  //       minUppercase: 1,
  //       minNumbers: 1,
  //       minSymbols: 1,
  //     })
  //   ) {
  //   } else {
  //     setErrorMessage(
  //       "Password must include at least 8 characters, at least 1 lowercase letter, at least 1 uppercase letter, at least 1 symbol, and at least 1 number"
  //     );
  //   }
  // };

  const handleChangeSubmit = async (e) => {
    try {
      if (!oldPassword || !newPassword || !confirmPassword) {
        toast.error('All fields are required.')
      }

      if (errorMessage) {
        toast.error(errorMessage)
      }

      if (confirmPassword != newPassword) {
        toast.error('Confirm password does not match with the new password.')
      }

      const req = {
        username: loggedInUser.username,
        old_password: oldPassword,
        new_password: newPassword
      }

      const res = await updateUser(req).unwrap()

      setNewPassword('')
      setOldPassword('')
      setConfirmPassword('')

      toast.success(res.message)
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }

  return (
    <>
      <div className="change-pass-main-container">
        <header className="change-pass-header">
          Change Password
          <div className="change-pass-icon">
            <MdManageAccounts></MdManageAccounts>
          </div>
        </header>
        <p className="changePass-page-description">
          This page will be used to modify user's password.
        </p>
        <div className="changePass-block">
          <Form onFinish={handleChangeSubmit} style={{ width: '100%' }}>
            <div className="user-input-container">
              <div className="username-input">
                <label>Username:</label>
                <Input value={loggedInUser.username} disabled />
              </div>
              <div className="username-input">
                <label>Current Password: </label>
                <Input.Password
                  iconRender={(visible) =>
                    !visible ? (
                      <Icon className="absolute mr-10" icon={eyeOff} size={20} />
                    ) : (
                      <Icon className="absolute mr-10" icon={eye} size={20} />
                    )
                  }
                  onChange={(e) => setOldPassword(e.target.value)}
                  value={oldPassword}
                />
              </div>
              <div className="username-input">
                <label>New Password: </label>
                <Input.Password
                  iconRender={(visible) =>
                    !visible ? (
                      <Icon className="absolute mr-10" icon={eyeOff} size={20} />
                    ) : (
                      <Icon className="absolute mr-10" icon={eye} size={20} />
                    )
                  }
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />
              </div>
              <div className="username-input">
                <label>Confirm Password: </label>
                <Input.Password
                  iconRender={(visible) =>
                    !visible ? (
                      <Icon className="absolute mr-10" icon={eyeOff} size={20} />
                    ) : (
                      <Icon className="absolute mr-10" icon={eye} size={20} />
                    )
                  }
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
              </div>
              <div className="pass-buttton-container">
                <Button type="primary" htmlType="submit">
                  Change Password
                </Button>
                <Button type="primary" onClick={backHandler}>
                  Back
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}

export default ChangePassword
