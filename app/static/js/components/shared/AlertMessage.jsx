// AlertMessage.jsx
export const AlertMessage = ({ type, message }) => {
    const bgColor = type === 'error' ? 'bg-red-500' : 
                   type === 'success' ? 'bg-green-500' : 
                   'bg-blue-500';
                   
    return (
        <div className={`fixed top-4 right-4 p-4 rounded-lg text-white ${bgColor}`}>
            {message}
        </div>
    );
};

// LoadingSpinner.jsx
export const LoadingSpinner = () => (
    <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
);