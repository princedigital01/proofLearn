'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink, Download, Share } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'
import Link from 'next/link';
import Image from 'next/image';

export const CertificateGallery = () => {
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
    const certRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch('/api/certificate/list')
        const data = await res.json()
        setCertificates(data.certificates || [])
        console.log(data)
      } catch (err) {
        console.error("Failed to fetch certificates", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCertificates()
  }, [])

 const handleDownload = async (courseId:string) => {
     if (!certRef.current) return
     const canvas = await html2canvas(certRef.current)
     const imgData = canvas.toDataURL('image/png')
     const pdf = new jsPDF('landscape', 'px', [canvas.width, canvas.height])
     pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
     pdf.save(`certificate-${courseId}.pdf`)
   }


  const handleShare = async (cert: any) => {
    try {
      const shareText = `🎓 I just earned my "${cert.title}" certificate in "${cert.courseTitle}"!\n\nVerified on Cardano: https://cardanoscan.io/transaction/${cert.txHash}`
      await navigator.clipboard.writeText(shareText)
      alert("Certificate info copied to clipboard!")
    } catch (err) {
      alert("Failed to copy share message.")
    }
  }

  if (loading) return <div className="p-6 text-center">Loading certificates...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Certificates</h2>
        <Badge variant="secondary">{certificates.length} NFT Certificates</Badge>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div key={cert._id}>
          <Card key={cert._id} className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Certificate of Completion</CardTitle>
                <CardDescription>{cert.courseTitle}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Issued On</div>
                  <div className="font-medium">{new Date(cert.issuedAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Recipient</div>
                  <div className="font-medium">{cert.userName}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-600">TX Hash</div>
                <div className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                  {cert.txHash || 'Not yet minted'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2">
                  <div className={`w-2 h-2 ${cert.txHash ? 'bg-green-500' : 'bg-yellow-500'} rounded-full`}></div>
                  <span className={`text-sm ${cert.txHash ? 'text-green-600' : 'text-yellow-600'}`}>
                    {cert.txHash ? 'Verified on Chain' : 'Pending Minting'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDownload(cert._id)}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleShare(cert)}>
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
                {cert.txHash && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://cardanoscan.io/transaction/${cert.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>

             
            </CardContent>
          </Card>
          <div className='absolute left-[1000%]'>
                <div
                      ref={certRef}
                      className="bg-opacity-20 bg-cover bg-center relative mx-auto bg-[#fefefe] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-[800px] h-[600px] font-serif text-center   px-10 py-12 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-[url('/watermark.png')] bg-cover bg-center opacity-20 z-0" />
              
                      {/* Certificate Content */}
                      <div className="relative z-10 gap-2 flex-col flex">
                        <div className='flex gap-2'>
                        <Image src="/logo.svg" alt="Logo" width={40} height={40} className="" />
              
                        <h2 className="text-5xl font-extrabold text-blue-800 mb-4 tracking-tight">
                          Certificate of Completion
                        </h2>
                        </div>
              
                        <hr className="border-t-2 border-blue-500 my-6 w-2/3 mx-auto" />
              
                        <p className="text-lg text-gray-700">This is proudly presented to</p>
                        <p className="text-4xl font-bold text-gray-900 my-4">{cert.userName}</p>
              
                        <p className="text-lg text-gray-700">for successfully completing the course:</p>
                        <p className="text-2xl font-semibold text-gray-800 my-2">{cert.courseTitle}</p>
              
                        <p className="text-sm text-gray-600 mt-6">
                          Issued on: {new Date(cert.issuedAt).toLocaleDateString()}
                        </p>
              
                        {cert.txHash && (
                          <div className="mt-6 text-sm text-gray-700">
                            TX Hash: <span className="break-all font-mono">{cert.txHash}</span>
                          </div>
                        )}
              
                        <div className="flex justify-between items-center absolute bottom-6 left-10 right-10 text-xs text-gray-600">
                          <span>Powered by <span className="font-bold text-blue-600">ProofLearn</span></span>
                          <span className="italic">Signature</span>
                        </div>
                      </div>
                    </div>
             </div>
             </div>
        ))}
      </div>

      <Card className="border-dashed border-2 hover:border-solid transition-colors">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Award className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Earn More Certificates</h3>
          <p className="text-gray-600 mb-4">
            Complete more courses to earn NFT certificates and build your verified skill portfolio
          </p>
          <Link href={"/courses"}><Button>Browse Courses</Button></Link>
        </CardContent>
      </Card>
    </div>
  )
}
