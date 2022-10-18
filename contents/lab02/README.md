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

1. 以下のコマンドを実行して

memo ダウングレードの方法
    https://qiita.com/kabosu3d/items/674e287dd068322ca7cf

memo インストールするライブラリ
    "@azure/communication-calling": "^1.4.4",
    "@azure/communication-chat": "^1.2.0",
    "@azure/communication-common": "^2.1.0",
    "@azure/communication-identity": "^1.1.0",
    "@azure/communication-react": "^1.3.1",
    "@fluentui/react": "^8.97.2",
