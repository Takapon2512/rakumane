import React from "react";
import Head from "next/head"
import dynamic from "next/dynamic";

const Form = dynamic(() => import('../components/FormComponent/form') ,
    {
        ssr: false,
    }
);

const Login = () => {

    return (
        <>
        <Head>
            <title>ログイン画面｜ラクマネイングリッシュ</title>
        </Head>
        <Form 
        formTitle="アプリにログインする" 
        buttonTitle="ログイン" 
        changeTitle="アカウントをお持ちでない方はこちら"
        />
        </>
    );
};

export default Login;