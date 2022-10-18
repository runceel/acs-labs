# ラボ 01: Azure Communication Services を作成して体験をする

ここでは、Azure ポータルで Azure Communication Services のリソースを作成してサンプル アプリケーションをデプロイして Azure Communication Services の機能を体験します。

## Azure Communication Services のリソースの作成

1. [Azure ポータル](https://portal.azure.com) を開いてサインインを行います。
2. Azure ポータルの「リソースの作成」を選択します。
   
   ![](images/2022-10-18-14-00-52.png)
3. 検索ボックスに Communication と入力して、選択肢に出てくる Communication Services を選択します。
   
   ![](images/2022-10-18-14-02-20.png)
4. Communication Services の作成画面に移動するので「作成」を選択します。

   ![](images/2022-10-18-14-04-02.png)
5. 以下のように各種パラメーターを入力して「レビューと作成」を選択します。
   - サブスクリプション: デプロイ先のサブスクリプションを選択
   - リソース グループ: 任意の名前で新規作成
   - リソース グループの位置情報: (Asia Pacific) Japan East
   - リソース名: 任意の名前 (グローバルで一意である必要があります)
   - データの場所: Japan

     ![](images/2022-10-18-14-07-34.png)
6. 入力内容の確認画面になるので内容を確認して「作成」を選択します。2 分程度でデプロイが完了します。
   
   ![](images/2022-10-18-14-18-05.png)
7. デプロイの完了後に「リソースに移動」を選択してリソースを開きます。

   ![](images/2022-10-18-14-28-44.png)
8. 「サンプル アプリケーション」を選択してWeb 用グループ通話ヒーローのサンプルの「展開」ボタンを選択します。

   ![](images/2022-10-18-14-51-43.png)
9. 以下の内容を入力して「確認と作成」を選択します。
   - サブスクリプション: Azure Communication Services をデプロイしたサブスクリプションが選択されていることを確認
   - リソース グループ: Azure Communication Services をデプロイしたリソース グループが選択されていることを確認
   - リージョン: Azure Communication Services をデプロイしたリソース グループのリージョンが選択されていることを確認
   - App Name: 任意の名前を入力 (グローバルで一意の名前にする必用があります)
   - Sku: F1 になっていることを確認

     ![](images/2022-10-18-14-54-35.png)
10. 