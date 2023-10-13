import React from "react";
import dynamic from "next/dynamic";

const Form = dynamic(() => import('../components/FormComponent/form') ,
    {
        ssr: false,
    }
);

const Register = () => {

    return (
        <>
        <Form 
        formTitle="アカウントを作成" 
        buttonTitle="新規登録" 
        changeTitle="アカウントをお持ちの方はこちら"
        />
        </>
    )
}

export default Register;