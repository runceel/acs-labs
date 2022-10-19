# ラボ 02: Azure Communication Services の UI ライブラリを使用したアプリを作る

Azure Communication Services の UI ライブラリを使用して通話やチャットが出来るアプリケーションの作成を行います。

このハンズオンを実施するには以下の環境が必用になります。

- Node.js v16(LTS)
  - https://nodejs.org/ja/
- Visual Studio Code
  - https://azure.microsoft.com/ja-jp/products/visual-studio-code/
  - Visual Studio Code 以外のエディターでも実施可能ですが、適宜読み替えを行ってください。
- Azure サブスクリプション
  - Azure Communication Services を作成していること
  - ラボ 01 から実施している場合はラボ 01 で作成した Azure Communication Services をそのまま利用してください

## React のプロジェクトの作成と動作確認

1. コマンドプロンプトや PowerShell などを開いて作業用のフォルダーに移動します。ここでは `c:\labs` というフォルダーを使用します。それ以外のフォルダーを使用する場合は適宜読み替えを行ってください。
2. 以下のコマンドを実行して React のアプリケーションを作成します。
   
   ```
   npx create-react-app acs-sample-app --template typescript
   ```
3. 作成が完了したら以下コマンドを実行してアプリケーションのフォルダーに移動して Visual Studio Code でフォルダーを開きます。code にパスが通っていない場合は Visual Studio Code を起動して `c:\labs\asc-sample-app` フォルダーを開いてください。
   
   ```
   cd acs-sample-app
   code .
   ```
4. Visual Studio Code のターミナルで `npm start` を実行して以下のように React のアプリケーションがブラウザーで開かれることを確認してください。
   
   ![](images/2022-10-18-17-58-42.png)

   画面が表示されたら Visual Studio Code のターミナルで Ctrl + C を押して開発サーバーを停止してください。

## React のバージョンを 17 にダウングレードする

このハンズオン ラボで使用する Azure Communication Services の UI ライブラリは 2022/10/18 時点では最新の React v18 には対応していません。create-react-app コマンドで作成されるアプリケーションは v18 が利用されているため v17 にダウングレードをする必要があります。この問題は以下の GitHub の Issue で管理されています。次のバージョンの UI ライブラリで React v18 でも利用可能になる予定です。

