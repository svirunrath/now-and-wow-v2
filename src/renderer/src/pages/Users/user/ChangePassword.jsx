import { MdManageAccounts } from "react-icons/md";
import "./ChangePassword.css";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { Icon } from "react-icons-kit";
import { toast } from "react-toastify";
import React, { useState } from "react";
import validator from "validator";
import { useUpdateMutation } from "../../../slices/userAPISlices.js";

const ChangePassword = () => {
  const loggedInUser = sessionStorage.getItem("userInfo")
    ? JSON.parse(sessionStorage.getItem("userInfo"))
    : "Account";
  const navigate = useNavigate();
  const [updateUser] = useUpdateMutation();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const backHandler = () => {
    navigate("/");
  };

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
        toast.error("All fields are required.");
      }

      if (errorMessage) {
        toast.error(errorMessage);
      }

      if (confirmPassword != newPassword) {
        toast.error("Confirm password does not match with the new password.");
      }

      const req = {
        username: loggedInUser.username,
        old_password: oldPassword,
        new_password: newPassword,
      };

      const res = await updateUser(req).unwrap();

      setNewPassword("");
      setOldPassword("");
      setConfirmPassword("");

      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <div className="changePassMainContainer">
        <header className="changePassMainHeader">
          Change Password
          <div className="changePassIcon">
            <MdManageAccounts></MdManageAccounts>
          </div>
        </header>
        <p className="changePass-page-description">
          This page will be used to modify user's password.
        </p>
        <div className="changePass-block">
          <Form name="change-password" onFinish={handleChangeSubmit}>
            <div className="userInputContainer">
              <Form.Item label="Username" />
              <Input
                id="username-input"
                value={loggedInUser.username}
                disabled
              />
            </div>
            <div className="userInputContainer">
              <Form.Item label="Current Password" />
              <div className="old-pass-wrapper">
                <Input.Password
                  iconRender={(visible) =>
                    !visible ? (
                      <Icon
                        className="absolute mr-10"
                        icon={eyeOff}
                        size={20}
                      />
                    ) : (
                      <Icon className="absolute mr-10" icon={eye} size={20} />
                    )
                  }
                  onChange={(e) => setOldPassword(e.target.value)}
                  value={oldPassword}
                />
              </div>
            </div>
            <div className="userInputContainer">
              <Form.Item label="New Password" />
              <div className="new-pass-wrapper">
                <Input.Password
                  iconRender={(visible) =>
                    !visible ? (
                      <Icon
                        className="absolute mr-10"
                        icon={eyeOff}
                        size={20}
                      />
                    ) : (
                      <Icon className="absolute mr-10" icon={eye} size={20} />
                    )
                  }
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />
              </div>
            </div>
            <div className="userInputContainer">
              <Form.Item label="Confirm Password" />
              <div className="conf-pass-wrapper">
                <Input.Password
                  iconRender={(visible) =>
                    !visible ? (
                      <Icon
                        className="absolute mr-10"
                        icon={eyeOff}
                        size={20}
                      />
                    ) : (
                      <Icon className="absolute mr-10" icon={eye} size={20} />
                    )
                  }
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
              </div>
            </div>
            <Form.Item className="buttonContainer">
              <Button type="primary" className="btnChange" htmlType="submit">
                Change Password
              </Button>
              <Button type="primary" className="btnBack" onClick={backHandler}>
                Back
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
