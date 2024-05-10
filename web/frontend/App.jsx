import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import PublicContextProvider from './context/PublicContext';
import { Provider } from '@shopify/app-bridge-react';


import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const { t } = useTranslation();

  const config = {
    // The client ID provided for your application in the Partner Dashboard.
    apiKey: "c72a0325616e0295b9210ee2860c197c",
    // The host of the specific shop that's embedding your app. This value is provided by Shopify as a URL query parameter that's appended to your application URL when your app is loaded inside the Shopify admin.
    host: new URLSearchParams(location.search).get("host"),
    forceRedirect: true
  };

  return (
    <PolarisProvider>

      <BrowserRouter>
        <AppBridgeProvider >
        <Provider config={config}>

          <QueryProvider>
              <NavigationMenu
                navigationLinks={[
                  {
                    label: t("NavigationMenu.pageName"),
                    destination: "/pagename",
                  },
                ]}
              />

            <PublicContextProvider>
              <Routes pages={pages} />
            </PublicContextProvider>
          </QueryProvider>
          </Provider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
