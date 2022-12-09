import { Loader, LoadingOverlay } from '@mantine/core'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { auth } from '../firebase'
import { userAlredyVoted } from '../helpers'

const Welcome = () => {
    const [status, setStatus] = useState<"pending" | "success" | "error"|"alredy">("pending")

    useEffect(() => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
            if(await userAlredyVoted(user.phoneNumber!.replace("+51", ""))) {
                setStatus("alredy")
            } else {
                setStatus("success")
            }
        }
        else {
            setStatus("error")
        }
      })
    }, [])

    if (status === "pending") {
        return <div
            style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
            <Loader />
        </div>
    }

    if (status === "error") {
        return <Navigate to="/auth" />
    }

    if (status === "alredy") {
        return <div

            style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
            <h1>Parece que ya votaste, en caso haya un error comunícate con Piero</h1>
        </div>
    }

    return <Navigate to="/" />

}

export default Welcome