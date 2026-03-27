export const templateParseErrorHebrew = (code: string): string => {
  if (code === 'NO_MATCHES') {
    return 'לא נמצאו עמודות שתואמות למיפוי. ודאו ששורת הכותרת בתבנית זהה לטקסט בעמודה הימנית (למשל שם מלא → שם מלא).'
  }
  if (code === 'EMPTY_SHEET') return 'גיליון ריק או לא תקין.'
  return 'לא ניתן לקרוא את הקובץ.'
}
