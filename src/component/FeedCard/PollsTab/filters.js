import { Dropdown } from "react-bootstrap"

export default function Filters({pollFilter, setPollFilter}) {
    return <div>
        <Dropdown>
    <Dropdown.Toggle variant="white" id="dropdown-basic">Poll Type
        </Dropdown.Toggle>
        <Dropdown.Menu>
            {["Condorcet", "For/Against", "Time"].map(filter => {
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
 }