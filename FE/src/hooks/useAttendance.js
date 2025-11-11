import { useQuery } from '@tanstack/react-query'
import { listAttendance } from '~/services/attendanceService'

export const useListAttendance = params => {
    return useQuery({
        queryKey: ['attendance', params],
        queryFn: () => listAttendance(params),
        keepPreviousData: true,
    })
}
