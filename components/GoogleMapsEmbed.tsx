// GoogleMapsEmbed.tsx
interface GoogleMapsEmbedProps {
    /** Latitude coordinate for the map center */
    latitude?: number;
    /** Longitude coordinate for the map center */
    longitude?: number;
    /** Title displayed above the map */
    title?: string;
    /** Width of the map container */
    width?: number | string;
    /** Height of the map container */
    height?: number | string;
    /** Zoom level of the map (1-20) */
    zoom?: number;
    /** Custom CSS class name for the container */
    className?: string;
    /** Custom CSS styles for the container */
    style?: React.CSSProperties;
}

export const GoogleMapsEmbed: React.FC<GoogleMapsEmbedProps> = ({
    latitude = 18.3170581,
    longitude = 99.3986862,
    title = "Location Map",
    width = "100%",
    height = 400,
    zoom = 15,
    className,
    style
}) => {
    const containerStyles: React.CSSProperties = {
        maxWidth: '100%',
        padding: '0px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        ...style
    };

    const titleStyles: React.CSSProperties = {
        fontSize: '1.5rem',
        fontWeight: 600,
        marginBottom: '16px',
        color: '#333'
    };

    const mapContainerStyles: React.CSSProperties = {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: '4px'
    };

    const iframeStyles: React.CSSProperties = {
        border: 0,
        borderRadius: '4px'
    };

    const embedUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f${zoom}.1!5e0!3m2!1sen!2sus!4v1730678177786!5m2!1sen!2sus`;

    return (
        <div style={containerStyles} className={className}>
            <div style={mapContainerStyles}>
                <iframe
                    src={embedUrl}
                    width={width}
                    height={height}
                    style={iframeStyles}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps"
                />
            </div>
        </div>
    );
};

// Types for reusable map configurations
export interface MapConfig {
    latitude: number;
    longitude: number;
    zoom?: number;
    title?: string;
}

