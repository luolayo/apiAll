

export interface MusicData  {
	code: number
	account: RootObjectAccount;
	profile: RootObjectProfile;
	cookie: string;
}
interface RootObjectAccount {
	id: number;
}

interface RootObjectProfile {
	avatarUrl: string;
	nickname: string;
}
