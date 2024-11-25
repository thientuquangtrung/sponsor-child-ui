import baseApi from '@/redux/baseApi';
export const childrenVisitTripsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllChildrenVisitTrips: builder.query({
            query: () => `/ChildrenVisitTrips`,
        }),
        createChildrenVisitTrips: builder.mutation({
            query: (data) => ({
                url: '/ChildrenVisitTrips',
                method: 'POST',
                body: data,
            }),
        }),
        getChildrenVisitTripsById: builder.query({
            query: (id) => `/ChildrenVisitTrips/${id}`,

        }),
        updateChildrenVisitTrips: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/ChildrenVisitTrips/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        getFilteredChildrenVisitTrips: builder.query({
            query: ({ status, startDate, endDate, province, visitCost }) => ({
                url: '/ChildrenVisitTrips/filter',
                params: {
                    status,
                    startDate,
                    endDate,
                    province,
                    visitCost
                }
            }),
        }),
    }),
});

export const {
    useGetAllChildrenVisitTripsQuery,
    useCreateChildrenVisitTripsMutation,
    useGetChildrenVisitTripsByIdQuery,
    useUpdateChildrenVisitTripsMutation,
    useGetFilteredChildrenVisitTripsQuery,
} = childrenVisitTripsApi;
