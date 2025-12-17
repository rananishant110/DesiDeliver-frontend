import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';
import CreateTicketForm from './CreateTicketForm';

const TicketsPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<TicketList />} />
      <Route path="new" element={<CreateTicketForm />} />
      <Route path=":ticketId" element={<TicketDetail />} />
    </Routes>
  );
};

export default TicketsPage;
