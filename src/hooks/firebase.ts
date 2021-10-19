import { initializeApp, getApps } from "firebase/app";
import { getFirestore, addDoc, collection, getDocs, onSnapshot, query, where, getDoc, doc, Unsubscribe, updateDoc, orderBy } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, AuthError, updateProfile, signInWithEmailAndPassword, signOut, signInAnonymously } from 'firebase/auth';
import { default_response } from "../utils/constants";
import firebaseErrors from "../utils/firebaseErrors";

type CollectionListener<T> = (el: T) => void;
type CollectionOrder<T> = keyof T;
interface Listeners<T> {
    onAdd: CollectionListener<T>,
    onChange?: CollectionListener<T>,
    onRemove?: CollectionListener<T>,
}

interface BaseRef {
    id?: string;
}

type Filter<T> = [keyof T, '==' | '<' | '<=' | '>' | '>=' | '!=', any];

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

/** Utilizar o firestore */
export const useFirestore = () => {
    const db = getFirestore();

    /** Carregar uma coleção */
    const getCollection = async <T extends BaseRef>(path: string, filters?: Filter<T>[]) => {
        
        const segments = path.split('/');
        const basePath = segments[0];

        const conditions = filters?.map(filter => where(filter[0].toString(), filter[1], filter[2])) || [];
        const q = query(collection(db, basePath, ...segments.slice(1)), ...conditions);
        const collectionSnapshot = await getDocs(q);

        return collectionSnapshot.docs.map<T>(doc => {
            const data = {
                id: doc.id,
                ...doc.data()
            };

            return data as T;
        });
    };

    const getRef = async(path: string) => {

        const docSnap = await getDoc(doc(db, path));
        const data = docSnap.data();

        return data;
    };

    /** Observar referência */
    const watchRef = async <T extends BaseRef>(path: string, onChange: (d: T) => void): Promise<Unsubscribe> => {

        return new Promise((resolve, reject) => {

            const segments = path.split('/');
            const basePath = segments[0];
    
            const docRef = doc(db, basePath, ...segments.slice(1));
    
            const unsubscribe = onSnapshot(docRef, (d) => {
                d.exists() ?  resolve(unsubscribe) : reject("Documento não encontrado");
                onChange(d.data() as T);
            });
        });
    };

    /** Carregar coleção e se inscrever */
    const watchCollection = async <T extends BaseRef>(data: { path: string,  listeners: Listeners<T>, filters?: Filter<T>[], orderBy?: CollectionOrder<T>[]}) => {

        const { path, listeners, filters } = data;

        const segments = path.split('/');
        const basePath = segments[0];

        const conditions = filters?.map(filter => where(filter[0].toString(), filter[1], filter[2])) || [];
        const order = data.orderBy?.map(order => orderBy(order.toString())) || [];

        const q = query(collection(db, basePath, ...segments.slice(1)), ...conditions, ...order);
        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log(snapshot);
            snapshot.docChanges().forEach(change => {
                const data = {
                    id: change.doc.id,
                    ...change.doc.data()
                } as T;

                if (change.type === "added") {
                    listeners.onAdd(data);
                }
                if (change.type === "modified" && listeners.onChange) {
                    listeners.onChange(data);
                }
                if (change.type === "removed" && listeners.onRemove) {
                    listeners.onRemove(data);
                }
            });
        });

        return unsubscribe;
    };

    /** Inserir Dados */
    const insert = async <T>(path: string, data: T) => {
        const segments = path.split('/');
        const basePath = segments[0];

        const docRef = await addDoc(collection(db, basePath, ...segments.slice(1)), data);

        console.log(docRef);
        return docRef;
    };

    const update = async <T>(path: string, data: T) => {

        const segments = path.split('/');
        const basePath = segments[0];

        const docRef = doc(db, basePath, ...segments.slice(1));
        await updateDoc(docRef, data);
    };

    return { getCollection, insert, watchCollection, getRef, watchRef, update };
};

/** Verificar se o firebase está inicializado */
export const initialized = () => getApps().length > 0;

/** Inicializar o firebase */
const initialize = (): Promise<void> => {
    return new Promise((resolve) => {
        const firebaseConfig = {
            apiKey: "AIzaSyAn_tUn9oZNyxnFLYShWBEZQ-XrlrhOqmI",
            authDomain: "wanna-know-f25bf.firebaseapp.com",
            databaseURL: "https://wanna-know-f25bf-default-rtdb.firebaseio.com",
            projectId: "wanna-know-f25bf",
            storageBucket: "wanna-know-f25bf.appspot.com",
            messagingSenderId: "868546342471",
            appId: "1:868546342471:web:4b36f1144e3c8588ca4b62",
            measurementId: "G-K46V0KEMQ8"
        };
            
        // Initialize Firebase
        if(getApps().length > 0) {
            throw "O Firebase ja foi inicializado";
        }
        
        initializeApp(firebaseConfig);

        const auth = getAuth();
        auth.onAuthStateChanged(() => resolve());
    });
};

export default initialize;