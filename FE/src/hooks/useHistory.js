import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    listHistory,
    listDoorUserHistory,
    addHistory,
    deleteHistory,
    deleteAllHistory,
} from '~/services/historyService'

export const useListHistory = params => {
    return useQuery({
        queryKey: ['history', params],
        queryFn: () => listHistory(params),
        keepPreviousData: true,
    })
}

export const useAddHistory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: addHistory,
        onSuccess: () => {
            queryClient.invalidateQueries(['history'])
        },
    })
}

export const useDeleteHistory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteHistory,
        onSuccess: () => {
            queryClient.invalidateQueries(['history'])
        },
    })
}

export const useDeleteAllHistory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteAllHistory,
        onSuccess: () => {
            queryClient.invalidateQueries(['history'])
        },
    })
}

export const useListDoorUserHistory = params => {
    return useQuery({
        queryKey: ['doorUserHistory', params],
        queryFn: () => listDoorUserHistory(params),
        keepPreviousData: true,
    })
}
