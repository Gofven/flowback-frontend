import { useEffect, useState } from "react";
import Layout1 from "../../layout/Layout1";
import { postRequest, getRequest } from "../../utils/API";
import { SearchFilter } from "../../component/common/Filter/Filter"
import "./Prediction.css"
import Prediction from "./Prediction";

export default function Predictions() {
    const [search, setSearch] = useState("")
    const [predictions, setPredictions] = useState([])

    useEffect(() => {
        voteSearch()
    }, [search])

    const voteSearch = (e) => {
        getRequest("api/v1/prediction/?limit=2", { title: search }).then(res => {
            setPredictions(res.results)
        })
    }

    const voteGet = (e) => {
        getRequest("api/v1/prediction/vote/1").then(res => {
            console.log(res, "YOOOOOO")
        })
    }

    return <Layout1>
        <div className="p-5 yyyyyyyy">
            <SearchFilter filter={search} setFilter={setSearch} />
            {predictions.map(prediction =>
                <Prediction prediction={prediction} />
            )}
        </div>
    </Layout1>
}