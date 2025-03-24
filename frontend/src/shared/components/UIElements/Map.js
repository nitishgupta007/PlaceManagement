import React, { useRef } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import './Map.css';

const MapView = props => {

    return <div className={`map ${props.className}`} style={props.style}>
        <APIProvider
            solutionChannel='GMP_devsite_samples_v3_rgmbasicmap'
            apiKey="AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao">
            <Map
                defaultZoom={8}
                defaultCenter={props.lagLat}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            />
        </APIProvider>
    </div>
};

export default MapView;