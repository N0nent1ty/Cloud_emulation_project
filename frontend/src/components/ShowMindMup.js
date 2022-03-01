import React from 'react';
function iframe() {
    return {
        __html: '<iframe src="./mindmup.html" width="540" height="450"></iframe>'
    }
}


export default function ShowMindMup() {
    return (
        <div>
            <div dangerouslySetInnerHTML={iframe()} />
        </div>)
}