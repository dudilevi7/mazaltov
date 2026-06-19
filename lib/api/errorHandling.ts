import { NextResponse } from 'next/server'

const REQUESTS_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}
const unauthorized = (message = 'Unauthorized') =>
  NextResponse.json({ message }, { status: REQUESTS_CODES.UNAUTHORIZED })
const forbidden = (message = 'Forbidden') => NextResponse.json({ message }, { status: REQUESTS_CODES.FORBIDDEN })
const notFound = (message = 'Not found') => NextResponse.json({ message }, { status: REQUESTS_CODES.NOT_FOUND })
const internalServerError = (message = 'Internal server error') =>
  NextResponse.json({ message }, { status: REQUESTS_CODES.INTERNAL_SERVER_ERROR })

export { unauthorized, forbidden, notFound, internalServerError }
