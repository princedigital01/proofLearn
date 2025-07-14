import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; 
import AuthProvider from "@/components/authProvider"; 
import Summarizer from "@/components/user/Summarizer";
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
            {!session?(
              <div></div>
            ):(
              <Summarizer/>
            )}
          </div>
        </AuthProvider>
      
  );
}