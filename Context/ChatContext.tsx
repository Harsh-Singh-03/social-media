// LoaderContext.js
"use client"
import React, { createContext, useContext, useState } from 'react';

const ChatContext: any = createContext();

export const ChatProvider = ({ children }: any) => {
  const [Message, setMessage] = useState([])
  const [inboxs, setInboxes] = useState([])
  const [isNext, setIsNext] = useState(false)
  const [searchString, setSearchString] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  return (
    <ChatContext.Provider value={{ searchString, setSearchString,setIsNext, isNext, setPage, page, setLoading, loading, setMessage, Message, setInboxes, inboxs }}> 
      {children}
    </ChatContext.Provider>
  );
};

export const useChatHook = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useCustomHook must be used within a LoaderProvider');
  }
  return context;
};
