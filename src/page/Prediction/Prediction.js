import { postRequest, getRequest } from "../../utils/API";
import { useState, useEffect } from "react";
import Loader from "../../component/common/Loader/Loader";

export default function Prediction({ prediction }) {
    const defaultVote = 0
    const [score, setScore] = useState(defaultVote)
    const [averageScore, setAverageScore] = useState(defaultVote)
    const [loading, setLoading] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    const voteCreate = (e) => {
        e.preventDefault()
        const score = parseInt(document.getElementById("prediction-vote-slider").value)
        setLoading(true)
        postRequest("api/v1/prediction/vote/create", { post: prediction.id, score: score }).then(res => {
            setLoading(false)
            setHasUnsavedChanges(false)
            voteGet()
        })
    }

    const voteDelete = (e) => {
        e.preventDefault()
        postRequest("api/v1/prediction/vote/delete", { post: prediction.id }).then(res => {
            setScore(defaultVote)
            setHasUnsavedChanges(false)
        })
    }

    const voteGet = (e) => {
        getRequest("api/v1/prediction/vote/" + prediction.id).then(res => {
            setAverageScore(res.score || defaultVote)
            setHasUnsavedChanges(false)
        })
    }

    const scoreChange = (e) => {
        setHasUnsavedChanges(true)
        setScore(e.target.value)
    }

    useEffect(() => {
        voteGet()
    }, [])


    return <div key={prediction.id} className="p-3 m-4 bg-light rounded-3 shadow-xl">
        <Loader loading={loading}>
            <h1>{prediction.title}</h1>
            <div className="mt-2 mb-3">{prediction.description}</div>
            <form>
                <div className="w-100">
                    <div className="d-flex ">
                        0% <input className="w-100" type="range" id="prediction-vote-slider" max="5" min="0" value={score} onChange={scoreChange}></input> 100%
                        {/* <input className="w-100 bg-orange-400" type="range" id="prediction-vote-slider" max="5" min="0" value={averageScore} ></input> */}
                    </div>
                    <div className="text-center" style={{ "color": hasUnsavedChanges ? "#994422" : "black" }}>{score * 20}%</div>
                </div>
                {hasUnsavedChanges && <div>You have unsaved changes</div>}
                <div>Average score: {averageScore * 20}%</div>
                <div className="d-flex mt-3">
                    <button type="submit" onClick={voteCreate} className="btn btn-primary">Vote</button>
                    <button type="submit" className="btn btn-secondary ms-2" onClick={voteDelete}>Unvote</button>
                </div>
            </form>
        </Loader>
    </div >
}