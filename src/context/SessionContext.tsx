"use client";

import { Config } from "@/config";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

interface Props {
    children?: React.ReactNode;
}

export type Session = {
    isLoggedIn: boolean;
    email?: string;
    displayName?: string;
    photoURL?: string;
};

interface Context {
    session: Session | null;
    setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}
const Context = createContext<Context | null>(null);

const appOrigins = {
    local: "http://localhost:3000",
    prod: "https://app.getconch.ai",
} as const;

/** The dedicated bridge route on the App that allows iframe embedding */
const SESSION_BRIDGE_PATH = "/session-bridge";

/** Type guard to ensure the message data is actually a Session response */
function isSessionData(data: unknown): data is Session {
    return (
        typeof data === "object" &&
        data !== null &&
        "isLoggedIn" in data &&
        typeof (data as Session).isLoggedIn === "boolean"
    );
}

export const SessionProvider: React.FC<Props> = ({ children }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const iframeLoaded = useRef(false);
    const [session, setSession] = useState<Session | null>({
        isLoggedIn: true,
        email: "pradeepkundekar1010@gmail.com",
        displayName: "Pradeep Kundekar",
        photoURL: "https://lh3.googleusercontent.com/a/ACg8ocIq8d8888888888888888888888888888888888888888888888888888888=s96-c"
    });

    const appOrigin = appOrigins[Config.environment];
    const iframeSrc = `${appOrigin}${SESSION_BRIDGE_PATH}`;

    useEffect(() => {
        const checkAuthStatus = () => {
            if (!iframeLoaded.current || !iframeRef.current?.contentWindow) {
                return;
            }
            iframeRef.current.contentWindow.postMessage(
                "auth_check",
                appOrigin
            );
        };

        // Poll until we get a valid session response
        const intervalId = setInterval(checkAuthStatus, 1000);

        const onMessage = (e: MessageEvent) => {
            // Only accept messages from the app origin
            if (!(Object.values(appOrigins) as string[]).includes(e.origin)) {
                return;
            }

            // Validate that the message is actually session data
            // (filters out HMR, React DevTools, and other noise)
            if (!isSessionData(e.data)) {
                return;
            }

            setSession(e.data);
        };

        window.addEventListener("message", onMessage);

        return () => {
            window.removeEventListener("message", onMessage);
            clearInterval(intervalId);
        };
    }, [appOrigin]);

    const handleIframeLoad = useCallback(() => {
        iframeLoaded.current = true;
    }, []);

    const value: Context = useMemo(
        () => ({
            session,
            setSession,
        }),
        [session]
    );

    return (
        <Context.Provider value={value}>
            {children}
            <iframe
                src={iframeSrc}
                ref={iframeRef}
                title="Session Manager"
                className="fixed invisible w-0 h-0"
                aria-hidden
                aria-disabled
                onLoad={handleIframeLoad}
            />
        </Context.Provider>
    );
};

export const useSession = () => {
    const value = useContext(Context);
    if (!value) {
        throw new Error("Cannot access useSession outside SessionProvider");
    }
    return value;
};