export const paths = {
  goal: {
    current: '/goal/current',
    past: '/goal/past',
    savingSimulation: '/goal/saving-simulation',
    amountAchieved: (id: string | number) => `/goal/detail/${id}/amount-achieved`,
    savingsSimulation: (id: string | number) => `/goal/detail/${id}/savingsimulation`,
    edit: (id: string | number) => `/goal/detail/${id}/edit`,
    editRoute: '/goal/detail/:id/edit',
    amountAchievedRoute: '/goal/detail/:id/amount-achieved',
    savingsSimulationRoute: '/goal/detail/:id/savingsimulation',
    create: '/goal/create',
    createStep: '/goal/create/step',
    createComplete: '/goal/create/complete',
    almostDone: '/goal/create/almost-done',
  },
} as const;
