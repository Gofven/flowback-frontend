import { Dropdown } from "react-bootstrap"
import './filters.css'
import SearchBox from "../../Search/SearchBox";
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Filters({pollFilter, setPollFilter}) {
    return <div>
    <div className="filters">
        <Dropdown>
            <Dropdown.Toggle variant="white" id="dropdown-basic">Poll Type
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {["condorcet", "traffic", "event"].map(filter => {
                    return <Dropdown.Item className="cursor-pointer filterDropdown" 
                    onClick={() => setPollFilter({...pollFilter, pollType:filter===pollFilter.pollType ? null : filter})}
                    >
                        <div>
                        {filter==="condorcet" ? "Ranking" : null}
                        {filter==="traffic" ? "For/Against" : null}
                        {filter==="event" ? "Time" : null}
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
                    onClick={() => setPollFilter({...pollFilter, discussion:filter===pollFilter.discussion ? null : filter})}
                    >
                        <div>{filter}</div>
                        <div>{pollFilter.discussion === filter ? <FontAwesomeIcon icon={faCheckCircle} /> : null}</div>
                        </Dropdown.Item>
                })}
            </Dropdown.Menu>
        </Dropdown>
    </div>
    
    <SearchBox onSearch={e => setPollFilter({...pollFilter, search:e})}></SearchBox>
    
 </div>
 }