import { Button, Loader, Select, Space, Title } from '@mantine/core'
import { addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { BOYS, GIRLS, OPTIONS } from '../const'
import { auth, db } from '../firebase'

import { motion } from "framer-motion"
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'

type Poll = {
  id: string
  title: string,
  open: boolean,
  type?: "all" | "boys" | "girls" | "custom",
  alternatives?: string[]
}

const getPools = async () => {

  const querySnapshot = await getDocs(collection(db, "poll"))
  const polls: Poll[] = []

  querySnapshot.forEach((doc) => {

    if (doc.data().open == true) {
      polls.push({
        id: doc.id,
        title: doc.data().title,
        ...doc.data() as any
      })
    }
  })

  return polls
}



const Poll = () => {
  const [currIndexPoll, setCurrIndexPoll] = useState(0)
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null)
  const [current, setcurrent] = useState("")
  const [loading, setLoading] = useState(true)
  const [polls, setPolls] = useState<Poll[]>([])

  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect");

    (async () => {
      const p = await getPools()
      setLoading(false)
      setPolls(p)
      console.log({ p });

      setCurrentPoll(p[currIndexPoll])

    })()
  }, [])

  const vote = async (poolId: string, optionName: string) => {
    setcurrent("")

    setLoading(true)

    const q = query(collection(db, "poll", poolId, "options"), where("name", "==", optionName));
    const querySnapshot = await getDocs(q);

    const res: { id: string, name: string, votes: number }[] = []
    querySnapshot.forEach((doc) => {
      res.push({
        id: doc.id,
        ...doc.data() as { name: string, votes: number },
      })
    });

    if (res.length === 0) {
      await addDoc(collection(db, "poll", poolId, "options"), {
        name: optionName,
        votes: 1,
      })
    } else {
      await setDoc(doc(db, "poll", poolId, "options", res[0].id), {
        votes: res[0].votes + 1,
      }, { merge: true })
    }
    setCurrIndexPoll(currIndexPoll + 1)

    const p = polls[currIndexPoll + 1]

    console.log({ p })

    if (p === undefined) {
      signOut(auth)
      navigate("/thanks")
      // TODO: EXIT
      return
    }

    setLoading(false)
    setCurrentPoll(p)
  }



  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "auto auto",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {
        loading ? <Loader /> :
          <motion.div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 20px"
            }}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
          >
            <Title>{currentPoll?.title}</Title>
            <Space h="xl" />
            <Select
              style={{
                width: "100%",
              }}
              maxDropdownHeight={340}
              searchable
              placeholder="Pick one"
              label="Selecciona un pendejo"
              data={
                currentPoll?.type === "all"
                  ? OPTIONS.map((option) => ({ label: option, value: option }))
                  : currentPoll?.type === "boys"
                    ? BOYS.map((option) => ({ label: option, value: option }))
                    : currentPoll?.type == "girls"
                      ? GIRLS.map((option) => ({ label: option, value: option }))
                      : currentPoll?.type === "custom" && currentPoll?.alternatives
                        ? currentPoll?.alternatives.map((option) => ({ label: option, value: option }))
                        : OPTIONS.map((option) => ({ label: option, value: option }))
              }

              onChange={(value) => {
                setcurrent(value ?? "")
              }}
            />
            <Space h="xl" />
            <Button
              onClick={() => vote(currentPoll!.id, current)}
              disabled={current === ""} style={{ width: "100%" }}>Votar</Button>
          </motion.div>

      }
    </div>
  )
}

export default Poll