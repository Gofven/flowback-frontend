/**
 * FlowBack was created and project lead by Loke Hagberg. The design was
 * made by Lina Forsberg. Emilio Müller helped constructing Flowback.
 * Astroneatech created the code. It was primarily financed by David
 * Madsen. It is a decision making platform.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
*/

import React, { useEffect, useState } from 'react';
import Loader from '../../../../component/common/Loader/Loader';
import './styles.css';
import styled from 'styled-components';
import { postRequest } from '../../../../utils/API';
import Image from '../../../../component/common/Image/Image';
import { formatDate } from '../../../../utils/common';
import Profile from '../../../../component/User/Profile/Profile';
import LinesEllipsis from 'react-lines-ellipsis';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';
import { Condorcet, TrafficLight } from './VoteButtons';
import ProposalDetails from '../../PollResults/ProposalDetails';
import { encryptWithPublicKey, getPublicKeyFromDatabase, signData } from '../../../../component/Metamask/metamask.js'
import { getTextBetweenHTMLTags } from '../../../../component/HTMEditor/HTMEditor'
import { getEncryptionPublicKey, encryptSafely } from '@metamask/eth-sig-util';

const div = styled.div`
  margin: 12px 0;
  border: 1px solid lightgrey;
  border-radius: 2px;
`;
const Title = styled.h5`
  padding: 8px;
  margin-bottom: 0;
  text-align:center;
  font-size:2rem;
  font-weight:680;
`;
const TaskList = styled.div`
  padding: 8px 16px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? '#f7f7f7' : 'white')};
`;
const TaskContainer = styled.div``;

const initialData = {
    tasks: {},
    columns: {
        'positive': {
            id: 'positive',
            title: 'Positive',
            taskIds: [],
        },
        'neutral': {
            id: 'neutral',
            title: 'Neutral',
            taskIds: [],
        },
        'negative': {
            id: 'negative',
            title: 'Negative',
            taskIds: [],
        }
    },
    // Facilitate reordering of the columns
    columnOrder: ['positive', 'neutral', 'negative'],
};

function Column(props) {
    return <div className="column-container">
        {props.votingType === "traffic" ?
            (props.column.id === "positive" && <Title>{window.t("For")}</Title>) ||
            (props.column.id === "neutral" && <Title>{window.t("Abstain")}</Title>) ||
            (props.column.id === "negative" && <Title>{window.t("Against")}</Title>)
            : null}
        {props.votingType === "condorcet" ?
            (props.column.id === "positive" && <Title>{window.t("Added")}</Title>) ||
            (props.column.id === "neutral" && <Title>{window.t("Abstain")}</Title>)
            : null}
        <div className="column-style">
            {props.tasks.map((task, index) => {
                return <ProposalBox key={task.id} task={task} index={index} columnId={props.column.id} columnLength={props.column.taskIds?.length} {...props} />
            })}
        </div>
    </div>
}

function ProposalBox(props) {
    const counterProposal = props.task.content;
    counterProposal.title = counterProposal?.proposal.split("~")[0];
    counterProposal.description = counterProposal?.proposal.split("~")[1];

    useEffect(() => {
        // const proposalDescription = document.getElementById(`description${proposal.id}`)
        // proposalDescription.innerHTML = coun

    })

    return <div>
        {/* {props.task.id} - {props.task.content.proposal} */}
        <div className="card counter-proposal-card bg-white">
            {/* TODO: ASK GOFVEN IF THIS WORKS IN PRODUCTION */}
            {props.task.content.file ? <a className='points' onClick={() => window.open(props.task.content.file, '_blank')} href="">
                <FontAwesomeIcon className="fa"
                    icon={faDownload} color='' size='lg' />
                {window.t("DOWNLOAD FILE")}
            </a>
                : null}
            <div className="post-header d-flex justify-content-between card-header mb-0">
                <div className="counter-proposal-title">
                    <h4>{counterProposal.date && counterProposal?.title !== "Drop this mission" ?
                        <h4>{formatDate(counterProposal.date, 'DD/MM/YYYY kk:mm')}</h4> : null}
                        {counterProposal?.title}
                    </h4>
                </div>
            </div>
            <div className="proposal-top-part" id={`${counterProposal?.title}`}>
                {counterProposal.description && <ProposalDetails proposal={counterProposal} proposalDescription={counterProposal.description} />}
            </div>

            <div className="proposal-buttons-and-user">
                {/* The backend only supports one textfield for a proposal so putting "~" between the title and description is a workaround */}

                {counterProposal && counterProposal.user &&
                    <div className="media post-meida">
                        {/* <Image src={counterProposal.user.image} className="post-user-img" errImg={'/img/no-photo.jpg'} /> */}
                        <div className="media-body proposal-bottom">
                            <a className="user-name user-name-proposal">
                                <Profile className='inline-block' id={counterProposal.user.id}>{counterProposal.user.first_name} {counterProposal.user.last_name} </Profile>
                            </a>
                            <div className="post-time">{counterProposal && formatDate(counterProposal.created_at, 'DD/MM/YYYY kk:mm')}</div>
                        </div>
                    </div>
                }
                {/* </div> */}
                {props.votingType === "traffic" && <TrafficLight {...props} iconSize={"4x"} />}
                {props.votingType === "condorcet" && <Condorcet {...props} iconSize={"4x"} />}
                {props.votingType === "cardinal" && <input type="number" min="0" max="1000000" placeholder="0" value={props.cardinalState[props.task.id]}
                    onChange={e => {
                        const newInput = props.cardinalState;
                        if (e.target.value === "") {
                            newInput[props.task.id] = 0;
                        } else {
                            newInput[props.task.id] = parseInt(e.target.value);
                        }
                        props.setCardinalState([...newInput]);

                    }}>
                </input>
                }
            </div>
        </div>
    </div >
}

