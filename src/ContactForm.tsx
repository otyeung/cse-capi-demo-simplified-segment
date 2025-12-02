// src/ContactForm.tsx
import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import Modal from './Modal'

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (command: string, event: string, data: any) => void
    analytics: any
  }
}

interface FormData {
  li_fat_id: string
  lastName: string
  firstName: string
  email: string
  hashEmail: string
  title: string
  company: string
  countryCode: string
  currency: string
  value: string
  acxiomId: string
  oracleMoatId: string
  leadId: string
}

const initialFormData: FormData = {
  li_fat_id: '',
  lastName: 'Doe',
  firstName: 'John',
  email: 'johndoe@example.com',
  hashEmail: '836f82db99121b3481011f16b49dfa5fbc714a0d1b1b9f784a1ebbbf5b39577f',
  title: 'Engineer',
  company: 'Acme Inc',
  countryCode: 'US',
  currency: 'USD',
  value: '0.0',
  acxiomId: '12345678',
  oracleMoatId: '12345678',
  leadId: '12345678',
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState<string | null>(null)
  const isAnalyticsExecuted = useRef(false)
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const li_fat_id =
        (typeof window !== 'undefined' &&
          new URLSearchParams(window.location.search).get('li_fat_id')) ||
        (typeof document !== 'undefined' && getCookie('li_fat_id')) ||
        ''

      if (li_fat_id && !isAnalyticsExecuted.current) {
        setFormData((prevData) => ({ ...prevData, li_fat_id }))
        isAnalyticsExecuted.current = true
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (formRef.current) {
      formRef.current.addEventListener('submit', () => {
        console.log('[DEBUG] Segment form submit detected. Form data:', {
          hashedEmail: formData.hashEmail,
          lastName: formData.lastName,
          firstName: formData.firstName,
          title: formData.title,
          company: formData.company,
          countryCode: formData.countryCode,
        })
      })
    }

    if (formRef.current && window.analytics?.trackForm) {
      window.analytics.trackForm(formRef.current, 'Sign Up', {
        hashedEmail: formData.hashEmail,
        lastName: formData.lastName,
        firstName: formData.firstName,
        title: formData.title,
        company: formData.company,
        countryCode: formData.countryCode,
      })
    }
  }, [formData])

  function getCookie(name: string): string | undefined {
    if (typeof document !== 'undefined') {
      const matches = document.cookie.match(
        new RegExp(
          '(?:^|; )' +
            name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') +
            '=([^;]*)'
        )
      )
      return matches ? decodeURIComponent(matches[1]) : undefined
    }
    return undefined
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const hashedEmail = await hashData(formData.email)
      setFormData((prevData) => ({
        ...prevData,
        hashEmail: hashedEmail,
      }))

      console.log('Form submitted successfully:', formData)

      setModalMessage(
        'Form submitted successfully : ' + JSON.stringify(formData, null, 2)
      )
      setSubmissionStatus('success')
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      setModalMessage('Error submitting form: ' + error)
      setSubmissionStatus('error')
      setIsModalOpen(true)
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    if (name === 'email') {
      const hashedEmail = await hashData(value)
      setFormData((prevData) => ({
        ...prevData,
        hashEmail: hashedEmail,
      }))
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleResetForm = () => {
    setFormData(initialFormData)
  }

  const hashData = async (value: string): Promise<string> => {
    const encoder = new TextEncoder()
    const buffer = await crypto.subtle.digest(
      'SHA-256',
      encoder.encode(value.toLowerCase())
    )
    const hashArray = Array.from(new Uint8Array(buffer))
    return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
  }

  return (
    <>
      <div className='App'>
        <form
          ref={formRef}
          className='centered-form'
          onSubmit={handleSubmit}
          id='capiForm'
        >
          <h1 className='form-title'>LinkedIn Online CAPI Demo</h1>

          <label>
            li_fat_id (browser 1P cookie or page URL):
            <span className='red-text'>{formData.li_fat_id}</span>
            <input
              type='hidden'
              name='li_fat_id'
              value={formData.li_fat_id}
              id='li_fat_id'
            />
          </label>

          <label>
            Last Name:
            <input
              type='text'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              id='lastName'
            />
          </label>

          <label>
            First Name:
            <input
              type='text'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              id='firstName'
            />
          </label>

          <label>
            Email:
            <input
              type='text'
              name='email'
              id='email'
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Email converted to lower case and SHA256 hashing (read-only):
            <input
              type='text'
              name='hashEmail'
              id='hashEmail'
              value={formData.hashEmail || ''}
              readOnly
            />
          </label>

          <label>
            Title:
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChange}
              id='title'
            />
          </label>

          <label>
            Company:
            <input
              type='text'
              name='company'
              value={formData.company}
              onChange={handleChange}
              id='company'
            />
          </label>

          <label>
            Country Code:
            <input
              type='text'
              name='countryCode'
              value={formData.countryCode}
              onChange={handleChange}
              id='countryCode'
            />
          </label>

          <label>
            Currency:
            <input
              type='text'
              name='currency'
              value={formData.currency}
              onChange={handleChange}
              id='currency'
            />
          </label>

          <label>
            Value:
            <input
              type='text'
              name='value'
              value={formData.value}
              onChange={handleChange}
              id='value'
            />
          </label>

          <label>
            Acxiom ID:
            <input
              type='text'
              name='acxiomId'
              value={formData.acxiomId}
              onChange={handleChange}
              id='acxiomId'
            />
          </label>

          <label>
            Oracle Moat ID:
            <input
              type='text'
              name='oracleMoatId'
              value={formData.oracleMoatId}
              onChange={handleChange}
              id='oracleMoatId'
            />
          </label>

          <label>
            Lead ID:
            <input
              type='text'
              name='leadId'
              value={formData.leadId}
              onChange={handleChange}
              id='leadId'
            />
          </label>

          <button type='submit' id='btn-submit' className='class-btn-submit'>
            Submit
          </button>
          <button
            type='button'
            id='btn-reset'
            className='class-btn-reset'
            onClick={handleResetForm}
          >
            Reset Form
          </button>
        </form>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          message={modalMessage}
        />
      </div>
    </>
  )
}

export default ContactForm
