import React from 'react';
import { Redirect , Route } from 'react-router-dom';

const PrivateRoute = ({isAllowed , redirectTo , ...props}) => {
    return isAllowed ? 
        <Route {...props} />
        : <Redirect to={redirectTo} />;
};

export default PrivateRoute;