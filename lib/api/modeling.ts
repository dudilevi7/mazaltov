const parseBody = async <T>(request: Request): Promise<Partial<T> | null> => {
  try {
    const body = await request.json()
    if (typeof body !== 'object' || body === null) return null
    return body as Partial<T>
  } catch {
    return null
  }
}

export { parseBody }
