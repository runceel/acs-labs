# Azure Communication Service

このリポジトリは、Azure Communication Services を体験するためのラボになります。以下の 2 つのラボが含まれています。

## ラボ 01: Azure Communication Services を作成して体験をする

Azure Communication Services のリソースを Azure 上に作成してサンプル アプリケーションのデプロイを行います。
プログラミングなどは行わないため、Azure サブスクリプションがあれば実施可能です。

## ラボ 02: Azure Communication Services の UI ライブラリを使用したアプリを作る

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

## ラボ完了後

今回のラボで作成したサンプル アプリケーションは、クライアント サイドで Azure Communication Services のキー情報を保持しています。
本番利用のアプリケーションでは、キー情報はサーバー サイドで保持をしてユーザー ID やトークンの発行はサーバー サイドで行います。

認証で保護された API でのユーザー ID の生成やトークンの発行のサンプルが以下のサイトにあるので参考にしてください。
こちらのサンプルでは [Microsoft Graph API の拡張機能](https://learn.microsoft.com/ja-jp/graph/extensibility-overview)を使用して Azure Communication Services のユーザー ID を格納しています。

[信頼された認証サービスのヒーロー サンプルの使用を開始する](https://learn.microsoft.com/ja-jp/azure/communication-services/samples/trusted-auth-sample?pivots=programming-language-javascript)


