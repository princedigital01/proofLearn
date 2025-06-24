'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink, Download, Share } from "lucide-react";

export const CertificateGallery = () => {
  const certificates = [
    {
      id: 1,
      title: "Smart Contract Developer",
      course: "Cardano Smart Contracts with Aiken",
      issueDate: "2024-01-15",
      grade: "A+",
      tokenId: "cert_001_aiken_2024",
      verified: true
    },
    {
      id: 2,
      title: "DeFi Protocol Specialist",
      course: "DeFi Fundamentals on Cardano",
      issueDate: "2024-02-28",
      grade: "A",
      tokenId: "cert_002_defi_2024",
      verified: true
    },
    {
      id: 3,
      title: "Blockchain Developer",
      course: "Building DApps with Mesh.js",
      issueDate: "2024-03-10",
      grade: "A+",
      tokenId: "cert_003_mesh_2024",
      verified: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Certificates</h2>
        <Badge variant="secondary">
          {certificates.length} NFT Certificates
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <Card key={cert.id} className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{cert.title}</CardTitle>
                <CardDescription>{cert.course}</CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Issue Date</div>
                  <div className="font-medium">{cert.issueDate}</div>
                </div>
                <div>
                  <div className="text-gray-600">Grade</div>
                  <div className="font-medium">{cert.grade}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Token ID</div>
                <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                  {cert.tokenId}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Verified on Chain</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="border-dashed border-2 hover:border-solid transition-colors">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Award className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Earn More Certificates</h3>
          <p className="text-gray-600 mb-4">
            Complete more courses to earn NFT certificates and build your verified skill portfolio
          </p>
          <Button>Browse Courses</Button>
        </CardContent>
      </Card>
    </div>
  );
};
