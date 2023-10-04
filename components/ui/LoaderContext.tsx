// LoaderContext.js
"use client"
import React, { createContext, useContext, useState } from 'react';

const LoaderContext: any = createContext();

export const LoaderProvider = ({ children }: any) => {
  const [loaderActive, setLoaderActive] = useState(false);

  const showLoader = () => setLoaderActive(true);
  const hideLoader = () => setLoaderActive(false);

  return (
    <LoaderContext.Provider value={{ loaderActive, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};