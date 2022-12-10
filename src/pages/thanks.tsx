import { motion } from 'framer-motion'
import { Space, Text, Title } from '@mantine/core'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { encrypt } from '../crypto'

const Thanks = () => {
    const navigate = useNavigate()

    const [name, setName] = useState("")

    useEffect(() => {     
        const name = localStorage.getItem("userName")
        if(!name) { navigate("/auth") }

        setName(name!)
    }, [])
    
    return (
        <div
            style={{
                height: "100vh",
                position: "relative",
                backgroundImage: "url(https://res.cloudinary.com/piero-rolando/image/upload/v1670635374/qc_ye8dqa.jpg)",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
            }}
        >
            <motion.div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    padding: "0.5rem",
                    width: "100%",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.8)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}
                initial={{ opacity: 0,  }}
                animate={{ opacity: 1, }}
                exit={{ opacity: 0, }}
            >

                <Title>Gracias por votar!</Title>
                <Text align='center'>Tomale un screenshot a esto y reclama un caramelo!</Text>

                <Space h="xl" />
                {
                    name && 
                    <motion.div
                    style={{
                        backgroundColor: "white",
                        padding: "0.5rem",
                    }}
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                    >
                        <QRCodeSVG value={"https://5d-1p.vercel.app/t/" + encrypt(name)} />                
                    </motion.div>
                }
            </motion.div>

        </div>
    )
}

export default Thanks