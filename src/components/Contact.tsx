import React from 'react';
import ContactList from './ContactList';
import PageWrap from './common/PageWrap';

export default function Contact() {
  return (
    <PageWrap title="Contact">
      <ContactList />
    </PageWrap>
  );
}
