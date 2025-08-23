import { useState, useEffect, useCallback } from 'react';

interface Version {
  id: string;
  htmlContent: string;
  cssContent?: string; // Optional, if CSS is extracted separately
  jsContent?: string; // Optional, if JS is extracted separately
  timestamp: number;
  description?: string;
}

const LOCAL_STORAGE_KEY = 'ui_version_history';
const MAX_VERSIONS = 10; // Limit the number of versions to store

export const useVersionHistory = () => {
  const [versions, setVersions] = useState<Version[]>([]);

  useEffect(() => {
    try {
      const storedVersions = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedVersions) {
        setVersions(JSON.parse(storedVersions));
      }
    } catch (error) {
      console.error("Failed to load versions from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(versions));
    } catch (error) {
      console.error("Failed to save versions to localStorage", error);
    }
  }, [versions]);

  const addVersion = useCallback((htmlContent: string, description?: string, cssContent?: string, jsContent?: string) => {
    setVersions((prevVersions) => {
      const newVersion: Version = {
        id: Date.now().toString(), // Simple timestamp as ID
        htmlContent,
        cssContent,
        jsContent,
        timestamp: Date.now(),
        description,
      };
      const updatedVersions = [newVersion, ...prevVersions];
      // Enforce MAX_VERSIONS limit
      if (updatedVersions.length > MAX_VERSIONS) {
        updatedVersions.pop(); // Remove the oldest version
      }
      return updatedVersions;
    });
  }, []);

  const getVersions = useCallback(() => versions, [versions]);

  const getVersion = useCallback((id: string) => {
    return versions.find((version) => version.id === id);
  }, [versions]);

  const deleteVersion = useCallback((id: string) => {
    setVersions((prevVersions) => prevVersions.filter((version) => version.id !== id));
  }, []);

  return { addVersion, getVersions, getVersion, deleteVersion };
};