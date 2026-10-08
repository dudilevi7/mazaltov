// Error code returned by the API when the caller is authenticated but has no event yet.
export const NO_EVENT_ERROR_CODE = 'NO_EVENT'
// Window event dispatched by fetchData when the API returns NO_EVENT_ERROR_CODE.
export const NO_EVENT_EVENT_NAME = 'mazaltov:no-event'

export const EVENT_SETUP_LABELS = {
  HEB: {
    title: 'עוד רגע ומתחילים',
    body: 'הגדירו את פרטי האירוע בהגדרות, ואחר כך תוכלו להוסיף משימות, אורחים, ספקים ועוד.',
    cta: 'להגדרות האירוע',
    disabledTooltip: 'הגדירו פרטי אירוע בהגדרות כדי להתחיל',
    toastTitle: 'עדיין לא הוגדר אירוע',
    toastMessage: 'הגדירו את פרטי האירוע בהגדרות ונסו שוב.',
  },
  ENG: {
    title: 'One step before you start',
    body: 'Set up your event details in Settings, then you can add tasks, guests, providers and more.',
    cta: 'Go to event settings',
    disabledTooltip: 'Set up your event in Settings first',
    toastTitle: 'No event defined yet',
    toastMessage: 'Set up your event details in Settings and try again.',
  },
}
