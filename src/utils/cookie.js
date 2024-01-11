// 刪除 cookie
export const eraseCookie = name => {
    console.log('eraseCookie:', name);
    // document.cookie = `${name}=; Max-Age=0`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// 設定 cookies
export const setCookie = (name, value, days = 1) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const objectString = JSON.stringify(value);
    document.cookie = `${name}=${encodeURIComponent(objectString)};expires=${date.toUTCString()}`;
};

// 取得 cookies
export const getCookie = name => {
    const decodedCookie = document.cookie;
    const cookies = decodedCookie.split(';');

    // 尋找指定 cookie
    const foundCookie = cookies.find(cookie => {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        return cookieName === name;
    });

    // 解析指定 cookie
    if (foundCookie) {
        const [cookieName, cookieValue] = foundCookie.trim().split('=');
        const decodedObjectString = decodeURIComponent(cookieValue);
        const parsedObject = JSON.parse(decodedObjectString);

        return parsedObject;
    }

    return null;
};
