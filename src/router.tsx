import { Loader } from "@mantine/core";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { userAlredyVoted } from "./helpers";
import Claim from "./pages/claim";
import Poll from "./pages/poll";
import Realtime from "./pages/realtime";
import { AuthPage } from "./pages/register";
import Thanks from "./pages/thanks";
import Welcome from "./pages/welcome";

const ProtectedRoute = ({
    element,
    ...rest
} : {
    element: JSX.Element
}) => {
    const [status, setStatus] = useState<"pending" | "success" | "error" | "alredy">("pending")

    useEffect(() => {
      onAuthStateChanged(auth, async (user) => {

        if (user) {
            if(await userAlredyVoted(user.phoneNumber?.replace("+51", "")!)) {
                setStatus("alredy")
            } else {

                setDoc(doc(db, "dudes", user.phoneNumber?.replace("+51", "")!), {
                    voted: true
                }, { merge: true })

                const docRef = doc(db, "dudes", user.phoneNumber?.replace("+51", "")!);
                const docSnap = await getDoc(docRef);

                localStorage.setItem("userName", docSnap.data()?.name)
                setStatus("success")
            }
        } else {
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
        return <Navigate to="/welcome" />
    }

    return element

}


export const router = createBrowserRouter([
    {
        path: "/auth",
        element: <AuthPage />
    },
    {
        path: "/",
        element: <ProtectedRoute element={<Poll />} />
    },
    {
        path: "/thanks",
        element: <Thanks />
    },
    {
        path: "/welcome",
        element: <Welcome />
    },
    {
        path: "/t/:hash",
        element: <Claim />
    },
    {
        path: "/realtime",
        element: <Realtime />
    }
])