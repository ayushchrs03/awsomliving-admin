import * as Yup from 'yup';
import { fieldValidation } from './fieldValidation';

export const signinValidator = Yup.object({
    email: fieldValidation.email,
    password: fieldValidation.oldPassword,
})

export const updatePasswordValidator = Yup.object({
    newPassword: fieldValidation.password,
    oldPassword: fieldValidation.oldPassword,
    confirmPassword: fieldValidation.confirmPassword,
})

export const resetPasswordValidator = Yup.object({
    password: fieldValidation.password,
    rePassword: fieldValidation.rePassword,
})


export const otpValidator = Yup.object({
    otp: Yup.string()
        .required('OTP is required')
        .matches(/^\d{4}$/, 'OTP must be a 4-digit number'),
});