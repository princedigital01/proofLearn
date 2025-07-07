'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; 
import { BookOpen, Shield, Award, Users, Coins, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header"
import Link from "next/link";
import { CertificateSearchBar } from "./SearchBar";

const Index = () => {
  return (
    <div className="min-h-screen ">
        

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            Powered by Cardano Blockchain
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Own Your Learning,<br />
            <span className="text-blue-600">Own Your Future</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The first decentralized e-learning platform where students truly own their credentials, 
            educators are fairly rewarded, and learning is transparent, verifiable, and globally accessible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3" asChild>
              <Link href="/courses">Explore Courses</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
              <Link href="/educators">Start Teaching</Link>
            </Button>
          </div>
        </div>
        <div className=" justify-center text-center  gap-4 mt-20">
         <Button size="lg"  className="no-flextext-lg px-12 py-3 bg-[#189cbd]" asChild>
              <Link href="/verify">verify a certificate</Link>
            </Button>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Revolutionary Learning Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Verifiable Credentials</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Certificates stored as NFTs on Cardano blockchain. Tamper-proof, 
                  globally verifiable, and owned by you forever.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Coins className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Earn While Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Earn LEARN tokens for completing courses, participating in governance, 
                  and contributing to the platform community.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Vote className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Decentralized Governance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Shape the platform's future through token-based voting on features, 
                  course quality, and platform improvements.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Token Economics */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">LEARN Token Economy</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-2xl font-bold">40%</div>
              <div className="text-sm">Course Rewards</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-2xl font-bold">25%</div>
              <div className="text-sm">Educator Incentives</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-2xl font-bold">15%</div>
              <div className="text-sm">Platform Development</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-2xl font-bold">1B</div>
              <div className="text-sm">Total Supply</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Expert Educators</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">1,200+</div>
              <div className="text-gray-600">Courses Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">50,000+</div>
              <div className="text-gray-600">Certificates Issued</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of learners who own their educational journey
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3" asChild>
            <Link href="/dashboard">Start Learning Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6" />
                <span className="text-xl font-bold">Learn on Cardano</span>
              </div>
              <p className="text-gray-400">
                Decentralized education for a better future
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <div className="space-y-2 text-gray-400">
                <div>Courses</div>
                <div>Educators</div>
                <div>Governance</div>
                <div>Staking</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <div className="space-y-2 text-gray-400">
                <div>Documentation</div>
                <div>API</div>
                <div>Support</div>
                <div>Community</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="space-y-2 text-gray-400">
                <div>Discord</div>
                <div>Twitter</div>
                <div>GitHub</div>
                <div>Blog</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Learn on Cardano. Powered by the Cardano blockchain.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
