const firebaseErrors: {[key: string]: string} = {
    'auth/email-already-in-use': 'Este e-mail não está disponível',
    'auth/wrong-password': 'Parece que o seu e-mail ou a sua senha estão incorretos',
    'auth/too-many-requests': 'Sua conta foi bloqueada por questões de segurança, tente acessar novamente em breve.'
};

export default firebaseErrors;