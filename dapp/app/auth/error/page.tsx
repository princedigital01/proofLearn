// 'use client'
// import { useSearchParams } from 'next/navigation'

// export default function AuthErrorPage() {
//   const searchParams = useSearchParams()
//   const error = searchParams.get('error')

//   const messages: Record<string, string> = {
//     OAuthAccountNotLinked: 'An account with your email already exists. Please use the same sign-in method.',
//     Configuration: 'Auth provider misconfigured. Check environment variables.',
//     AccessDenied: 'You denied access to GitHub.',
//     default: 'Something went wrong. Please try again.',
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center text-center p-8">
//       <div>
//         <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
//         <p className="mt-4 text-gray-700">
//           {messages[error || 'default']}
//         </p>
//       </div>
//     </div>
//   )
// }
