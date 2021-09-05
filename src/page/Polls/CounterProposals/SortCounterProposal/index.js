/**
 * FlowBack was created and project lead by Loke Hagberg. The design was
 * made by Lina Forsberg. Emilio Müller helped constructing Flowback.
 * Astroneatech created the code. It was primarily financed by David
 * Madsen. It is a decision making platform.
 * Copyright (C) 2021  Astroneatech AB
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
import { Button, Modal } from 'react-bootstrap';
import Loader from '../../../../component/common/Loader';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './styles.css';
import styled from 'styled-components';
import { postRequest } from '../../../../utils/API';
import Image from '../../../../component/common/Image';
import { formatDate } from '../../../../utils/common';
import Profile from '../../../../component/User/Profile';
import LinesEllipsis from 'react-lines-ellipsis';

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
        <Title>{props.column.title}</Title>
        <Droppable droppableId={props.column.id + ''}>
            {(provided, snapshot) => (
                <TaskList
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    isDraggingOver={snapshot.isDraggingOver}
                >
                    {props.tasks.map((task, index) => (
                        <Task key={task.id} task={task} index={index} />
                    ))}
                    {provided.placeholder}
                </TaskList>
            )}
        </Droppable>
    </Container>
}

function Task(props) {

    const counterProposal = props.task.content;
    return <Draggable draggableId={props.task.id + ''} index={props.index}>
        {(provided, snapshot) => (
            <TaskContainer
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                isDragging={snapshot.isDragging}
            >
                {/* {props.task.id} - {props.task.content.proposal} */}
                <div className="card counter-proposal-card bg-white">
                    <div className='points'>{counterProposal?.points || 0}</div>
                    <div className="post-header d-flex justify-content-between card-header mb-0">
                        {counterProposal && counterProposal.user &&
                            <div className="media post-meida">
                                <Image src={counterProposal.user.image} className="post-user-img" errImg={'/img/no-photo.jpg'} />
                                <div className="media-body">
                                    <h5 className="user-name">
                                        <Profile className='inline-block' id={counterProposal.user.id}>{counterProposal.user.first_name} {counterProposal.user.last_name} </Profile>
                                    </h5>
                                    <div className="post-time">{counterProposal && formatDate(counterProposal.created_at, 'DD/MM/YYYY h:mm:ss')}</div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="counterproposal-body card-body">
                        <LinesEllipsis
                            text={counterProposal?.proposal}
                            maxLine='3'
                            ellipsis='...'
                            trimRight
                            basedOn='letters'
                        />
                    </div>
                </div>
            </TaskContainer>
        )}
    </Draggable>;
}

function SortCounterProposal(props) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState(initialData);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        if (show) {
            initializeState();
        }
    }, [show]);

    /**
     * To intialize counter proposal sorting state
     */
    const initializeState = () => {
        const cpList = props.counterProposals || [];
        const cpMap = cpList.reduce((acc, cp) => (acc[cp.id] = cp, acc), {});
        let cpPoints = props.proposalIndexes || {};
        const data = state;
        cpPoints = Object.fromEntries(
            Object.entries(cpPoints).sort(([, a], [, b]) => a - b)
        );
        const pointsMap = new Map();
        Object.keys(cpPoints).forEach((key, index) => {
            if (cpPoints[key]) {
                if (cpPoints[key] > 0) {
                    const list = pointsMap.get('positive') || [];
                    list.push(key);
                    pointsMap.set('positive', list);
                } else {
                    const list = pointsMap.get('negative') || [];
                    list.push(key);
                    pointsMap.set('negative', list);
                }
            } else {
                const list = pointsMap.get('neutral') || [];
                list.push(key);
                pointsMap.set('neutral', list);
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

    /**
     * To update counter proposal positions when user has dragged any proposals
     * @param {*} event 
     * @returns 
     */
    const onDragEnd = (event) => {
        console.log('event', event);
        const { source, destination, draggableId } = event;
        if (!destination) {
            return;
        }
        if (source.droppableId == destination.droppableId && source.index == destination.index) {
            return;
        }
        const data = state;
        data.columns[source.droppableId].taskIds.splice(source.index, 1);
        data.columns[destination.droppableId].taskIds.splice(destination.index, 0, draggableId);
        setState({ ...data });
    }

    /**
     * To save proposal positions provided by a user
     */
    const saveIndexies = () => {
        setLoading(true);
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
        const positive_proposal_indexes = Object.keys(ppi).sort(function(a,b){
            return ppi[a] - ppi[b];
        }).map(Number)

        const negative_proposal_indexes = Object.keys(npi).sort(function(a,b){
            return npi[a] - npi[b];
        }).map(Number)

        const data = {
            positive_proposal_indexes: positive_proposal_indexes,
            negative_proposal_indexes: negative_proposal_indexes,
            poll: props.pollId
        }
        postRequest("api/v1/group_poll/update_proposal_indexes", data).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    if (props.onUpdateIndexes) {
                        props.onUpdateIndexes(true);
                        handleClose();
                    }
                }
                setLoading(false);
            }).catch((err) => {
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

    useEffect(() => {
        console.log('state changes', state);
    }, [state])

    return (
        <>
            <div className={props.className} onClick={handleShow}>
                {props.children}
            </div>

            <Modal show={show} onHide={handleClose} centered size='lg'>
                <div className='p-4'>
                    <Loader loading={loading}>
                        <h4>Sort Proposals</h4>
                        <div>
                            {
                                show &&
                                <DragDropContext
                                    // onDragStart={onDragStart}
                                    // onDragUpdate={onDragUpdate}
                                    onDragEnd={onDragEnd}
                                >
                                    {state.columnOrder.map(columnId => {
                                        const column = state.columns[columnId];
                                        const tasks = column.taskIds.map(taskId => state.tasks[taskId]);

                                        return <Column key={column.id} column={column} tasks={tasks} />;
                                    })}
                                </DragDropContext>
                            }
                        </div>
                        <div>
                            <Button color='secondary' onClick={saveIndexies}>Update</Button>
                        </div>
                    </Loader>
                </div>
            </Modal>
        </>
    );
}

export default SortCounterProposal;