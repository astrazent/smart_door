import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createUser,
    listUsers,
    getUserById,
    updateUser,
    deleteUser,
} from '~/services/userService'

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
