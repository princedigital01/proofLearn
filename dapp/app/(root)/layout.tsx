import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import AuthProvider from "@/components/authProvider"; 
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  const session = await getServerSession(authOptions);

  return (
        
        <AuthProvider session={session}>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
           
            {children}
          </div>
        </AuthProvider>
      
  );
}