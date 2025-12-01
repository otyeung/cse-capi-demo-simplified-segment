// Modal.tsx

// Import the React library
import React from 'react'

// Define the properties expected by the Modal component
interface ModalProps {
  isOpen: boolean // Indicates whether the modal is open or not
  onClose: () => void // Callback function to close the modal
  message: string | null // Message to be displayed in the modal (nullable)
}

// Functional component definition for Modal
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message }) => {
  // If the modal is not open or no message is provided, return null (no rendering)
  if (!isOpen || message === null) {
    return null
  }

  // Render the Modal with the provided message and a Close button
  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <pre>{message}</pre> {/* Display message as formatted JSON */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

// Export the Modal component as the default export
export default Modal
