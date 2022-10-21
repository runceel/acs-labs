import { CommunicationIdentityClient } from "@azure/communication-identity";
import { AzureCommunicationCallWithChatAdapterArgs, CallAndChatLocator, fromFlatCommunicationIdentifier } from "@azure/communication-react";
import { FormEvent, useEffect, useState } from "react";
import { CommunicationUserIdentifier, AzureCommunicationTokenCredential } from "@azure/communication-common";
import "./AcsSetup.css";
import { DefaultButton, PrimaryButton, TextField } from "@fluentui/react";
import { v4 as uuidv4 } from 'uuid';
import { ChatClient } from "@azure/communication-chat";
import { TeamsMeetingLinkLocator } from "@azure/communication-calling";

type AcsSetupProperties = {
    // この画面で作成した AzureCommunicationCallWithChatAdapterArgs を渡すためのコールバック
    setCallWithChatAdapterArgs: (arg: AzureCommunicationCallWithChatAdapterArgs) => void,
}

function AcsSetup({ setCallWithChatAdapterArgs }: AcsSetupProperties) {
    // ユーザー ID とトークン
    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('');
    // 後で使用するクレデンシャル
    const [credential, setCredential] = useState<AzureCommunicationTokenCredential>();
    // 表示名
    const [displayName, setDisplayName] = useState('');
    // チャットのトピック
    const [topic, setTopic] = useState('');
    // チャットのスレッド ID
    const [threadId, setThreadId] = useState('');
    // グループ通話の ID
    const [groupId, setGroupId] = useState('');
    // チャットスレッドに追加するユーザー ID
    const [additionalParticipantUserId, setAdditionalParticipantUserId] = useState('');
    // 既存のグループ通話の ID 入力用
    const [groupIdToJoin, setGroupIdToJoin] = useState('');
    // 既存のチャット スレッドの ID 入力用
    const [threadIdToJoin, setThreadIdToJoin] = useState('');

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

    const createGroupMeeting = async () => {
        // 必用な情報がそろっていない場合は何もしない
        if (!credential) return;
        if (!userId) return;
        if (!displayName) return;
        if (!topic) return;

        const client = new ChatClient(process.env.REACT_APP_ACS_ENDPOINT!, credential);
        // トピックを指定して、参加者が自分のみのチャットスレッドを作成
        const result = await client.createChatThread(
            { topic, },
            {
                participants: [
                    { id: fromFlatCommunicationIdentifier(userId), displayName },
                ]
            },
        );

        // チャットスレッドが作成できたらグループIDや作成されたスレッドIDを設定
        if (!!result.chatThread) {
            setGroupId(uuidv4());
            setThreadId(result.chatThread.id);
        } else {
            setGroupId('');
            setThreadId('');
        }
    };

    const addParticipantToChatThread = async () => {
        // 必用な情報がそろっていない場合は何もしない
        if (!credential) return;
        if (!threadId) return;
        if (!additionalParticipantUserId) return;

        // チャットのスレッドにユーザーを追加する
        const client = new ChatClient(process.env.REACT_APP_ACS_ENDPOINT!, credential);
        const chatThreadClient = client.getChatThreadClient(threadId);
        await chatThreadClient.addParticipants({
            participants: [
                { id: fromFlatCommunicationIdentifier(additionalParticipantUserId) },
            ],
        });

        setAdditionalParticipantUserId('');
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();

        if (!userId) return;
        if (!displayName) return;
        if (!credential) return;
        if (!groupId) return;

        const locator = groupId.startsWith("https://") ?
            // groupId が https:// で始まる場合は Teams 会議リンクとして扱う
            { meetingLink: groupId } as TeamsMeetingLinkLocator :
            // そうじゃない場合は Azure Communication Services の通話とチャットとして扱う
            { callLocator: { groupId }, chatThreadId: threadId } as CallAndChatLocator;

        setCallWithChatAdapterArgs({
            endpoint: process.env.REACT_APP_ACS_ENDPOINT!,
            userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
            displayName,
            credential,
            locator,
        });
    };

    return (
        <div className="container">
            <h3>Azure Communication Services の情報設定</h3>
            <label>ユーザー ID</label>
            <span className="wrap-text">{userId ?? 'ユーザー ID を取得中'}</span>
            <label>トークン</label>
            <span className="wrap-text">{token ?? 'トークンを取得中'}</span>
            <form onSubmit={submit}>
                <TextField
                    label="表示名"
                    className="input"
                    value={displayName}
                    onChange={(e, newValue) => setDisplayName(newValue ?? '')} />
                <div className="meeting-info">
                    <div>
                        <h4>新しい会議を作成</h4>
                        <TextField
                            label="トピック"
                            className="input"
                            value={topic}
                            onChange={(e, newValue) => setTopic(newValue ?? '')} />
                        <DefaultButton
                            text="会議を作成"
                            disabled={!topic || !displayName}
                            onClick={() => createGroupMeeting()} />
                        <TextField
                            label="会議に追加するユーザーの ID"
                            value={additionalParticipantUserId}
                            onChange={(e, newValue) => setAdditionalParticipantUserId(newValue ?? '')} />
                        <DefaultButton
                            text="ユーザーを追加"
                            disabled={!threadId || !additionalParticipantUserId}
                            onClick={() => addParticipantToChatThread()} />
                    </div>
                    <div>
                        <h4>既存の会議情報を入力</h4>
                        <TextField
                            label="グループ ID または Teams 会議リンク"
                            value={groupIdToJoin}
                            onChange={(e, newValue) => setGroupIdToJoin(newValue ?? '')} />
                        <TextField
                            label="チャット スレッド ID"
                            value={threadIdToJoin}
                            onChange={(e, newValue) => setThreadIdToJoin(newValue ?? '')} />
                        <DefaultButton
                            text="参加する会議情報を設定"
                            disabled={!groupIdToJoin}
                            onClick={() => {
                                setGroupId(groupIdToJoin);
                                setThreadId(threadIdToJoin);
                                setGroupIdToJoin('');
                                setThreadIdToJoin('');
                            }} />
                    </div>
                </div>
                <div>
                    <h4>参加会議情報</h4>
                    {!!groupId ?
                        (<>
                            <div>グループ ID</div>
                            <span className="wrap-text">{groupId}</span>
                            <div>チャット スレッド ID</div>
                            <span className="wrap-text">{threadId}</span>
                        </>) :
                        (<span>参加する会議情報がありません。</span>)}
                </div>
                <PrimaryButton text="会議への参加" type="submit" disabled={!groupId} />
            </form>
        </div>
    );
}

export default AcsSetup;