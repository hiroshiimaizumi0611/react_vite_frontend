type Stage = 'dev' | 'stg' | 'prod';
const stage = (import.meta.env.VITE_STAGE as Stage | undefined) ?? 'dev';

export type OidcConfig = {
    clientId: string;
    redirectUri: string;
    cognitoDomain: string;
};

const CONFIG_MAP: Record<string, OidcConfig> = {
    'dev': {
        clientId: 'j13taan8rcthtpojjsq30c62k',
        redirectUri: 'https://estimate-app.com/callback',
        cognitoDomain: 'https://estimate-app.auth.ap-northeast-1.amazoncognito.com',
    },
    'stg': {
        clientId: '',
        redirectUri: '',
        cognitoDomain: '',
    },
    'prod': {
        clientId: '',
        redirectUri: '',
        cognitoDomain: '',
    },
};

function getOidcConfig(): OidcConfig {
    return CONFIG_MAP[stage] ?? CONFIG_MAP['dev'];
}

export const oidcConfig = getOidcConfig()