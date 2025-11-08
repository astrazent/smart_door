import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    listDoors,
    addDoor,
    updateDoor,
    deleteDoor,
} from '~/services/doorService'

export const useListDoors = params => {
    return useQuery({
        queryKey: ['doors', params],
        queryFn: () => listDoors(params),
        keepPreviousData: true,
    })
}

export const useAddDoor = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: addDoor,
        onSuccess: () => {
            queryClient.invalidateQueries(['doors'])
        },
    })
}

export const useUpdateDoor = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }) => updateDoor(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['doors'])
        },
    })
}

export const useDeleteDoor = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteDoor,
        onSuccess: () => {
            queryClient.invalidateQueries(['doors'])
        },
    })
}
