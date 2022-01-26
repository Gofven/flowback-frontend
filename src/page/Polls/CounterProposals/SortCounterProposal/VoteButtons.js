import { faTimes, faCircleNotch, faCheck, faDownload, faArrowUp, faArrowDown, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Condorcet(props) {
    const inputs = { source: props.columnId, draggableID: props.task.id + '', index: props.index }
    return <div className="vote-buttons">
        {props.columnId === "positive" && <button
            onClick={() => props.onClickCondorcet({ ...inputs, destination: "positive", destinationIndex: 1 })}
            className="for">
            <FontAwesomeIcon className={props.iconSize}
                icon={faArrowUp} color='' size={props.iconSize} />
            <div>UP</div>
        </button>
        }
        {
            props.columnId === "positive" && <button
                onClick={() => props.onClickCondorcet({ ...inputs, destination: "positive", destinationIndex: -1 })}
                className="abstain" >
                <FontAwesomeIcon className={props.iconSize}
                    icon={faArrowDown} color='' size={props.iconSize} />
                <div>DOWN</div>
            </button >
        }
        <button
            onClick={() => props.onClickCondorcet({ ...inputs, destination: props.columnId === "neutral" ? "positive" : "neutral" })}
            className="against">
            <FontAwesomeIcon className={props.iconSize}
                icon={props.columnId === "neutral" ? faPlus : faTrash} color='' size={props.iconSize} />
            <div>{props.columnId === "neutral" ? "ADD" : "REMOVE"}</div>
        </button>
    </div >
}

export function TrafficLight(props) {
    const inputs = { source: props.columnId, draggableID: props.task.id + '', index: props.index }
    return <div className="vote-buttons">
        <button
            onClick={() => props.onClickTrafficLight({ ...inputs, destination: "positive" })}
            className="for">
            <FontAwesomeIcon className={props.iconSize}
                icon={faCheck} color='' size={props.iconSize} />
            <div>FOR</div>
        </button>
        <button
            onClick={() => props.onClickTrafficLight({ ...inputs, destination: "neutral" })}
            className="abstain">
            <FontAwesomeIcon className={props.iconSize}
                icon={faCircleNotch} color='' size={props.iconSize} />
            <div>ABSTAIN</div>
        </button>
        <button
            onClick={() => props.onClickTrafficLight({ ...inputs, destination: "negative" })}
            className="against">
            <FontAwesomeIcon className={props.iconSize}
                icon={faTimes} color='' size={props.iconSize} />
            <div>AGAINST</div>
        </button>
    </div>

}