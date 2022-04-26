import { postRequest, getRequest } from "../../utils/API";
import { useState, useEffect } from "react";
import Loader from "../../component/common/Loader/Loader";
import './Prediction.css'

export default function Prediction({ prediction }) {
    const defaultVote = -1
    const [score, setScore] = useState(defaultVote)
    const [averageScore, setAverageScore] = useState(defaultVote)
    const [loading, setLoading] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [message, setMessage] = useState({ message: "", color: "black" })

    const voteCreate = (e) => {
        e.preventDefault()
        // const score = parseInt(document.getElementById("prediction-vote-slider").value)
        setLoading(true)
        postRequest("api/v1/prediction/vote/create", { post: prediction.id, score: score }).then(res => {
            if (res[0] === "Post is inactive or finished.") {
                setMessage({ message: "Post is inactive or finished", color: "text-danger" })
            }
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
            voteGet()
        })
    }

    const voteGet = (e) => {
        getRequest("api/v1/prediction/vote/" + prediction.id).then(res => {
            setScore(res.score || defaultVote)
            setHasUnsavedChanges(false)
            setAverageScore(res.average)
        })
    }

    const scoreChange = (probability) => {
        setHasUnsavedChanges(true)
        // setScore(e.target.value)
        setScore(probability)
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
                    <div className="d-flex justify-content-center">
                        {[0, 20, 40, 60, 80, 100].map(probability =>
                            <div key={probability} className={`btn ms-2 mt-1 rounded-2 prediction-score-buttons ${probability === score * 20 ? "btn-outline-warning" : "btn-outline-secondary"}`}
                                onClick={() => scoreChange(probability / 20)}> {probability}%</div>
                        )}
                    </div>
                </div>
                {hasUnsavedChanges && <div className="mt-2">You have unsaved changes</div>}
                <div className={`mt-2 ${message.color}`}>{message.message}</div>
                <div className="mt-2">Average score: {averageScore}%</div>
                <div className="d-flex mt-3 gap-2">
                    <button type="submit" onClick={voteCreate} className="btn btn-primary">Vote</button>
                    <button type="submit" className="btn btn-secondary" onClick={voteDelete}>Unvote</button>
                </div>
            </form>
        </Loader>
    </div >
}