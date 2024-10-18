import baseApi from '../baseApi';

// Tạo API cho các Enum
export const getEnumApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBankNames: builder.query({
            query: () => '/getEnum/bank-names',
        }),
        getOrganizationTypes: builder.query({
            query: () => 'getEnum/organization-types',
        }),
    }),
});


export const { useGetBankNamesQuery, useGetOrganizationTypesQuery } = getEnumApi;
