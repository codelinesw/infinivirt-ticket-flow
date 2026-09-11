// TicketDetailWrapper.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TicketDetail } from '../ticket-detail/TicketDetail';

export const TicketDetailWrapper: React.FC<any> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate('/tickets');
    return null;
  }

  return (
    <TicketDetail
      ticketId={id}
      onBack={() => navigate('/tickets')}
    />
  );
};