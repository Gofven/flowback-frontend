import { Dropdown } from "react-bootstrap"
import './filters.css'
import SearchBox from "../../Search/SearchBox";
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//TODO: Refactor the code so it's more reusible and modular, like the SearchFilter function. 
//Also include a function that returns true or false based on if an item is filtered or not

export function DropDownPollFilter({ pollFilter, setPollFilter }) {
    return <div>
        <div className="filters">
            <Dropdown>
                <Dropdown.Toggle variant="white" id="dropdown-basic">
                    {pollFilter.pollType === "condorcet" && "Ranking"}
                    {pollFilter.pollType === "traffic" && "For/Against"}
                    {pollFilter.pollType === "event" && "Time"}
                    {pollFilter.pollType === "cardinal" && "Cardinal"}
                    {pollFilter.pollType === null && "Any Poll Type"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {["condorcet", "traffic", "event", "cardinal"].map(filter => {
                        return <Dropdown.Item className="cursor-pointer filterDropdown"
                            onClick={() => setPollFilter({ ...pollFilter, pollType: filter === pollFilter.pollType ? null : filter })}>
                            <div>
                                {filter === "condorcet" ? "Ranking" : null}
                                {filter === "traffic" ? "For/Against" : null}
                                {filter === "event" ? "Time" : null}
                                {filter === "cardinal" ? "Cardinal" : null}
                            </div>
                            <div>{pollFilter.pollType === filter ? <FontAwesomeIcon icon={faCheckCircle} /> : null}</div>
                        </Dropdown.Item>
                    })}
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
                <Dropdown.Toggle variant="white" id="dropdown-basic">{pollFilter.discussion === null ? "Any Poll Progress" : pollFilter.discussion}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {["In progress", "Finished"].map(filter => {
                        return <Dropdown.Item className="cursor-pointer filterDropdown"
                            onClick={() => setPollFilter({ ...pollFilter, discussion: filter === pollFilter.discussion ? null : filter })}>
                            <div>{filter}</div>
                            <div>{pollFilter.discussion === filter ? <FontAwesomeIcon icon={faCheckCircle} /> : null}</div>
                        </Dropdown.Item>
                    })}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    </div>
}

export function DropDownFilterGroup({ filter, setFilter }) {
    return <div className="filters">
        <Dropdown>
            <Dropdown.Toggle variant="white" id="dropdown-basic">{filter.typeOfMember === null ? "Type of Member" : filter.typeOfMember}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {["Not Member", "Member", "Delegator", "Owner"].map(filterCategory => {
                    return <Dropdown.Item className="cursor-pointer filterDropdown"
                        onClick={() => setFilter({ ...filter, typeOfMember: filterCategory === filter.typeOfMember ? null : filterCategory })}>
                        <div>
                            {filterCategory === "Not Member" && "Not Member"}
                            {filterCategory === "Delegator" && "Delegate"}
                            {filterCategory === "Member" && "Member"}
                            {filterCategory === "Owner" && "Admin"}
                        </div>
                        <div>{filter.typeOfMember === filterCategory ? <FontAwesomeIcon icon={faCheckCircle} /> : null}</div>
                    </Dropdown.Item>
                })}
            </Dropdown.Menu>
        </Dropdown>
    </div>
}

export function SearchFilter({ filter, setFilter }) {
    return <SearchBox onSearch={e => setFilter({ ...filter, search: e })}></SearchBox>
}