import { useEffect } from "react";
import Layout1 from "../../layout/Layout1";
import { postRequest } from "../../utils/API";

export default function Prediction() {

    useEffect(() => {

        postRequest("api/v1/prediction/vote/create", { post: 1, score: 0 }).then(res => {
            console.log(res, "YOOOOOO")
        })

    })


    return <Layout1>

        hiiiii

    </Layout1>
}