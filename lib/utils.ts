export const getFromLocalStorage = (key: string, defaultValue: any) => {
    const value = localStorage.getItem(key)
    if (!value) return defaultValue
    return JSON.parse(value || "")
}
export const setToLocalStorage = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value))

export const parseNumber = (value: string) => {
    const parsed = parseFloat(value.replace(",", "."));
    return Number.isNaN(parsed) ? 0 : parsed;
}

export const formatCurrency = (value: number, withoutFloatingPoint: boolean = true): string => {
    const formattedCurrency = new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(value || 0);
    return withoutFloatingPoint ? formattedCurrency.replace(/\.\d{2}/, "") : formattedCurrency;
}
