import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createUser,
    listUsers,
    getUserById,
    updateUser,
    deleteUser,
    registerUser,
    loginUser,
    verifyUser,
    logoutUser,
} from '~/services/userService'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearUser } from '~/redux/reducers/userReducer'

export const useListUsers = params => {
    return useQuery({
        queryKey: ['users', params],
        queryFn: () => listUsers(params),
        keepPreviousData: true,
    })
}

export const useGetUserById = id => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => getUserById(id),
        enabled: !!id,
    })
}

export const useCreateUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries(['users'])
        },
    })
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }) => updateUser(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['users'])
            queryClient.invalidateQueries(['user', variables.id])
        },
    })
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries(['users'])
        },
    })
}

export const useRegisterUser = () => {
    return useMutation({
        mutationFn: registerUser,
    })
}

export const useLoginUser = () => {
    return useMutation({
        mutationFn: loginUser,
    })
}

export const useAuth = () => {
    return useQuery({
        queryKey: ['verifyUser'],
        queryFn: verifyUser,
        retry: false,
        refetchOnWindowFocus: false,
    })
}

export const useLogout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            dispatch(clearUser())
            queryClient.removeQueries(['verifyUser'])
            navigate('/login')
        },
    })

    return {
        logout: mutation.mutate,
        isLoading: mutation.isLoading,
        isError: mutation.isError,
        error: mutation.error,
    }
}
