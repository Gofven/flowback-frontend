import { useEffect, useState } from "react";
import Layout1 from "../../layout/Layout1";
import { postRequest, getRequest } from "../../utils/API";
import { SearchFilter } from "../../component/common/Filter/Filter";
import Prediction from "./Prediction";
import Loader from "../../component/common/Loader/Loader";
import "./Prediction.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleDown } from "@fortawesome/free-solid-svg-icons";

export default function Predictions() {
  const [search, setSearch] = useState("");
  const [weight, setWeight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [expandedDescription, setExpandedDescription] = useState(false);

  useEffect(() => {
    voteSearch();
  }, [search]);

  useEffect(() => {
    getUserWeight();
  }, []);

  const voteSearch = (e) => {
    setLoading(true);
    getRequest("api/v1/prediction/?limit=10", { title: search }).then((res) => {
      setLoading(false);
      setPredictions(res.results);
    });
  };

  const getUserWeight = () => {
    getRequest("api/v1/prediction/user").then((res) => {
      setWeight(res.weight);
    });
  };

  return (
    <Layout1>
      <div className="p-5">
        <Loader loading={loading}>
          <div className="predictions">
            <div className="predictions-side">
              <div className="mt-3 me-3">
                <SearchFilter filter={search} setFilter={setSearch} />
              </div>
              <div className="p-3 m-4 bg-light rounded-3 shadow-sm ">
                {window.t("Your current weight is")}: <b>{weight}</b>
              </div>
              <div
                className="p-3 m-4 bg-light rounded-3 shadow-xl d-flex shadow-sm"
                onClick={() => setExpandedDescription(!expandedDescription)}
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon
                  className={`fa expand-description-circle ${
                    expandedDescription ? "clicked" : null
                  }`}
                  icon={faArrowCircleDown}
                  color=""
                  size="2x"
                  onClick={() => setExpandedDescription(!expandedDescription)}
                />
                {expandedDescription ? (
                  <div className="ms-2">
                    {window.t(`This prediction market is a point-based system dedicated to
                    generating accurate predictions about future events by using
                    the collective intelligence and wisdom. The number of steps
                    better you guess than the average vote will change your
                    weight positively in the voting and vice versa with negative
                    (10 points plus or minus per step better or worse), that is
                    only for the voting in the prediction market and not
                    elsewhere. Your weight will be viewable by others.`)}
                  </div>
                ) : (
                  <div className="ps-1 pm-1 what-are-pred">
                    {window.t("What are prediction markets?")}
                  </div>
                )}
              </div>
            </div>
            <div>
              {predictions.map((prediction) => (
                <div key={prediction.id}>
                  <Prediction prediction={prediction} />
                </div>
              ))}
            </div>
          </div>
        </Loader>
      </div>
    </Layout1>
  );
}
