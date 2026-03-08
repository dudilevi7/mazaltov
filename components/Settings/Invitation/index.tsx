'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import useSupabase from '@/hooks/useSupabase'
import { supabase } from '@/lib/supabase/client'
import { API_URL } from '@/constants'
import { API_ROUTES } from '@/constants/apiRoutes'
import { LanguageDirection } from '@/types/General'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faPenToSquare, faUpload } from '@fortawesome/free-solid-svg-icons'
import { validateImageFile, INVITATION_STORAGE_BUCKET, INVITATION_OBJECT_NAME } from './helper'
import InvitationImageModal from './InvitationImageModal'
import fetchData, { METHODS, getAuthToken } from '@/lib/fetchData'

const Invitation = () => {
  const { user } = useSupabase()
  const { languageDirection } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const displayUrl = imageUrl ? imageUrl : null

  const fetchInvitationUrl = useCallback(async () => {
    if (!user || imageUrl) return
    try {
      const res = await fetchData<void, { url: string }>({
        url: `${API_URL}${API_ROUTES.INVITATION}`,
        method: METHODS.GET,
      })
      const url = res?.url
      if (url) {
        setImageUrl(url)
        setLoadError(false)
      } else {
        setLoadError(true)
      }
    } catch {
      setLoadError(true)
    } finally {
      setIsUploading(false)
    }
  }, [user])

  useEffect(() => {
    fetchInvitationUrl()
  }, [user])

  const handleImageError = () => setLoadError(true)

  const uploadFile = async (file: File) => {
    if (!user) return
    setUploadError(null)
    const valid = await validateImageFile(file)
    if (!valid) {
      setUploadError(
        isRtl
          ? 'נא להעלות קובץ תמונה תקין (JPEG, PNG, GIF או WebP)'
          : 'Please upload a valid image file (JPEG, PNG, GIF or WebP)'
      )
      return
    }
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${API_URL}${API_ROUTES.INVITATION}`, {
        method: imageUrl ? METHODS.PUT : METHODS.POST,
        body: formData,
        headers: {
          'X-Supabase-Auth': (await getAuthToken()) ?? '',
        },
      })
      const data = await res.json()
      const url = data?.url
      if (url) {
        setImageUrl(url)
        setLoadError(false)
        setUploadError(null)
        setIsUploading(false)
        return
      }
      setUploadError(isRtl ? 'ההעלאה נכשלה' : 'Upload failed')
      setIsUploading(false)
      setLoadError(true)
    } catch (error) {
      setUploadError(isRtl ? 'ההעלאה נכשלה' : 'Upload failed')
      setIsUploading(false)
      setLoadError(true)
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ''
  }

  if (!user) return null

  return (
    <section className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <FontAwesomeIcon icon={faImage} className="text-indigo-500" />
        <h2 className="text-base font-semibold text-gray-800">{isRtl ? 'הזמנה לאירוע' : 'Event invitation'}</h2>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {displayUrl && !loadError ? (
        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2">
            <img
              src={displayUrl}
              alt="Invitation"
              onError={handleImageError}
              className="max-w-[500px] object-cover object-top rounded-lg border border-gray-200 transition hover:opacity-95 animate-fade-in"
            />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 disabled:opacity-50">
            <FontAwesomeIcon icon={faPenToSquare} />
            {isRtl ? 'ערוך' : 'Edit'}
          </button>
          {uploadError && (
            <p className="text-sm text-red-600 animate-fade-in" role="alert">
              {uploadError}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="flex max-w-xs items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm font-medium text-gray-600 transition hover:border-indigo-400 hover:bg-indigo-50/50 disabled:opacity-50 w-full">
            <FontAwesomeIcon icon={faUpload} />
            {isUploading
              ? isRtl
                ? 'מעלה...'
                : 'Uploading...'
              : isRtl
                ? 'העלה תמונת הזמנה'
                : 'Upload invitation image'}
          </button>
          {uploadError && (
            <p className="text-sm text-red-600 animate-fade-in" role="alert">
              {uploadError}
            </p>
          )}
        </div>
      )}

      <InvitationImageModal isOpen={modalOpen} onClose={() => setModalOpen(false)} imageUrl={displayUrl ?? ''} />
    </section>
  )
}

export default Invitation
