import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faCamera,
  faHotel,
  faListCheck,
  faMoneyBill,
  faPersonDress,
  faPlane,
  faShieldHalved,
  faSuitcase,
  faUmbrellaBeach,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons'
import { TripCurrency, TripType } from '@/types/Trip'
import type { SelectOption } from '@/components/Shared/SelectDropdown'

export const TRIP_TYPE_META: Record<TripType, { he: string; en: string; icon: IconDefinition; color: string }> = {
  [TripType.HONEYMOON]: { he: 'ירח דבש', en: 'Honeymoon', icon: faUmbrellaBeach, color: 'text-blue-500' },
  [TripType.BACHELOR]: { he: 'מסיבת רווקים', en: 'Bachelor party', icon: faUserTie, color: 'text-gray-600' },
  [TripType.BACHELORETTE]: {
    he: 'מסיבת רווקות',
    en: 'Bachelorette party',
    icon: faPersonDress,
    color: 'text-blue-400',
  },
  [TripType.OTHER]: { he: 'אחר', en: 'Other', icon: faSuitcase, color: 'text-gray-500' },
}

export const getTripTypeOptions = (isRtl: boolean): SelectOption[] =>
  Object.values(TripType).map((value) => ({
    value,
    label: isRtl ? TRIP_TYPE_META[value].he : TRIP_TYPE_META[value].en,
  }))

export const CURRENCY_OPTIONS: SelectOption[] = [
  { value: TripCurrency.ILS, label: '₪ ILS' },
  { value: TripCurrency.USD, label: '$ USD' },
  { value: TripCurrency.EUR, label: '€ EUR' },
]

export interface SuggestedTripTask {
  templateId: string
  he: string
  en: string
  icon: IconDefinition
}

export const SUGGESTED_TRIP_TASKS: SuggestedTripTask[] = [
  { templateId: 'book-flights', he: 'הזמינו טיסות', en: 'Book flights', icon: faPlane },
  {
    templateId: 'book-hotels',
    he: 'תכננו יעדים והזמינו מלונות',
    en: 'Plan destinations and book hotels',
    icon: faHotel,
  },
  {
    templateId: 'insurance',
    he: 'ודאו שיש ביטוח נסיעות',
    en: 'Make sure you have travel insurance',
    icon: faShieldHalved,
  },
  {
    templateId: 'luggage',
    he: 'הכינו רשימת ציוד / מזוודות',
    en: 'Prepare luggage / to-do list',
    icon: faSuitcase,
  },
  {
    templateId: 'cash',
    he: 'משכו מזומנים',
    en: 'Withdraw cash',
    icon: faMoneyBill,
  },
]

export const TRIP_SECTION_META = {
  flights: { he: 'טיסות', en: 'Flights', icon: faPlane },
  hotels: { he: 'מלונות', en: 'Hotels', icon: faHotel },
  attractions: { he: 'אטרקציות', en: 'Attractions', icon: faCamera },
  tasks: { he: 'משימות', en: 'Tasks', icon: faListCheck },
} as const

export const getTripCopy = (isRtl: boolean) => ({
  addTrip: isRtl ? 'הוסף טיול' : 'Add trip',
  search: isRtl ? 'חיפוש טיול...' : 'Search trips...',
  back: isRtl ? 'חזרה לטיולים' : 'Back to trips',
  emptyList: isRtl ? 'אין טיולים. הוסף טיול כדי להתחיל.' : 'No trips yet. Add a trip to get started.',
  addTripHeader: isRtl ? 'הוספת טיול' : 'Add trip',
  editTripHeader: isRtl ? 'עריכת טיול' : 'Edit trip',
  tripName: isRtl ? 'שם הטיול' : 'Trip name',
  tripType: isRtl ? 'סוג' : 'Type',
  cancel: isRtl ? 'ביטול' : 'Cancel',
  save: isRtl ? 'שמור שינויים' : 'Save changes',
  add: isRtl ? 'הוסף' : 'Add',
  totalCost: isRtl ? 'סה״כ עלויות' : 'Total cost',
  addFlight: isRtl ? 'הוסף טיסה' : 'Add flight',
  editFlight: isRtl ? 'עריכת טיסה' : 'Edit flight',
  addHotel: isRtl ? 'הוסף מלון' : 'Add hotel',
  editHotel: isRtl ? 'עריכת מלון' : 'Edit hotel',
  addAttraction: isRtl ? 'הוסף אטרקציה' : 'Add attraction',
  editAttraction: isRtl ? 'עריכת אטרקציה' : 'Edit attraction',
  addTask: isRtl ? 'הוסף משימה' : 'Add task',
  editTask: isRtl ? 'עריכת משימה' : 'Edit task',
  emptyFlights: isRtl ? 'אין טיסות עדיין' : 'No flights yet',
  emptyHotels: isRtl ? 'אין מלונות עדיין' : 'No hotels yet',
  emptyAttractions: isRtl ? 'אין אטרקציות עדיין' : 'No attractions yet',
  emptyTasks: isRtl ? 'אין משימות עדיין' : 'No tasks yet',
  suggestedTasks: isRtl ? 'משימות מוצעות' : 'Suggested tasks',
  flightCompany: isRtl ? 'חברת תעופה' : 'Airline',
  from: isRtl ? 'מ' : 'From',
  to: isRtl ? 'אל' : 'To',
  departure: isRtl ? 'המראה' : 'Departure',
  arrival: isRtl ? 'נחיתה' : 'Arrival',
  connection: isRtl ? 'קונקשן (אופציונלי)' : 'Connection (optional)',
  addReturn: isRtl ? 'הוסף טיסת חזור' : 'Add return flight',
  returnFlight: isRtl ? 'טיסת חזור' : 'Return flight',
  price: isRtl ? 'מחיר' : 'Price',
  currency: isRtl ? 'מטבע' : 'Currency',
  hotelName: isRtl ? 'שם המלון' : 'Hotel name',
  bookingUrl: isRtl ? 'קישור להזמנה (אופציונלי)' : 'Booking link (optional)',
  country: isRtl ? 'מדינה' : 'Country',
  city: isRtl ? 'עיר' : 'City',
  checkIn: isRtl ? 'צ׳ק-אין' : 'Check-in',
  checkOut: isRtl ? 'צ׳ק-אאוט' : 'Check-out',
  description: isRtl ? 'תיאור' : 'Description',
  attractionName: isRtl ? 'שם האטרקציה' : 'Attraction',
  date: isRtl ? 'תאריך' : 'Date',
  taskTitle: isRtl ? 'משימה' : 'Task',
  done: isRtl ? 'בוצע' : 'Done',
  edit: isRtl ? 'ערוך' : 'Edit',
  delete: isRtl ? 'מחק' : 'Delete',
  bookingLink: isRtl ? 'קישור להזמנה' : 'Booking link',
  saved: isRtl ? 'הטיול נשמר' : 'Trip saved',
  deleted: isRtl ? 'הטיול נמחק' : 'Trip deleted',
  error: isRtl ? 'אירעה שגיאה' : 'Something went wrong',
  success: isRtl ? 'הצלחה' : 'Success',
  errorTitle: isRtl ? 'שגיאה' : 'Error',
  flightsCount: isRtl ? 'טיסות' : 'Flights',
  hotelsCount: isRtl ? 'מלונות' : 'Hotels',
  attractionsCount: isRtl ? 'אטרקציות' : 'Attractions',
  tasksCount: isRtl ? 'משימות' : 'Tasks',
})
