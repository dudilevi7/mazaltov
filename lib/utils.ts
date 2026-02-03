export const getFromLocalStorage = (key: string, defaultValue: any) => {
    const value = localStorage.getItem(key)
    if (!value) return defaultValue
    return JSON.parse(value || "")
}
export const setToLocalStorage = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value))
