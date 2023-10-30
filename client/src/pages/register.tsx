import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

const Form = dynamic(() => import('../components/FormComponent/form') ,
    {
        ssr: false,
    }
);

const Register = () => {

    return (
        <>
        <Head>
            <title>登録画面｜ラクマネイングリッシュ</title>
        </Head>
        <Form 
        formTitle="アカウントを作成" 
        buttonTitle="新規登録" 
        changeTitle="アカウントをお持ちの方はこちら"
        />
        </>
    )
}

export default Register;