'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
// No longer needed: import html2canvas from 'html2canvas'
// No longer needed: import jsPDF from 'jspdf'
import Image from 'next/image'
import Link from 'next/link'

// Note: Ensure you have your type declaration file in place to avoid TS errors
// e.g., /types/html2pdf.d.ts containing `declare module 'html2pdf.js';`

export default function CertificatePage() {
  const { courseId } = useParams()
  const [certificate, setCertificate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const certRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await fetch(`/api/certificate/${courseId}`)
        const data = await res.json()
        setCertificate(data.certificate)
      } catch (err) {
        console.error('Failed to load certificate', err)
      } finally {
        setLoading(false)
      }
    }

    if (courseId) fetchCertificate()
  }, [courseId])

  // --- REFACTORED DOWNLOAD HANDLER ---
  const handleDownload = async () => {
    const element = certRef.current
    if (!element) return

    // Dynamically import the library only when the function is called
    const html2pdf = (await import('html2pdf.js')).default

    const opt = {
      margin: 0,
      filename: `certificate-${courseId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      // This is the key for high-quality output
      html2canvas: {
        scale: 2, // Renders the canvas at a higher resolution
        useCORS: true, // Important for loading external images if you have any
      },
      // This ensures the PDF page size is set to the exact dimensions of your element
      jsPDF: {
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight],
        orientation: 'landscape',
      },
    }

    // Create the PDF from the element with the specified options
    html2pdf().from(element).set(opt).save()
  }
  // --- END OF REFACTORED CODE ---

  if (loading) return <div className="p-6 text-center">Loading...</div>
  if (!certificate) return <div className="p-6 text-center text-red-600">Certificate not found</div>

  return (
    <div className="max-w-5xl mx-auto p-6 text-center">
      <h1 className="text-4xl font-extrabold mb-6">🎓 Certificate of Completion</h1>

      {/* The certificate element remains exactly the same */}
      <div
        ref={certRef}
        className="bg-opacity-20 bg-cover bg-center relative mx-auto bg-[#fefefe] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-[800px] h-[600px] font-serif text-center   px-10 py-12 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/watermark.png')] bg-cover bg-center opacity-20 z-0" />

        {/* Certificate Content */}
        <div className="relative z-10 gap-2 flex-col flex">
          <div className="flex gap-2">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} className="" />

            <h2 className="text-5xl font-extrabold text-blue-800 mb-4 tracking-tight">
              Certificate of Completion
            </h2>
          </div>

          <hr className="border-t-2 border-blue-500 my-6 w-2/3 mx-auto" />

          <p className="text-lg text-gray-700">This is proudly presented to</p>
          <p className="text-4xl font-bold text-gray-900 my-4">{certificate.userName}</p>

          <p className="text-lg text-gray-700">for successfully completing the course:</p>
          <p className="text-2xl font-semibold text-gray-800 my-2">{certificate.courseTitle}</p>

          <p className="text-sm text-gray-600 mt-6">
            Issued on: {new Date(certificate.issuedAt).toLocaleDateString()}
          </p>
          <div className="mt-6 text-sm text-gray-700">
            PL Hash: <span className="break-all font-mono">{certificate._id}</span>
          </div>
          {certificate.txHash && (
            <div className="mt-6 text-sm text-gray-700">
              TX Hash: <span className="break-all font-mono">{certificate.txHash}</span>
            </div>
          )}

          <div className="flex justify-between items-center absolute bottom-6 left-10 right-10 text-xs text-gray-600">
            <span>
              Powered by <span className="font-bold text-blue-600">ProofLearn</span>
            </span>
            <span className="italic">Signature</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Download as PDF
      </button>
      <Link
        href={'/certificate'}
        className="mt-6 text-blue-600 border border-blue-600 bg-white mx-5 px-6 py-2 rounded hover:bg-blue-700 hover:text-white"
      >
        Return to dashboard
      </Link>

      <div className="mt-6 text-sm text-gray-600">
        {certificate.txHash ? (
          <p>
            View on Blockchain:{' '}
            <a
              href={`https://cardanoscan.io/transaction/${certificate.txHash}`}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {certificate.txHash}
            </a>
          </p>
        ) : (
          <p className="text-orange-600">🔗 Not yet minted on blockchain</p>
        )}
      </div>
    </div>
  )
}