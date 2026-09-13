import { useEffect } from 'react';
import { useCompany } from '../context/CompanyContext';

export function usePageTitle(title?: string) {
  const { companyInfo } = useCompany();
  const brand = companyInfo?.companyName || 'BaytBD Group';

  useEffect(() => {
    if (title) {
      document.title = `${title} | ${brand}`;
    } else {
      document.title = `${brand} - Corporate, Agro, Development & IT`;
    }
  }, [title, brand]);
}
