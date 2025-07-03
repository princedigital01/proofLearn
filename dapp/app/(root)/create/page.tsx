'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

const CreateAccountPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState('Create Account')
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    setError('')
    setText("loading...")

    function hasTwoToFourNames(fullName:String) {
  if (!fullName) return false; 
  const parts = fullName.trim().split(/\s+/);
  return parts.length >= 2 && parts.length <= 4;
}


    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.')
      setText('Create Account')
      return
    }

    if(password.length <=5){
      setError('Password must be more than 5 letters.')
      setText('Create Account')
      return
    }

    if(!hasTwoToFourNames(fullName)){
      setError('minimum of 2 names maximum of 4.')
      setText('Create Account')
      return
    }

    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions.')
      setText('Create Account')
      return
    }
    console.log("done1")
    try {
      // Step 1: Create user
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: fullName,
          pass: password,
          role: 'user',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Signup failed')

      setText('success wait...')
      const login = await signIn('credentials', {
        email,
        password,
        redirect:false
      })
      if (login?.error) {
        setError('Account created but login failed.<a href="/login">try to login</a>')
        setText('Create Account')
      } else {
        router.push('/dashboard')
        setText('logging in...')
      }
      setLoading(false)

    } catch (err:any) {
      console.log(err)
      setText('Create Account')
      setError(err.message)
    } 
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10">
          {/* OAuth */}
          <div>
            <div className="mb-6 flex justify-around gap-4">
              {[
                { icon: 'github.svg', alt: 'GitHub', provider: 'github' },
                { icon: 'google.svg', alt: 'Google', provider: 'google' },
              ].map(({ icon, alt, provider }) => (
                <button
                  key={provider}
                  onClick={() => signIn(provider, { callbackUrl: '/dashboard' })}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white hover:bg-gray-50 w-full justify-center"
                >
                  <img
                    src={`/${icon}`}
                    alt={alt}
                    className={icon === 'google.svg' ? 'h-6 w-6' : 'h-5 w-5'}
                  />
                  {alt}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or continue with email</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-600 mb-4 text-center">{error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={() => setAgreeToTerms(!agreeToTerms)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the terms and conditions
              </label>
            </div>

            <button
              type="submit"
              disabled={!agreeToTerms || loading}
              className={`w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white transition ${
                agreeToTerms
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-indigo-300 cursor-not-allowed'
              }`}
            >
              {text}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateAccountPage
