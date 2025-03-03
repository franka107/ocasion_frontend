export const useGraphicsService = () => {
  const viewEventsPerMonth = async (params: {
    organizationIds: string[]
    startDate: Date
    endDate: Date
  }) => {
    const request = await useAPI<ChartResponse>(
      `kpi-management/graphics/view-events-per-month`,
      {
        method: 'POST',
        body: {
          organizationIds: params.organizationIds,
          startDate: params.startDate,
          endDate: params.endDate,
        },
      } as any,
    )
    return request
  }

  const viewOfferPerEventAverage = async (params: {
    organizationIds: string[]
    startDate: Date
    endDate: Date
  }) => {
    const request = await useAPI<ChartResponse>(
      `kpi-management/graphics/view-offer-per-event-average`,
      {
        method: 'POST',
        body: {
          organizationIds: params.organizationIds,
          startDate: params.startDate,
          endDate: params.endDate,
        },
      } as any,
    )
    return request
  }

  const viewComissionCollection = async (params: {
    organizationIds: string[]
    startDate: Date
    endDate: Date
  }) => {
    const request = await useAPI<ChartResponse>(
      `kpi-management/graphics/view-comission-collection`,
      {
        method: 'POST',
        body: {
          organizationIds: params.organizationIds,
          startDate: params.startDate,
          endDate: params.endDate,
        },
      } as any,
    )
    return request
  }
  return {
    viewEventsPerMonth,
    viewOfferPerEventAverage,
    viewComissionCollection,
  }
}
