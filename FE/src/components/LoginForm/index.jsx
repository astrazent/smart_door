import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaUser, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa'
import { useRegisterUser, useLoginUser } from '~/hooks/useUser'
import { useDispatch } from 'react-redux'
import { updateUser } from '~/redux/reducers/userReducer'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function LoginForm() {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        full_name: '',
        username: '',
        password: '',
        confirmPassword: '',
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const registerUserMutation = useRegisterUser()
    const loginUserMutation = useLoginUser()

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const validateForm = () => {
        if (!isLogin) {
            if (!formData.full_name.trim()) {
                toast.error('Họ và tên không được để trống!')
                return false
            }
            if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
                toast.error('Email không hợp lệ!')
                return false
            }
            if (!formData.phone.match(/^\d{9,15}$/)) {
                toast.error('Số điện thoại phải từ 9 đến 15 chữ số!')
                return false
            }
            if (!formData.username.trim()) {
                toast.error('Tên đăng nhập không được để trống!')
                return false
            }
            if (formData.password.length < 6) {
                toast.error('Mật khẩu phải từ 6 ký tự trở lên!')
                return false
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error('Mật khẩu không khớp!')
                return false
            }
        } else {
            if (!formData.username.trim()) {
                toast.error('Tên đăng nhập không được để trống!')
                return false
            }
            if (!formData.password) {
                toast.error('Mật khẩu không được để trống!')
                return false
            }
        }
        return true
    }

    const handleSubmit = e => {
        e.preventDefault()

        if (!validateForm()) return

        if (!isLogin) {
            const { confirmPassword, ...payload } = formData
            registerUserMutation.mutate(payload, {
                onSuccess: data => {
                    loginUserMutation.mutate(
                        {
                            identifier: formData.username,
                            password: formData.password,
                        },
                        {
                            onSuccess: loginData => {
                                dispatch(updateUser({ ...loginData.user }))

                                navigate('/')
                            },
                            onError: loginError => {
                                toast.error(
                                    loginError.message || 'Đăng nhập thất bại!'
                                )
                            },
                        }
                    )
                },
                onError: error => {
                    toast.error(
                        error.response?.data?.message ||
                            error.message ||
                            'Đăng ký thất bại!'
                    )
                },
            })
        } else {
            loginUserMutation.mutate(
                { identifier: formData.username, password: formData.password },
                {
                    onSuccess: data => {
                        dispatch(updateUser({ ...data.user }))

                        navigate('/')
                    },
                    onError: error => {
                        toast.error(
                            error.response?.data?.message ||
                                error.message ||
                                'Đăng nhập thất bại!'
                        )
                    },
                }
            )
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-12"
        >
            <div className="flex justify-between mb-8">
                <button
                    className={`w-1/2 py-3 font-semibold text-xl rounded-l-xl transition ${
                        isLogin
                            ? 'bg-[#0B6AAF] text-white'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => setIsLogin(true)}
                >
                    Đăng nhập
                </button>
                <button
                    className={`w-1/2 py-3 font-semibold text-xl rounded-r-xl transition ${
                        !isLogin
                            ? 'bg-[#0B6AAF] text-white'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => setIsLogin(false)}
                >
                    Đăng ký
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                    <>
                        <div className="relative">
                            <FaEnvelope className="absolute top-3 left-3 text-gray-400 text-lg" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-full pl-10 pr-3 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6AAF]"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <FaPhone className="absolute top-3 left-3 text-gray-400 text-lg" />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Số điện thoại"
                                className="w-full pl-10 pr-3 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6AAF]"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <FaUser className="absolute top-3 left-3 text-gray-400 text-lg" />
                            <input
                                type="text"
                                name="full_name"
                                placeholder="Họ và tên"
                                className="w-full pl-10 pr-3 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6AAF]"
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                <div className="relative">
                    <FaUser className="absolute top-3 left-3 text-gray-400 text-lg" />
                    <input
                        type="text"
                        name="username"
                        placeholder="Tên đăng nhập hoặc Email"
                        autoComplete="username"
                        className="w-full pl-10 pr-3 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6AAF]"
                        required
                        onChange={handleChange}
                    />
                </div>

                <div className="relative">
                    <FaLock className="absolute top-3 left-3 text-gray-400 text-lg" />
                    <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        autoComplete="new-password"
                        className="w-full pl-10 pr-3 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6AAF]"
                        required
                        onChange={handleChange}
                    />
                </div>

                {!isLogin && (
                    <div className="relative">
                        <FaLock className="absolute top-3 left-3 text-gray-400 text-lg" />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Nhập lại mật khẩu"
                            autoComplete="new-password"
                            className="w-full pl-10 pr-3 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6AAF]"
                            required
                            onChange={handleChange}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full py-3 mt-6 text-lg text-white font-semibold rounded-lg bg-[#0B6AAF] hover:bg-[#095B97] transition"
                    disabled={
                        registerUserMutation.isLoading ||
                        loginUserMutation.isLoading
                    }
                >
                    {registerUserMutation.isLoading ||
                    loginUserMutation.isLoading
                        ? 'Đang xử lý...'
                        : isLogin
                          ? 'Đăng nhập'
                          : 'Đăng ký'}
                </button>
            </form>
        </motion.div>
    )
}
