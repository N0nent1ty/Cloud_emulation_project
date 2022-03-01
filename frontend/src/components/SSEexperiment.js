import React, { Component } from 'react';
import { useState, useEffect } from 'react';



const useEventSource = (url) => {
    const [data, updateData] = useState(null);
    useEffect(() => {
        const source = new EventSource(url);
        source.onmessage = function logEvents(event) {
            updateData(JSON.parse(event.data));
        }
    }, []);

    return data
}


function SSEexperiment() {
    const data = useEventSource('http://127.0.0.1:4000/stream');
    if (!data) {
        return (<div > didn't recived data</div>);
    }
    return (<div>Recive the data: {data}</div>);
}

export default SSEexperiment;