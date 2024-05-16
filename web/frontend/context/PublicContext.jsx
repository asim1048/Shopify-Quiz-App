import { createContext,useEffect, useState } from 'react';
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';

export const PublicContext = createContext(null);

const PublicContextProvider = ({ children }) => {
    let fetch = useAuthenticatedFetch();

    const [storeinfo, setStoreInfo] = useState({});
    const [quizes, setQuizes] = useState([]);
    const [backendURL, setBackendUrl] = useState('');
    const [singleQuizDetail, setSingleQuizDetail] = useState({});

    useEffect(() => {
        const fetchStoreInfo = async () => {
          try {
            const request = await fetch("/api/store/info");
            const response = await request.json();
            setStoreInfo(response?.data[0]);
            fetchQuizes(response?.data[0]?.id)
    
          } catch (error) {
            console.error(error);
          }
        };
        const fetchQuizes = async (id) => {
          try {
            const request = await fetch("/api/quiz/shopQuizes", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json' // Specify JSON content type
              },
              body: JSON.stringify({
                shopID: id // Pass shopID directly in the request body
              })
            });
    
            const response = await request.json();
            setQuizes(response?.data);
          } catch (error) {
            console.error(error);
          }
        }
        const getHostURL = async (id) => {
          try {
            const request = await fetch("/api/quiz/getHost", {
              method: 'GET',
            });
    
            const response = await request.json();
            setBackendUrl(response?.data);
          } catch (error) {
            console.error(error);
          }
        }
        
        fetchStoreInfo()
        getHostURL()
      }, []);
    

    return (
        <PublicContext.Provider value={{
            quizes,
            setQuizes,
            singleQuizDetail,
            setSingleQuizDetail,
            backendURL
        }}>
            {children}
        </PublicContext.Provider>
    )
}
export default PublicContextProvider;
