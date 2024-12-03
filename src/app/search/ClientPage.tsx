"use client"
import {useState} from "react";
import TenderCard from "../components/TenderCard/TenderCard";
import {Tender} from "../../models/Tender/Tender";
import styles from "./page.module.css";
import TendersFilter from "@/app/components/TendersFilter/TendersFilter";


export default function SearchPage({tendersJSON}: { tendersJSON: string }) {
    const allTenders = JSON.parse(tendersJSON) as Tender[]
    const [tenders, setTenders] = useState(allTenders)
    return (
        <main className={styles.content + ' inherit'}>
            <div id={styles.leftPanel}>
                <TendersFilter allTenders={allTenders} setTenders={setTenders}/>
            </div>
            <div className={styles.tenders}>
                {tenders.map(tender => <TenderCard tender={tender} key={tender.id}/>)}
            </div>
        </main>
    )
}