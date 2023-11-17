// LoaderContext.js
"use client"
import React, { createContext, useContext, useState } from 'react';

const LoaderContext: any = createContext();

export const LoaderProvider = ({ children }: any) => {
  const [loaderActive, setLoaderActive] = useState(false);
  const [isNewThread, setIsNewThread] = useState(false);
  const [ThreadFeed, setThreadFeed] = useState({Data: [], isNext: true, Page: 1});

  const showLoader = () => setLoaderActive(true);
  const hideLoader = () => setLoaderActive(false);

  return (
    <LoaderContext.Provider value={{ setIsNewThread, isNewThread, loaderActive, showLoader, hideLoader, setThreadFeed, ThreadFeed}}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useCustomHook = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useCustomHook must be used within a LoaderProvider');
  }
  return context;
};
