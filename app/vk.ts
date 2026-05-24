"use client";

import { Config, Messenger, CommonSDKEvents, MessengerParams, Connect } from '@vkontakte/superappkit';
import crypto from 'crypto';
Config.init({
    appId: 54600824, // Тут нужно подставить ID своего приложения.

    appSettings: {
        agreements: '',
        promo: '',
        vkc_behavior: '',
        vkc_auth_action: '',
        vkc_brand: '',
        vkc_display_mode: '',
    },
});


const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text: string, key: string) {
    const [encryptKey, signKey] = prepareKeys(key);

    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', encryptKey, iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);
    encrypted = Buffer.concat([iv, encrypted]);
    let signature = hmac(encrypted, signKey);

    return Buffer.concat([signature, encrypted]).toString('base64');
}

function decrypt(text: string, key: string) {
    const [encryptKey, signKey] = prepareKeys(key);
    text = Buffer.from(text, 'base64');

    let signature = text.slice(0, 32);
    let ciphertext = text.slice(32);

    if (Buffer.compare(hmac(ciphertext, signKey), signature)) {
        throw new Error('Signature does not match');
    }

    let iv = ciphertext.slice(0, IV_LENGTH);
    let encryptedText = ciphertext.slice(IV_LENGTH);
    let decipher = crypto.createDecipheriv('aes-256-cbc', encryptKey, iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf-8');
}

function prepareKeys(key: string) {
    const hash = crypto.createHash('sha512');
    hash.update(key);
    const hashed = hash.digest();

    return [hashed.slice(0, 32), hashed.slice(32)];
}

function hmac(data: string, key: string) {
    return crypto.createHmac('sha256', key).update(data).digest();
}

function generateSuperAppToken(data: any) {
    // Код для обмена и получения токенов

    const currentTime = Date.now() / 1000;
    const tokenBody = {
        "access_token": "****",
        "iat": currentTime,
        "exp": currentTime + (60 * 60),
        "subject": "superappkit-web",
        "payload": {},
    }

    const serviceKey = "..."; // App service token (can be obtained in app settings).

    const superAppToken = encrypt(JSON.stringify(tokenBody), serviceKey); // See below for an example implementation of the encrypt method.

    return superAppToken;
}

Config.onAuth(() => {
    // Показывает форму аутентификации
    console.log("ON AUTH");
    Connect.userVisibleAuth()
        .then((data) => {
            // Вызов вашей функции для создания SuperApp-токена
            console.log(data);
            // generateSuperAppToken(data);
        })
    //     .catch((err) => {
    //         console.log('Ошибка', err)
    //     });
});

Config.onRequestSuperAppToken((params, options) => {
    // // params.refresh указывает, что токен надо обновить
    // if (params.refresh) {
    //     // С помощью параметра action можно скрыть форму входа,
    //     // если можно авторизоваться бесшовно
    //     Connect.userVisibleAuth({ action: { name: 'login_silent_user' } })
    //         .then((data) = {
    //             // Вызываем функцию для обновления и
    //             // установки SuperApp-токена
    //             generateSuperAppToken(data);
    //         })
    //         .catch((err) => {
    //             console.log('Ошибка', err);
    //         });
    // } else {
    //     // Если событие произошло, но param.refresh == false,
    //     // устанавливаем существующий SuperApp-токен
    //     Config.setSuperAppToken(superAppToken, options);
    // }
    console.log("REQUEST SUPER APP TOKEN");
    console.log(params);
    console.log(options);
    // return {
    //     superAppToken: "superAppToken",
    //     options: options,
    // }
});

export const openMessengerHandler = () => {
    console.log("ОТКРЫВАЕМ МЕССЕНДЖЕР");

    const messenger = new Messenger({
        styles: {
            right: '10px',
            bottom: '10px',
            zIndex: 100,
        },
    });

    //   messenger.on(CommonSDKEvents.ERROR, () => {
    //     messenger.close();
    //     messenger = null;
    //   });

    //   messenger.on(CommonSDKEvents.CLOSE, () => {
    //     messenger = null;
    //   });

    const messengerParams: MessengerParams = {
        expanded: true,
        messageSound: true,
        openSound: true,
        mode: 'extended',
        expandTimeout: 0,
        peer_id: -2645768,
        scheme: 'bright_light',
    }
    messenger.open({ ...messengerParams }).catch((error) => {
        messenger.close();
        // messenger = null;
    });
}
