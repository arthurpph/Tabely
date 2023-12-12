import { useEffect } from "react";
import '../assets/styles/Notification.css';

interface NotificationProps {
    text: string;
    showNotification: boolean;
    setShowNotification: any;
}

function Notification(props: NotificationProps) {
    const { text, showNotification, setShowNotification } = props;

    useEffect(() => {
        if(showNotification) {
            setTimeout(() => {
                setShowNotification(!showNotification);
            }, 2000);
        }
    }, [showNotification])

    return (
        <div style={{ display: showNotification ? 'block' : 'none' }} className={`notification-div`}>
            {text}
        </div>
    );
}

export default Notification;