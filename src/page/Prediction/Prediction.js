import { postRequest, getRequest } from "../../utils/API";
import { useState } from "react";

export default function Prediction({ prediction }) {
    const [score, setScore] = useState(50)

    const voteCreate = (e) => {
        e.preventDefault()
        const score = parseInt(document.getElementById("prediction-vote-slider").value)
        postRequest("api/v1/prediction/vote/create", { post: prediction.id, score: score }).then(res => {

        })
    }

    const voteDelete = (e) => {
        e.preventDefault()
        postRequest("api/v1/prediction/vote/delete", { post: prediction.id }).then(res => {
            console.log(res, "YOOOOOO")
        })
    }

    const scoreChange = (e) => {
        setScore(e.target.value)
    }


    return <div key={prediction.id} className="p-3 m-4 bg-light rounded-3 shadow-xl">
        <h1>{prediction.title}</h1>
        <div className="mt-2 mb-3">{prediction.description}</div>
        <form>
            <div className="w-100">
                <div className="d-flex">0<input type="range" id="prediction-vote-slider" max="100" min="0" value={score} onChange={scoreChange}></input>100</div>
                <div>{score}</div>
            </div>
            <div className="d-flex mt-3">
                <button type="submit" onClick={voteCreate} className="btn btn-primary">Vote</button>
                <button type="submit" className="btn btn-secondary ms-2" onClick={voteDelete}>Unvote</button>
            </div>
        </form>
    </div>
}