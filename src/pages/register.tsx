import {
    Paper,
    createStyles,
    Button,
    Title,
    Text,
    Modal,
    NumberInput,
    TextInput,
} from '@mantine/core';
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, checkNumber } from '../firebase';

const useStyles = createStyles((theme) => ({
    wrapper: {
        height: '100vh',
        backgroundSize: 'cover',
        backgroundImage:
            'url(https://res.cloudinary.com/piero-rolando/image/upload/v1670634826/5deinos_vqwhwh.jpg)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

    },

    form: {
        borderRight: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
            }`,
        height: '100%',
        maxWidth: 650,
        paddingTop: 80,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            maxWidth: '100%',
        },
        background: "#1A1B1ED4"
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    logo: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        width: 120,
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
}));

export function AuthPage() {
    const [modalOpen, setModalOpen] = useState(true)
    const [loadingbutton, setloadingbutton] = useState(false)
    const { classes } = useStyles();

    const [valid, setValid] = useState<{
        done: boolean,
        status: "pending" | "success" | "error"
    }
    >({ done: true, status: "pending" })
    const [number, setnumber] = useState<string>("")

    const checkNumberUi = async () => {
        setloadingbutton(true)
        const valid = await checkNumber(number)
        setValid({
            done: valid ? true : false,
            status: valid ? "success" : "error"
        })
        setloadingbutton(false)
    }

    return (
        <>
            <Modal opened={modalOpen} centered withCloseButton={false} onClose={() => { }}>
                <Title order={2} className={classes.title} align="center">
                    IMPORTANTE LEER!
                </Title>

                <Text mb="xl" size={'xs'}>
                    <Text size={'sm'} weight={'bold'}>- Usa el numero de telefono con el que estes agregada en "wurbos" o "5D". <br /></Text>
                    <Text size={'sm'} weight={'bold'}>- Una vez registrado, NO CIERRES O RECARGUES PARA NADA EL NAVEGADOR, ya que no vas a poder volver a votar</Text>
                    - Los votos son totalmente anónimos, no se guardan datos personales.<br />
                    - Solo se puede votar una vez por numero de telefono.<br />
                    - Si tienes algun tipo de error, comunicate a Piero <br />
                </Text>

                <Button onClick={() => {
                    setModalOpen(false)
                }}>Entendido</Button>

            </Modal>

            <div className={classes.wrapper}>
                <Paper className={classes.form} radius={0} p={30} pt={120}>
                    {
                        valid.done && valid.status === "success" ?
                            <>
                                <VerificationCode phoneNumber={'+51' + number} />
                            </>
                            :
                            <>
                                <Title order={2} className={classes.title} align="center" mt="md" mb={50}>
                                    Hola quintodeino!
                                </Title>

                                <NumberInput
                                    error={!valid.done && "El numero de telefono no es valido o no esta registrado o ya has votado pendejo, contacta a Piero"}
                                    onChange={(e) => {
                                        setnumber(e?.toString() ?? "")
                                    }}
                                    min={900000000} label="Numero de telefono" placeholder="Ejem. '962791928'" size="md" />
                                <Button loading={loadingbutton} onClick={checkNumberUi} fullWidth mt="xl" size="md">Votar</Button>
                            </>
                    }
                     <div id="recaptcha-container"></div>
                </Paper>
            </div>
        </>
    );
}

const VerificationCode = ({ phoneNumber }: { phoneNumber: string }) => {
    const navigate = useNavigate()

    const generateRecaptcha = () => {
        (window as any).recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'visible',
            'callback': (response: any) => {
              console.log(response)
            },
            'expired-callback': () => {
            }
          }, auth);
    }

    useEffect(() => {
        console.log(phoneNumber)
        generateRecaptcha()

        let appVerifier = (window as any).recaptchaVerifier;

        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                (window as any).confirmationResult = confirmationResult;
                // ...
            }).catch((error) => {
                console.log(error)
            });

    }, [])

    const [code, setCode] = useState("")
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    return (
        <>
            <TextInput
                onChange={(e) => {
                    setCode(e.target.value)
                }}
                error={ error && "El codigo de verificacion no es valido" }
                label="Codigo de verificacion" 
                placeholder="Ejem. '333333'" size="md"
            />
            <Text size="xs">El codigo sera enviado despues de ser llenado el reCAPTCHA</Text>
            {
             /*
             
            <Button 
            onClick={() => {
                generateRecaptcha()

                let appVerifier = (window as any).recaptchaVerifier;
        
                signInWithPhoneNumber(auth, phoneNumber, appVerifier)
                    .then((confirmationResult) => {
                        (window as any).confirmationResult = confirmationResult;
                        // ...
                    }).catch((error) => {
                        console.log(error)
                    });

            }}
            size='xs'>No has recibido el codigo? Reenviar</Button>
                        */   
                       }
            <Button
            loading={loading}
            disabled={code.length !== 6}
            onClick={() => {
                setLoading(true);
                ((window as any).confirmationResult as ConfirmationResult)
                .confirm(code).then((result) => {
                    const user = result.user;
                    console.log(user)

                    navigate("/welcome")
                }).catch((e) => {
                    setError(true)
                    setLoading(false)
                    console.log(e)
                });
            }} fullWidth mt="xl" size="md">Votar</Button>
        </>
    )

}