import { useState, useEffect } from 'react';

const Modal = ({ isOpen, title, message, confirmText = "Confirm", onConfirm, onCancel, confirmButtonClass = "btn-primary" }) => {
    const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);

	// Make confirm button available after 3 seconds
    useEffect(() => {
        if (isOpen) {
            setIsConfirmEnabled(false);
            const timer = setTimeout(() => {
                setIsConfirmEnabled(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">{message}</p>
                <div className="modal-action flex justify-between">
                    <div>
                        <button
                            className="btn"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                    <div>
                        <button
                            className={`btn ${confirmButtonClass} ${!isConfirmEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={onConfirm}
                            disabled={!isConfirmEnabled}
                        >
                            {isConfirmEnabled ? confirmText : '...'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;