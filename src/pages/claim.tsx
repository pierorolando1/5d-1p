import { Title } from '@mantine/core';
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { decrypt, validateDecrypted } from '../crypto';

const Claim = () => {
    let { hash } = useParams()

    const [isValid, setIsValid] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        const decrypted = decrypt(hash!)

        const isValid = validateDecrypted(decrypted)
        setIsValid(isValid)

    }, [])



    return isValid ? (
        <motion.div
            style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 20
            }}

            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
        >
            <Title align='center'>Caramelo valido para {decrypt(hash!)}</Title>

            <motion.svg

                initial={{ opacity: 0, y: -100, scale: 0.5, rotate: 180 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, y: 100, scale: 0.5, rotate: 180 }}
                transition={{ delay: 0.5 }}
                style={{
                    paddingTop: 20,
                    width: 150,
                    height: 150,
                    color: "aquamarine"
                }}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </motion.svg>


        </motion.div>
    )
        : (
            <motion.div
                style={{
                    height: "100vh",
                    width: "100vw",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20
                }}

                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
            >
                <Title align='center'>Invalid hash!</Title>

                <motion.svg

                    initial={{ opacity: 0, y: -100, scale: 0.5, rotate: 180 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, y: 100, scale: 0.5, rotate: 180 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        paddingTop: 20,
                        width: 150,
                        height: 150,
                        color: "red"
                    }}
                    xmlns="http://www.w3.org/2000/svg"

                    fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </motion.svg>


            </motion.div>
        )
}

export default Claim