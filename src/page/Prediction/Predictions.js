import { useEffect, useState } from "react";
import Layout1 from "../../layout/Layout1";
import { postRequest, getRequest } from "../../utils/API";
import { SearchFilter } from "../../component/common/Filter/Filter"
import Prediction from "./Prediction";
import Loader from "../../component/common/Loader/Loader";

export default function Predictions() {
    const [search, setSearch] = useState("")
    const [weight, setWeight] = useState(null)
    const [loading, setLoading] = useState(false)
    const [predictions, setPredictions] = useState([])

    useEffect(() => {
        voteSearch()
    }, [search])

    useEffect(() => {
        getUserWeight()
    }, [])

    const voteSearch = (e) => {
        setLoading(true)
        getRequest("api/v1/prediction/?limit=2", { title: search }).then(res => {
            setLoading(false)
            setPredictions(res.results)
        })
    }

    const getUserWeight = () => {
        getRequest("api/v1/prediction/user").then(res => {
            setWeight(res.weight)
        })
    }

    return <Layout1>
        <div className="p-5">
            <Loader loading={loading}>
                <SearchFilter filter={search} setFilter={setSearch} />
                <div className="p-3 m-4 bg-light rounded-3 shadow-xl">Your current weight is: {weight}</div>
                {predictions.map(prediction =>
                    <Prediction prediction={prediction} />
                )}
            </Loader>
        </div>
    </Layout1>
}