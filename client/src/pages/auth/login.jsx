import React from 'react'
import CommonForm from "@/components/common/form";
import { loginUser } from "@/store/auth-slice";
import { loginFormControls } from "@/config";
import { toast } from "sonner";
import { useState } from "react";

import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';

const initialState = {
  email: "",
  password: "",
};

const AuthLogin = () => {

  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  const onSubmit = (event) => {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data.payload.message || "Login successful");
      } else {
        toast.error(data?.payload?.message || "Login failed");
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  )
}

export default AuthLogin;