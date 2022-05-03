import { useEffect, useState } from 'react';
import Layout1 from '../../layout/Layout1';
import { postRequest, getRequest } from '../../utils/API';
import { SearchFilter } from '../../component/common/Filter/Filter';
import Prediction from './Prediction';
import Loader from '../../component/common/Loader/Loader';
import './Prediction.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';

export default function Predictions() {
  const [search, setSearch] = useState('');
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
    getRequest('api/v1/prediction/?limit=10', { title: search }).then((res) => {
      setLoading(false);
      setPredictions(res.results);
    });
  };

  const getUserWeight = () => {
    getRequest('api/v1/prediction/user').then((res) => {
      setWeight(res.weight);
    });
  };

  return (
    <Layout1>
      <div className="p-5">
        <Loader loading={loading}>
          <div className="predictions">
            <div>
              <div
                className="p-3 m-4 bg-light rounded-3 shadow-xl d-flex shadow-sm"
                onClick={() => setExpandedDescription(!expandedDescription)}
                style={{ cursor: 'pointer' }}
              >
                <FontAwesomeIcon
                  className={`fa expand-description-circle ${
                    expandedDescription ? 'clicked' : null
                  }`}
                  icon={faArrowCircleDown}
                  color=""
                  size="2x"
                  onClick={() => setExpandedDescription(!expandedDescription)}
                />
                {expandedDescription ? (
                  <div className='ms-2'>
                    [32] Sed ut perspiciatis, unde omnis iste natus error sit
                    voluptatem accusantium doloremque laudantium, totam rem
                    aperiam eaque ipsa, quae ab illo inventore veritatis et
                    quasi architecto beatae vitae dicta sunt, explicabo. Nemo
                    enim ipsam voluptatem, quia voluptas sit, aspernatur aut
                    odit aut fugit, sed quia consequuntur magni dolores eos, qui
                    ratione voluptatem sequi nesciunt, neque porro quisquam est,
                    qui dolorem ipsum, quia dolor sit amet consectetur
                    adipisci[ng] velit, sed quia non numquam [do] eius modi
                    tempora inci[di]dunt, ut labore et dolore magnam aliquam
                    quaerat voluptatem. Ut enim ad minima veniam, quis
                    nostrum[d] exercitationem ullam corporis suscipit
                    laboriosam, nisi ut aliquid ex ea commodi consequatur?
                    [D]Quis autem vel eum iure reprehenderit, qui in ea
                    voluptate velit esse, quam nihil molestiae consequatur, vel
                    illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?
                    [33] At vero eos et accusamus et iusto odio dignissimos
                    ducimus, qui blanditiis praesentium voluptatum deleniti
                    atque corrupti, quos dolores et quas molestias excepturi
                    sint, obcaecati cupiditate non provident, similique sunt in
                    culpa, qui officia deserunt mollitia animi, id est laborum
                    et dolorum fuga. Et harum quidem rerum facilis est et
                    expedita distinctio. Nam libero tempore, cum soluta nobis
                    est eligendi optio, cumque nihil impedit, quo minus id, quod
                    maxime placeat, facere possimus, omnis voluptas assumenda
                    est, omnis dolor repellendus. Temporibus autem quibusdam et
                    aut officiis debitis aut rerum necessitatibus saepe eveniet,
                    ut et voluptates repudiandae sint et molestiae non
                    recusandae. Itaque earum rerum hic tenetur a sapiente
                    delectus, ut aut reiciendis voluptatibus maiores alias
                    consequatur aut perferendis doloribus asperiores repellat.
                  </div>
                ) : (
                  <div className='ms-2'>{window.t("What are prediction markets?")}</div>
                )}
              </div>
            </div>
            <div className="p-3 m-4 bg-light rounded-3 shadow-sm">
              {window.t('Your current weight is')}: <b>{weight}</b>
            </div>
            <div>
              <SearchFilter filter={search} setFilter={setSearch} />
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
