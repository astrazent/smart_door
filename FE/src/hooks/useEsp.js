import { useMutation, useQuery } from '@tanstack/react-query'
import { openDoor, closeDoor, getDoorStatus } from '~/services/espService'

export const useOpenDoor = () => {
    return useMutation({
        mutationFn: params => openDoor(params),
    })
}

export const useCloseDoor = () => {
    return useMutation({
        mutationFn: params => closeDoor(params),
    })
}

export const useDoorStatus = params => {
    return useQuery({
        queryKey: ['doorStatus', params],
        queryFn: () => getDoorStatus(params),
        refetchInterval: 1000,
        refetchOnWindowFocus: true,
        keepPreviousData: true,
    })
}
