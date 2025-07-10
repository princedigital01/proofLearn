"use client"
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [text, setText] = useState('Sign in');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      let message = ""
      switch (oauthError) {
        case "OAuthAccountNotLinked":
          message = "That email is already linked to another login method."
          break
        case "CredentialsSignin":
          message = "Invalid email or password."
          break
        case "Configuration":
          message = "Server configuration error. Try again later."
          break
        case "querySrv ETIMEOUT _mongodb._tcp.cluster.cqpg61y.mongodb.net":
          message = "Database connection failed. Please try again shortly."
          break
        default:
          message = "Login failed. Please try again."
      }
      setError(message)
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")
    setText("loading...")

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    if (res.error) {
      setError(res.error);
      setText("Sign in")
    } else {
      router.push('/dashboard')
      setText("success wait...")
    }
  };

 

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/create" className="font-medium text-blue-600 hover:text-blue-500">
            create an account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

          {error && <p className="text-red-600 mb-2">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="mt-1 appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-900">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {text}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-100 text-gray-500">Or continue with</span>
              </div>
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
