import { Chip, Loader, RingProgress, SegmentedControl, Space, Text } from '@mantine/core'
import { doc, onSnapshot, query, collection, getDocs, orderBy } from "firebase/firestore";
import { db } from '../firebase';
import { motion } from 'framer-motion';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Fragment, useEffect, useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


type Poll = {
    id: string,
    title: string,
    options: { name: string, votes: number }[],
}


export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Chart.js Bar Chart',
        },
    },
};

const getAllPollsIds = async () => {
    const res: { id: string, title: string }[] = []

    const querySnapshot = await getDocs(collection(db, "poll"));
    querySnapshot.forEach((doc) => {
        res.push({ id: doc.id, title: doc.data().title })
    });

    return res
}


const Realtime = () => {

    const [currTab, setCurrTab] = useState<"resultados" | "votantes">("resultados")

    return (
        <div
            style={{
                height: "100vh",
            }}
        >

            <nav
                style={{
                    backgroundColor: "rgba(20, 21, 23, 0.7)",
                    width: "100%",
                    position: "fixed",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "1rem",
                }}
            >
                <SegmentedControl
                    value={currTab}
                    onChange={(value) => { setCurrTab(value as "resultados" | "votantes") }}
                    data={[
                        { label: 'Resultados', value: 'resultados' },
                        { label: 'Votantes', value: 'votantes' },
                    ]}
                />
            </nav>

            <div style={{
                height: "100vh",
                paddingTop: "7rem",
                paddingLeft: "1rem",
                paddingRight: "1rem",
                maxWidth: "700px",
                margin: "0 auto",
            }}>
                {
                    currTab === "resultados" ? <Resultados /> : <Votantes />
                }
            </div>

        </div>
    )
}

const Votantes = () => {

    const [dudes, setDudes] = useState<{ name: string, voted: boolean }[]>([])

    const getAllSorted = async () => {
        const q = query(collection(db, "dudes"));

        onSnapshot(
            q,
            (query) => {
                const data: { name: string, voted: boolean }[] = []
                query.forEach((doc) => {
                    data.push({ name: doc.data().name, voted: doc.data().voted })
                }
                );
                setDudes(data)
            },
            (error) => { }
        );
    }

    useEffect(() => {
        getAllSorted()
    }, [])


    return <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >

        {
            dudes?.length === 0 ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <Loader size="lg" />
            </div> :

                dudes.map((dude) => (
                    <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1rem",
                        borderBottom: "0.01px solid rgba(150, 150, 150, 0.1)",
                    }}
                    >
                        <Text>{dude.name}</Text>
                        {
                            dude.voted &&
                            <Chip
                            checked
                            color={"cyan"}
                            variant="filled"
                            >
                            {dude.voted ? "Votó" : "No votó"}
                        </Chip>
                        }
                    </div>
                ))
        }

    </motion.div>
}

const Resultados = () => {
    const [polls, setPolls] = useState<{ id: string, title: string }[]>([])

    useEffect(() => {
        getAllPollsIds().then(async (res) => {
            setPolls(res)
        })
    }, [])



    return <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        {

            polls.length === 0 ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <Loader size="lg" />
            </div> :
                polls.map((poll) => {
                    return <Fragment key={poll.id}>
                        <PollResult pollId={poll.id} pollTitle={poll.title} />
                        <div style={{ height: "7rem" }} />
                    </Fragment>
                })

        }
    </motion.div>

}

const PollResult = ({ pollId, pollTitle }: { pollId: string, pollTitle: string }) => {
    const [optionsVotes, setOptionsVotes] = useState<{ name: string, votes: number }[]>([])

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, `poll/${pollId}/options`), (snapshot) => {
            const data: { name: string, votes: number }[] = []
            snapshot.forEach((doc) => {
                data.push({ name: doc.data().name, votes: doc.data().votes })
            });
            setOptionsVotes(data)
        }, (error) => { });

        return () => {
            unsubscribe()
        }
    }, [])


    return (
        <Bar options={{
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: pollTitle,
                },
            },
        }} data={{
            labels: optionsVotes.map((option) => option.name),
            datasets: [{
                label: 'Votes',
                data: optionsVotes.map((option) => option.votes),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(255, 205, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(201, 203, 207, 0.5)'
                ],
            }],
        }} />
    )
}

export default Realtime