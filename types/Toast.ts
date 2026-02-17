export enum ToastType {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error',
}

export type ShowToastParams = {
  type: ToastType
  title: string
  message: string
  duration?: number
}

export type ToastData = ShowToastParams & {
  id: number
}
