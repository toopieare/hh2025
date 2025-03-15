import React, { useState } from 'react';
import Button from './Button';

const ResponseConfirmation = ({ response, onConfirm, onEdit }) => {
  const [editedResponse, setEditedResponse] = useState(response);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleChange = (e) => {
    setEditedResponse(e.target.value);
  };
  
  const handleConfirm = () => {
    onConfirm(isEditing ? editedResponse : response);
  };
  
  const handleCancel = () => {
    setEditedResponse(response);
    setIsEditing(false);
  };
  
  return (
    <div className="response-confirmation">
      <div className="response-content">
        {isEditing ? (
          <textarea 
            className="response-edit"
            value={editedResponse}
            onChange={handleChange}
            rows={4}
          />
        ) : (
          <div className="response-text">{response}</div>
        )}
      </div>
      
      <div className="response-actions">
        {isEditing ? (
          <>
            <Button onClick={handleCancel} className="secondary">
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleEdit} className="secondary">
              Edit Response
            </Button>
            <Button onClick={handleConfirm}>
              Confirm & Continue
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResponseConfirmation;