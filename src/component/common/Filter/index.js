import { Dropdown } from "react-bootstrap"
import './filters.css'
import SearchBox from "../../Search/SearchBox";
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function DropDownPollFilter({ pollFilter, setPollFilter }) {
    return <div>
        <div className="filters">
            <Dropdown>
                <Dropdown.Toggle variant="white" id="dropdown-basic">Poll Type
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {["condorcet", "traffic", "event"].map(filter => {
                        return <Dropdown.Item className="cursor-pointer filterDropdown"
                            onClick={() => setPollFilter({ ...pollFilter, pollType: filter === pollFilter.pollType ? null : filter })}>
                            <div>
                                {filter === "condorcet" ? "Ranking" : null}
                                {filter === "traffic" ? "For/Against" : null}
                                {filter === "event" ? "Time" : null}
                            </div>
                            <div>{pollFilter.pollType === filter ? <FontAwesomeIcon icon={faCheckCircle} /> : null}</div>
                        </Dropdown.Item>
                    })}
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
                <Dropdown.Toggle variant="white" id="dropdown-basic">Poll Progress
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
            <Dropdown.Toggle variant="white" id="dropdown-basic">Type of Member
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {["", "Member", "Delegator", "Owner"].map(filterCategory => {
                    return <Dropdown.Item className="cursor-pointer filterDropdown"
                        onClick={() => setFilter({ ...filter, typeOfMember: filterCategory === filter.typeOfMember ? null : filterCategory })}>
                        <div>
                            {filterCategory === "" && "Not member"}
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