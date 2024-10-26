import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const AlertMessage = ({ type = 'error', message, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

    return (
        <div className={`fixed top-4 right-4 p-4 rounded-lg text-white ${bgColor} flex items-center gap-2`}>
            <span>{message}</span>
            <button onClick={() => setIsVisible(false)} className="ml-2">
                <X size={16} />
            </button>
        </div>
    );
};

export default AlertMessage;