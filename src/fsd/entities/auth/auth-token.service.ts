const ACCESS_TOKEN_NAME = "Access-Token";

export const getAccessToken = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_NAME);
    return accessToken || null;
};

export const saveAccessToken = (accessToken: string) => {
    console.log("accessToken", accessToken);

    localStorage.setItem(ACCESS_TOKEN_NAME, accessToken);
};

export const removeAccessToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_NAME);
};
