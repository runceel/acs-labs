import { useState } from 'react';
import './App.css';
import {
  AzureCommunicationCallWithChatAdapterArgs,
  CallWithChatComposite,
  COMPONENT_LOCALE_JA_JP,
  FluentThemeProvider,
  LocalizationProvider,
  useAzureCommunicationCallWithChatAdapter
} from '@azure/communication-react';
import AcsSetup from './components/AcsSetup';

function App() {
  const [callWithCahtAdapterArgs, setCallWithChatAdapterArgs] = useState<AzureCommunicationCallWithChatAdapterArgs>();

  const adapter = useAzureCommunicationCallWithChatAdapter(callWithCahtAdapterArgs ?? {});
  const callWithChat = () => {
    if (!!adapter) {
      return <CallWithChatComposite adapter={adapter} />;
    }
    return <h3>初期化中...</h3>;
  }

  const setup = () => {
    return <AcsSetup setCallWithChatAdapterArgs={setCallWithChatAdapterArgs} />;
  }

  return (
    <div className="content">
      <FluentThemeProvider>
        <LocalizationProvider locale={COMPONENT_LOCALE_JA_JP}>
          {!!callWithCahtAdapterArgs ? callWithChat() : setup()}
        </LocalizationProvider>
      </FluentThemeProvider>
    </div>
  );
}

export default App;
