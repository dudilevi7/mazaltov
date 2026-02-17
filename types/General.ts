import { METHODS } from '@/lib/fetchData'

export enum LanguageDirection {
  'HEB' = 'rtl',
  'ENG' = 'ltr',
}

export type FetchDataOptions<T = unknown> = {
  url: string
  method?: METHODS
  body?: T
  headers?: Record<string, string>
  cache?: RequestCache
  next?: { revalidate?: number | false; tags?: string[] }
}
