import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  const [users, setUsers] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await sendRequest('http://localhost:5000/api/users');
        setUsers(response.users);
      } catch (err) {
      }
    };

    fetchUsers();
  }, [sendRequest]);

  return <>
    <ErrorModal error={error} onClear={clearError} />
    {isLoading &&
      <div className='center'>
        <LoadingSpinner asOverlay />
      </div>
    }
    {users && users.length ?<UsersList items={users} /> : ''};
  </ >
};

export default Users;
