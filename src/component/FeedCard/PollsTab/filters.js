import { Dropdown } from "react-bootstrap"
import './filters.css'
import SearchBox from "../../Search/SearchBox";

export default function Filters({pollFilter, setPollFilter}) {
    return <div>
    <div className="filters">
        <Dropdown>
            <Dropdown.Toggle variant="white" id="dropdown-basic">Poll Type
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {["condorcet", "traffic", "event"].map(filter => {
                    return <Dropdown.Item className="cursor-pointer" 
                    onClick={() => setPollFilter({...pollFilter, pollType:filter})}
                    >
                        {filter}
                        </Dropdown.Item>
                })}
            </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
            <Dropdown.Toggle variant="white" id="dropdown-basic">Poll Progress
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {["In Progress", "Finished"].map(filter => {
                    return <Dropdown.Item className="cursor-pointer" 
                    onClick={() => setPollFilter({...pollFilter, discussion:filter})}
                    >
                        {filter}
                        </Dropdown.Item>
                })}
            </Dropdown.Menu>
        </Dropdown>
    </div>
    
    <SearchBox onSearch={e => setPollFilter({...pollFilter, search:e})}></SearchBox>
    
 </div>
 }