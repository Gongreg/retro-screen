import React from 'react';
import Alert from 'react-bootstrap/lib/Alert';

export default React.createClass({

    displayName: 'Main',

    render() {
        return (
            <Alert bsStyle="warning">
                <strong>Oh snap!</strong> Work in progress.
            </Alert>
        );
    },
});

