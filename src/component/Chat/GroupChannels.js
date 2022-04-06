import GroupChannel from './GroupChannel';
import { useState, useEffect } from 'react';
import './index.css';
import { postRequest } from '../../utils/API';
import Loader from '../common/Loader/Loader';
const { REACT_APP_PROXY } = process.env

export default function GroupChannels() {
  const [groupId, setgroupId] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [loading, setLoading] = useState(false);

  const changeChat = (e) => {
    setgroupId(e);
  };

  const getGroups = () => {
    setLoading(true);
    postRequest('api/v1/user_group/all_group').then((response) => {
      setLoading(false);
      console.log('response', response);
      if (response) {
        const { status, data } = response;
        setGroupList(data.data);
      }
    });
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <Loader loading={loading}>
      <div className="group-chats row">
        <div className="group-chat-buttons col-2">
          {groupList.map((group) =>
            <>
              {group.user_type !== "" && <img
                className="group-chat-image"
                key={group.id}
                src={group.image ? group.image : "/img/no-photo.jpg"}
                onClick={() => changeChat(group.id)}
              />}
            </>
          )}
        </div>
        {groupId && <GroupChannel groupId={groupId} />}
      </div>
    </Loader>
  );
}
