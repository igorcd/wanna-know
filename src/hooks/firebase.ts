import { initializeApp, getApps } from "firebase/app";
import { getFirestore, addDoc, collection, query, onSnapshot } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, AuthError, updateProfile, signInWithEmailAndPassword, signOut, signInAnonymously } from 'firebase/auth';
import { default_response } from "../utils/constants";
import firebaseErrors from "../utils/firebaseErrors";

/** Verificar se o firebase está inicializado */
export const initialized = () => getApps().length > 0;

/** Inicializar o firebase */
const initialize = (): Promise<void> => {
    return new Promise((resolve) => {
        const firebaseConfig = {
            apiKey: process.env.VUE_APP_apiKey,
            authDomain: process.env.VUE_APP_authDomain,
            databaseURL: process.env.VUE_APP_databaseURL,
            projectId: process.env.VUE_APP_projectId,
            storageBucket: process.env.VUE_APP_storageBucket,
            messagingSenderId: process.env.VUE_APP_messagingSenderId,
            appId: process.env.VUE_APP_appId,
            measurementId: process.env.VUE_APP_measurementId
        };

        console.log(firebaseConfig);
            
        // Initialize Firebase
        if(getApps().length > 0) {
            throw "O Firebase ja foi inicializado";
        }
        
        initializeApp(firebaseConfig);

        const auth = getAuth();
        auth.onAuthStateChanged(() => resolve());
    });
};

/** Utilizar a autenticação do firebase */
export function useAuth() {
    const auth = getAuth();
    
    const register = async (data: { email: string, password: string }) => {
        try {
            const { email, password } = data;
            const user = await createUserWithEmailAndPassword(auth, email, password );
            return user;

        } catch (err) {
            const error = err as AuthError;
            throw firebaseErrors[error.code] || default_response;
        }
    };

    const getUser = () => {
        return auth.currentUser;
    };

    const updateUser = async (data: { name?: string, photo?: string}) => {
        if(!auth.currentUser) {
            throw "Você não possui usuários logados";
        }
        await updateProfile(auth.currentUser, { displayName: data.name, photoURL: data.photo });
    };

    const login = async (data: { email: string, password: string }) => {
        try {
            const user = await signInWithEmailAndPassword(auth, data.email, data.password);
            return user.user;
            
        } catch (err) {
            const error = err as AuthError;
            throw firebaseErrors[error.code] || default_response;
        }
    };

    const anonymouslyLogin = async () => {
        try {
            const data = await signInAnonymously(auth);
            return data.user;

        } catch (err) {
            const error = err as AuthError;
            throw firebaseErrors[error.code] || default_response;
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    return {
        register,
        getUser,
        updateUser,
        login,
        logout,
        anonymouslyLogin
    };
}

type CollectionListener<T> = (el: T) => void;

interface Listeners<T> {
    onAdd: CollectionListener<T>,
    onChange?: CollectionListener<T>,
    onRemove?: CollectionListener<T>,
}

interface BaseRef {
    id?: string;
}

export function useFirestore() {
    const db = getFirestore();
    
    const insert = async <T>(path: string, data: T) => {
        const segments = path.split('/');
        const basePath =  segments[0];
        const docRef = await addDoc(collection(db, basePath, ...segments.slice(1)), data);
        return docRef;
    };

    const watchCollection = <T extends BaseRef>(data: { path: string, listeners: Listeners<T>, filters?: any, orderBy?: any}) => {
        const { path, listeners, filters } = data;
        
        const segments = path.split('/');
        const basePath = segments[0];

        const q = query(collection(db, basePath, ...segments.slice(1)));

        const unsubscribe = onSnapshot(q, (snapshot) => {

            snapshot.docChanges().forEach(change => {
                const data = {
                    id: change.doc.id,
                    ...change.doc.data()
                } as T;

                if(change.type == 'added') {
                    listeners.onAdd(data);
                }

                if(change.type == 'modified' && listeners.onChange) {
                    listeners.onChange(data);
                }

                if (change.type == 'removed' && listeners.onRemove) {
                    listeners.onRemove(data);
                }
            });
        });

        return unsubscribe;
    };

    return { insert, watchCollection };
}


export default initialize;