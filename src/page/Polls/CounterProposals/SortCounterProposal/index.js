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
import Loader from '../../../../component/common/Loader';
import './styles.css';
import styled from 'styled-components';
import { postRequest } from '../../../../utils/API';
import Image from '../../../../component/common/Image';
import { formatDate } from '../../../../utils/common';
import Profile from '../../../../component/User/Profile';
import LinesEllipsis from 'react-lines-ellipsis';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Condorcet, TrafficLight } from './VoteButtons';

const Container = styled.div`
  margin: 12px 0;
  border: 1px solid lightgrey;
  border-radius: 2px;
`;
const Title = styled.h5`
  padding: 8px;
  margin-bottom: 0;
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
    console.log('columns', props);
    return <Container>
        {props.votingType === "traffic" ?
            (props.column.id === "positive" && <Title>For</Title>) ||
            (props.column.id === "neutral" && <Title>Abstain</Title>) ||
            (props.column.id === "negative" && <Title>Against</Title>)
            : null}
        {props.votingType === "condorcet" ?
            (props.column.id === "positive" && <Title>Added</Title>) ||
            (props.column.id === "neutral" && <Title>Abstain</Title>)
            : null}
        <div className="column-style">
            {props.tasks.map((task, index) => {
                return <ProposalBox key={task.id} task={task} index={index} columnId={props.column.id} onClickTrafficLight={props.onClickTrafficLight} votingType={props.votingType} onClickCondorcet={props.onClickCondorcet} />
            })}
        </div>
    </Container>
}

function ProposalBox(props) {
    const counterProposal = props.task.content;
    counterProposal.title = counterProposal?.proposal.split("~")[0];
    counterProposal.description = counterProposal?.proposal.split("~")[1];
    return <div>
        {/* {props.task.id} - {props.task.content.proposal} */}
        <div className="card counter-proposal-card bg-white">
            {/* TODO: ASK GOFVEN IF THIS WORKS IN PRODUCTION */}
            {props.task.content.file ? <a className='points' onClick={() => window.open(props.task.content.file, '_blank')} href="">
                <FontAwesomeIcon className="fa"
                    icon={faDownload} color='' size='lg' />
                DOWNLOAD FILE
            </a>
                : null}
            <div className="post-header d-flex justify-content-between card-header mb-0">
                {counterProposal && counterProposal.user &&
                    <div className="media post-meida">
                        <Image src={counterProposal.user.image} className="post-user-img" errImg={'/img/no-photo.jpg'} />
                        <div className="media-body">
                            <h5 className="user-name">
                                <Profile className='inline-block' id={counterProposal.user.id}>{counterProposal.user.first_name} {counterProposal.user.last_name} </Profile>
                            </h5>
                            <div className="post-time">{counterProposal && formatDate(counterProposal.created_at, 'DD/MM/YYYY kk:mm')}</div>
                        </div>
                    </div>
                }
            </div>

            {props.votingType === "traffic" && <TrafficLight {...props} iconSize={"fa-3x"} />}
            {props.votingType === "condorcet" && <Condorcet {...props} iconSize={"fa-3x"} />}

            <div className="counterproposal-body">
                {/* The backend only supports one textfield for a proposal so putting "~" between the title and description is a workaround */}
                <div className="counter-proposal-top">
                    <div className="counter-proposal-title">
                        <h4>{counterProposal.date && counterProposal?.title !== "Drop this mission" ?
                            <h4>{formatDate(counterProposal.date, 'DD/MM/YYYY kk:mm')}</h4> : null}
                            <LinesEllipsis
                                text={counterProposal?.title}
                                maxLine='3'
                                ellipsis='...'
                                trimRight
                                basedOn='letters' /></h4>
                    </div>
                </div>
                <div className="proposal-description">
                    <LinesEllipsis
                        text={counterProposal?.description}
                        ellipsis="..."
                        trimRight
                        basedOn='letters' />
                </div>
            </div>
        </div>
    </div>
}

function SortCounterProposal(props) {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState(initialData);
    const [messege, setMessege] = useState({ content: "", color: "black" })

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
        saveIndexies()
    }

    const onClickCondorcet = ({ source, destination, draggableID, index, destinationIndex }) => {
        console.log("STUFF", source, destination, draggableID, index)
        const data = state;
        console.log("STATE", state)
        data.columns[source].taskIds.splice(index, 1);
        if (source === "neutral")
            data.columns[destination].taskIds.splice(data.columns.positive.taskIds.length, 0, draggableID);
        else
            data.columns[destination].taskIds.splice(index - destinationIndex, 0, draggableID);

        setState({ ...data });
        saveIndexies()
    }
    /**
     * To save proposal positions provided by a user
     */
    const saveIndexies = () => {
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

        const data = {
            positive: positive_proposal_indexes,
            negative: negative_proposal_indexes
        }
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
                if (status === "success") {
                    if (props.onUpdateIndexes) {
                        props.onUpdateIndexes(true);
                        //handleClose();
                    }
                }
                setMessege({ content: "Successfully updated your vote", color: "green" })
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

    useEffect(() => { initializeState(); console.log(props, "GROUP") }, [props.proposalIndexes]);


    return (
        <div className='p-4'>
            <Loader loading={loading}>
                <h4>Sort Proposals</h4>
                <h4 style={{ "color": messege.color }}>{messege.content}</h4>
                {/* <Button onClick={() => votingType==="condorcet" ? setVotingType("traffic") : setVotingType("condorcet") }>Switch between voting systems</Button> */}
                <div>
                    {/* {props.votingType !== "traffic" ? */}
                    {state.columnOrder.map(columnId => {
                        if (columnId === "negative" && props.votingType === "condorcet") {
                            return;
                        }
                        const column = state.columns[columnId];
                        const tasks = column.taskIds.map(taskId => state.tasks[taskId]);

                        return <Column key={tasks.id} column={column} tasks={tasks} onClickTrafficLight={onClickTrafficLight} onClickCondorcet={onClickCondorcet} votingType={props.votingType} />;
                    })}
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