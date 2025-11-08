import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createCard,
    listCards,
    listCardUsers,
    getCardById,
    getCardByUid,
    updateCard,
    deleteCard,
} from '~/services/cardService'

export const useListCards = params => {
    return useQuery({
        queryKey: ['card', params],
        queryFn: () => listCards(params),
        keepPreviousData: true,
    })
}

export const useListCardUsers = params => {
    return useQuery({
        queryKey: ['cardUser', params],
        queryFn: () => listCardUsers(params),
        keepPreviousData: true,
    })
}

export const useGetCardById = id => {
    return useQuery({
        queryKey: ['card', id],
        queryFn: () => getCardById(id),
        enabled: !!id,
    })
}

export const useGetCardByUid = uid => {
    return useQuery({
        queryKey: ['card', 'uid', uid],
        queryFn: () => getCardByUid(uid),
        enabled: !!uid,
    })
}

export const useCreateCard = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createCard,
        onSuccess: () => {
            queryClient.invalidateQueries(['card'])
        },
    })
}

export const useUpdateCard = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }) => updateCard(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['card'])
        },
    })
}

export const useDeleteCard = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteCard,
        onSuccess: () => {
            queryClient.invalidateQueries(['card'])
        },
    })
}
