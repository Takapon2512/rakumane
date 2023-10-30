import React from "react";
import Head from "next/head";

//Component
import Header from "@/components/topComponents/header";
import FirstContent from "@/components/topComponents/firstContent";
import SecondContent from "@/components/topComponents/secondContent";
import ThirdContent from "@/components/topComponents/thirdContent";
import ForthContent from "@/components/topComponents/forthContent";
import FifthContent from "@/components/topComponents/fifthContent";
import SixthContent from "@/components/topComponents/sixthContent";
import Footer from "@/components/topComponents/footer";

const Top = () => {
  return (
    <>
    <Head>
      <title>ラクマネイングリッシュ</title>
    </Head>
    <Header />
    <FirstContent />
    <SecondContent />
    <ThirdContent />
    <ForthContent />
    <FifthContent />
    <SixthContent />
    <Footer />
    </>
  )

};

export default Top;
