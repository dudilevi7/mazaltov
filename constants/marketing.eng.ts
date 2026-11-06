import type { MarketingCopy } from './marketing.heb'

export const ENG: MarketingCopy = {
  nav: {
    about: 'About',
    features: 'Features',
    connect: 'Connect',
    login: 'Log in',
    start: 'Get started',
    recommendations: 'Recommendations',
  },
  hero: {
    eyebrow: 'Everything in one place',
    headline: 'It’s time to manage an event and save the hassle',
    support: 'Guests, gifts, vendors, and tasks in one place — without miserable spreadsheets and tables.',
    connect: 'Connect',
  },
  eventsLead: 'A wedding, a bar or bat mitzvah, a brit, even a henna.',
  events: [
    { id: 'wedding', label: 'Wedding' },
    { id: 'bar_mitzva', label: 'Bar/bat mitzvah' },
    { id: 'brit', label: 'Brit' },
    { id: 'henna', label: 'Henna' },
  ],
  about: {
    kicker: 'About',
    title: 'One login instead of a notebook, Excel, and WhatsApp',
    body: 'A smart system that catches mistakes as guests are entered, with live statistics, filters by side and category, hall seating plans, and above all — order on the timeline.',
    points: ['Control and manage guests', 'Live statistics', 'Filter by side and category', 'Hall seating', 'Order on the timeline'],
  },
  features: {
    kicker: 'Features',
    items: [
      {
        id: 'tasks',
        title: 'Run tasks, meetings, and times',
        body: 'Set tasks, meetings, shopping, and what your event needs.',
        points: ['Tasks', 'Meetings', 'Shopping'],
      },
      {
        id: 'vendors',
        title: 'Full control of vendors and what you still owe',
        body: 'Every vendor, the price, the advance, and what you still owe.',
        points: ['Hall — advance paid', 'Photo — left to pay', 'Catering — left to pay'],
      },
      {
        id: 'gifts',
        title: 'Gifts and stats by side and by how they were paid',
        body: 'By side — bride, groom, or both — and by cash, Bit, Paybox, check, or transfer.',
        points: ['Bride’s side', 'Groom’s side', 'Cash', 'Bit', 'Paybox'],
      },
    ],
  },
  recommendations: {
    kicker: 'Recommendations',
    items: [
      {
        quote:
          'I built MazalTov two months before the wedding. Wanting control of that huge event gave me a grip on it, and we hit the goals and the budget my wife and I had set. We were happy, and we ran the event easily — the tasks, what we owed the vendors, the gifts we logged — and it gave us and the people around us a sense of certainty. When it was over I promised I’d keep building it and help people with their simchas. Mazal tov!',
        name: 'David Levi',
      },
      {
        quote:
          'You can’t really get it wrong. This system puts things in order.\nEvery list is in one place, and if you feel like exporting to Excel you always can — the guests, the vendors, even the gifts.\nYou know the morning after, when the parents ask how much he gave and how much the aunt gave?\nIn seconds I made a PDF by the category of my parents’ guests and sent it to them.\nShort version — this system is a blast.',
        name: 'Dan',
      },
      {
        quote:
          'I opened tasks with times, shared the event with my husband, and he logged in and added the tasks and vendors he had closed.\nAnother great part is the public notes. My dad was in charge of seating, and so spare tables wouldn’t just open I sent him a public page. He updated which tables opened as reserve and how many people sat there in total.\nA friend of my husband’s was in charge of the alcohol and updated everything on that same page.',
        name: 'Lior',
      },
    ],
  },
  connect: {
    kicker: 'Get in touch',
    title: 'We built the system for our own event. We’re here to help you through the mess.',
    body: 'Write to us about questions, how to get the most from your event, bugs, and even ideas to make it better. Mazal tov!',
    name: 'Name',
    email: 'Email',
    event: 'Event type',
    eventPlaceholder: 'Choose a type',
    message: 'Message',
    send: 'Send',
    or: 'or',
    start: 'Get started',
    subject: 'MazalTov — message from the site',
    errors: {
      name: 'Name is missing',
      email: 'Email looks wrong',
      event: 'Choose an event type',
      message: 'Message is missing',
    },
  },
  footer: {
    line: 'Everything in one place.',
  },
}
