"use client"
import { CertificateSearch } from "@/components/CertificateSearch";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Index from "@/components/Index";


export default function Home() {
  return (
    <div className="">
      <Header title={"Learn on Cardano"}>
        <CertificateSearch/>
      </Header>
      
     <Index/>

     <Footer/>
    </div>

  );
}
