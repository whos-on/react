import { json, redirect } from "@remix-run/cloudflare"
import { useActionData } from "@remix-run/react"
import { Key, Mail, Smile, User } from "lucide-react"
import { useEffect, useState } from "react"
import AuthScreen from "~/components/auth/AuthScreen"
import AuthInput from "~/components/auth/AuthInput"
import AuthSubmitButton from "~/components/auth/AuthSubmitButton"
import whoson, { userCookie } from "~/utils/whoson"

const inputStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '600px',
    padding: '40px',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    boxSizing: 'borderBox',
    boxShadow: '0 15px 25px rgba(0, 0, 0, 0.6)',
    borderRadius: '10px',
    fontFamily: 'sans-serif',
}


export default function ResetPassword() {
    let formError = useActionData()
    const [submitDisabled, setSubmitDisabled] = useState(false)

    useEffect(() => {
        if (formError) setSubmitDisabled(true)
    }, [formError])
 

    return (

        <div className="flex h-full min-h-screen w-full flex-col bg-[url('/images/authbg.png')] bg-cover bg-no-repeat">

            <div style={inputStyle}>
                <h1 className="text-center font-sans text-3xl font-extrabold tracking-tight text-gray-900">
                    Rest your password
                </h1>
                <br/>

                <h5 className="font-sans font-extrabold tracking-tight text-gray-900">New Password</h5>
                <AuthInput id="password" type="password" icon={Key} setSubmitDisabled={setSubmitDisabled}/>
                <br/>

                <h5 className="font-sans font-extrabold tracking-tight text-gray-900">Confirm Password</h5>
                <AuthInput id="confirmPassword" type="password" icon={Key} setSubmitDisabled={setSubmitDisabled}/>

                
                <br/>
                <AuthSubmitButton disabled={submitDisabled}>
                    {submitDisabled ? formError.message : "Reset Password"}
                </AuthSubmitButton>
            </div>

        </div>
        
    )

}