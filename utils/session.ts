import {Session} from "../types/session";

const BROWSER_SESSION = "planning-poker-session";

const withSession = (): Session => {
    const json = localStorage.getItem(BROWSER_SESSION);
    let session: Session;

    if (!window.crypto) {
        throw new Error('Crypto is not defined - this code should only be run within a browser context (client-side)');
    }

    if (!json) {
        session = {
            id: window.crypto.randomUUID!(),
            displayName: ""
        };

        localStorage.setItem(BROWSER_SESSION, JSON.stringify(session));
    } else {
        session = JSON.parse(json);

        if (!session.id) {
            session.id = window.crypto.randomUUID!();
        }
        if (!session.displayName) {
            session.displayName = "";
        }

        localStorage.setItem(BROWSER_SESSION, JSON.stringify(session));
    }
    return session;
};

const updateDisplayName = (name: string): void => {
   const session = withSession();

    session.displayName = name;

    localStorage.setItem(BROWSER_SESSION, JSON.stringify(session));
};

export {withSession, updateDisplayName};