function SortCounterProposal(props) {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState(initialData);
    const [cardinalState, setCardinalState] = useState([])
    const [messege, setMessege] = useState({ content: "", color: "black" })
    const [privateKey, setPrivateKey] = useState("5d46203f6060b6be023d95714c23f329d49a4f2315ec9cd4907edae66b125f1b")

    /**
     * To intialize counter proposal sorting state
     */
    const initializeState = () => {
        const cpList = props.counterProposals || [];
        const cpMap = cpList.reduce((acc, cp) => (acc[cp.id] = cp, acc), {});
        let cpPoints = props.proposalIndexes || {};
        const data = state;
        let cpPointsArr = Object.keys(cpPoints).map((key) => [Number(key), cpPoints[key]]);
        cpPointsArr = cpPointsArr.sort((a, b) => b[1] - a[1]);
        cpPoints = new Map();
        cpPointsArr.forEach((val, i) => cpPoints.set(val[0], val[1]));
        const pointsMap = new Map();
        cpPoints.forEach((val, key) => {
            if (val > 0) {
                const list = pointsMap.get('positive') || [];
                list.push(key);
                pointsMap.set('positive', list);
            } else {
                const list = pointsMap.get('negative') || [];
                list.push(key);
                pointsMap.set('negative', list);
            }
            delete cpMap[key];
        });
        Object.keys(cpMap).forEach((cp) => {
            const list = pointsMap.get('neutral') || [];
            list.push(cp);
            pointsMap.set('neutral', list);
        });

        data.tasks = cpList.reduce((acc, cp) => (acc[cp.id] = { id: cp.id, content: cp }, acc), {});


        Object.keys(data.columns).forEach((column) => {
            data.columns[column].taskIds = pointsMap.get(column) || [];
        });

        setState({ ...data });
    }

    const onClickTrafficLight = ({ source, destination, draggableID, index }) => {
        if (source !== destination) {
            const data = state;
            data.columns[source].taskIds.splice(index, 1);
            data.columns[destination].taskIds.splice(0, 0, draggableID);
            setState({ ...data });
        }
        //Uncomment for live updates
        // saveIndexies()
    }

    const onClickCondorcet = ({ source, destination, draggableID, index, destinationIndex }) => {
        const data = state;
        data.columns[source].taskIds.splice(index, 1);
        if (source === "neutral")
            data.columns[destination].taskIds.splice(data.columns.positive.taskIds.length, 0, draggableID);
        else
            data.columns[destination].taskIds.splice(index - destinationIndex, 0, draggableID);

        setState({ ...data });
        //Uncomment for live updates
        // saveIndexies()

    }
    /**
     * To save proposal positions provided by a user
     */
    const saveIndexies = () => {

        if (props.votingType === "cardinal") {
            saveCardinal();
            return;
        }

        const newPoints = calculatePoints();
        console.log('points on save', newPoints);
        const ppi = {};
        const npi = {};

        // Split into two list containing positives and negatives
        for (const [key, value] of Object.entries(newPoints)) {
            if (value > 0) {
                ppi[key] = value;
            }
            if (value < 0) {
                npi[key] = value;
            }
        }

        // Sort values highest to lowest
        const positive_proposal_indexes = Object.keys(ppi).sort(function (a, b) {
            return ppi[a] - ppi[b];
        }).map(Number)

        const negative_proposal_indexes = Object.keys(npi).sort(function (a, b) {
            return npi[a] - npi[b];
        }).map(Number)

        console.log("HIIi")
        const userId = JSON.parse(window.localStorage.user).id;
        // getPublicKeyFromDatabase(userId).then(publicKey => {

            const publicKey = getEncryptionPublicKey(privateKey)

            //TODO: More elegant code
            if (typeof window.ethereum !== 'undefined') {
                

                    let positive_proposal_indexes_encrypted = []
                    positive_proposal_indexes.forEach((proposal, index) => {
                        
                        const encryptedProposal = JSON.stringify(encryptSafely({
                            version:"x25519-xsalsa20-poly1305",
                            data:{proposal_id: proposal, proposalIndex: index, userId},
                            publicKey
                        }))
                        
                        // const encryptedProposal = encryptWithPublicKey({ proposal_id: proposal, proposalIndex: index, userId }, publicKey)
                        positive_proposal_indexes_encrypted.push({ proposal, hash: encryptedProposal }) //TODO: Rename hash to encrypted
                    });
                    
                    let negative_proposal_indexes_encrypted = []
                    negative_proposal_indexes.forEach((proposal, index) => {
                        
                        const encryptedProposal = JSON.stringify(encryptSafely({
                            version:"x25519-xsalsa20-poly1305",
                            data:{proposal_id: proposal, proposalIndex: index, userId},
                            publicKey:publicKey
                        }))

                        
                        // const encryptedProposal = encryptWithPublicKey({ proposal_id: proposal, proposalIndex: index, userId }, publicKey)
                        negative_proposal_indexes_encrypted.push({ proposal, hash: encryptedProposal })
                    });
                    
                    //Sends encrypted votes to backend
                    sendData({positive: positive_proposal_indexes_encrypted, negative:negative_proposal_indexes_encrypted, hash:"none"});
            }
                else {
                    let positive_proposal_indexes_2 = []
                    positive_proposal_indexes.forEach((proposal, index) => {
                        
                        positive_proposal_indexes_2.push({ proposal })
                    });
                    
                    let negative_proposal_indexes_2 = []
                    negative_proposal_indexes.forEach((proposal, index) => {
                        
                    negative_proposal_indexes_2.push({ proposal })
                });

                const data = {
                    positive: positive_proposal_indexes_2,
                    negative: negative_proposal_indexes_2
                }

                sendData(data)
            }
        // })
    }

    const saveCardinal = () => {

        if (totalCardinalVotes() <= 1000000) {
            let toSend = [];
            let index = 0;

            const userId = JSON.parse(window.localStorage.user).id;
            // getPublicKeyFromDatabase(userId).then(publicKey => {
                cardinalState.forEach((score, scoreIndex) => {
                    if (typeof score === 'number') {
                        const encryptedProposal = encryptWithPublicKey({ score, scoreIndex, userId }, privateKey)
                        toSend[index] = { "proposal": scoreIndex, "score": parseInt(score), "hash": encryptedProposal || "" }
                        index++;
                    }
                });

                const data = {
                    positive: toSend
                }

                sendData(data);
            // });
        }
        else {
            setMessege({ content: "Above maximum allowed votes (one million)", color: "red" });
        }
    }

    const sendData = (data) => {
        setLoading(true);
        postRequest(`api/v1/group_poll/${props.pollId}/update_index_proposals`, data).then(
            (response) => {
                console.log('response', response);
                if (response === "User has no permission to vote") {
                    setMessege({ content: "You don't have permission to vote", color: "red" })
                    initializeState();
                    setLoading(false);
                    return;
                }

                const { status, data } = response;
                if (status === "success" || response === "") {
                    if (props.onUpdateIndexes) {
                        props.onUpdateIndexes(true);
                        //handleClose();
                    }
                    setMessege({ content: "Successfully updated your vote", color: "green" })
                }
                else {
                    setMessege({ content: "A problem has occurred", color: "red" })
                }
                setLoading(false);
            }).catch((err) => {
                setMessege({ content: "A problem has occurred", color: "red" })
                setLoading(false);
            });
    }

    /**
     * To calculate points based on new sorting
     * @returns 
     */
    const calculatePoints = () => {
        const data = state;
        const points = {};
        data.columns['positive'].taskIds.forEach((taskId, index) => {
            points[taskId] = data.columns['positive'].taskIds.length - index;
        });
        data.columns['neutral'].taskIds.forEach((taskId, index) => {
            points[taskId] = 0;
        });
        data.columns['negative'].taskIds.forEach((taskId, index) => {
            points[taskId] = (index + 1) * -1;
        });
        return points;
    }

    const intializeCardinal = () => {

        const scores = props.scores;
        let cardinals = []
        scores.forEach(score => {
            cardinals[score.proposal] = score.score
        })

        setCardinalState(cardinals)
    }

    const totalCardinalVotes = () => {
        let totalCardinal = 0
        if (props.votingType === "cardinal") {
            cardinalState.forEach(cardinal => {
                if (cardinal !== undefined)
                    totalCardinal += cardinal;
            })
        }

        return totalCardinal || 0
    }

    useEffect(() => { initializeState(); console.log(props, "GROUP") }, [props.proposalIndexes]);
    useEffect(() => { if (props.scores) intializeCardinal(); }, [props.scores]);


    return (
        <div className='p-4'>
            <Loader loading={loading}>
                {props.votingType === "cardinal" &&
                    <div>
                        <div className="total-cardinal">{window.t("Total number of votes")}: {totalCardinalVotes()}</div>
                    </div>}
                <h4>{window.t("Sort Proposals")}</h4>
                Private Key: <input type="text" value={privateKey} onChange={e => setPrivateKey(e.target.value)}></input>
                <button className="btn btn-outline-primary" onClick={saveIndexies}>{window.t("Save Votings")}</button>
                <h4 style={{ "color": messege.color }}>{window.t(messege.content)}</h4>
                {/* <Button onClick={() => votingType==="condorcet" ? setVotingType("traffic") : setVotingType("condorcet") }>Switch between voting systems</Button> */}
                <div>
                    {/* {props.votingType !== "traffic" ? */}
                    {props.votingType !== "cardinal" ? state.columnOrder.map(columnId => {
                        if (columnId === "negative" && props.votingType === "condorcet") {
                            return;
                        }

                        // if (columnId !== "neutral" && props.votingType === "cardinal") {
                        //     return;
                        // }

                        if (props.votingType !== "cardinal") {
                            const column = state.columns[columnId];
                            const tasks = column.taskIds.map(taskId => state.tasks[taskId]);

                            return <Column key={tasks.id} column={column} tasks={tasks}
                                onClickTrafficLight={onClickTrafficLight} onClickCondorcet={onClickCondorcet}
                                votingType={props.votingType} cardinalState={cardinalState} setCardinalState={setCardinalState} />;
                        }
                    })
                        : ["neutral"].map(e => {
                            let allTasks = Object.values(state.tasks)

                            return <Column key={allTasks}
                                column={"neutral"} tasks={allTasks}
                                onClickTrafficLight={onClickTrafficLight} onClickCondorcet={onClickCondorcet}
                                votingType={props.votingType} cardinalState={cardinalState} setCardinalState={setCardinalState} saveCardinal={saveCardinal} />
                        })
                    }

                    {/* : <div>
                        <div className="column-style">
                            {console.log(state.tasks, "TASKS")}
                            {state.tasks.map((task, index) => {
                                console.log(task, "TASK")
                                return <ProposalBox key={task.id} task={task} index={index} columnId={props.column.id} onClickTrafficLight={onClickTrafficLight} votingType={"traffic"} />
                            })}
                            </div>
                            </div>
                            
                        } */}



                    {/* //     // const column = state.columns["neutral"];
                        //     const tasks = state.tasks.map(taskId => state.tasks[taskId]);
                        //     console.log(tasks, "TASKS");
                        //     console.log(state, "TASKS");
                        
                        //     return null
                        // return (
                            
                            //     <div className="column-style">
                            //         {state.tasks.map((task, index) => {
                                //             console.log(task)
                                //             return <ProposalBox key={task.id} task={task} index={index} columnId={task} onClickTrafficLight={onClickTrafficLight} votingType={"traffic"} />
                                //         })}
                                //     </div>
                                
                                // )
                            // } */}

                </div>
            </Loader>
        </div>
    );
}

export default SortCounterProposal;