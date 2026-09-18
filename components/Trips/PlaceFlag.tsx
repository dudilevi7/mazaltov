'use client'

interface PlaceFlagProps {
  countryCode?: string
  className?: string
}

export const flagEmoji = (countryCode?: string): string => {
  const code = countryCode?.trim().toUpperCase()
  if (!code || !/^[A-Z]{2}$/.test(code)) return ''
  return String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)))
}

const PlaceFlag = ({ countryCode, className = '' }: PlaceFlagProps) => {
  const code = countryCode?.trim().toLowerCase()
  if (!code || !/^[a-z]{2}$/.test(code)) return null

  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width={16}
      height={12}
      alt=""
      className={`inline-block h-3 w-4 shrink-0 rounded-[1px] object-cover ${className}`}
    />
  )
}

export default PlaceFlag
