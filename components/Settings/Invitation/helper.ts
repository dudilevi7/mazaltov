const IMAGE_SIGNATURES: { bytes: number[]; offset: number }[] = [
  { bytes: [0x89, 0x50, 0x4e, 0x47], offset: 0 },
  { bytes: [0xff, 0xd8, 0xff], offset: 0 },
  { bytes: [0x47, 0x49, 0x46, 0x38, 0x37], offset: 0 },
  { bytes: [0x47, 0x49, 0x46, 0x38, 0x39], offset: 0 },
  { bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 },
]

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const readBytes = (file: File, offset: number, length: number): Promise<Uint8Array> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    const blob = file.slice(offset, offset + length)
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer))
    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(blob)
  })

const checkSignature = (bytes: Uint8Array, sig: number[]): boolean =>
  sig.every((b, i) => bytes[i] === b)

export const validateImageFile = async (file: File): Promise<boolean> => {
  if (!ALLOWED_TYPES.includes(file.type)) return false
  const maxLen = Math.max(...IMAGE_SIGNATURES.map((s) => s.offset + s.bytes.length))
  const bytes = await readBytes(file, 0, maxLen)
  return IMAGE_SIGNATURES.some(
    (sig) => bytes.length >= sig.offset + sig.bytes.length && checkSignature(bytes.slice(sig.offset), sig.bytes)
  )
}

export const INVITATION_STORAGE_BUCKET = 'invitations'
export const INVITATION_OBJECT_NAME = 'invitation'
