import React, { createContext, useContext, useEffect, useState } from 'react';
import { cmsApi } from '../services/api';

export interface CompanyInfo {
  id?: string;
  companyName: string;
  tagline?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  iconUrl?: string | null;
  primaryPhone: string;
  secondaryPhone?: string | null;
  primaryEmail: string;
  supportEmail?: string | null;
  address: string;
  city: string;
  country: string;
  businessHours?: string | null;
  facebookUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  updatedAt?: string;
}

const defaultCompanyInfo: CompanyInfo = {
  companyName: 'BaytBD Group of Companies',
  tagline: 'One Group. Three Businesses. One Digital Ecosystem.',
  description: 'Building national infrastructure in ethical agriculture, premier real estate, and enterprise software.',
  primaryPhone: '+880 1800-BAYTBD',
  secondaryPhone: '+880 2 8878901',
  primaryEmail: 'info@baytbd.com',
  supportEmail: 'support@baytbd.com',
  address: 'Bayt Tower, Level 14, Road 71, Gulshan-2, Dhaka-1212, Bangladesh',
  city: 'Dhaka',
  country: 'Bangladesh',
  businessHours: 'Sun - Thu: 9:00 AM - 6:00 PM',
  facebookUrl: 'https://facebook.com',
  linkedinUrl: 'https://linkedin.com',
  twitterUrl: 'https://x.com',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
};

interface CompanyContextType {
  companyInfo: CompanyInfo;
  loading: boolean;
  refreshCompanyInfo: () => Promise<void>;
  refreshCompany: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType>({
  companyInfo: defaultCompanyInfo,
  loading: false,
  refreshCompanyInfo: async () => {},
  refreshCompany: async () => {},
});

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(defaultCompanyInfo);
  const [loading, setLoading] = useState(true);

  const fetchCompanyInfo = async () => {
    try {
      const res = await cmsApi.getCompanyInfo();
      if (res.success && res.companyInfo) {
        setCompanyInfo(res.companyInfo);
      }
    } catch (err) {
      console.error('Failed to load company information:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  // Dynamically update browser tab favicon with company's uploaded icon/logo
  useEffect(() => {
    const iconToUse = companyInfo?.iconUrl || companyInfo?.logoUrl;
    if (iconToUse) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = iconToUse;
    }
  }, [companyInfo?.iconUrl, companyInfo?.logoUrl]);

  return (
    <CompanyContext.Provider
      value={{
        companyInfo,
        loading,
        refreshCompanyInfo: fetchCompanyInfo,
        refreshCompany: fetchCompanyInfo,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);

export default CompanyContext;