[Support React 18](https://github.com/Azure/communication-ui-library/issues/1900)

1. 以下のコマンドを実行して依存関係を v17 のものに変更します。
   ```
   npm install --save react@17.0.2 react-dom@17.0.2 @testing-library/react@12.1.5
   ```
2. src/index.tsx を開き以下の内容で置き換えて保存します。
   ```ts
   import React from "react";
   import ReactDOM from "react-dom";
   import "./index.css";
   import App from "./App";
   import reportWebVitals from "./reportWebVitals";
   
   ReactDOM.render(
     <React.StrictMode>
       <App />
     </React.StrictMode>,
     document.getElementById("root")
   );
   
   // If you want to start measuring performance in your app, pass a function
   // to log results (for example: reportWebVitals(console.log))
   // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
   reportWebVitals();
   ```
3. `npm start` を実行してビルド エラーが発生せずに React のアプリが起動することを確認してください。

以上で React v17 へのダウングレードの手順は終了です。

## Azure Communication Services のライブラリの追加

1. 以下のコマンドを実行してライブラリをプロジェクトに追加してください。1行ずつ実行をおこないエラーが発生していないことを確認しながら実行をしてください。警告はいくつか発生しますがエラーが発生していなければ大丈夫です。
   ```
   npm install @azure/communication-react --legacy-peer-deps
   npm install @azure/communication-calling@1.4.4 --legacy-peer-deps
   npm install @azure/communication-chat@1.2.0 --legacy-peer-deps
   npm install @azure/communication-identity --legacy-peer-deps
   ```
   
   参考: 問題ない場合の出力例
   ```
   > npm install @azure/communication-react --legacy-peer-deps
   npm WARN config global `--global`, `--local` are deprecated. Use `--location=global` instead.
   npm WARN deprecated uuid@3.4.0: Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.  
   
   added 116 packages, and audited 1546 packages in 41s
   
   217 packages are looking for funding
     run `npm fund` for details
   
   6 high severity vulnerabilities
   
   To address all issues (including breaking changes), run:
     npm audit fix --force
   
   Run `npm audit` for details.
   ```


## 会議へ参加するための情報の作成画面を作る

今回作成するアプリケーションは、Azure Communication Services のユーザー ID の作成やトークンの取得、チャットスレッドの作成から参加者の追加までをクライアント サイドで制御を行うアプリケーションになります。

チャット付きの会議に参加するための UI として `CallWithChatComposite` というコンポーネントを使用します。このコンポーネントは `AzureCommunicationCallWithChatAdapterArgs` という以下のように定義されている型を使って会議に参加して通話したりチャットをしたりすることが出来る完全な UI を持ったコンポーネントになります。

```ts
export declare type AzureCommunicationCallWithChatAdapterArgs = {
    endpoint: string;
    userId: CommunicationUserIdentifier;
    displayName: string;
    credential: CommunicationTokenCredential;
    locator: CallAndChatLocator | TeamsMeetingLinkLocator;
};
```

### 全体の大枠を作成する

まず `AzureCommunicationCallWithChatAdapterArgs` を作るために必用な情報を設定するための画面と通話を行うための画面を出しわける大枠を src/App.tsx に作成します。

src/App.tsx を開いて内容を以下のように変更します。

```ts
import { useState } from 'react';
import './App.css';
import {
  AzureCommunicationCallWithChatAdapterArgs,
  COMPONENT_LOCALE_JA_JP,
  darkTheme,
  FluentThemeProvider,
  LocalizationProvider
} from '@azure/communication-react';

function App() {
  const [callWithCahtAdapterArgs, setCallWithChatAdapterArgs] = useState<AzureCommunicationCallWithChatAdapterArgs>();

  const callWithChat = () => {
    return <div>ここに CallWithChatComposite を使った画面を定義する</div>;
  }

  const setup = () => {
    return <div>ここに AzureCommunicationCallWithChatAdapterArgs を作るための情報を入力する画面を定義する</div>;
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
```

画面いっぱいにコンテンツを表示するために src/App.css を開いて以下の内容に変更します。

```css
.content {
  width: 100vw;
  height: 100vh;
}
```

`AzureCommunicationCallWithChatAdapterArgs` の有無で表示画面を変更しています。

> **Note**
> 
> `FluentThemeProvider` は fluent-ui のコンポーネントのテーマを決めるためのコンポーネントです。ここでは上記コードではデフォルト値を使用しているためライトテーマになります。パラメーターに `fluentTheme={darkTheme}` を指定することでダークテーマにすることも可能です。

> **Note**
> 
> `LocalizationProvider` は Azure Communication Services の UI ライブラリの表示言語を切り替えるためのコンポーネントです。上記のコードのように `locale={COMPONENT_LOCALE_JA_JP}' を指定することで日本語表示にすることが出来ます。指定しない場合は英語表記になります。

`npm start` をして画面を表示すると以下のようになります。

![](images/2022-10-19-14-45-19.png)

### Azure Communication Services のキーの設定

Azure Communication Services にアクセスするために必要なキーの情報をポータルから取得します。Azure ポータルの Azure Communication Services のリソースのキーを開いてエンドポイントと接続文字列をコピーします。

![](images/2022-10-19-17-22-36.png)

.env.local というファイルをアプリのルートフォルダー (ここの手順と同じパスに作成している場合は c:\labs\acs-sample-app) に作成して以下の内容に編集してください。

```
REACT_APP_ACS_ENDPOINT=先ほどコピーしたエンドポイントの値
REACT_APP_ACS_CONNECTION_STRING=先ほどコピーした接続文字列の値
```

### 会議へ参加するための情報を入力するためのコンポーネントの定義

src/components/AcsSetup.tsx というファイルと src/components/AcsSetup.css というファイルを作成します。

#### ユーザー ID とアクセス トークンの取得

まず、Azure Communication Services のユーザー ID とアクセス トークンを取得する処理を作成します。

ユーザー ID とトークンを取得するには `CommunicationIdentityClient` クラスを Azure Communication Services の接続文字列を使って作成を行い `createUserAndToken` メソッドを使うことで行えます。引数には `['chat', 'voip']` のようにスコープを指定します。

src/components/AcsSetup.tsx を開いて以下のように変更します。

```tsx
import { CommunicationIdentityClient } from "@azure/communication-identity";
import { AzureCommunicationCallWithChatAdapterArgs } from "@azure/communication-react";
import { useEffect, useState } from "react";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import "./AcsSetup.css";

type AcsSetupProperties = {
    // この画面で作成した AzureCommunicationCallWithChatAdapterArgs を渡すためのコールバック
    setCallWithChatAdapterArgs: (arg: AzureCommunicationCallWithChatAdapterArgs) => void,
}

function AcsSetup({ setCallWithChatAdapterArgs }: AcsSetupProperties) {
    const {
        userId,
        token,
    } = useAcsSetup();

    return (
        <div className="container">
            <h3>Azure Communication Services の情報設定</h3>
            <label>ユーザー ID</label>
            <span className="wrap-text">{userId ?? 'ユーザー ID を取得中'}</span>
            <label>トークン</label>
            <span className="wrap-text">{token ?? 'トークンを取得中'}</span>
        </div>
    );
}

function useAcsSetup() {
    // ユーザー ID とトークン
    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('');
    // 後で使用するクレデンシャル
    const [credential, setCredential] = useState<AzureCommunicationTokenCredential>();

    useEffect(() => {
        // ユーザー ID とトークンの取得
        (async () => {
            const client = new CommunicationIdentityClient(process.env.REACT_APP_ACS_CONNECTION_STRING!);
            const { user: { communicationUserId }, token } = await client.createUserAndToken(['chat', 'voip']);
            setUserId(communicationUserId);
            setToken(token);
            setCredential(new AzureCommunicationTokenCredential(token));
        })();
    }, []);

    return {
        userId,
        token,
    };
}

export default AcsSetup;
```

src/components/AcsSetup.css を開いて以下のように変更します。

```css
.container {
    min-height: 100vh;
    max-width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.container > form {
    flex: 1;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    align-items: center;
    width: 90vw;
}

.container label {
    display: block;
    font-weight: bold;
}

.container .wrap-text {
    overflow-wrap: break-word;
    max-width: 100%;
}
```

そして src/App.tsx を開いて 18 行目にある setup の定義を変更して作成した AcsSetup コンポーネントを表示するように変更します。

```tsx
  const setup = () => {
    return <AcsSetup setCallWithChatAdapterArgs={setCallWithChatAdapterArgs} />;
  }
```

この状態で実行すると、以下のように Azure Communication Service のユーザー ID とトークンが取得され画面に表示されます。

![](images/2022-10-19-18-19-47.png)

#### グループ通話の作成

#### 既存のグループ通話の情報の設定

#### Teams 会議情報の設定


### 会議への参加 UI の作成

### 動作確認

#### グループ通話の動作確認


#### Teams 会議への参加の動作確認 (オプション)
