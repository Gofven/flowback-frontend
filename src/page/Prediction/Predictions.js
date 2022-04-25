import { useEffect, useState } from "react";
import Layout1 from "../../layout/Layout1";
import { postRequest, getRequest } from "../../utils/API";
import { SearchFilter } from "../../component/common/Filter/Filter"
import Prediction from "./Prediction";
import Loader from "../../component/common/Loader/Loader";

export default function Predictions() {
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [predictions, setPredictions] = useState([])

    useEffect(() => {
        voteSearch()
    }, [search])

    const voteSearch = (e) => {
        setLoading(true)
        getRequest("api/v1/prediction/?limit=2", { title: search }).then(res => {
            setLoading(false)
            setPredictions(res.results)
        })
    }

    return <Layout1>
        <div className="p-5">
            <Loader loading={loading}>
                <SearchFilter filter={search} setFilter={setSearch} />
                {predictions.map(prediction =>
                    <Prediction prediction={prediction} />
                )}
            </Loader>
        </div>
    </Layout1>
}