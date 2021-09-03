import React from 'react';

function ComingSoon(props) {
    return (
        <div style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            // opacity: '0.6',
            boxSizing: 'border-box'
        }}>
            <img src='/img/coming-soon.jpg' alt='coming soon' />
        </div>
    );
}

export default ComingSoon;