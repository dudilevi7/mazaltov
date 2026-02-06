
const getWhatsappUrl = (phone:string) => {
    if (!phone) return "";
    let cleanedPhone = phone;
    cleanedPhone = cleanedPhone.replace(/\D/g, "");
    cleanedPhone = cleanedPhone.replaceAll("-", "").replaceAll(" ", "").replaceAll("+972", "0");
    return `https://wa.me/${cleanedPhone}`;
}
const PHONE_NUMBER_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

const validatePhoneNumber = (phone?: string) => {
    if (!phone) return true;
    let cleanedPhone = phone;
    cleanedPhone = cleanedPhone.replaceAll("-", "").replaceAll(" ", "").replaceAll("+972", "0");
    cleanedPhone = cleanedPhone.replace(/\D/g, "");
    return PHONE_NUMBER_REGEX.test(cleanedPhone);
}
export { getWhatsappUrl, validatePhoneNumber };