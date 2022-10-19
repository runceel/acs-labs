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
> `FluentThemeProvider` は fluent-ui のコンポーネントのテーマを決めるためのコンポーネントです。ここでは上記コードではデフォルト値を使用しているためライトテーマになります。パラメーターに `fluentTheme={darkTheme}` を指定することでダークテーマにすることも可能です。

> **Note**
> `LocalizationProvider` は Azure Communication Services の UI ライブラリの表示言語を切り替えるためのコンポーネントです。上記のコードのように `locale={COMPONENT_LOCALE_JA_JP}' を指定することで日本語表示にすることが出来ます。指定しない場合は英語表記になります。



## メモ

memo ダウングレードの方法
    https://qiita.com/kabosu3d/items/674e287dd068322ca7cf

memo インストールするライブラリ
    "@azure/communication-calling": "^1.4.4", x
    "@azure/communication-chat": "^1.2.0", x
    "@azure/communication-common": "^2.1.0",
    "@azure/communication-identity": "^1.1.0",
    "@azure/communication-react": "^1.3.1", x
    "@fluentui/react": "^8.97.2",
