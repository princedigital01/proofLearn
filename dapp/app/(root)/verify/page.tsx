'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Award, ExternalLink, Download, Share } from 'lucide-react';
// ❌ REMOVE the static import. It causes the server-side error.
// import html2pdf from 'html2pdf.js'; 

import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Loading from '@/app/loading';
import { CertificateSearch } from '@/components/CertificateSearch'; // Make sure you created this

// (Keep your CertificateData interface here)
interface CertificateData {
  _id: string;
  title: string;
  courseTitle: string;
  issuedAt: string;
  grade?: string;
  txHash: string;
  userName: string;
  userId: string;
}

const VerifyPage = () => {
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setCertificate(null);
      return;
    }

    const fetchCertificate = async () => {
      setLoading(true);
      setError(null);
      setCertificate(null);

      try {
        
        
        const res = await fetch(`/api/certificate/verify/${query}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.message || 'Certificate not found.');
        }
        const data = await res.json();
        setCertificate(data.certificate || null);
                
        
      } catch (err: any) {

        console.error('Failed to fetch certificate', err);
        setError(err.message || 'An unexpected error occurred.');
      
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [query]);

  // ✅ The handleDownload function is now async
  const handleDownload = async () => {
    if (!certificate) return;
    const certEl = document.getElementById(`download-cert-${certificate._id}`);
    if (!certEl) return;

    // ✅ Dynamically import the library ONLY when this function is called
    const html2pdf = (await import('html2pdf.js')).default;

    const opt = {
      margin: 0,
      filename: `certificate-${certificate._id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
    };

    html2pdf().set(opt).from(certEl).save();
  };

  const handleShare = async () => {
    // ... handleShare logic remains the same
    if (!certificate) return;
    try {
      const shareText = `🎓 I just earned my "${certificate.title}" certificate in "${certificate.courseTitle}"!\n\nVerified on Cardano: https://cardanoscan.io/transaction/${certificate.txHash}`;
      await navigator.clipboard.writeText(shareText);
      alert('Certificate info copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy share message.', err);
      alert('Failed to copy share message.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <Header title="Verify Certificate">
        <CertificateSearch />
      </Header>

      {/* The rest of your JSX remains the same */}
      <div className="flex justify-center items-start p-4 min-h-[50vh]">
        {certificate ? (
          <div className="relative p-6 bg-white border shadow-md rounded-lg max-w-md w-full">
            {/* ... Visible Card Preview ... */}
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold">{certificate.title}</h3>
              <p className="text-sm text-gray-500">{certificate.courseTitle}</p>
              <div className="text-sm text-gray-600">Issued on: {new Date(certificate.issuedAt).toLocaleDateString()}</div>
              <div className="text-sm text-gray-600">Owner: {certificate.userName}</div>
              <div className="text-xs font-mono bg-gray-100 p-2 rounded break-all">{certificate.txHash}</div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
                  <Share className="h-4 w-4 mr-1" /> Share
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://cardanoscan.io/transaction/${certificate.txHash}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* ... Hidden Element for PDF Generation ... */}
            <div className='absolute left-[1000%] hidden'>
              <div
                                    id={`download-cert-${certificate._id}`} 
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
                                        <span>Powered by <span className="font-bold text-blue-600">ProofLearn</span></span>
                                        <span className="italic">Signature</span>
                                      </div>
                                    </div>
                                  </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-10 bg-gray-50 rounded-lg max-w-md w-full">
            {/* ... error/not found/initial prompt JSX ... */}
             {error ? (
              <>
                <h3 className="text-xl font-semibold text-red-600">Error</h3>
                <p className="text-gray-600 mt-2">{error}</p>
              </>
            ) : query ? (
              <>
                <h3 className="text-xl font-semibold">Certificate Not Found</h3>
                <p className="text-gray-600 mt-2">No certificate could be found with that ID. Please check the value and try again.</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">Verify a Certificate</h3>
                <p className="text-gray-600 mt-2">Enter a certificate ID in the search bar to verify its authenticity.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;